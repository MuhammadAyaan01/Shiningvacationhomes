export function productionCsp(hashes=[]){
 if(hashes.some(hash=>!/^sha256-[A-Za-z0-9+/]{43}=$/.test(hash)))throw Error('Invalid CSP hash');
 return ["default-src 'self'",`script-src 'self' ${[...new Set(hashes)].map(hash=>`'${hash}'`).join(' ')}`.trim(),"script-src-attr 'none'","style-src 'self' 'unsafe-inline'","img-src 'self' data: blob:","font-src 'self'","connect-src 'self'","frame-src 'none'","frame-ancestors 'none'","base-uri 'self'","object-src 'none'","form-action 'self'"].join('; ');
}
