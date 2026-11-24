import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),axePath=require.resolve('axe-core/axe.min.js');
const routes=['/','/stays/','/monthly-stays/','/property-management/','/about/','/contact/','/stays/studio-apartments/','/stays/one-bedroom-apartments/','/stays/two-bedroom-apartments/','/stays/three-bedroom-apartments/','/stays/townhouses/','/stays/luxury-villas/','/privacy-policy/','/booking-terms/'];
async function settle(page){
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
}
async function open(page,url){await page.goto(url,{waitUntil:'networkidle'});await settle(page);}
for(const width of [390,834,1440]){
 for(const route of routes)test(`${width}px content and accessibility ${route}`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:900});
  await page.addInitScript({path:axePath});
  const response=await page.goto(route,{waitUntil:'networkidle'});expect(response.status()).toBe(200);
  for(const section of await page.locator('main > section').all()){await section.scrollIntoViewIfNeeded();}
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await settle(page);
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.title()).toContain('Shining');
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/^https:\/\//);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(await page.evaluate(()=>[...document.images].filter(im=>im.complete&&im.naturalWidth===0).map(im=>im.src))).toEqual([]);
  expect(await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(decodeURIComponent(h.slice(1)))))).toEqual([]);
  const violations=await page.evaluate(async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
  expect(violations).toEqual([]);expect(errors).toEqual([]);
 });
 test(`${width}px keyboard menu, chapters, FAQ and photo dialog`,async({page})=>{
  await page.setViewportSize({width,height:900});await open(page,'/');
  if(width<=900){const menu=page.locator('.menu-toggle');await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();}
  const tabs=page.getByRole('tab');await tabs.first().scrollIntoViewIfNeeded();const before=await page.locator('.chapter-story').boundingBox();
  await tabs.first().focus();await page.keyboard.press('ArrowRight');await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');await settle(page);
  expect(Math.abs((await page.locator('.chapter-story').boundingBox()).height-before.height)).toBeLessThan(2);
  const faq=page.locator('.faq-trigger').first();await faq.scrollIntoViewIfNeeded();const faqBefore=await page.locator('.faqs').boundingBox();await faq.click();await expect(faq).toHaveAttribute('aria-expanded','true');await page.waitForTimeout(450);
  expect(Math.abs((await page.locator('.faqs').boundingBox()).height-faqBefore.height)).toBeLessThan(2);
  const opener=page.locator('.hero-visual .quick-view');await opener.scrollIntoViewIfNeeded();await opener.click();await expect(page.getByRole('dialog')).toBeVisible();
  const title=await page.locator('#photo-title').innerText();await page.getByRole('button',{name:'Next collection photograph'}).click();await expect(page.locator('#photo-title')).not.toHaveText(title);
  expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(opener).toBeFocused();
 });
}
for(const width of [320,360,600,768,900,901,1000,1001,1024,1280,1920])test(`${width}px responsive boundary`,async({page})=>{
 await page.setViewportSize({width,height:900});for(const route of ['/','/contact/']){await open(page,route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
});
async function fillGuest(page){await page.getByLabel('Full name').fill('QA Example');await page.locator('[name="email"]').fill('qa@example.com');await page.getByLabel('Approximate dates or duration').fill('A week in December');}
test('guest enquiry preserves query context and sends JSON without personal data in the URL',async({page})=>{
 let request;
 await page.route('**/api/enquiry/',async route=>{request=route.request();await route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({message:'Test submission captured.',reference:'TEST-ONLY'})});});
 await open(page,'/contact/?collection=luxury-villas&guests=4');await expect(page.locator('[name="collection"]')).toHaveValue('luxury-villas');await expect(page.locator('[name="guests"]')).toHaveValue('4');
 await fillGuest(page);await page.getByRole('button',{name:'Send my requirements'}).click();await expect(page.locator('#form-feedback')).toContainText('TEST-ONLY');
 expect(request.method()).toBe('POST');expect(request.headers()['content-type']).toBe('application/json');expect(request.postDataJSON().collection).toBe('luxury-villas');expect(page.url()).not.toContain('qa%40');
});
test('owner enquiry excludes disabled guest fields',async({page})=>{
 let data;await page.route('**/api/enquiry/',async route=>{data=route.request().postDataJSON();await route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({message:'Test owner enquiry captured.',reference:'OWNER-TEST'})});});
 await open(page,'/contact/?intent=owner');await page.getByLabel('Full name').fill('QA Owner');await page.locator('[name="email"]').fill('owner@example.com');await page.getByRole('button',{name:'Send property enquiry'}).click();await expect(page.locator('#form-feedback')).toContainText('OWNER-TEST');expect(data.intent).toBe('owner');expect(data).not.toHaveProperty('travelPlan');
});
test('server field errors preserve input and expose the accessible error',async({page})=>{
 await page.route('**/api/enquiry/',route=>route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({message:'Please check the highlighted fields.',errors:{travelPlan:'Add dates or duration.'}})}));
 await open(page,'/contact/');await fillGuest(page);await page.getByRole('button',{name:'Send my requirements'}).click();await expect(page.locator('[name="travelPlan"]')).toHaveAttribute('aria-invalid','true');await expect(page.getByLabel('Full name')).toHaveValue('QA Example');await expect(page.locator('#travelPlan-error')).toBeVisible();
});
test('unavailable backend preserves enquiry fields and reports failure',async({page})=>{
 await page.route('**/api/enquiry/',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Your enquiry has not been submitted. Please contact the team.'})}));
 await open(page,'/contact/');await fillGuest(page);await page.getByRole('button',{name:'Send my requirements'}).click();await expect(page.locator('#form-feedback')).toContainText('not been submitted');await expect(page.getByLabel('Full name')).toHaveValue('QA Example');
});
test.describe('without JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 test('form cannot leak a GET submission and direct contact remains available',async({page})=>{
  await page.goto('/contact/');
  // Playwright's text matcher deliberately skips noscript elements. Inspect the DOM text and link directly.
  expect(await page.locator('noscript').evaluate(el=>el.textContent)).toContain('email the team');
  await expect(page.locator('noscript a[href="mailto:info@shiningvacationhomes.com"]')).toBeVisible();
  await expect(page.locator('fieldset.form-fields').first()).toHaveAttribute('disabled','');
  await expect(page.locator('[name="name"]')).toBeDisabled();
  await expect(page.getByRole('button',{name:'Send my requirements'})).toBeDisabled();
  await expect(page.locator('form')).toHaveAttribute('method','post');
 });
});
test('desktop enquiry sidebar stays centered and stops inside its section',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await open(page,'/contact/');
 const aside=page.locator('.enquiry-sidebar');await expect(aside).toHaveAttribute('data-sticky','');
 const geometry=await page.locator('.contact-grid').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight}));
 await page.evaluate(top=>scrollTo({top,behavior:'instant'}),geometry.top+200);await settle(page);
 const box=await aside.boundingBox();expect(Math.abs(box.y-Math.max(32,(1000-box.height)/2))).toBeLessThan(3);
 await page.evaluate(top=>scrollTo({top,behavior:'instant'}),geometry.top+geometry.height-500);await settle(page);
 const end=await aside.boundingBox(),parent=await page.locator('.contact-grid').boundingBox();expect(end.y+end.height).toBeLessThanOrEqual(parent.y+parent.height+2);
});

for(const width of [390,834,1440])test(`${width}px privacy contents follows reading position`,async({page})=>{
 await page.setViewportSize({width,height:900});await open(page,'/privacy-policy/');
 const active=page.locator('.privacy-nav a[aria-current="location"]');
 const ids=['information-you-share','services-that-process-enquiries','your-questions-and-requests','how-information-is-used'];
 for(const id of ids){
  await page.locator('#'+id).evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));
  await settle(page);await expect(active).toHaveCount(1);await expect(active).toHaveAttribute('href','#'+id);
 }
 expect(new URL(page.url()).hash).toBe('');
 await page.goto('/privacy-policy/#links-and-tracking',{waitUntil:'networkidle'});await settle(page);
 await expect(active).toHaveAttribute('href','#links-and-tracking');
 if(width===1440){
  const link=page.locator('.privacy-nav a[href="#sharing-information-carefully"]');
  await link.focus();await page.keyboard.press('Enter');
  await expect(active).toHaveAttribute('href','#sharing-information-carefully');
 }
});

test('booking contents tracks sections and keeps its links after navigation',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await open(page,'/booking-terms/');
 const active=page.locator('.privacy-nav a[aria-current="location"]');
 for(const id of ['share-your-plans','complete-quotation','before-you-confirm','review-the-accommodation']){
  await page.locator('#'+id).evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));
  await settle(page);await expect(active).toHaveCount(1);await expect(active).toHaveAttribute('href','#'+id);
 }
 const link=page.locator('.privacy-nav a[href="#arrival-and-stay"]');await link.focus();await page.keyboard.press('Enter');
 await expect(active).toHaveAttribute('href','#arrival-and-stay');
 await page.getByRole('link',{name:'Share your requirements',exact:true}).click();await expect(page).toHaveURL(/\/contact\//);await expect(page.locator('h1')).toContainText('Every good stay');await settle(page);
 await page.goBack({waitUntil:'networkidle'});await expect(page.locator('.privacy-nav a[aria-current="location"]')).toHaveCount(1);
});

test('untrusted enquiry preferences remain text and never execute markup',async({page})=>{
 const payload='<img src=x onerror="window.__injected=true">';
 await page.addInitScript(()=>{window.__injected=false});
 await open(page,'/contact/?collection='+encodeURIComponent(payload)+'&guests='+encodeURIComponent(payload));
 expect(await page.evaluate(()=>window.__injected)).toBe(false);
 await expect(page.locator('[name="collection"]')).toHaveValue('');
 await expect(page.locator('[name="guests"]')).toHaveValue('');
 await expect(page.locator('main img[src="x"]')).toHaveCount(0);
});

test('real preview API accepts its own origin and rejects invalid input before delivery',async({request,baseURL})=>{
 const response=await request.post('/api/enquiry/',{headers:{Origin:baseURL,'Idempotency-Key':'boundary-browser-test-12345'},data:{}});
 expect(response.status()).toBe(422);expect(response.headers()['cache-control']).toBe('no-store');
});

test('strict script CSP permits hydration and blocks unapproved inline scripts',async({page})=>{
 await page.addInitScript(()=>{window.__cspInjected=false;window.__blocked=[];document.addEventListener('securitypolicyviolation',event=>window.__blocked.push(event.effectiveDirective))});
 const response=await page.goto('/',{waitUntil:'networkidle'});await settle(page);
 const policy=response.headers()['content-security-policy'];const scripts=policy.split(';').find(rule=>rule.trim().startsWith('script-src '));
 expect(scripts).toContain("'sha256-");expect(scripts).not.toContain("'unsafe-inline'");
 expect(await page.evaluate(()=>window.__blocked)).toEqual([]);
 const faq=page.locator('.faq-trigger').first();await faq.scrollIntoViewIfNeeded();await faq.click();await expect(faq).toHaveAttribute('aria-expanded','true');
 expect(await page.locator('.hero-image').getAttribute('src')).toMatch(/^\/media\/1BR-\d+\.webp$/);
 await page.evaluate(()=>{const script=document.createElement('script');script.textContent='window.__cspInjected=true';document.body.append(script)});
 await expect.poll(()=>page.evaluate(()=>window.__blocked)).toContain('script-src-elem');
 expect(await page.evaluate(()=>window.__cspInjected)).toBe(false);
 await page.locator('footer').getByRole('link',{name:'About',exact:true}).click();await expect(page).toHaveURL(/\/about\//);await expect(page.locator('h1')).toContainText('Every stay starts');
});
