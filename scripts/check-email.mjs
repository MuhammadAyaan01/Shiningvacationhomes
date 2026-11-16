import nextEnv from '@next/env';
import {deliveryIssues,deliveryProvider,createGmailTransport,gmailConnectionMessage} from '../src/enquiry-delivery.mjs';
nextEnv.loadEnvConfig(process.cwd(),false);
const issues=deliveryIssues(process.env);
if(issues.length){
 console.error('Email configuration is incomplete:');
 for(const issue of issues)console.error('- '+issue);
 process.exitCode=1;
}else if(deliveryProvider(process.env)!=='gmail'){
 console.error('This connection check is for ENQUIRY_PROVIDER=gmail.');process.exitCode=1;
}else{
 let transport;
 try{transport=await createGmailTransport(process.env);await transport.verify();console.log('Gmail SMTP connection and authentication passed. No email was sent; inbox delivery still needs a form test.');}
 catch(error){
  console.error(gmailConnectionMessage(error)+' No email was sent.');process.exitCode=1;
 }
 finally{transport?.close();}
}
