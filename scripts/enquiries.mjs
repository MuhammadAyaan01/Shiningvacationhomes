import nextEnv from '@next/env';
import {getEnquiryStore} from '../src/enquiry-store.mjs';
nextEnv.loadEnvConfig(process.cwd(),false);
const args=process.argv.slice(2);
try{
 const store=await getEnquiryStore(process.env,!process.env.ENQUIRY_DATABASE_URL&&!process.env.ENQUIRY_STORAGE_DIR);
 try{
  if(!args.length||args[0]==='list'){await store.prune();console.table(await store.list());}
  else if(args[0]==='prune'){await store.prune();console.log('Expired website records removed. Mailbox copies are handled separately.');}
  else if(args[0]==='delete'&&/^[a-f0-9-]{36}$/.test(args[1]||'')){await store.remove(args[1]);console.log('Website record removed. Mailbox copies are handled separately.');}
  else if(args[0]==='show'&&/^[a-f0-9-]{36}$/.test(args[1]||'')){
   // Explicit local operator action: never expose this command through an HTTP endpoint.
   const record=await store.read(args[1]);if(!record){console.error('Enquiry not found or expired.');process.exitCode=1;}else console.log(JSON.stringify(record.data,null,2));
  }else{console.error('Use: npm run enquiries -- list | show REFERENCE | delete REFERENCE | prune. Show prints private enquiry details locally.');process.exitCode=1;}
 }finally{await store.close();}
}catch{console.error('Enquiry storage is unavailable. Check the private database/key settings.');process.exitCode=1;}
