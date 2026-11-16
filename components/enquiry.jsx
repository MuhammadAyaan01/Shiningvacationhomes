'use client';
import Link from 'next/link';
import {Suspense,useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {collections} from '../src/data.mjs';
import {dateErrors} from '../src/dates.js';

function EnquiryPrefill({form,setIntent}){
 const params=useSearchParams(),search=params.toString();
 useEffect(()=>{
  const query=new URLSearchParams(search),el=form.current;if(!el)return;
  setIntent(['monthly','owner'].includes(query.get('intent'))?query.get('intent'):'guest');
  for(const key of ['arrival','departure','guests','collection']){
   const field=el.elements[key],value=query.get(key);
   if(value&&field&&(field.type==='date'?/^\d{4}-\d{2}-\d{2}$/.test(value):Array.from(field.options||[]).some(o=>o.value===value)))field.value=value;
  }
  if(query.get('arrival'))el.querySelector('[data-exact-dates]').open=true;
  if(query.get('collection'))el.querySelector('[data-preferences]').open=true;
 },[search,form,setIntent]);
 return null;
}
export function EnquiryForm(){
 const form=useRef(null),feedback=useRef(null),requestId=useRef(null),busy=useRef(false);
 const [ready,setReady]=useState(false),[pending,setPending]=useState(false),[intent,setIntent]=useState('guest'),[message,setMessage]=useState(''),[errors,setErrors]=useState({}),[min,setMin]=useState('');
 useEffect(()=>{setReady(true);setMin(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai'}).format(new Date()));},[]);
 const clear=()=>{setMessage('');setErrors({});requestId.current=null;for(const name of ['arrival','departure','travelPlan'])form.current.elements[name]?.setCustomValidity('');};
 const field=(name,hint)=>({id:name,'aria-invalid':errors[name]?'true':undefined,'aria-describedby':[hint,errors[name]?name+'-error':null].filter(Boolean).join(' ')||undefined});
 const error=name=>errors[name]?<p className="field-error" id={name+'-error'}>{errors[name]}</p>:null;
 const submit=async event=>{
  event.preventDefault();if(!ready||busy.current)return;
  const el=form.current;el.elements.name.setCustomValidity(el.elements.name.value.trim()?'':'Enter your full name.');
  if(intent!=='owner'){
   const issues=dateErrors(el.elements.arrival.value,el.elements.departure.value,min);
   el.elements.arrival.setCustomValidity(issues.start);el.elements.departure.setCustomValidity(issues.end);
   el.elements.travelPlan.setCustomValidity(el.elements.arrival.value||el.elements.travelPlan.value.trim()?'':'Tell us your approximate dates or duration, or add an exact arrival date.');
   if(issues.start||issues.end)el.querySelector('[data-exact-dates]').open=true;
  }
  if(!el.reportValidity())return;
  const body=Object.fromEntries(new FormData(el));
  requestId.current ||= crypto.randomUUID();busy.current=true;setPending(true);setErrors({});setMessage('Sending your requirements.');
  try{
   const response=await fetch('/api/enquiry/',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':requestId.current},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
   const result=await response.json();setErrors(result.errors||{});setMessage(result.message+(result.reference?' Reference: '+result.reference:''));
   if(result.errors){if(['arrival','departure'].some(k=>result.errors[k]))el.querySelector('[data-exact-dates]').open=true;if(['collection','preferredArea','budget','budgetBasis'].some(k=>result.errors[k]))el.querySelector('[data-preferences]').open=true;}
   if(response.ok){el.reset();requestId.current=null;}
  }catch{setMessage('Delivery could not be confirmed. Please retry or contact the team directly.');}
  finally{busy.current=false;setPending(false);feedback.current?.focus();}
 };
 return <form ref={form} id="enquiry-form" className="enquiry-form" action="/api/enquiry/" method="post" onSubmit={submit} onInput={clear} onInvalidCapture={event=>{const details=event.target.closest('details');if(details)details.open=true;}} aria-busy={pending}>
  <h2>{intent==='owner'?'Tell us about your property.':'Tell us about your stay.'}</h2>
  <p className="form-intro">{intent==='owner'?'Share your property details and questions with the team.':'Share your requirements. Our team will contact you to discuss suitable available options.'}</p>
  <Suspense fallback={null}><EnquiryPrefill form={form} setIntent={setIntent}/></Suspense>
  <fieldset className="form-fields" disabled={!ready||pending}>
   <legend className="visually-hidden">Your enquiry details</legend>
   {intent==='owner'?<><input type="hidden" name="intent" value="owner"/><p className="form-purpose">Property management enquiry</p></>:<label>Type of stay<select {...field('intent')} name="intent" value={intent} onChange={e=>{setIntent(e.target.value);clear();}}><option value="guest">A short stay</option><option value="monthly">A monthly stay</option></select></label>}{error('intent')}
   <div className="two-fields"><div><label>Full name <span>(required)</span><input {...field('name')} name="name" autoComplete="name" required maxLength={100} onChange={e=>e.target.setCustomValidity(e.target.value.trim()?'':'Enter your full name.')}/></label>{error('name')}</div><div><label>Email <span>(required)</span><input {...field('email')} name="email" type="email" autoComplete="email" required maxLength={254}/></label>{error('email')}</div></div>
   <label>Phone <span>(optional)</span><input {...field('phone')} name="phone" type="tel" autoComplete="tel" maxLength={40}/></label>{error('phone')}
   <div id="guest-fields" hidden={intent==='owner'}><fieldset disabled={intent==='owner'} className="form-fields"><legend className="visually-hidden">Stay requirements</legend>
    <label>Approximate dates or duration<input {...field('travelPlan','travel-plan-help')} name="travelPlan" maxLength={200} placeholder="For example, two weeks in December"/></label><p className="field-hint" id="travel-plan-help">Tell us when you would like to stay, or add exact dates below. Flexible plans are welcome.</p>{error('travelPlan')}
    <details className="enquiry-details" data-exact-dates><summary>Add exact dates <span>(optional)</span></summary><div className="two-fields"><div><label>Arrival<input {...field('arrival')} name="arrival" type="date" min={min}/></label>{error('arrival')}</div><div><label>Departure<input {...field('departure')} name="departure" type="date" min={min}/></label>{error('departure')}</div></div></details>
    <label>Number of guests<select {...field('guests')} name="guests" defaultValue=""><option value="">Not sure yet</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label>{error('guests')}
    <details className="enquiry-details" data-preferences><summary>Accommodation, area and budget <span>(optional)</span></summary>
     <label>Accommodation preference<select {...field('collection')} name="collection" defaultValue=""><option value="">Help me choose</option>{collections.map(p=><option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>{error('collection')}
     <label>Preferred area<input {...field('preferredArea')} name="preferredArea" maxLength={120} placeholder="A neighbourhood, landmark or place nearby"/></label>{error('preferredArea')}
     <div className="two-fields"><div><label>Approximate budget (AED)<input {...field('budget')} name="budget" type="number" min="1" max="100000000" step="0.01" inputMode="decimal"/></label>{error('budget')}</div><div><label>Budget is for<select {...field('budgetBasis')} name="budgetBasis" defaultValue="total"><option value="total">The whole stay</option><option value="monthly">Each month</option></select></label>{error('budgetBasis')}</div></div>
    </details>
   </fieldset></div>
   <div id="owner-fields" hidden={intent!=='owner'}><fieldset disabled={intent!=='owner'} className="form-fields"><legend className="visually-hidden">Property details</legend><div className="two-fields"><div><label>Property area<input {...field('area')} name="area" maxLength={120} placeholder="Your Dubai neighbourhood"/></label>{error('area')}</div><div><label>Bedrooms<select {...field('bedrooms')} name="bedrooms"><option>Studio</option>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label>{error('bedrooms')}</div></div></fieldset></div>
   <label>Anything else we should know? <span>(optional)</span><textarea {...field('message')} name="message" rows={3} maxLength={3000} placeholder="Anything important to your plans"/></label>{error('message')}
   <div className="form-trap" aria-hidden="true"><label>Leave this field empty<input name="companyWebsite" tabIndex={-1} autoComplete="off"/></label></div>
   <p className="subnote">We use these details to respond to your enquiry. Read our <Link href="/privacy-policy/">privacy information</Link>. Please do not include payment details or identity documents.</p>
   <button className="button" type="submit">{pending?'Sending…':intent==='owner'?'Send property enquiry':'Send my requirements'} <span aria-hidden="true">↗</span></button>
  </fieldset>
  <noscript><p>Please enable JavaScript to use this form, or <a href="mailto:info@shiningvacationhomes.com">email the team</a>. No form information is collected while JavaScript is unavailable.</p></noscript>
  <p ref={feedback} id="form-feedback" role="status" tabIndex={-1}>{message}</p>{errors.form&&<p className="field-error" role="alert">{errors.form}</p>}
  {intent==='owner'?<p className="subnote"><Link href="/contact/">Planning a stay instead?</Link></p>:<p className="subnote">Own a Dubai property? <Link href="/contact/?intent=owner">Contact us about management.</Link></p>}
 </form>;
}
