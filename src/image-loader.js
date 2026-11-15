'use client';
const widths=[128,256,384,640,768,1024,1200,1600,2000];
export default function imageLoader({src,width}){
 if(!/^\/media\/(studio|[1-4]BR|villa)\.jpg$/.test(src))return src;
 const size=widths.find(size=>size>=width)||2000;
 return src.replace('.jpg',`-${size}.webp`);
}
