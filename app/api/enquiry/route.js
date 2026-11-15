import {handleEnquiry} from '../../../src/enquiry-server.js';

export const runtime='nodejs';
export async function POST(request){return handleEnquiry(request,process.env)}
