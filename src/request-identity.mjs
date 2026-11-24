import {isIP} from 'node:net';
// Trust only the platform-owned header on Vercel. Generic forwarded headers on
// a self-hosted Node server are client-controlled unless its proxy is configured.
export function trustedClientAddress(request,env){
 if(!env.VERCEL)return '';
 const value=request.headers.get('x-vercel-forwarded-for')?.trim()||'';
 return isIP(value)?value:'';
}
