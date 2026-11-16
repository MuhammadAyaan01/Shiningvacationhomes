const email=/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
export const deliveryProvider=env=>env.ENQUIRY_PROVIDER||'resend';
export const deliveryRecipients=env=>(env.ENQUIRY_TO||(deliveryProvider(env)==='gmail'?env.SMTP_USER:'')||'').split(',').map(value=>value.trim()).filter(Boolean);

export function deliveryIssues(env){
 const issues=[],provider=deliveryProvider(env);
 if(!['gmail','resend'].includes(provider))return ['ENQUIRY_PROVIDER must be gmail or resend.'];
 if(provider==='gmail'){
  if(!email.test(env.SMTP_USER||''))issues.push('SMTP_USER must contain your Google account email.');
  if(!/^[a-zA-Z]{16}$/.test((env.SMTP_APP_PASSWORD||'').replace(/\s/g,'')))issues.push('SMTP_APP_PASSWORD must contain a 16-letter Google App Password.');
 }else{
  for(const key of ['RESEND_API_KEY','ENQUIRY_FROM'])if(!env[key]?.trim())issues.push(`${key} is required.`);
  if(env.ENQUIRY_FROM){const value=env.ENQUIRY_FROM.trim(),match=value.match(/^[^<>\r\n]+<([^<>]+)>$/);if(!email.test(match?match[1]:value))issues.push('ENQUIRY_FROM must contain a valid verified sender email.');}
 }
 const recipients=deliveryRecipients(env);
 if(!recipients.length&&provider==='resend')issues.push('ENQUIRY_TO is required.');
 if(env.ENQUIRY_TO&&!env.ENQUIRY_TO.split(',').every(value=>email.test(value.trim())))issues.push('ENQUIRY_TO must contain valid recipient emails.');
 return issues;
}

export function gmailTransportOptions(env){
 return {host:'smtp.gmail.com',port:465,secure:true,
  auth:{user:env.SMTP_USER.trim(),pass:env.SMTP_APP_PASSWORD.replace(/\s/g,'')},
  connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,dnsTimeout:10000,
  disableFileAccess:true,disableUrlAccess:true,logger:false,debug:false};
}

export async function sendGmailEnquiry(env,message,createTransport){
 const transport=(createTransport||(await import('nodemailer')).default.createTransport)(gmailTransportOptions(env));
 let deadline;
 try{
  const sending=transport.sendMail({
   from:{name:'Shining Vacation Homes',address:env.SMTP_USER.trim()},
   to:deliveryRecipients(env),replyTo:message.replyTo,subject:message.subject,text:message.text,
   messageId:`<enquiry-${message.requestId}@${env.SMTP_USER.trim().split('@')[1]}>`
  });
  const timeout=new Promise((_,reject)=>{deadline=setTimeout(()=>{transport.close();reject(new Error('SMTP deadline exceeded'));},20000);deadline.unref?.();});
  const result=await Promise.race([sending,timeout]);
  if(!result.messageId||result.rejected?.length||result.accepted?.length!==deliveryRecipients(env).length)throw new Error('SMTP acceptance not confirmed');
  return result.messageId;
 }finally{clearTimeout(deadline);transport.close();}
}
