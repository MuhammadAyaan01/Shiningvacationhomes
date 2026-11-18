export default {
  trailingSlash:true,
  images:{imageSizes:[128,256,384],deviceSizes:[640,768,1024,1200,1600,2000],formats:['image/webp'],qualities:[75,85]},
  poweredByHeader:false,
  async headers(){return [{source:'/(.*)',headers:[
   {key:'X-Content-Type-Options',value:'nosniff'},
   {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
   {key:'X-Frame-Options',value:'DENY'},
   {key:'Content-Security-Policy',value:process.env.NODE_ENV==='production'?"default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'":"frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'"},
   {key:'Strict-Transport-Security',value:'max-age=31536000'},
   {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}
  ]}]},
};
