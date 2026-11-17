import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {staySummary} from '../src/experience.js';
import {routes} from '../src/seo.js';

test('gallery keeps fitted photographs and navigation without zoom controls',async()=>{
 const html=await readFile('components/photo-dialog.jsx','utf8');
 const shell=await readFile('components/site.jsx','utf8');
 assert.match(shell,/dynamic\(\(\)=>import\('\.\/photo-dialog\.jsx'\)/);
 assert.match(shell,/photo!==null&&<PhotoDialog/);
 assert.match(html,/aria-label="Close photo preview"/);
 assert.match(html,/aria-label="Previous collection photograph"/);
 assert.match(html,/aria-label="Next collection photograph"/);
 assert.doesNotMatch(html,/Zoom in|Zoom out|Fit photo|Expand photo|Restore view|Scroll to zoom|Drag to explore/);
});
test('stay plan calculates nights across year and daylight-saving boundaries without implying availability',()=>{
 assert.equal(staySummary('','','1'),'Dates flexible · 1 guest');
 assert.equal(staySummary('2026-12-31','2027-01-03','4'),'3 nights · 4 guests');
 assert.equal(staySummary('2026-03-28','2026-03-30','2'),'2 nights · 2 guests');
 assert.equal(staySummary('2026-12-10','2026-12-11','2'),'1 night · 2 guests');
 assert.equal(staySummary('2026-12-10','2026-12-09','3'),'Check your dates · 3 guests');
 assert.equal(staySummary('2026-12-10','2026-12-10','1'),'Check your dates · 1 guest');
 assert.equal(staySummary('','2026-12-10','999'),'Choose your check-in · 1 guest');
 assert.equal(staySummary('2026-12-10','','2'),'Choose your check-out · 2 guests');
});

test('all content routes omit back-to-top controls and their reserved footer row',async()=>{
 for(const route of routes){
  const html=(await readFile('out'+route+'index.html','utf8')).replace(/<script[\s\S]*?<\/script>/g,'');
  assert.doesNotMatch(html,/Back to top|back-top|footer-utility/,route);
 }
});
