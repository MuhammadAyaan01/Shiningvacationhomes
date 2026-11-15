import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createPreviewServer} from '../scripts/serve.mjs';
test('static server supports deep links, HEAD, real 404s and safe request boundaries',async t=>{
 const server=createPreviewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const port=server.address().port;
 async function request(url,method='GET'){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port,path:url,method},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}))});req.on('error',reject);req.end()})}
 const deep=await request('/stays/luxury-villas/?guests=4');assert.equal(deep.status,200);assert.match(deep.body,/<h1 aria-label="Luxury villas">/);
 const head=await request('/contact/','HEAD');assert.equal(head.status,200);assert.equal(head.body,'');
 const missing=await request('/missing-page/');assert.equal(missing.status,404);assert.match(missing.body,/A little off the map/);
 assert.equal((await request('/%zz')).status,400);
 assert.equal((await request('/%2e%2e%5cpackage.json')).status,403);
 assert.equal((await request('/contact/','POST')).status,405);
 assert.equal(deep.headers['x-content-type-options'],'nosniff');
});
