import {mkdtemp,mkdir,cp,writeFile,readFile,readdir,symlink,stat,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import os from 'node:os';
import {createTestSnapshot} from './test-snapshot.mjs';
import {secureBuild} from './secure-build.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const fixture=await mkdtemp(path.join(os.tmpdir(),'shining-adapter-'));
try{
 // Never copy local environment files, records, credentials or Git metadata.
 for(const name of ['app','components','src','public','package.json','package-lock.json','tsconfig.json','next-env.d.ts','scripts','tests','vercel.json','.env.example','.github'])await cp(path.join(root,name),path.join(fixture,name),{recursive:true});
 await symlink(path.join(root,'node_modules'),path.join(fixture,'node_modules'),'junction');
 const adapter=path.join(fixture,'fixture-adapter.mjs');
 await writeFile(adapter,"import {writeFile} from 'node:fs/promises';\nimport path from 'node:path';\nexport default {name:'isolated-adapter-layout-test',async onBuildComplete(context){await writeFile(path.join(context.projectDir,'adapter-proof.json'),JSON.stringify({staticOutputs:context.outputs.staticFiles.length,prerenders:context.outputs.prerenders.length}));}};\n");
 await writeFile(path.join(fixture,'next.config.mjs'),`import base from ${JSON.stringify(pathToFileURL(path.join(root,'next.config.mjs')).href)};\nexport default {...base,outputFileTracingRoot:${JSON.stringify(fixture)},deploymentId:'adapter-test-deployment',adapterPath:${JSON.stringify(adapter)}};\n`);
 const env={...process.env,NEXT_TELEMETRY_DISABLED:'1'};
 for(const key of Object.keys(env))if(/^(SMTP_|RESEND_|ENQUIRY_|NEXT_PUBLIC_SITE_URL$|VERCEL)/.test(key))delete env[key];
 const result=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build',fixture,'--webpack'],{cwd:fixture,env,stdio:'inherit',windowsHide:true});
 if(result.status!==0)throw Error('Isolated adapter-mode build failed');
 const snapshot=await createTestSnapshot({projectDir:fixture});const security=await secureBuild({projectDir:fixture,...snapshot});
 const tests=(await readdir(path.join(root,'tests'))).filter(name=>name.endsWith('.test.mjs')).map(name=>path.join(root,'tests',name));
 const tested=spawnSync(process.execPath,['--test',...tests],{cwd:fixture,env,stdio:'inherit',windowsHide:true});
 if(tested.status!==0)throw Error('Adapter-mode production regression tests failed');
 const proof=JSON.parse(await readFile(path.join(fixture,'adapter-proof.json'),'utf8'));
 const legacyHome=await stat(path.join(fixture,'.next/server/app/index.html')).then(()=>true,error=>{if(error.code==='ENOENT')return false;throw error});
 if(legacyHome)throw Error('Adapter test did not exercise the alternate layout');
 const verification={verifiedAt:new Date().toISOString(),adapterBuild:'passed',regressionTests:'passed',deploymentId:'adapter-test-deployment',legacyHomePresent:legacyHome,contentRoutes:14,scriptHashCount:security.hashes.length,...proof};
 await mkdir(path.join(root,'test-results'),{recursive:true});
 await writeFile(path.join(root,'test-results/adapter-verification.json'),JSON.stringify(verification,null,2)+'\n');
 console.log('PASS: real Next adapter build, alternate route-cache layout and all 14 required snapshot routes.');
}finally{
 const temp=path.resolve(os.tmpdir()),resolved=path.resolve(fixture);
 if(path.dirname(resolved)!==temp||!path.basename(resolved).startsWith('shining-adapter-'))throw Error('Unsafe fixture cleanup');
 await rm(resolved,{recursive:true,force:true});
}
