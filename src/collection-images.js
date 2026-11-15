const names=new Set(['studio','1BR','2BR','3BR','4BR','villa']);
const widths=[768,1200];

export function collectionImageProps(src,sizes='(max-width:1000px) 100vw, 50vw'){
 const name=src?.split('/').at(-1)?.replace(/(?:-600x336)?\.jpg$/,'');
 if(!names.has(name))return {src};
 return {
  src:`/media/${name}.jpg`,
  srcSet:[...widths.map(width=>`/media/${name}-${width}.webp ${width}w`),`/media/${name}.jpg 2000w`].join(', '),
  sizes
 };
}
