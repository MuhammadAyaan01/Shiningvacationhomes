import Image from 'next/image';
import imageLoader from '../src/image-loader.js';
import {collectionImageProps} from '../src/collection-images.js';

export function CollectionImage({src,sizes,...props}){
 if(!src)return null;
 return <Image {...props} loader={imageLoader} loading={props.loading||(props.fetchPriority==='high'?'eager':'lazy')} src={collectionImageProps(src).src} sizes={sizes||'(max-width:1000px) 100vw, 50vw'} quality={85}/>;
}
