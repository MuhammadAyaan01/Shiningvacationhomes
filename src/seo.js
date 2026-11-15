export const siteUrl=new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://shiningvacationhomes.com');
export const routes=['/','/stays/','/monthly-stays/','/property-management/','/about/','/contact/','/stays/studio-apartments/','/stays/one-bedroom-apartments/','/stays/two-bedroom-apartments/','/stays/three-bedroom-apartments/','/stays/townhouses/','/stays/luxury-villas/','/privacy-policy/','/booking-terms/'];
export function pageMetadata(path,title,description){
 const full=path==='/'?title:`${title} | Shining Vacation Homes`;
 return {title:path==='/'?{absolute:title}:title,description,alternates:{canonical:path},openGraph:{title:full,description,url:new URL(path,siteUrl).href,siteName:'Shining Vacation Homes',type:'website',images:[{url:'/media/1BR.jpg',width:2000,height:1121,alt:'Reference photograph from the Shining Vacation Homes collection'}]},twitter:{card:'summary_large_image',title:full,description,images:['/media/1BR.jpg']}};
}
