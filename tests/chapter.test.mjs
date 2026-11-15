import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chapters} from '../src/chapter-data.mjs';

test('chapter discovery connects accessible panels to requirements enquiries without inventory search',async()=>{
 const html=await readFile('out/index.html','utf8');
 assert.doesNotMatch(html,/class="search-form"|Browse collections/);
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
 assert.match(html,/Example accommodation photograph/);
});
