export const siteUrl=new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://shiningvacationhomes.com');
export const routes=['/','/stays/','/monthly-stays/','/property-management/','/about/','/contact/','/stays/studio-apartments/','/stays/one-bedroom-apartments/','/stays/two-bedroom-apartments/','/stays/three-bedroom-apartments/','/stays/townhouses/','/stays/luxury-villas/','/privacy-policy/','/booking-terms/'];
export const pageImages={
 '/monthly-stays/':'2BR','/property-management/':'villa',
 '/stays/studio-apartments/':'studio','/stays/one-bedroom-apartments/':'1BR',
 '/stays/two-bedroom-apartments/':'2BR','/stays/three-bedroom-apartments/':'4BR',
 '/stays/townhouses/':'3BR','/stays/luxury-villas/':'villa'
};
export function pageMetadata(path,title,description){
 const full=path==='/'?title:`${title} | Shining Vacation Homes`;
 const image=`/media/${pageImages[path]||'1BR'}.jpg`;
 return {title:path==='/'?{absolute:title}:title,description,alternates:{canonical:path},openGraph:{title:full,description,url:new URL(path,siteUrl).href,siteName:'Shining Vacation Homes',locale:'en_AE',type:'website',images:[{url:image,width:2000,height:1121,alt:'Illustrative accommodation photograph; actual options are shared after enquiry'}]},twitter:{card:'summary_large_image',title:full,description,images:[image]}};
}

export const organizationId=new URL('/#organization',siteUrl).href;
export const websiteId=new URL('/#website',siteUrl).href;
export const organizationSchema={
 '@context':'https://schema.org','@type':'Organization','@id':organizationId,
 name:'Shining Vacation Homes',url:siteUrl.href,
 logo:{'@type':'ImageObject',url:new URL('/media/shining_logo_ink.svg',siteUrl).href,width:558,height:119},
 telephone:'+971555770688',email:'info@shiningvacationhomes.com',
 areaServed:{'@type':'City',name:'Dubai'},
 contactPoint:{'@type':'ContactPoint',contactType:'Accommodation enquiries',telephone:'+971555770688',email:'info@shiningvacationhomes.com'}
};
