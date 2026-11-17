import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {staySummary,backToTopVisible} from '../src/experience.js';

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

test('desktop back-to-top clears the footer while smaller-screen behavior stays unchanged',()=>{
 assert.equal(backToTopVisible(550,1000,900,1440),false);
 assert.equal(backToTopVisible(900,1000,900,1440),true);
 assert.equal(backToTopVisible(900,900,900,1440),true);
 assert.equal(backToTopVisible(900,899,900,1440),false);
 assert.equal(backToTopVisible(900,-200,900,1440),false);
 assert.equal(backToTopVisible(900,400,900,1000),true);
 assert.equal(backToTopVisible(900,400,900,390),true);
 assert.equal(backToTopVisible(900,Infinity,900,1440),true);
});
