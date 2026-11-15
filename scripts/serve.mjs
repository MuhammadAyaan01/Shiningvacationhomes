import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../out/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.txt':'text/plain'};
export function createPreviewServer(directory=root){
 const base=path.resolve(directory);
 return http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Cache-Control','no-store');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end('Method not allowed');return}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end('Bad request');return}
  if(pathname.includes('\\')){res.writeHead(403);res.end('Forbidden');return}
  let file=path.resolve(base,'.'+pathname);
  if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);res.end('Forbidden');return}
  let status=200,data;
  try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');data=await readFile(file)}catch{
   status=404;file=path.join(base,'404.html');
   try{data=await readFile(file)}catch{status=500;data=Buffer.from('Build the site before starting the preview.');file='error.txt'}
  }
  res.writeHead(status,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
  res.end(req.method==='HEAD'?undefined:data);
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const server=createPreviewServer();
 server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port 4173 is already in use. Open http://127.0.0.1:4173/ or stop that preview first.':error.message);process.exitCode=1});
 server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
}
