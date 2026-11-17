'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {backToTopDocked,backToTopVisible} from '../src/experience.js';

export function BackToTop(){
 const path=usePathname(),slot=useRef(null),button=useRef(null);
 const [state,setState]=useState({visible:false,docked:false});
 useEffect(()=>{
  const host=slot.current,control=button.current;let frame=0;
  const update=()=>{
   frame=0;
   const height=control.offsetHeight;
   host.style.minHeight=height+'px';
   const gap=parseFloat(getComputedStyle(host.parentElement).paddingBottom)||0;
   const docked=backToTopDocked(host.getBoundingClientRect().top,height,innerHeight,gap);
   const visible=docked||backToTopVisible(scrollY);
   setState(previous=>previous.visible===visible&&previous.docked===docked?previous:{visible,docked});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const observer=new ResizeObserver(schedule);observer.observe(control);observer.observe(host);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});update();
  return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[path]);
 return <div ref={slot} className="back-top-dock"><button ref={button} className={'back-top'+(state.visible?' is-visible':'')} data-docked={state.docked||undefined} type="button" aria-hidden={!state.visible} tabIndex={state.visible?0:-1} onClick={()=>{window.scrollTo({top:0,behavior:'smooth'});document.querySelector('.brand')?.focus({preventScroll:true});}}>Back to top <span aria-hidden="true">↑</span></button></div>;
}
