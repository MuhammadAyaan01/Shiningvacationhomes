import {organizationId,websiteId,siteUrl,pageImages} from '../src/seo.js';

export function PageSchema({path,name,description}){
 const url=new URL(path,siteUrl).href;
 const page={
  '@type':path==='/about/'?'AboutPage':path==='/contact/'?'ContactPage':path==='/stays/'?'CollectionPage':'WebPage',
  '@id':`${url}#webpage`,url,name,description,inLanguage:'en',
  isPartOf:{'@id':websiteId},publisher:{'@id':organizationId}
 };
 if(pageImages[path])page.primaryImageOfPage={'@type':'ImageObject',url:new URL(`/media/${pageImages[path]}.jpg`,siteUrl).href,caption:'Illustrative accommodation photograph; actual options are shared after enquiry'};
 const graph=[page];
 if(path==='/')graph.unshift({'@type':'WebSite','@id':websiteId,url:siteUrl.href,name:'Shining Vacation Homes',inLanguage:'en',publisher:{'@id':organizationId}});
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}}/>;
}
