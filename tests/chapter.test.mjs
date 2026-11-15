import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chapters} from '../src/chapter-data.mjs';

test('chapter discovery keeps search first and provides connected accessible tab panels and valid destinations',async()=>{
 const html=await readFile('out/index.html','utf8');
 assert.ok(html.indexOf('id="booking"')<html.indexOf('id="chapter-moments"'));
 assert.ok(html.indexOf('id="chapter-moments"')<html.indexOf('id="property_types"'));
 for(const chapter of chapters){
  assert.ok(html.includes(`aria-controls="chapter-panel-${chapter.id}"`));
  assert.ok(html.includes(`id="chapter-panel-${chapter.id}" aria-labelledby="chapter-tab-${chapter.id}"`));
  await assert.doesNotReject(readFile('out'+chapter.href.split('?')[0]+'index.html'));
  await assert.doesNotReject(readFile('public/media/'+chapter.image.split('/').at(-1)));
 }
 assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
 const panels=html.match(/<div role="tabpanel"[^>]*>/g);
 assert.equal(panels.length,3);
 assert.equal(panels.filter(tag=>tag.includes('aria-hidden="true"')&&tag.includes('inert=""')).length,2);
 assert.match(html,/Reference collection photograph/);
});
