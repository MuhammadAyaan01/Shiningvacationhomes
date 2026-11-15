import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('production pages include real Next.js React hydration bundles and no legacy application script',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 assert.ok(pkg.dependencies.next&&pkg.dependencies.react&&pkg.dependencies['react-dom']);
 const html=await readFile('out/index.html','utf8');
 assert.match(html,/\/_next\/static\/chunks\//);
 assert.match(html,/self\.__next_f/);
 assert.doesNotMatch(html,/\/assets\/app.js/);
 const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(scripts.length>0);
 for(const src of scripts)await assert.doesNotReject(readFile('out'+src));
});
