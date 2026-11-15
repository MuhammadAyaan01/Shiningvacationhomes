import sharp from 'sharp';
for(const name of ['studio','1BR','2BR','3BR','4BR','villa']){
 for(const width of [128,256,384,640,768,1024,1200,1600,2000]){
  await sharp(`public/media/${name}.jpg`).resize({width,withoutEnlargement:true}).webp({quality:85}).toFile(`public/media/${name}-${width}.webp`);
 }
}
console.log('Prepared responsive collection images, including 256px/384px thumbnails.');
