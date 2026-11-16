'use client';
import {createContext,useContext,useEffect,useLayoutEffect,useRef,useState,useCallback,Suspense} from 'react';
import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import {collections,faqs,media} from '../src/data.mjs';
import {chapters} from '../src/chapter-data.mjs';
import {CollectionImage} from './collection-image.jsx';
import {staySummary} from '../src/experience.js';

const SiteContext=createContext(null);
const keys=['arrival','departure','guests'];
const nav=[['/stays/','Accommodation'],['/monthly-stays/','Monthly stays'],['/about/','About'],['/contact/','Contact']];
const easing='cubic-bezier(.22,1,.36,1)';
const photoSrc=p=>['studio-600x336.jpg','1BR-600x336.jpg','2BR-600x336.jpg','4BR-600x336.jpg','villa-600x336.jpg'].includes(p.image.split('/').at(-1))?'/media/'+p.image.split('/').at(-1):media+p.image;
const animate=(element,frames,duration=600)=>element?.animate?.(frames,{duration,easing});
function useSite(){return useContext(SiteContext)}
export function EnquirySidebar({children}){
 const sidebar=useRef(null);
 useLayoutEffect(()=>{
  const element=sidebar.current,desktop=matchMedia('(min-width:1001px)');
  const update=()=>{
   const height=element.offsetHeight;
   element.style.setProperty('--sidebar-top',`${Math.max(32,(innerHeight-height)/2)}px`);
   element.toggleAttribute('data-sticky',desktop.matches&&height<=innerHeight-64);
  };
  const observer=new ResizeObserver(update);observer.observe(element);
  window.addEventListener('resize',update,{passive:true});update();
  return()=>{observer.disconnect();window.removeEventListener('resize',update);};
 },[]);
 return <aside ref={sidebar} className="enquiry-sidebar">{children}</aside>;
}
export function SiteProvider({children}){
 const [plan,setPlan]=useState({arrival:'',departure:'',guests:'1'});
 const [query,setQuery]=useState({});const [photo,setPhoto]=useState(null);
 const opener=useRef(null);
 const path=usePathname();
 const sync=useCallback(search=>{const q=Object.fromEntries(new URLSearchParams(search));setQuery(q);setPlan({arrival:/^\d{4}-\d{2}-\d{2}$/.test(q.arrival||'')?q.arrival:'',departure:/^\d{4}-\d{2}-\d{2}$/.test(q.departure||'')?q.departure:'',guests:/^(?:[1-9]|1[0-2])$/.test(q.guests||'')?q.guests:'1'});},[]);
 useEffect(()=>{setPhoto(null)},[path]);
 useEffect(()=>{const legacy={about_us:'/about/',property_management:'/property-management/'};if(location.pathname==='/'&&legacy[location.hash.slice(1)])location.replace(legacy[location.hash.slice(1)]);},[]);
 const href=path=>{
  if(!/^\/(?:stays|contact|monthly-stays)\//.test(path))return path;
  const url=new URL(path,'https://shining.invalid');
  keys.forEach(key=>{if(plan[key]&&(key!=='guests'||plan[key]!=='1'))url.searchParams.set(key,plan[key]);});
  return url.pathname+url.search+url.hash;
 };
 const openPhoto=(slug,button)=>{opener.current=button;setPhoto(Math.max(0,collections.findIndex(p=>p.slug===slug)));};
 return <SiteContext.Provider value={{plan,setPlan,query,href,openPhoto}}><Suspense fallback={null}><PlanSync onNavigate={sync}/></Suspense>{children}<PhotoDialog index={photo} setIndex={setPhoto} opener={opener}/></SiteContext.Provider>;
}
function PlanSync({onNavigate}){const path=usePathname(),params=useSearchParams(),search=params.toString();useEffect(()=>onNavigate(search),[path,search,onNavigate]);return null}
export function ContextLink({href,...props}){const site=useSite(),target=site.href(href);return target.startsWith('/')&&!target.startsWith('//')?<Link href={target} {...props}/>:<a href={target} {...props}/>}
export function Header(){
 const path=usePathname();const [open,setOpen]=useState(false),[mobile,setMobile]=useState(false);const menu=useRef(null),header=useRef(null);
 useEffect(()=>{const breakpoint=matchMedia('(max-width:900px)');setMobile(breakpoint.matches);const change=()=>{setMobile(breakpoint.matches);setOpen(false);};breakpoint.addEventListener('change',change);return()=>breakpoint.removeEventListener('change',change);},[]);
 useEffect(()=>{if(!open)return;const outside=e=>{if(!header.current?.contains(e.target))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
 useEffect(()=>{const escape=e=>{if(e.key==='Escape'&&open){setOpen(false);menu.current?.focus();}};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);},[open]);
 return <header ref={header} className="header wrap"><ContextLink className="brand" href="/" aria-label="Shining Vacation Homes home"><img src="/media/shining_logo_ink.svg" alt="Shining Vacation Homes" width="196" height="42"/></ContextLink><button ref={menu} className="menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(value=>!value)}><span className="menu-label">{open?'Close':'Menu'}</span><span className="menu-icon" aria-hidden="true"/></button><nav id="main-nav" className={open?'open':''} aria-label="Main navigation" aria-hidden={mobile?!open:undefined} inert={mobile&&!open} onClick={e=>{if(e.target.closest('a'))setOpen(false);}}>{nav.map(([url,label])=><ContextLink key={url} href={url} aria-current={path===url||path===url.slice(0,-1)?'page':undefined}>{label}</ContextLink>)}<ContextLink className="mobile-stay" href="/contact/">Plan your stay <span aria-hidden="true">↗</span></ContextLink></nav><ContextLink className="header-contact" href="/contact/">Plan your stay <span aria-hidden="true">↗</span></ContextLink></header>;
}
export function Footer(){return <footer><div className="wrap footer-top"><div><ContextLink className="footer-wordmark" href="/">A little more Dubai.<br/>A little more you.</ContextLink><p>Shining Vacation Homes<br/>Short &amp; mid-term stays · Dubai</p></div><div><p className="eyebrow">EXPLORE</p>{nav.map(([url,label])=><ContextLink key={url} href={url}>{label}</ContextLink>)}<ContextLink href="/property-management/">For property owners</ContextLink></div><div><p className="eyebrow">LET’S CONNECT</p><a href="mailto:info@shiningvacationhomes.com">info@shiningvacationhomes.com</a><a href="tel:+971555770688">+971 55 577 0688</a><a href="tel:+97145770384">+971 4 577 0384</a></div></div><p className="wrap preview-note">Accommodation arranged around your requirements. Availability is confirmed on enquiry; submitting a request does not reserve a home.</p><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Shining Vacation Homes</span><div><ContextLink href="/privacy-policy/">Privacy information</ContextLink><ContextLink href="/booking-terms/">Booking information</ContextLink></div><span>Dubai, UAE ↗</span></div></footer>}
export function StayContext(){const {plan}=useSite();return <div className="context-summary">{plan.arrival||plan.departure?staySummary(plan.arrival,plan.departure,plan.guests):'Share your dates, guests and preferences. We will discuss suitable available options with you.'}</div>}
export function Faq(){
 const [active,setActive]=useState(-1);const group=useRef(null);
 useLayoutEffect(()=>{const el=group.current;const measure=()=>{const items=[...el.querySelectorAll('.faq-item')];const closed=items.reduce((n,item)=>n+item.querySelector('button').offsetHeight+2,1);const max=Math.max(...items.map(item=>item.querySelector('.faq-answer').scrollHeight));el.style.minHeight=`${closed+max}px`;};measure();let width=el.clientWidth;const observer=new ResizeObserver(()=>{if(el.clientWidth!==width){width=el.clientWidth;measure();}});observer.observe(el);document.fonts.ready.then(()=>{if(el.isConnected)measure()});return()=>observer.disconnect();},[]);
 return <div ref={group} className="faqs faq-enhanced">{faqs.map(([question,answer],i)=><div key={question} className={'faq-item'+(active===i?' is-open':'')}><button type="button" className="faq-trigger" id={`faq-0-${i}-question`} aria-expanded={active===i} aria-controls={`faq-0-${i}-answer`} onClick={()=>setActive(active===i?-1:i)}>{question}<span aria-hidden="true">+</span></button><div className="faq-panel" role="region" id={`faq-0-${i}-answer`} aria-labelledby={`faq-0-${i}-question`} aria-hidden={active!==i} inert={active!==i}><div className="faq-panel-inner"><div className="faq-answer"><p>{answer}</p></div></div></div></div>)}</div>;
}
export function ChapterStory(){
 const [active,setActive]=useState(0);const tabs=useRef([]),photo=useRef(null),panel=useRef(null);
 const choose=(i,focus=false)=>{if(i===active)return;setActive(i);if(focus)tabs.current[i]?.focus();animate(photo.current,[{opacity:.25,transform:'scale(1.045)'},{opacity:1,transform:'scale(1)'}]);animate(panel.current,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],420);};
 return <div className="chapter-story"><figure className="chapter-photo chapter-reveal"><CollectionImage ref={photo} src={'/media/'+chapters[active].image.split('/').at(-1)} alt={chapters[active].alt} width="900" height="650" loading="lazy"/><span className="chapter-photo-number" aria-hidden="true">0{active+1} <span>/ 03</span></span><figcaption>Example accommodation photograph</figcaption></figure><div className="chapter-story-content"><div className="chapter-tabs" style={{'--chapter-index':active}} role="tablist" aria-label="Choose your Dubai chapter">{chapters.map((c,i)=><button key={c.id} ref={el=>{tabs.current[i]=el}} type="button" role="tab" id={'chapter-tab-'+c.id} aria-controls={'chapter-panel-'+c.id} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>choose(i)} onKeyDown={e=>{const next=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:null;if(next!==null){e.preventDefault();choose(next,true);}}}><span className="chapter-tab-number" aria-hidden="true">0{i+1}</span><span className="chapter-tab-label">{c.label}</span></button>)}</div><div ref={panel} className="chapter-panels chapter-reveal">{chapters.map((c,i)=><div key={c.id} role="tabpanel" id={'chapter-panel-'+c.id} aria-labelledby={'chapter-tab-'+c.id} tabIndex={0} hidden={active!==i} aria-hidden={active!==i} inert={active!==i}><p className="eyebrow">YOUR DUBAI, YOUR WAY</p><h3>{c.title.split('\n').map((line,j)=><span key={line}>{j>0&&<br/>}{line}</span>)}</h3><p>{c.body}</p><p className="chapter-prompt">{c.prompt}</p><ContextLink className="text-link chapter-action" href={c.href}>{c.cta} <span aria-hidden="true">↗</span></ContextLink></div>)}</div></div></div>;
}
export function PhotoButton({slug,label='View example photos'}){const {openPhoto}=useSite();return <button className="quick-view" type="button" aria-haspopup="dialog" aria-label={label+' — '+(collections.find(p=>p.slug===slug)?.name||'Dubai collection')} onClick={e=>openPhoto(slug,e.currentTarget)}>{label} ↗</button>}
export function CollectionCard({slug,featured=false}){const p=collections.find(p=>p.slug===slug);return <article className={'stay-tile'+(featured?' feature':'')}><ContextLink className={'stay-card'+(featured?' feature':'')} href={'/contact/?collection='+p.slug}><div className="card-image"><CollectionImage sizes={featured?'(max-width:1000px) 100vw, 55vw':'(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw'} src={photoSrc(p)} alt={'Illustrative '+p.name.toLowerCase()+' accommodation photograph'} width="900" height="650" loading="lazy"/><span className="image-tag">Example photograph</span><span className="round-arrow" aria-hidden="true">↗</span></div><div className="card-copy"><span className="eyebrow">ACCOMMODATION STYLE</span><h3>{p.name}</h3><p>{p.short}</p><span className="card-bottom">Enquire about this option <span aria-hidden="true">↗</span></span></div></ContextLink><ContextLink className="stay-guide" href={'/stays/'+p.slug+'/'}>About this accommodation style <span aria-hidden="true">↗</span></ContextLink><PhotoButton slug={slug} label="View example"/></article>}
export function AccommodationStyles(){return <><h2 className="visually-hidden">Accommodation styles</h2><div className="cards accommodation-styles" aria-label="Accommodation styles">{collections.map(p=><CollectionCard key={p.slug} slug={p.slug}/>)}</div></>}
function PhotoDialog({index,setIndex,opener}){
 const dialog=useRef(null),image=useRef(null);const [status,setStatus]=useState('');const {href}=useSite();const item=collections[index??0];
 useEffect(()=>{const el=dialog.current;if(index!==null){if(!el.open)el.showModal();document.documentElement.classList.add('photo-open');setStatus('Loading photograph.');animate(image.current,[{opacity:.25},{opacity:1}],480);}else if(el.open)el.close();return()=>document.documentElement.classList.remove('photo-open');},[index]);
 const close=()=>{setIndex(null);opener.current?.focus();};const move=n=>setIndex((index+n+collections.length)%collections.length);
 return <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-title" onCancel={close} onClose={close} onClick={e=>{if(e.target===e.currentTarget)dialog.current.close()}} onKeyDown={e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}><div className="photo-dialog-inner"><header className="photo-toolbar"><span>ACCOMMODATION INSPIRATION</span><button type="button" className="photo-close" aria-label="Close photo preview" onClick={()=>dialog.current.close()}>Close ×</button></header><div className="photo-stage" aria-busy={status==='Loading photograph.'}><CollectionImage sizes="100vw" width="2000" height="1121" ref={image} src={index===null?undefined:photoSrc(item)} alt={'Representative '+item.name.toLowerCase()+' collection photograph'} draggable={false} onLoad={()=>setStatus(`Example ${index+1} of ${collections.length}`)} onError={()=>setStatus('This photograph could not load. Try another collection or open its page.')}/></div><div className="photo-navigation"><button type="button" aria-label="Previous collection photograph" onClick={()=>move(-1)}>← Previous</button><button type="button" aria-label="Next collection photograph" onClick={()=>move(1)}>Next →</button></div><div className="photo-info"><div><p className="eyebrow">EXAMPLE PHOTOGRAPHY</p><h2 id="photo-title">{item.name}</h2><p className="photo-status" role="status">{status}</p><p className="subnote">These images illustrate accommodation styles. Our team shares actual available options after your enquiry.</p></div><div className="photo-actions"><Link className="button secondary" href={href('/stays/'+item.slug+'/')}>Read the style guide ↗</Link><Link className="button" href={href('/contact/?collection='+item.slug)}>Enquire about this option ↗</Link></div></div></div></dialog>;
}
export function Motion(){
 const path=usePathname();
 const progress=useRef(null),[back,setBack]=useState(false);
 useEffect(()=>{
  const animations=[];const play=(el,frames,duration=760,delay=0)=>{const a=el?.animate?.(frames,{duration,delay,easing,fill:'backwards'});if(a)animations.push(a);};
  const enter=(el,delay=0)=>play(el,[{opacity:0,transform:'translateY(44px)'},{opacity:1,transform:'translateY(0)'}],760,delay);
  document.querySelectorAll('.hero-copy>*:not(h1),.page-intro>*:not(h1),.detail-heading>*:not(h1):not(.breadcrumb)').forEach((el,i)=>enter(el,Math.min(i*110,440)));
  play(document.querySelector('.hero-visual'),[{clipPath:'inset(0 0 100% 0 round 8px)',transform:'translateY(32px)',opacity:.2},{clipPath:'inset(0 0 0 0 round 8px)',transform:'translateY(0)',opacity:1}],1150,80);
  const observer=new IntersectionObserver(entries=>entries.filter(entry=>entry.isIntersecting).forEach((entry,i)=>{enter(entry.target,Math.min(i*90,270));observer.unobserve(entry.target);}),{threshold:.12,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.section-title,.home-collection>.stay-tile,.collection-row,.slow-grid>*,.steps article,.owner-band>*,.faq-grid>*,.editorial>*,.help-strip,.contact-grid>*,.prose>*,.detail-photo,.detail-copy,.enquiry-panel,.cards>*,.chapter-reveal').forEach(el=>observer.observe(el));
  const hero=document.querySelector('.hero-visual');let frame=0;
  const update=()=>{frame=0;const y=scrollY,range=document.documentElement.scrollHeight-innerHeight;progress.current?.style.setProperty('transform',`scaleX(${range>0?Math.min(y/range,1):0})`);setBack(y>550);hero?.style.setProperty('--hero-drift',`${Math.min(y*.1,42)}px`);};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const look=e=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const box=hero.getBoundingClientRect();hero?.style.setProperty('--look-x',`${((e.clientX-box.left)/box.width-.5)*14}px`);hero?.style.setProperty('--look-y',`${((e.clientY-box.top)/box.height-.5)*10}px`);};
  const leave=()=>{hero?.style.setProperty('--look-x','0px');hero?.style.setProperty('--look-y','0px')};
  window.addEventListener('scroll',scroll,{passive:true});hero?.addEventListener('pointermove',look);hero?.addEventListener('pointerleave',leave);update();
  return()=>{observer.disconnect();animations.forEach(a=>a.cancel());cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);hero?.removeEventListener('pointermove',look);hero?.removeEventListener('pointerleave',leave);};
 },[path]);
 return <><div ref={progress} className="reading-progress" aria-hidden="true"/><button className={'back-top'+(back?' is-visible':'')} type="button" aria-hidden={!back} tabIndex={back?0:-1} onClick={()=>{window.scrollTo({top:0,behavior:'smooth'});document.querySelector('.brand')?.focus({preventScroll:true});}}>Back to top ↑</button></>;
}
