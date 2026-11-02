// Independent artifact verification: require two playable, moving 12-second MP4s.
import {spawnSync} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const results=[];
for(const sample of ['product','data']){
 const file=join(root,'renders',sample+'.mp4');
 if(!existsSync(file))throw Error('Missing actual MP4: '+file);
 const p=spawnSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',file],{encoding:'utf8'});
 if(p.status!==0)throw Error(p.stderr||'ffprobe failed');
 const d=JSON.parse(p.stdout),v=d.streams.filter(s=>s.codec_type==='video');
 if(v.length!==1||v[0].width!==1920||v[0].height!==1080||v[0].r_frame_rate!=='30/1'||v[0].nb_frames!=='360'||Math.abs(Number(d.format.duration)-12)>.04)throw Error('Unexpected video properties for '+sample);
 const md5=sec=>{
  const f=spawnSync('ffmpeg',['-v','error','-ss',String(sec),'-i',file,'-frames:v','1','-f','framemd5','-'],{encoding:'utf8'});
  if(f.status!==0)throw Error(f.stderr||'frame decode failed');
  return f.stdout.split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>l.split(',').at(-1).trim()).join('');
 };
 const first=md5(0),last=md5(9);
 if(!first||first===last)throw Error('No visible decoded-frame change: '+sample);
 results.push({sample,width:v[0].width,height:v[0].height,fps:30,frames:360,duration:Number(d.format.duration),first,last,decodedFrameChanged:true});
}
writeFileSync(join(root,'renders','verification.json'),JSON.stringify({passed:true,observedAt:new Date().toISOString(),results},null,2)+'\n');
console.log(JSON.stringify({passed:true,results},null,2));
