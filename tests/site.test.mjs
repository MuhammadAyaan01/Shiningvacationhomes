import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {routes,siteUrl} from '../src/seo.js';
const root=path.resolve('out');
async function htmlFiles(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?htmlFiles(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]))).flat()}
test('every generated page has one H1, unique IDs and valid internal destinations',async()=>{const pages=await htmlFiles(root);assert.ok(pages.length>=15);for(const file of pages){const html=(await readFile(file,'utf8')).replace(/<script[\s\S]*?<\/script>/g,'');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);const ids=Array.from(html.matchAll(/\sid="([^"]+)"/g),m=>m[1]);assert.equal(new Set(ids).size,ids.length,file);for(const [,href] of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){const target=path.join(root,href.endsWith('/')?href+'index.html':href);await assert.doesNotReject(readFile(target),`${file} links to missing ${href}`)}}});
test('all public content routes have unique titles, descriptions, canonicals and sitemap entries',async()=>{
 const titles=new Set(),descriptions=new Set(),sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
 for(const route of routes){const html=await readFile(path.join(root,route,'index.html'),'utf8');assert.match(html,/content="index, follow"/);assert.match(html,/rel="canonical"/);const title=html.match(/<title>(.*?)<\/title>/)[1],description=html.match(/name="description" content="([^"]+)"/)[1];assert.ok(!titles.has(title),route);assert.ok(!descriptions.has(description),route);titles.add(title);descriptions.add(description);assert.ok(sitemap.includes(new URL(route,siteUrl).href),route);assert.doesNotMatch(html,/fonts\.googleapis\.com|fonts\.gstatic\.com/)}
 assert.match(await readFile(path.join(root,'robots.txt'),'utf8'),/Allow: \//);
});
test('accommodation guides explain examples and enquiries rather than live listings',async()=>{for(const slug of ['studio-apartments','one-bedroom-apartments','two-bedroom-apartments','three-bedroom-apartments','townhouses','luxury-villas']){const html=await readFile(path.join(root,'stays',slug,'index.html'),'utf8');assert.match(html,/actual options shared after enquiry/);assert.match(html,/Sending a request does not reserve accommodation/);assert.match(html,new RegExp('collection='+slug))}});
