import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {productionCsp} from '../src/security-policy.mjs';
export function inlineScriptHashes(html){
 const hashes=new Set();
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/\bsrc\s*=/i.test(match[1])&&match[2].trim())hashes.add('sha256-'+createHash('sha256').update(match[2]).digest('base64'));
 return [...hashes];
}
async function patchManifest(file,policy,required=false){
 let manifest;try{manifest=JSON.parse(await readFile(file,'utf8'))}catch(error){if(error.code==='ENOENT'&&!required)return false;throw error;}
 let count=0;
 for(const route of manifest.headers||[])for(const header of route.headers||[])if(header.key.toLowerCase()==='content-security-policy'&&header.value.startsWith("default-src 'self'; script-src 'self'")){header.value=policy;count++;}
 for(const route of manifest.routes||[])if(route.headers&&!Array.isArray(route.headers))for(const key of Object.keys(route.headers))if(key.toLowerCase()==='content-security-policy'&&route.headers[key].startsWith("default-src 'self'; script-src 'self'")){route.headers[key]=policy;count++;}
 if(!count)throw Error(`No CSP header found in ${path.basename(file)}`);
 await writeFile(file,JSON.stringify(manifest,null,2)+'\n');return true;
}
export async function secureBuild({projectDir,files,buildId}){
 const hashes=[...new Set(files.filter(file=>file.name.endsWith('.html')).flatMap(file=>inlineScriptHashes(file.data.toString('utf8'))))];
 if(!hashes.length)throw Error('No prerendered script hashes found; refusing an unprotected build');
 const policy=productionCsp(hashes);if(Buffer.byteLength(policy)>12000)throw Error('CSP exceeds the reviewed header budget');
 await patchManifest(path.join(projectDir,'.next/routes-manifest.json'),policy,true);
 let platformManifests=0;
 for(const folder of ['.next/output','.vercel/output']){
  const root=path.join(projectDir,folder);
  if(await patchManifest(path.join(root,'config.json'),policy))platformManifests++;
  const scan=async dir=>{let entries;try{entries=await readdir(dir,{withFileTypes:true})}catch(error){if(error.code==='ENOENT')return;throw error;}
   for(const entry of entries){const file=path.join(dir,entry.name);if(entry.isDirectory())await scan(file);else if(entry.name==='routes-manifest.json')await patchManifest(file,policy);}
  };
  await scan(path.join(root,'functions'));
 }
 await writeFile(path.join(projectDir,'.next/security-policy.json'),JSON.stringify({buildId,hashes,policy,platformManifests},null,2)+'\n');
 console.log(`Security policy: ${hashes.length} approved script hashes; no script unsafe-inline.`);
 return {hashes,policy,platformManifests};
}
