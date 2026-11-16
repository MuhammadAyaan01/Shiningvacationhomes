const email=/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
export function releaseIssues(env){
 const issues=[];
 for(const key of ['NEXT_PUBLIC_SITE_URL','ENQUIRY_ORIGIN','RESEND_API_KEY','ENQUIRY_FROM','ENQUIRY_TO'])if(!env[key]?.trim())issues.push(`${key} is required.`);
 const parseOrigin=key=>{if(!env[key]?.trim())return;try{const u=new URL(env[key]);if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/'||u.search||u.hash||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(u.hostname))throw Error();return u.origin;}catch{issues.push(`${key} must be a public HTTPS origin without a path, query or credentials.`)}};
 const site=parseOrigin('NEXT_PUBLIC_SITE_URL'),origin=parseOrigin('ENQUIRY_ORIGIN');
 if(origin&&env.ENQUIRY_ORIGIN!==origin)issues.push('ENQUIRY_ORIGIN must not have a trailing slash.');
 if(site&&origin&&site!==origin)issues.push('NEXT_PUBLIC_SITE_URL and ENQUIRY_ORIGIN must use the same published origin.');
 if(env.ENQUIRY_FROM){const value=env.ENQUIRY_FROM.trim(),match=value.match(/^[^<>\r\n]+<([^<>]+)>$/);if(!email.test(match?match[1]:value))issues.push('ENQUIRY_FROM must contain a valid verified sender email.');}
 if(env.ENQUIRY_TO&&!env.ENQUIRY_TO.split(',').every(value=>email.test(value.trim())))issues.push('ENQUIRY_TO must contain valid recipient emails.');
 return issues;
}
