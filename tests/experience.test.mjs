import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {staySummary,backToTopVisible,backToTopLift} from '../src/experience.js';

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

test('back-to-top stays available at the footer and moves only when its text would overlap',()=>{
 assert.equal(backToTopVisible(550),false);
 assert.equal(backToTopVisible(900),true);
 const button={left:650,right:800,top:728,bottom:776};
 const tabletLabel={left:700,right:796,top:752,bottom:768};
 const lift=backToTopLift(button,tabletLabel,728);
 assert.equal(lift,64);
 assert.equal(button.bottom-lift,728-16);
 assert.equal(backToTopLift(button,{left:500,right:600,top:752,bottom:768},728),0);
 assert.equal(backToTopLift(button,{left:700,right:796,top:920,bottom:936},896),0);
 assert.equal(backToTopLift(button,{left:700,right:796,top:620,bottom:636},596),0);
 assert.equal(backToTopLift(button,null,undefined),0);
 assert.equal(backToTopLift(button,tabletLabel,728),lift);
});
