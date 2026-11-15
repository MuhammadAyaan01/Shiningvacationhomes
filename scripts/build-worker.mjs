import {spawnSync} from 'node:child_process';
import {cp,mkdir,writeFile} from 'node:fs/promises';
import {builtinModules} from 'node:module';
import {build} from 'esbuild';

await import('./prepare-images.mjs');
const result=spawnSync(process.execPath,['node_modules/@opennextjs/cloudflare/dist/cli/index.js','build'],{stdio:'inherit',windowsHide:true,env:{...process.env,BUILD_TARGET:'worker',NEXT_TELEMETRY_DISABLED:'1'}});
if(result.status!==0)process.exit(result.status||1);
await mkdir('dist/server',{recursive:true});
await build({entryPoints:['.open-next/worker.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'neutral',mainFields:['module','main'],conditions:['workerd','worker','import'],target:'es2022',external:[...builtinModules,...builtinModules.map(n=>'node:'+n),'cloudflare:*'],minify:true});
await cp('.open-next/assets','dist/client',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
const hosting=JSON.parse(await (await import('node:fs/promises')).readFile('.openai/hosting.json','utf8'));
delete hosting.static;
await writeFile('dist/.openai/hosting.json',JSON.stringify(hosting,null,2));
console.log('Prepared the server-backed Sites worker and client assets.');
