import {Children,cloneElement,createElement,isValidElement} from 'react';

// Render the word masks on the server so hydration never rewrites the heading.
export function AnimatedHeading({children,...props}){
 let index=0;
 const text=nodes=>Children.toArray(nodes).map(node=>isValidElement(node)?node.type==='br'?' ':text(node.props.children):String(node)).join('');
 const words=nodes=>Children.map(nodes,node=>{
  if(typeof node==='string'||typeof node==='number')return String(node).split(/(\s+)/).map(word=>{
   if(!word.trim())return word;
   const order=index++;
   return createElement('span',{className:'word-mask',key:order,'aria-hidden':'true'},createElement('span',{className:'motion-word',style:{animationDelay:`${Math.min(order*85,425)}ms`}},word));
  });
  return isValidElement(node)&&node.props.children?cloneElement(node,{},words(node.props.children)):node;
 });
 return createElement('h1',{...props,'aria-label':text(children).replace(/\s+/g,' ').trim()},words(children));
}
