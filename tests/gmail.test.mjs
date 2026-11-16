import test from 'node:test';
import assert from 'node:assert/strict';
import {handleEnquiry} from '../src/enquiry-server.js';
import {deliveryIssues,sendGmailEnquiry,createGmailTransport,gmailConnectionMessage} from '../src/enquiry-delivery.mjs';
import {releaseIssues} from '../src/release-config.mjs';
const env={ENQUIRY_PROVIDER:'gmail',SMTP_USER:'sender@gmail.com',SMTP_APP_PASSWORD:'abcd efgh ijkl mnop'};
const body={intent:'guest',name:'Test Guest',email:'guest@example.com',travelPlan:'One month',message:'Please confirm options.'};
const request=(input=body)=>new Request('https://example.com/api/enquiry/',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json','Idempotency-Key':'gmail-test-123456789'},body:JSON.stringify(input)});
const dependencies=()=>({limits:new Map(),smtpRequests:new Map()});

test('Gmail uses authenticated sender, same-inbox default, TLS and private plain-text delivery',async()=>{
 let options,message,closed=false;
 const result=await handleEnquiry(request(),env,{...dependencies(),createTransport:config=>{
  options=config;return {sendMail:async data=>{message=data;return {messageId:'smtp-reference',accepted:['sender@gmail.com'],rejected:[]}},close:()=>{closed=true}};
 }});
 assert.equal(result.status,202);assert.equal((await result.json()).reference,'smtp-reference');
 assert.equal(options.host,'smtp.gmail.com');assert.equal(options.port,465);assert.equal(options.secure,true);
 assert.equal(options.auth.pass,'abcdefghijklmnop');assert.equal(options.logger,false);assert.equal(options.debug,false);
 assert.equal(options.disableFileAccess,true);assert.equal(options.disableUrlAccess,true);
 assert.equal(message.from.address,'sender@gmail.com');assert.deepEqual(message.to,['sender@gmail.com']);
 assert.equal(message.replyTo,'guest@example.com');assert.equal(message.html,undefined);assert.match(message.text,/travelPlan: One month/);
 assert.equal(closed,true);assert.doesNotMatch(message.text,/abcdefghijklmnop/);
});

test('Gmail retries are deduplicated within a process and changed submissions are rejected',async()=>{
 let calls=0;
 const deps={...dependencies(),createTransport:()=>({sendMail:async()=>{calls++;return {messageId:'accepted',accepted:['sender@gmail.com'],rejected:[]}},close:()=>{}})};
 const responses=await Promise.all([handleEnquiry(request(),env,deps),handleEnquiry(request(),env,deps)]);
 for(const result of responses)assert.equal(result.status,202);
 assert.equal(calls,1);
 assert.equal((await handleEnquiry(request({...body,message:'Changed'}),env,deps)).status,409);
});

test('Gmail rejection and uncertain delivery return errors without disclosing credentials',async()=>{
 for(const mode of ['failure','rejected','partial']){
  let closed=false;const deps={...dependencies(),createTransport:()=>({sendMail:async()=>{
   if(mode==='failure')throw Error('private SMTP details');
   return {messageId:'reference',accepted:mode==='partial'?[]:['sender@gmail.com'],rejected:mode==='rejected'?['sender@gmail.com']:[]};
  },close:()=>{closed=true}})};
  const result=await handleEnquiry(request(),env,deps);assert.equal(result.status,502);assert.equal(closed,true);
  const text=await result.text();assert.doesNotMatch(text,/private SMTP|abcdefghijklmnop/);
 }
 const incomplete=await handleEnquiry(request(),{...env,SMTP_APP_PASSWORD:''},dependencies());assert.equal(incomplete.status,503);
});

test('Gmail release settings support a different recipient and require no Resend credentials',()=>{
 assert.deepEqual(deliveryIssues(env),[]);
 assert.deepEqual(releaseIssues({...env,ENQUIRY_DATABASE_URL:'postgresql://test:test@db.example.com/shining',ENQUIRY_DATA_KEY:'a'.repeat(64),NEXT_PUBLIC_SITE_URL:'https://example.com',ENQUIRY_ORIGIN:'https://example.com'}),[]);
 assert.deepEqual(deliveryIssues({...env,ENQUIRY_TO:'team@example.com'}),[]);
 for(const bad of [{SMTP_USER:'bad\r\nBcc: x'},{SMTP_APP_PASSWORD:'regular-password'},{ENQUIRY_TO:'team@example.com,'},{ENQUIRY_PROVIDER:'unknown'}])assert.ok(deliveryIssues({...env,...bad}).length);
});

test('SMTP has a total deadline and closes a stalled connection',async context=>{
 context.mock.timers.enable({apis:['setTimeout']});
 let closed=false;
 const pending=sendGmailEnquiry(env,{replyTo:'guest@example.com',subject:'Test',text:'Test',requestId:'deadline-test-123456'},()=>({sendMail:()=>new Promise(()=>{}),close:()=>{closed=true}}));
 const rejection=assert.rejects(pending,/deadline exceeded/);
 context.mock.timers.tick(20000);await rejection;assert.equal(closed,true);
});

test('Gmail resolves through the OS while preserving SNI and certificate verification',async()=>{
 let settings;
 await createGmailTransport(env,{
  resolveHost:async(host,options)=>{assert.equal(host,'smtp.gmail.com');assert.equal(options.order,'ipv4first');return [{address:'192.0.2.20',family:4}]},
  createTransport:options=>{settings=options;return {}}
 });
 assert.equal(settings.host,'192.0.2.20');assert.equal(settings.port,465);assert.equal(settings.secure,true);
 assert.deepEqual(settings.tls,{servername:'smtp.gmail.com',rejectUnauthorized:true});
});

test('Gmail DNS failures and denied sockets are distinguished from rejected credentials',async()=>{
 let created=false;
 await assert.rejects(createGmailTransport(env,{resolveHost:async()=>{throw new Error('DNS unavailable')},createTransport:()=>{created=true}}),error=>error.code==='EDNS');
 assert.equal(created,false);
 assert.match(gmailConnectionMessage({code:'ESOCKET',errno:-4092}),/before authentication/);
 assert.match(gmailConnectionMessage({code:'EAUTH'}),/Google rejected authentication/);
 assert.doesNotMatch(gmailConnectionMessage({code:'ESOCKET',errno:-4092}),/App Password/);
});
