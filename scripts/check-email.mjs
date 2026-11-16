import nextEnv from '@next/env';
import nodemailer from 'nodemailer';
import {deliveryIssues,deliveryProvider,gmailTransportOptions} from '../src/enquiry-delivery.mjs';
nextEnv.loadEnvConfig(process.cwd(),false);
const issues=deliveryIssues(process.env);
if(issues.length){
 console.error('Email configuration is incomplete:');
 for(const issue of issues)console.error('- '+issue);
 process.exitCode=1;
}else if(deliveryProvider(process.env)!=='gmail'){
 console.error('This connection check is for ENQUIRY_PROVIDER=gmail.');process.exitCode=1;
}else{
 const transport=nodemailer.createTransport(gmailTransportOptions(process.env));
 try{await transport.verify();console.log('Gmail SMTP connection and authentication passed. No email was sent; inbox delivery still needs a form test.');}
 catch(error){
  const reason=error.code==='EDNS'?'DNS lookup for smtp.gmail.com failed before authentication.':error.code==='EAUTH'?'Google rejected authentication. Check the account, App Password and 2-Step Verification.':'The SMTP connection could not be verified. Check host network access and Google account settings.';
  console.error(reason+' No email was sent.');process.exitCode=1;
 }
 finally{transport.close();}
}
