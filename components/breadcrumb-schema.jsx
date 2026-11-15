import {siteUrl} from '../src/seo.js';
export function BreadcrumbSchema({name,path}){
 const data={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Home','/'],['Stay collections','/stays/'],[name,path]].map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:new URL(path,siteUrl).href}))};
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>;
}
