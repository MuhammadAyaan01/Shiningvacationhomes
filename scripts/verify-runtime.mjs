import assert from 'node:assert/strict';
import sharp from 'sharp';
import {routes} from '../src/seo.js';
const origin=process.env.VERIFY_ORIGIN||'http://127.0.0.1:4173';
for(const route of routes){
 const response=await fetch(origin+route);assert.equal(response.status,200,route);
 const html=await response.text();assert.match(html,/<h1[ >]/);assert.match(html,/rel="canonical"/);
 for(const [name,value] of Object.entries({'x-frame-options':'DENY','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'}))assert.equal(response.headers.get(name),value,route+' '+name);
 assert.match(response.headers.get('content-security-policy'),/form-action 'self'/);
 if(route==='/contact/'){assert.match(html,/action="\/api\/enquiry\/" method="post"/);assert.match(html,/<fieldset class="form-fields" disabled="">/)}
}
assert.equal((await fetch(origin+'/api/enquiry/')).status,405);
const post=(body,from=origin)=>fetch(origin+'/api/enquiry/',{method:'POST',headers:{Origin:from,'Content-Type':'application/json','Idempotency-Key':'runtime-check-123456789'},body:JSON.stringify(body)});
assert.equal((await post({},'https://foreign.example')).status,403);
assert.equal((await post({})).status,422);
assert.equal((await fetch(origin+'/missing-route-check/')).status,404);
assert.match(await (await fetch(origin+'/robots.txt')).text(),/Allow: \//);
assert.match(await (await fetch(origin+'/sitemap.xml')).text(),/<urlset/);
for(const width of [256,384]){
 const response=await fetch(origin+'/_next/image?url=%2Fmedia%2F1BR.jpg&w='+width+'&q=85',{headers:{Accept:'image/webp'}});assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/image\/webp/);
 const bytes=Buffer.from(await response.arrayBuffer()),metadata=await sharp(bytes).metadata();assert.equal(metadata.width,width);console.log(width+'px WebP: '+bytes.length+' bytes');
}
console.log('PASS: 14 routes, headers, POST boundaries, no-JS form guard, 404, robots, sitemap, and real optimized images. No email was sent.');
