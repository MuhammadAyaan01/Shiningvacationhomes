import {handleEnquiry,readEnquiryRequest} from './enquiry-server.js';
import {deliveryIssues} from './enquiry-delivery.mjs';
import {getEnquiryStore} from './enquiry-store.mjs';

const reply=(status,message,reference)=>Response.json({message,...(reference?{reference}:{})},{status,headers:{'Cache-Control':'no-store'}});
export async function handlePersistentEnquiry(request,env,dependencies={}){
 const parsed=await readEnquiryRequest(request,env,dependencies);
 if(parsed instanceof Response)return parsed;
 if(deliveryIssues(env).length)return reply(503,'Online enquiries are not configured yet. Please call or email the team. Your enquiry has not been sent.');
 let store,captured;
 try{
  const local=['127.0.0.1','localhost','[::1]'].includes(new URL(request.url).hostname);
  store=dependencies.store||await getEnquiryStore(env,local);
  captured=await store.capture(parsed.data,parsed.requestId);
 }catch{return reply(503,'Your enquiry could not be saved. Please call or email the team. Your enquiry has not been submitted.');}
 if(captured.conflict)return reply(409,'This submission has changed. Please reload the form and try again.');
 if(captured.limited)return reply(429,'Please wait before sending another enquiry, or contact the team directly.');
 const received=()=>reply(202,captured.status==='sent'?'Your requirements have been submitted. Our team will contact you. No accommodation has been reserved.':'Your requirements have been saved. Email delivery has not been confirmed. Please contact the team directly if your enquiry is urgent. No accommodation has been reserved.',captured.id);
 if(captured.existing)return received();
 try{
  const result=await handleEnquiry(request,env,{...dependencies,parsed});
  captured.status=result.ok?'sent':'attention';
  await store.finish(captured.id,captured.status);
 }catch{captured.status='attention';}
 return received();
}
