import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createEnquiryStore,storageIssues} from '../src/enquiry-store.mjs';
import {handlePersistentEnquiry} from '../src/persistent-enquiry.mjs';
const data={intent:'guest',name:'Private Test Guest',email:'guest@example.com',travelPlan:'One month'};
const env={ENQUIRY_PROVIDER:'gmail',SMTP_USER:'sender@gmail.com',SMTP_APP_PASSWORD:'abcdefghijklmnop'};
const request=()=>new Request('http://localhost/api/enquiry/',{method:'POST',headers:{Origin:'http://localhost','Content-Type':'application/json','Idempotency-Key':'persistent-test-123456789'},body:JSON.stringify(data)});
async function fixture(fn){const directory=await mkdtemp(path.join(os.tmpdir(),'shining-store-'));const store=await createEnquiryStore({directory});try{await fn(store,directory)}finally{await store.close();await rm(directory,{recursive:true,force:true})}}

test('encrypted enquiries and duplicate detection survive a store restart',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'shining-restart-'));
 let store=await createEnquiryStore({directory});
 try{
  const first=await store.capture(data,'request-restart-123456');await store.finish(first.id,'sent');await store.close();
  store=await createEnquiryStore({directory});const repeated=await store.capture(data,'request-restart-123456');
  assert.equal(repeated.id,first.id);assert.equal(repeated.existing,true);assert.equal(repeated.status,'sent');
  assert.deepEqual((await store.read(first.id)).data,data);
  assert.equal((await store.capture({...data,travelPlan:'Changed'},'request-restart-123456')).conflict,true);
  for(const file of ['enquiries.sqlite','enquiries.sqlite-wal']){let bytes;try{bytes=await readFile(path.join(directory,file))}catch{continue}assert.ok(!bytes.includes(Buffer.from(data.email)));assert.ok(!bytes.includes(Buffer.from(data.name)));}
 }finally{await store.close();await rm(directory,{recursive:true,force:true})}
});

test('durable counters limit per-email and rotating-email traffic',async()=>fixture(async store=>{
 for(let i=0;i<5;i++)assert.ok((await store.capture(data,'per-email-request-'+i)).id);
 assert.equal((await store.capture(data,'per-email-request-6')).limited,true);
 for(let i=0;i<15;i++)assert.ok((await store.capture({...data,email:`other${i}@example.com`},'rotating-request-'+i)).id);
 assert.equal((await store.capture({...data,email:'extra@example.com'},'rotating-request-extra')).limited,true);
}));

test('failed mail remains captured and repeat requests do not send again',async()=>fixture(async store=>{
 let calls=0;const deps={store,limits:new Map(),smtpRequests:new Map(),createTransport:()=>({sendMail:async()=>{calls++;throw Error('offline')},close:()=>{}})};
 const result=await handlePersistentEnquiry(request(),env,deps);assert.equal(result.status,202);const receipt=await result.json();assert.match(receipt.message,/saved/);assert.match(receipt.message,/not been confirmed/);
 assert.deepEqual((await store.read(receipt.reference)).data.travelPlan,data.travelPlan);
 assert.equal((await store.list())[0].status,'attention');
 assert.equal((await handlePersistentEnquiry(request(),env,deps)).status,202);assert.equal(calls,1);
}));

test('concurrent duplicate submissions claim one durable record and one delivery',async()=>fixture(async store=>{
 let calls=0;const deps={store,limits:new Map(),smtpRequests:new Map(),createTransport:()=>({sendMail:async()=>{calls++;return {messageId:'accepted',accepted:['sender@gmail.com'],rejected:[]}},close:()=>{}})};
 const results=await Promise.all([handlePersistentEnquiry(request(),env,deps),handlePersistentEnquiry(request(),env,deps)]);
 const bodies=await Promise.all(results.map(r=>r.json()));assert.equal(bodies[0].reference,bodies[1].reference);assert.equal(calls,1);assert.equal((await store.list()).length,1);
}));

test('capture failure never sends email or reports successful submission',async()=>{
 let called=false;const result=await handlePersistentEnquiry(request(),env,{store:{capture:async()=>{throw Error('disk unavailable')}},createTransport:()=>{called=true}});
 assert.equal(result.status,503);assert.equal(called,false);assert.match((await result.json()).message,/not been submitted/);
});

test('public hosting requires persistent storage and a stable encryption key',()=>{
 assert.ok(storageIssues({}).length);
 const key='a'.repeat(64);assert.deepEqual(storageIssues({ENQUIRY_DATABASE_URL:'postgresql://user:password@db.example.com/shining',ENQUIRY_DATA_KEY:key}),[]);
 assert.ok(storageIssues({VERCEL:'1',ENQUIRY_STORAGE_DIR:path.resolve('.data'),ENQUIRY_DATA_KEY:key}).length);
});

test('expired records are unavailable and individual privacy deletions leave other leads intact',async()=>fixture(async store=>{
 const expired=await store.capture(data,'expired-request-123456',Date.now()-31*86400000);
 assert.equal(await store.read(expired.id),null);await store.prune();assert.equal((await store.list()).length,0);
 const first=await store.capture(data,'active-request-123456'),second=await store.capture({...data,email:'another@example.com'},'second-request-123456');
 await store.remove(first.id);assert.equal(await store.read(first.id),null);assert.ok(await store.read(second.id));
}));
