import {readFile,mkdir,writeFile,cp,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {routes as publicRoutes} from '../src/seo.js';
const require=createRequire(import.meta.url);
// Next 16 uses the adapter cache identity instead of server/app/*.html on Vercel.
// Use the helper from our pinned Next version rather than duplicating its hash format.
const {getRouteCacheKey}=require('next/dist/server/lib/route-cache-key.js');
const {normalizeAppPath}=require('next/dist/shared/lib/router/utils/app-paths.js');
export async function createTestSnapshot({projectDir=fileURLToPath(new URL('../',import.meta.url)),routes=publicRoutes}={}){
 const root=path.resolve(projectDir),server=path.join(root,'.next/server'),out=path.join(root,'out');
 if(path.relative(root,out)!=='out')throw Error('Unsafe snapshot directory');
 const modules=JSON.parse(await readFile(path.join(server,'app-paths-manifest.json'),'utf8'));
 const entries=Object.keys(modules);
 const readOutput=async(route,kind,extension)=>{
  const sourceRoute=entries.find(key=>normalizeAppPath(key)===route&&key.endsWith(kind==='APP_PAGE'?'/page':'/route'));
  if(!sourceRoute)throw Error(`Missing built module for ${route}`);
  const legacy=path.join(server,'app',(route==='/'?'index':route.slice(1))+extension);
  const adapter=path.join(server,getRouteCacheKey(route,{kind,sourceRoute})+extension);
  for(const file of [legacy,adapter]){try{return await readFile(file)}catch(error){if(error.code!=='ENOENT')throw error;}}
  // Next also creates a Pages Router copy of the static custom 404.
  if(route==='/_not-found'){try{return await readFile(path.join(server,'pages/404.html'))}catch(error){if(error.code!=='ENOENT')throw error;}}
  throw Error(`Missing prerendered ${route}${extension}; neither standalone nor adapter output exists`);
 };
 const files=[];
 for(const pathname of routes){const route=pathname==='/'?'/':pathname.replace(/\/$/,'');files.push({name:route==='/'?'index.html':route.slice(1)+'/index.html',data:await readOutput(route,'APP_PAGE','.html')});}
 files.push({name:'404.html',data:await readOutput('/_not-found','APP_PAGE','.html')});
 for(const name of ['robots.txt','sitemap.xml'])files.push({name,data:await readOutput('/'+name,'APP_ROUTE','.body')});
 // Resolve every required artifact before replacing this build-owned directory.
 await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
 for(const file of files){const target=path.join(out,file.name);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,file.data);}
 await cp(path.join(root,'public'),out,{recursive:true});
 await cp(path.join(root,'.next/static'),path.join(out,'_next/static'),{recursive:true});
 const buildId=(await readFile(path.join(root,'.next/BUILD_ID'),'utf8')).trim();
 await writeFile(path.join(out,'snapshot-manifest.json'),JSON.stringify({buildId,routes},null,2)+'\n');
 console.log(`Verified snapshot: ${routes.length} content routes, custom 404, robots and sitemap.`);
 const securityFiles=[...files];
 if(entries.some(key=>normalizeAppPath(key)==='/_global-error')){try{securityFiles.push({name:'_global-error.html',data:await readOutput('/_global-error','APP_PAGE','.html')})}catch(error){if(!error.message.startsWith('Missing prerendered'))throw error;}}
 return {files:securityFiles,out,buildId};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await createTestSnapshot();
