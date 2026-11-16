import {collections} from './data.mjs';

const emailPattern=/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
// shortcut: per-process limits reset on restart; use shared host protection before public promotion.
const limits=new Map();
const response=(status,data,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
const todayDubai=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai'}).format(new Date());
const dateValid=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;

export function validateEnquiry(input,today=todayDubai()){
 const errors={},data={};
 if(!input||typeof input!=='object'||Array.isArray(input))return {errors:{form:'Invalid enquiry.'},data};
 for(const [key,max] of Object.entries({intent:10,name:100,email:254,phone:40,collection:80,arrival:10,departure:10,travelPlan:200,guests:2,preferredArea:120,budget:12,budgetBasis:10,area:120,bedrooms:10,message:3000,companyWebsite:200})){
  if(input[key]!==undefined&&typeof input[key]!=='string'){errors[key]='Use a text value.';continue;}
  data[key]=(input[key]||'').trim();if(data[key].length>max)errors[key]=`Use no more than ${max} characters.`;
 }
 if(!['guest','monthly','owner'].includes(data.intent))errors.intent='Choose an enquiry type.';
 if(!data.name||/[\r\n\u0000-\u001f]/.test(data.name))errors.name='Enter your full name on one line.';
 if(!emailPattern.test(data.email))errors.email='Enter a valid email address.';
 if(data.phone&&!/^[+\d\s().-]{5,40}$/.test(data.phone))errors.phone='Enter a valid telephone number.';
 if(data.companyWebsite)errors.form='Unable to accept this enquiry.';
 if(data.intent==='owner'){
  if(!['Studio','1','2','3','4','5','6'].includes(data.bedrooms))errors.bedrooms='Choose the number of bedrooms.';
  for(const key of ['collection','arrival','departure','travelPlan','guests','preferredArea','budget','budgetBasis'])delete data[key];
 }else{
  if(data.collection&&!collections.some(c=>c.slug===data.collection))errors.collection='Choose a listed accommodation style.';
  if(data.guests&&!/^(?:[1-9]|1[0-2])$/.test(data.guests))errors.guests='Choose between 1 and 12 guests, or Not sure yet.';
  if(!data.arrival&&!data.travelPlan)errors.travelPlan='Tell us your approximate dates or duration, or add an exact arrival date.';
  if(data.budget){
   if(!/^\d+(?:\.\d{1,2})?$/.test(data.budget)||Number(data.budget)<1||Number(data.budget)>100000000)errors.budget='Enter a budget between AED 1 and AED 100,000,000, with up to two decimal places.';
   if(!['total','monthly'].includes(data.budgetBasis))errors.budgetBasis='Choose whether the budget is for the whole stay or each month.';
  }else delete data.budgetBasis;
  for(const key of ['arrival','departure'])if(data[key]&&!dateValid(data[key]))errors[key]='Enter a valid date.';
  if(data.arrival&&data.arrival<today)errors.arrival='Choose today or a future date.';
  if(data.departure&&!data.arrival)errors.arrival='Choose a check-in date first.';
  if(data.arrival&&data.departure&&data.departure<=data.arrival)errors.departure='Check-out must be after check-in.';
  delete data.area;delete data.bedrooms;
 }
 delete data.companyWebsite;
 return {data,errors};
}

async function readBody(request){
 const reader=request.body?.getReader();if(!reader)throw new Error('empty');
 const chunks=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();throw new Error('large')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
 return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handleEnquiry(request,env={},dependencies={}){
 if(request.method!=='POST')return response(405,{message:'Use POST.'},{Allow:'POST'});
 const url=new URL(request.url);
 const origin=request.headers.get('origin'),expected=env.ENQUIRY_ORIGIN||(request.headers.get('host')?`${url.protocol}//${request.headers.get('host')}`:url.origin);
 if(!origin||origin!==expected)return response(403,{message:'This enquiry must be sent from this website.'});
 if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')return response(415,{message:'Use JSON.'});
 let input;try{input=await readBody(request)}catch(error){return response(error.message==='large'?413:400,{message:'The enquiry could not be read. Please check its size and try again.'})}
 const {data,errors}=validateEnquiry(input,dependencies.today);
 if(Object.keys(errors).length)return response(422,{message:'Please check the highlighted fields.',errors});
 const requestId=request.headers.get('idempotency-key')||'';
 if(!/^[a-zA-Z0-9_-]{16,80}$/.test(requestId))return response(400,{message:'Reload the form and try again.'});
 if(!env.RESEND_API_KEY||!env.ENQUIRY_FROM||!env.ENQUIRY_TO)return response(503,{message:'Online enquiries are not configured yet. Please call or email the team. Your enquiry has not been sent.'});
 const now=Date.now(),key=data.email.toLowerCase(),store=dependencies.limits||limits;
 for(const [key,value] of store)if(now-value.start>900000)store.delete(key);
 if(store.size>=1000&&!store.has(key))return response(429,{message:'Please try again later.'},{'Retry-After':'900'});
 const entry=store.get(key)||{start:now,count:0};
 if(entry.count>=5)return response(429,{message:'Please wait before sending another enquiry.'},{'Retry-After':'900'});
 entry.count++;store.set(key,entry);
 const text=['Shining Vacation Homes enquiry','',...Object.entries(data).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`),'','An enquiry is not a confirmed reservation.'].join('\n');
 try{
  const result=await (dependencies.fetch||fetch)('https://api.resend.com/emails',{
   method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`enquiry-${requestId}`},
   body:JSON.stringify({from:env.ENQUIRY_FROM,to:env.ENQUIRY_TO.split(',').map(v=>v.trim()).filter(Boolean),reply_to:data.email,subject:`Shining Vacation Homes — ${data.intent==='owner'?'Property management':data.intent==='monthly'?'Monthly stay':'Stay'} enquiry`,text})
  });
  if(!result.ok)return response(result.status===429?429:502,{message:'The email service could not accept your enquiry. Please retry or contact the team directly.'});
  const receipt=await result.json();if(!receipt.id)throw new Error('No receipt');
  return response(202,{message:data.intent==='owner'?'Your property enquiry has been submitted. Our team will contact you to discuss the details.':'Your requirements have been submitted. Our team will contact you to discuss suitable available options. No accommodation has been reserved.',reference:receipt.id});
 }catch{return response(502,{message:'Delivery could not be confirmed. Please retry or contact the team directly.'})}
}
