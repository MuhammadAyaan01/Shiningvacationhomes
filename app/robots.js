import {siteUrl} from '../src/seo.js';
export const dynamic='force-static';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:new URL('/sitemap.xml',siteUrl).href}}
