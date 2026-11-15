'use client';
import Link from 'next/link';
import {Suspense,useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {collections} from '../src/data.mjs';
import {dateErrors} from '../src/dates.js';

function EnquiryPrefill({form,setIntent}){
 const params=useSearchParams(),search=params.toString();
 useEffect(()=>{const query=new URLSearchParams(search),el=form.current;for(const key of ['arrival','departure','guests','collection','intent']){const field=el.elements[key],value=query.get(key);if(value&&field&&(field.type==='date'?/^\d{4}-\d{2}-\d{2}$/.test(value):Array.from(field.options).some(o=>o.value===value)))field.value=value;}if(['guest','monthly','owner'].includes(query.get('intent')))setIntent(query.get('intent'));},[search,form,setIntent]);
 return null;
}
export function EnquiryForm(){
 const form=useRef(null),feedback=useRef(null),requestId=useRef(null),busy=useRef(false);
 const [ready,setReady]=useState(false),[pending,setPending]=useState(false),[intent,setIntent]=useState('guest'),[message,setMessage]=useState(''),[errors,setErrors]=useState({}),[min,setMin]=useState('');
 useEffect(()=>{setReady(true);const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());setMin(today.toISOString().slice(0,10));},[]);
 const clear=()=>{setMessage('');setErrors({});requestId.current=null;form.current.elements.arrival.setCustomValidity('');form.current.elements.departure.setCustomValidity('');};
 const field=name=>({id:name,'aria-invalid':errors[name]?'true':undefined,'aria-describedby':errors[name]?name+'-error':undefined});
 const error=name=>errors[name]?<p className="field-error" id={name+'-error'}>{errors[name]}</p>:null;
 const submit=async event=>{
  event.preventDefault();if(!ready||busy.current)return;
  const el=form.current;el.elements.name.setCustomValidity(el.elements.name.value.trim()?'':'Enter your full name.');
  if(intent!=='owner'){const issues=dateErrors(el.elements.arrival.value,el.elements.departure.value,min);el.elements.arrival.setCustomValidity(issues.start);el.elements.departure.setCustomValidity(issues.end);}
  if(!el.reportValidity())return;
  const body=Object.fromEntries(new FormData(el));
  requestId.current ||= crypto.randomUUID();busy.current=true;setPending(true);setErrors({});setMessage('Sending your enquiry…');
  try{
   const response=await fetch('/api/enquiry/',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':requestId.current},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
   const result=await response.json();setErrors(result.errors||{});setMessage(result.message+(result.reference?' Reference: '+result.reference:''));
   if(response.ok){el.reset();setIntent('guest');requestId.current=null;}
  }catch{setMessage('Delivery could not be confirmed. Please retry or contact the team directly.');}
  finally{busy.current=false;setPending(false);feedback.current?.focus();}
 };
 return <form ref={form} id="enquiry-form" className="enquiry-form" action="/api/enquiry/" method="post" onSubmit={submit} onInput={clear} aria-busy={pending}>
  <h2>Tell us what you have in mind.</h2>
  <Suspense fallback={null}><EnquiryPrefill form={form} setIntent={setIntent}/></Suspense>
  <fieldset className="form-fields" disabled={!ready||pending}>
   <legend className="visually-hidden">Your enquiry details</legend>
   <label>I'm interested in<select {...field('intent')} name="intent" value={intent} onChange={e=>{setIntent(e.target.value);clear();}}><option value="guest">A short stay</option><option value="monthly">A monthly stay</option><option value="owner">Property management</option></select></label>{error('intent')}
   <div className="two-fields"><div><label>Full name <span>(required)</span><input {...field('name')} name="name" autoComplete="name" required maxLength={100} onChange={e=>e.target.setCustomValidity(e.target.value.trim()?'':'Enter your full name.')}/></label>{error('name')}</div><div><label>Email <span>(required)</span><input {...field('email')} name="email" type="email" autoComplete="email" required maxLength={254}/></label>{error('email')}</div></div>
   <label>Phone <span>(optional)</span><input {...field('phone')} name="phone" type="tel" autoComplete="tel" maxLength={40}/></label>{error('phone')}
   <div id="guest-fields" hidden={intent==='owner'}><fieldset disabled={intent==='owner'} className="form-fields"><legend className="visually-hidden">Stay preferences</legend>
    <label>Preferred collection<select {...field('collection')} name="collection" defaultValue=""><option value="">Help me choose</option>{collections.map(p=><option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>{error('collection')}
    <div className="two-fields"><div><label>Check in<input {...field('arrival')} name="arrival" type="date" min={min}/></label>{error('arrival')}</div><div><label>Check out<input {...field('departure')} name="departure" type="date" min={min}/></label>{error('departure')}</div></div>
    <label>Guests<select {...field('guests')} name="guests" defaultValue="1">{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label>{error('guests')}
   </fieldset></div>
   <div id="owner-fields" hidden={intent!=='owner'}><fieldset disabled={intent!=='owner'} className="form-fields"><legend className="visually-hidden">Property details</legend><div className="two-fields"><div><label>Property area<input {...field('area')} name="area" maxLength={120} placeholder="Your Dubai neighbourhood"/></label>{error('area')}</div><div><label>Bedrooms<select {...field('bedrooms')} name="bedrooms"><option>Studio</option>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label>{error('bedrooms')}</div></div></fieldset></div>
   <label>Anything else we should know?<textarea {...field('message')} name="message" rows={4} maxLength={3000} placeholder="Preferred area, duration or anything important to your plans"/></label>{error('message')}
   <div className="form-trap" aria-hidden="true"><label>Leave this field empty<input name="companyWebsite" tabIndex={-1} autoComplete="off"/></label></div>
   <p className="subnote">We use these details to respond to your enquiry. Review our <Link href="/privacy-policy/">privacy information</Link>. Do not include payment details or identity documents.</p>
   <button className="button" type="submit">{pending?'Sending…':'Send enquiry'} <span aria-hidden="true">↗</span></button>
  </fieldset>
  <noscript><p>Please enable JavaScript to use this form, or <a href="mailto:info@shiningvacationhomes.com">email the team</a>. No form information is collected while JavaScript is unavailable.</p></noscript>
  <p ref={feedback} id="form-feedback" role="status" tabIndex={-1}>{message}</p>{errors.form&&<p className="field-error" role="alert">{errors.form}</p>}
 </form>;
}
