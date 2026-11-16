import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseIssues} from '../src/release-config.mjs';
const configured={NEXT_PUBLIC_SITE_URL:'https://stay.example.com',ENQUIRY_ORIGIN:'https://stay.example.com',RESEND_API_KEY:'test-only-not-a-real-secret',ENQUIRY_FROM:'Shining <sender@example.com>',ENQUIRY_TO:'team@example.com'};
test('production configuration requires delivery settings without exposing secret values',()=>{
 const missing=releaseIssues({});for(const key of Object.keys(configured))assert.ok(missing.some(issue=>issue.includes(key)),key);
 assert.deepEqual(releaseIssues(configured),[]);
 const invalid=releaseIssues({...configured,ENQUIRY_FROM:'sender@example.com\r\nBcc: x',ENQUIRY_TO:'not-email'});assert.ok(invalid.some(x=>x.includes('ENQUIRY_FROM')));assert.ok(invalid.some(x=>x.includes('ENQUIRY_TO')));assert.ok(invalid.every(x=>!x.includes(configured.RESEND_API_KEY)));
});
test('release origins reject insecure, mismatched and malformed public URLs',()=>{
 for(const origin of ['http://stay.example.com','https://localhost','https://127.0.0.1','https://user:pass@stay.example.com','https://stay.example.com/form','https://stay.example.com/?key=value','https://stay.example.com/#fragment','https://other.example.com','https://stay.example.com/'])assert.ok(releaseIssues({...configured,ENQUIRY_ORIGIN:origin}).length,origin);
 assert.deepEqual(releaseIssues({...configured,NEXT_PUBLIC_SITE_URL:'https://stay.example.com/'}),[]);
});

test('release command checks the real deployment environment before builds',async()=>{
 const {spawnSync}=await import('node:child_process');
 const accepted=spawnSync(process.execPath,['scripts/check-release.mjs'],{env:{...process.env,...configured},encoding:'utf8',windowsHide:true});assert.equal(accepted.status,0,accepted.stderr);assert.match(accepted.stdout,/configuration checks passed/);assert.ok(!accepted.stdout.includes(configured.RESEND_API_KEY));
 const missing={...process.env};for(const key of Object.keys(configured))missing[key]='';
 const blocked=spawnSync(process.execPath,['scripts/check-release.mjs'],{env:missing,encoding:'utf8',windowsHide:true});assert.equal(blocked.status,1);assert.match(blocked.stderr,/Production release is blocked/);assert.match(blocked.stderr,/RESEND_API_KEY is required/);
});
