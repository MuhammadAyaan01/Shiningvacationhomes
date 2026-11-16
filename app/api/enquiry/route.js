import {handlePersistentEnquiry} from '../../../src/persistent-enquiry.mjs';

export const runtime='nodejs';
export const maxDuration=30;
export async function POST(request){return handlePersistentEnquiry(request,process.env)}
