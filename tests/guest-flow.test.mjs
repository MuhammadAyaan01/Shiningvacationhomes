import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('full motion stays enabled without a toggle and contact uses a protected POST form',async()=>{
 const home=await readFile('out/index.html','utf8');
 assert.match(home,/data-motion="full"/);
 assert.doesNotMatch(home,/class="motion-toggle"|class="preview-bar"/);
 assert.match(home,/Availability is confirmed on enquiry/);
 const contact=await readFile('out/contact/index.html','utf8');
 assert.ok(contact.indexOf('id="enquiry-form"')<contact.indexOf('<aside'));
 assert.ok(contact.includes('action="/api/enquiry/" method="post"'));
 assert.match(contact,/<fieldset class="form-fields" disabled="">/);
 assert.doesNotMatch(contact,/Prepare enquiry|Open email draft/);
});
