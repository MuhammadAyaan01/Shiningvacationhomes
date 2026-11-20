import test from 'node:test';
import assert from 'node:assert/strict';
import {isEmailAddress} from '../src/email-address.mjs';
import {validateEnquiry} from '../src/enquiry-server.js';
import {deliveryIssues} from '../src/enquiry-delivery.mjs';

test('single-mailbox validation accepts normal addresses and rejects parser-ambiguous forms',()=>{
 for(const email of ['guest@example.com','first.last+stay@example.co.uk',"o'neil@example.com",'guest@b\u00fccher.de'])assert.equal(isEmailAddress(email),true,email);
 for(const email of ['Display<guest@example.com>','guest@example.com;','guest..name@example.com','.guest@example.com','guest.@example.com','guest@-example.com','guest@example..com','guest@localhost','guest@example.com/path','guest@example.com?query','guest@example.com#fragment','guest@ex%61mple.com','a'.repeat(65)+'@example.com','guest@example.com\r\nBcc: x','guest@example.com\u0000','guest@example.com,other@example.com'])assert.equal(isEmailAddress(email),false,email);
});

test('form and delivery configuration share the same mailbox boundary',()=>{
 const invalid='Display<guest@example.com>';
 assert.ok(validateEnquiry({intent:'guest',name:'Guest',email:invalid,travelPlan:'One week'}).errors.email);
 assert.ok(deliveryIssues({ENQUIRY_PROVIDER:'gmail',SMTP_USER:invalid,SMTP_APP_PASSWORD:'abcdefghijklmnop'}).some(issue=>issue.includes('SMTP_USER')));
 assert.ok(deliveryIssues({ENQUIRY_PROVIDER:'gmail',SMTP_USER:'sender@example.com',SMTP_APP_PASSWORD:'abcdefghijklmnop',ENQUIRY_TO:invalid}).some(issue=>issue.includes('ENQUIRY_TO')));
});
