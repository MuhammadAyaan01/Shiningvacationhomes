import {deliveryIssues} from './enquiry-delivery.mjs';
import {storageIssues} from './enquiry-store.mjs';
export function releaseIssues(env){
 const issues=[];
 for(const key of ['NEXT_PUBLIC_SITE_URL','ENQUIRY_ORIGIN'])if(!env[key]?.trim())issues.push(`${key} is required.`);
 issues.push(...deliveryIssues(env));
 issues.push(...storageIssues(env));
 const parseOrigin=key=>{if(!env[key]?.trim())return;try{const u=new URL(env[key]);if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/'||u.search||u.hash||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(u.hostname))throw Error();return u.origin;}catch{issues.push(`${key} must be a public HTTPS origin without a path, query or credentials.`)}};
 const site=parseOrigin('NEXT_PUBLIC_SITE_URL'),origin=parseOrigin('ENQUIRY_ORIGIN');
 if(origin&&env.ENQUIRY_ORIGIN!==origin)issues.push('ENQUIRY_ORIGIN must not have a trailing slash.');
 if(site&&origin&&site!==origin)issues.push('NEXT_PUBLIC_SITE_URL and ENQUIRY_ORIGIN must use the same published origin.');
 return issues;
}
