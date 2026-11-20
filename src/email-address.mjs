import {domainToASCII} from 'node:url';

// Accept one mailbox, not a display name, address list or SMTP header fragment.
export function isEmailAddress(value){
 if(typeof value!=='string'||value.length>254)return false;
 const parts=value.split('@');if(parts.length!==2)return false;
 const [local,host]=parts;
 if(!local||local.length>64||local.startsWith('.')||local.endsWith('.')||local.includes('..')||!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local))return false;
 if(!host||/[\s\u0000-\u001f\u007f<>,;:"()[\]\\]/.test(host))return false;
 if(!/^[\p{L}\p{N}\p{M}.-]+$/u.test(host))return false;
 const domain=domainToASCII(host);
 return !!domain&&domain.length<=253&&domain.includes('.')&&domain.split('.').every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
}
