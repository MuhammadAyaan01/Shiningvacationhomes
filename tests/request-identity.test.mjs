import test from 'node:test';
import assert from 'node:assert/strict';
import {trustedClientAddress} from '../src/request-identity.mjs';
test('network identifiers trust only a valid platform address on Vercel',()=>{
 const request=values=>new Request('https://example.com/',{headers:values});
 assert.equal(trustedClientAddress(request({'x-vercel-forwarded-for':'203.0.113.19'}),{}),'');
 assert.equal(trustedClientAddress(request({'x-forwarded-for':'203.0.113.19'}),{VERCEL:'1'}),'');
 assert.equal(trustedClientAddress(request({'x-vercel-forwarded-for':'203.0.113.19'}),{VERCEL:'1'}),'203.0.113.19');
 assert.equal(trustedClientAddress(request({'x-vercel-forwarded-for':'2001:db8::1'}),{VERCEL:'1'}),'2001:db8::1');
 for(const value of ['unknown','203.0.113.19, 203.0.113.20','localhost'])assert.equal(trustedClientAddress(request({'x-vercel-forwarded-for':value}),{VERCEL:'1'}),'');
});
