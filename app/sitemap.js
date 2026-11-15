import {routes,siteUrl} from '../src/seo.js';
export const dynamic='force-static';
export default function sitemap(){return routes.map(path=>({url:new URL(path,siteUrl).href}))}
