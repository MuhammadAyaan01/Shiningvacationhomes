import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {collections} from '../src/data.mjs';

test('the guest journey showcases examples and leads to a secure requirements form',async()=>{
 const home=await readFile('out/index.html','utf8'),stays=await readFile('out/stays/index.html','utf8'),contact=await readFile('out/contact/index.html','utf8');
 assert.match(home,/id="plan-your-stay"/);assert.match(home,/id="enquiry-form"/);assert.match(home,/suitable available accommodation options/);
 for(const html of [home,stays]){assert.doesNotMatch(html,/class="search-form"|id="sort"|id="results-count"|Filter collections|live inventory|not connected/i);for(const c of collections)assert.match(html,new RegExp('/contact/\\?collection='+c.slug));}
 assert.match(stays,/actual options and prices are shared after enquiry/);
 for(const name of ['travelPlan','preferredArea','budget','budgetBasis'])assert.ok(contact.includes('name="'+name+'"'),name);
 assert.match(contact,/Help me choose/);assert.match(contact,/Not sure yet/);assert.match(contact,/Send my requirements/);
 assert.doesNotMatch(contact,/<input[^>]*name="phone"[^>]*required/);
});
