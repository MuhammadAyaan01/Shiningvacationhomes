import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import {enquiryEmail} from '../src/enquiry-email.mjs';

const guest={intent:'monthly',name:'Sample Guest',email:'guest@example.com',travelPlan:'One month',guests:'2',collection:'one-bedroom-apartments',budget:'12000',budgetBasis:'monthly',message:'Near the Metro, please.'};
test('notification presents human-readable requirements and a matching reference in both formats',()=>{
 const {html,text}=enquiryEmail(guest,{reference:'saved-reference'});
 assert.match(html,/New monthly stay enquiry/);assert.match(html,/Guest details/);assert.match(html,/One-bedroom apartments/);
 assert.match(html,/per month/);assert.match(html,/Reply to guest/);assert.match(html,/saved-reference/);
 assert.match(text,/Travel plans: One month/);assert.match(text,/Accommodation: One-bedroom apartments/);
 assert.match(text,/Reference: saved-reference/);assert.doesNotMatch(text,/travelPlan:|budgetBasis:|collection:/);
 assert.doesNotMatch(html,/https?:\/\/|<script\b|<img\b/);
});
test('HTML escapes user input and preserves message line breaks without treating it as markup',()=>{
 const data={...guest,name:'<script>alert("x")</script>',message:'<img src=x onerror=alert(1)>\nA & B'};
 const {html,text}=enquiryEmail(data,{reference:'<unsafe>'});
 assert.doesNotMatch(html,/<script\b|<img\b|Reference: <unsafe>/);
 assert.match(html,/&lt;script&gt;/);assert.match(html,/A &amp; B/);assert.match(html,/<br>/);
 assert.ok(text.includes(data.message));
});
test('owner notifications omit guest fields and empty contact rows',()=>{
 const {html,text}=enquiryEmail({...guest,intent:'owner',area:'Dubai',bedrooms:'2',phone:''});
 assert.match(html,/Owner details/);assert.match(html,/About the property/);assert.match(html,/Reply to owner/);
 assert.match(text,/Property area: Dubai/);assert.doesNotMatch(text,/Travel plans:|Guests:|Budget:|Phone:/);
});
test('real mail composition includes HTML and plain-text alternatives without sending mail',async()=>{
 const template=enquiryEmail(guest);
 const transport=nodemailer.createTransport({streamTransport:true,buffer:true});
 try{const result=await transport.sendMail({from:'sender@example.com',to:'team@example.com',subject:'Preview',...template});assert.match(result.message.toString(),/multipart\/alternative/);assert.match(result.message.toString(),/Content-Type: text\/plain/);assert.match(result.message.toString(),/Content-Type: text\/html/);}finally{transport.close();}
});
