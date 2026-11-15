import {readdir,readFile,mkdir,writeFile,cp} from 'node:fs/promises';
import path from 'node:path';
const root='.next/server/app';
for(const name of await readdir(root,{recursive:true})){
 if(!name.endsWith('.html'))continue;
 const route=name.replaceAll('\\','/').replace(/\.html$/,'');
 const target=route==='index'?'out/index.html':route==='_not-found'?'out/404.html':`out/${route}/index.html`;
 await mkdir(path.dirname(target),{recursive:true});await writeFile(target,await readFile(path.join(root,name)));
}
await cp('public','out',{recursive:true});
await cp('.next/static','out/_next/static',{recursive:true});
for(const name of ['robots.txt','sitemap.xml']){
 try{await writeFile('out/'+name,await readFile(root+'/'+name+'.body'))}catch{}
}
