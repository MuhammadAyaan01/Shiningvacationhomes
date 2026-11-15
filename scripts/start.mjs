import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const url='http://127.0.0.1:4173/';
const built=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'inherit',windowsHide:true});
if(built.status!==0)process.exit(built.status||1);
async function ready(){try{const response=await fetch(url,{signal:AbortSignal.timeout(800)});const api=await fetch(url+'api/enquiry/',{signal:AbortSignal.timeout(800)});return response.ok&&api.status===405&&(await response.text()).includes('Shining Vacation Homes')}catch{return false}}
if(await ready()){console.log(`Already running: ${url}`);process.exit(0)}
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4173'],{cwd:root,detached:true,stdio:'ignore',windowsHide:true});
child.on('error',error=>{console.error('Could not start preview:',error.message);process.exitCode=1});
child.unref();
for(let attempt=0;attempt<15;attempt++){if(await ready()){console.log(`Preview running: ${url}`);process.exit(0)}await new Promise(resolve=>setTimeout(resolve,200))}
console.error('Preview did not start. Run npm run dev to see the error.');process.exitCode=1;
