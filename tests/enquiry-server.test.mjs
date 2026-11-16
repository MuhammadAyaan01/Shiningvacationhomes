import test from 'node:test';
import assert from 'node:assert/strict';
import {handleEnquiry,validateEnquiry} from '../src/enquiry-server.js';
const valid={intent:'guest',name:'Test Guest',email:'guest@example.com',guests:'2',arrival:'2030-05-01',departure:'2030-05-04',collection:'studio-apartments',message:'Please confirm options.'};
const env={RESEND_API_KEY:'test-only',ENQUIRY_FROM:'Shining <sender@example.com>',ENQUIRY_TO:'team@example.com'};
const request=(body=valid,headers={})=>new Request('https://example.com/api/enquiry/',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json','Idempotency-Key':'test-request-1234567890',...headers},body:JSON.stringify(body)});
const dependencies=()=>({today:'2030-04-01',limits:new Map()});

test('server validation rejects invalid dates, ranges, headers and collection values',()=>{
 const {errors}=validateEnquiry({...valid,name:'Name\r\nInjected',email:'guest@example.com\nBcc: x',arrival:'2030-02-31',departure:'2030-01-01',guests:'99',collection:'unknown'},'2030-01-01');
 for(const key of ['name','email','arrival','departure','guests','collection'])assert.ok(errors[key],key);
 assert.ok(validateEnquiry({...valid,companyWebsite:'spam'}).errors.form);
 const owner=validateEnquiry({...valid,intent:'owner',bedrooms:'2',area:'Dubai'},'2030-04-01');assert.deepEqual(owner.errors,{});assert.equal(owner.data.collection,undefined);
});
test('POST boundary rejects other methods, foreign origins, non-JSON and oversized bodies',async()=>{
 assert.equal((await handleEnquiry(new Request('https://example.com/api/enquiry/'),env)).status,405);
 assert.equal((await handleEnquiry(request(valid,{Origin:'https://other.example'}),env)).status,403);
 assert.equal((await handleEnquiry(request(valid,{'Content-Type':'text/plain'}),env)).status,415);
 assert.equal((await handleEnquiry(request(valid,{'Content-Type':'application/json-extra'}),env)).status,415);
 assert.equal((await handleEnquiry(request({...valid,message:'x'.repeat(17000)}),env)).status,413);
 assert.equal((await handleEnquiry(request({...valid,guests:'99'}),env,dependencies())).status,422);
});
test('missing configuration fails closed without calling an email service',async()=>{
 let called=false;const result=await handleEnquiry(request(),{}, {...dependencies(),fetch:()=>{called=true}});
 assert.equal(result.status,503);assert.equal(called,false);assert.match((await result.json()).message,/not been sent/);
});
test('accepted delivery uses validated text, configured recipient and provider idempotency',async()=>{
 let sent;const result=await handleEnquiry(request(),env,{...dependencies(),fetch:async(url,init)=>{sent={url,init};return Response.json({id:'receipt-123'})}});
 assert.equal(result.status,202);assert.equal((await result.json()).reference,'receipt-123');assert.equal(sent.url,'https://api.resend.com/emails');
 const body=JSON.parse(sent.init.body);assert.deepEqual(body.to,['team@example.com']);assert.equal(body.reply_to,'guest@example.com');assert.match(body.text,/name: Test Guest/);assert.equal(body.html,undefined);assert.equal(sent.init.headers['Idempotency-Key'],'enquiry-test-request-1234567890');
});
test('provider rejection and network failure never claim successful delivery',async()=>{
 for(const fail of [async()=>new Response('',{status:500}),async()=>{throw Error('offline')}])assert.equal((await handleEnquiry(request(),env,{...dependencies(),fetch:fail})).status,502);
});
test('basic per-process limiter bounds repeated enquiries',async()=>{
 let calls=0;const deps={...dependencies(),fetch:async()=>{calls++;return Response.json({id:'receipt'})}};
 for(let i=0;i<5;i++)assert.equal((await handleEnquiry(request(),env,deps)).status,202);
 assert.equal((await handleEnquiry(request(),env,deps)).status,429);assert.equal(calls,5);
});

test('flexible enquiries accept approximate plans and optional preferences without inventing availability',()=>{
 const flexible={...valid,arrival:'',departure:'',guests:'',travelPlan:'Two weeks in December, dates flexible',preferredArea:'Near the Metro',budget:'12000.50',budgetBasis:'monthly'};
 const result=validateEnquiry(flexible,'2030-04-01');assert.deepEqual(result.errors,{});assert.equal(result.data.budget,'12000.50');assert.equal(result.data.preferredArea,'Near the Metro');
 assert.ok(validateEnquiry({...flexible,travelPlan:''},'2030-04-01').errors.travelPlan);
 for(const budget of ['-1','0','0.50','100000001','NaN','1e3','100.123'])assert.ok(validateEnquiry({...flexible,budget},'2030-04-01').errors.budget,budget);
 assert.ok(validateEnquiry({...flexible,budgetBasis:'nightly'},'2030-04-01').errors.budgetBasis);
 assert.equal(validateEnquiry({...flexible,budget:''},'2030-04-01').data.budgetBasis,undefined);
 const owner=validateEnquiry({...flexible,intent:'owner',bedrooms:'2',area:'Dubai'},'2030-04-01');assert.deepEqual(owner.errors,{});for(const key of ['travelPlan','guests','preferredArea','budget','budgetBasis'])assert.equal(owner.data[key],undefined,key);
});

test('delivery includes flexible requirements and does not promise a reservation',async()=>{
 let delivered;const body={...valid,arrival:'',departure:'',travelPlan:'About one month',budget:'10000',budgetBasis:'monthly',preferredArea:'Dubai'};
 const result=await handleEnquiry(request(body),env,{...dependencies(),fetch:async(url,init)=>{delivered=JSON.parse(init.body);return Response.json({id:'flexible-receipt'})}});
 assert.equal(result.status,202);assert.match(delivered.text,/travelPlan: About one month/);assert.match(delivered.text,/budgetBasis: monthly/);assert.match(delivered.text,/preferredArea: Dubai/);assert.match((await result.json()).message,/No accommodation has been reserved/);
});
