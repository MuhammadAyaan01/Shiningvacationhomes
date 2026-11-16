import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {routes,siteUrl,pageImages,organizationId,websiteId} from '../src/seo.js';

test('rendered SEO describes each canonical page and a consistent business identity',async()=>{
 for(const route of routes){
  const html=await readFile(`out${route}index.html`,'utf8');
  const url=new URL(route,siteUrl).href;
  assert.ok(html.includes(`rel="canonical" href="${url}"`),route);
  assert.ok(html.includes(`property="og:url" content="${url}"`),route);
  assert.match(html,/max-image-preview:large/,route);
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const nodes=blocks.flatMap(b=>b['@graph']||[b]);
  const organization=nodes.filter(n=>n['@type']==='Organization');
  assert.equal(organization.length,1,route);
  assert.equal(organization[0]['@id'],organizationId);
  assert.equal(organization[0].email,'info@shiningvacationhomes.com');
  const page=nodes.find(n=>n['@id']===`${url}#webpage`);
  assert.ok(page,route);
  assert.equal(page.url,url);
  assert.equal(page.isPartOf['@id'],websiteId);
  assert.equal(page.publisher['@id'],organizationId);
  assert.equal(nodes.filter(n=>n['@type']==='WebSite').length,route==='/'?1:0);
  if(pageImages[route])assert.ok(html.includes(`property="og:image" content="${new URL(`/media/${pageImages[route]}.jpg`,siteUrl).href}"`),route);
  // Accommodation examples must not imply bookable inventory or fabricated social proof.
  assert.ok(nodes.every(n=>!['VacationRental','Product','Offer','AggregateRating'].includes(n['@type'])),route);
  if(route.startsWith('/stays/')&&route!='/stays/'){
   const breadcrumb=nodes.find(n=>n['@type']==='BreadcrumbList');
   assert.equal(breadcrumb.itemListElement[1].name,'Accommodation');
   assert.equal(breadcrumb.itemListElement[2].item,url);
   assert.match(html,/href="\/monthly-stays\/"/);
  }
 }
});
