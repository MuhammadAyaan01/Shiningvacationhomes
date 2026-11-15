import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {collectionImageProps} from '../src/collection-images.js';

test('all collection photographs offer local responsive files and untouched full-size fallbacks',async()=>{
 for(const name of ['studio','1BR','2BR','3BR','4BR','villa']){
  const attrs=collectionImageProps(`/media/${name}-600x336.jpg`);
  assert.equal(attrs.src,`/media/${name}.jpg`);
  assert.match(attrs.srcSet,new RegExp(`/media/${name}\\.jpg 2000w$`));
  for(const candidate of attrs.srcSet.split(', ')){
   const bytes=await readFile('public'+candidate.split(' ')[0]);
   assert.ok(bytes.length>10000);
  }
 }
 assert.deepEqual(collectionImageProps(undefined),{src:undefined});
 assert.deepEqual(collectionImageProps('/media/shining_logo_ink.svg'),{src:'/media/shining_logo_ink.svg'});
});

test('exported photographs use responsive originals rather than thumbnail-only sources',async()=>{
 let count=0;
 for(const file of await readdir('out',{recursive:true})){
  if(!file.endsWith('index.html'))continue;
  const html=await readFile('out/'+file,'utf8');
  for(const image of html.match(/<img\b[^>]*>/g)||[]){
   if(!image.includes('data-nimg'))continue;
   assert.doesNotMatch(image,/-600x336\.jpg/);
   assert.match(image,/srcSet="/i);
   assert.match(image,/sizes="/);
   count++;
  }
 }
 assert.ok(count>=14);
});
