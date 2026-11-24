import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {createTestSnapshot} from '../scripts/test-snapshot.mjs';
import {secureBuild,inlineScriptHashes} from '../scripts/secure-build.mjs';
import {productionCsp} from '../src/security-policy.mjs';
const require=createRequire(import.meta.url),{getRouteCacheKey}=require('next/dist/server/lib/route-cache-key.js');
const put=async(file,value)=>{await mkdir(path.dirname(file),{recursive:true});await writeFile(file,value)};
for(const adapter of [false,true])test(`test snapshots handle ${adapter?'adapter route-cache':'standalone'} prerender paths`,async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'shining-build-'));
 try{
  const modules={'/page':'app/page.js','/about/page':'app/about/page.js','/_not-found/page':'app/_not-found/page.js','/robots.txt/route':'app/robots.txt/route.js','/sitemap.xml/route':'app/sitemap.xml/route.js'};
  await put(path.join(root,'.next/server/app-paths-manifest.json'),JSON.stringify(modules));
  await put(path.join(root,'.next/BUILD_ID'),'fixture-build');await put(path.join(root,'public/favicon.ico'),'icon');await put(path.join(root,'.next/static/test.js'),'fixture');
  for(const route of ['/','/about','/_not-found','/robots.txt','/sitemap.xml']){
   const metadata=route.includes('.'),kind=metadata?'APP_ROUTE':'APP_PAGE',sourceRoute=Object.keys(modules).find(key=>key===(route==='/'?'/page':route+(metadata?'/route':'/page')));
   const name=adapter?getRouteCacheKey(route,{kind,sourceRoute}):'app/'+(route==='/'?'index':route.slice(1));
   await put(path.join(root,'.next/server',name+(metadata?'.body':'.html')),metadata?'metadata':`<h1>${route}</h1><script>window.fixture=true</script>`);
  }
  const snapshot=await createTestSnapshot({projectDir:root,routes:['/','/about/']});
  assert.match(await readFile(path.join(root,'out/about/index.html'),'utf8'),/<h1>\/about<\/h1>/);
  assert.equal(JSON.parse(await readFile(path.join(root,'out/snapshot-manifest.json'),'utf8')).buildId,'fixture-build');
  const header={key:'Content-Security-Policy',value:productionCsp()};
  await put(path.join(root,'.next/routes-manifest.json'),JSON.stringify({headers:[{source:'/(.*)',headers:[header]}]}));
  await put(path.join(root,'.next/output/config.json'),JSON.stringify({version:3,routes:[{src:'^/.*',headers:{'Content-Security-Policy':header.value},continue:true}]}));
  const secured=await secureBuild({projectDir:root,...snapshot});assert.equal(secured.platformManifests,1);assert.equal(secured.hashes.length,1);
  assert.ok(!secured.policy.split(';').find(value=>value.trim().startsWith('script-src ')).includes('unsafe-inline'));
  const platform=JSON.parse(await readFile(path.join(root,'.next/output/config.json'),'utf8'));assert.equal(platform.routes[0].headers['Content-Security-Policy'],secured.policy);
  await assert.rejects(createTestSnapshot({projectDir:root,routes:['/','/missing/']}),/Missing built module/);
 }finally{await rm(root,{recursive:true,force:true})}
});
test('script hashes cover exact inline bytes and ignore external sources',()=>{
 const first=inlineScriptHashes('<script>window.fixture=true</script><script src="/asset.js"></script>');
 assert.equal(first.length,1);assert.notDeepEqual(first,inlineScriptHashes('<script> window.fixture=true</script>'));
});
test('the produced snapshot and security policy belong to the current build',async()=>{
 const id=(await readFile('.next/BUILD_ID','utf8')).trim();
 assert.equal(JSON.parse(await readFile('out/snapshot-manifest.json','utf8')).buildId,id);
 const security=JSON.parse(await readFile('.next/security-policy.json','utf8'));assert.equal(security.buildId,id);
 assert.ok(security.hashes.length>0);
 for(const file of ['index.html','contact/index.html','404.html'])for(const hash of inlineScriptHashes(await readFile('out/'+file,'utf8')))assert.ok(security.hashes.includes(hash));
});
