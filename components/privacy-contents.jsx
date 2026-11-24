"use client";

import {useEffect,useState} from 'react';
import Link from 'next/link';

export function PrivacyContents({items}){
 const [active,setActive]=useState(items[0]?.id);
 useEffect(()=>{
  const sections=items.map(item=>document.getElementById(item.id)).filter(Boolean);
  if(!sections.length)return;
  let frame=0,current=items[0]?.id;
  const update=()=>{
   frame=0;
   const readingLine=Math.min(180,innerHeight*.25);
   let next=sections[0].id;
   for(const section of sections){
    if(section.getBoundingClientRect().top<=readingLine)next=section.id;
    else break;
   }
   if(next!==current){current=next;setActive(next);}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const content=document.querySelector('.privacy-content');
  const observer=new ResizeObserver(schedule);
  if(content)observer.observe(content);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('hashchange',schedule);
  schedule();
  return()=>{
   cancelAnimationFrame(frame);observer.disconnect();
   window.removeEventListener('scroll',schedule);
   window.removeEventListener('resize',schedule);
   window.removeEventListener('hashchange',schedule);
  };
 },[items]);
 return <nav className="privacy-nav" aria-labelledby="privacy-contents-title">
  <h2 id="privacy-contents-title" className="eyebrow">ON THIS PAGE</h2>
  <ol>{items.map((item,index)=><li key={item.id}><Link href={'#'+item.id} scroll={false} onNavigate={event=>{event.preventDefault();window.history.pushState(null,'','#'+item.id);document.getElementById(item.id)?.scrollIntoView({behavior:'smooth',block:'start'});}} aria-current={active===item.id?'location':undefined}><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span>{item.title}</Link></li>)}</ol>
 </nav>;
}
