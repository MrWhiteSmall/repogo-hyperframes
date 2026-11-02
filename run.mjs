// RepoGo original local launcher. It never changes global shell or execution policy.
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=dirname(fileURLToPath(import.meta.url));
process.chdir(root);
const action=process.argv[2]||'preview-product';
const allowed=['setup','preview-product','preview-data','render-product','render-data','check','stop-product','stop-data'];
if(!allowed.includes(action)){console.error('可用命令：'+allowed.join(' / '));process.exit(2);}
if(Number(process.versions.node.split('.')[0])<22){console.error('请先安装 Node.js 22 或更新版本。');process.exit(2);}
const env={...process.env,HYPERFRAMES_NO_TELEMETRY:'1',HYPERFRAMES_NO_UPDATE_CHECK:'1',HYPERFRAMES_NO_AUTO_INSTALL:'1'};
function run(bin,args){const r=spawnSync(bin,args,{cwd:root,env,stdio:'inherit',shell:false});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
if(!existsSync(join(root,'node_modules/hyperframes/dist/cli.js'))){
  console.log('首次安装锁定依赖：HyperFrames 0.9.5 / GSAP 3.15.0；需要网络。');
  // npm.cmd needs cmd.exe on Windows; only this fixed command uses the shell.
  if(process.platform==='win32')run(process.env.ComSpec||'cmd.exe',['/d','/s','/c','npm ci --registry=https://registry.npmjs.org --no-audit --no-fund']);
  else run('npm',['ci','--registry=https://registry.npmjs.org','--no-audit','--no-fund']);
}
const hf=join(root,'node_modules/hyperframes/dist/cli.js');
if(!existsSync(hf)){console.error('安装后未找到 HyperFrames CLI，请检查 package-lock.json 与安装日志。');process.exit(2);}
if(action.startsWith('stop-')){run(process.execPath,[hf,'preview',join('projects',action.slice(5)),'--stop']);process.exit(0);}
run(process.execPath,[join(root,'build.mjs')]);
if(action==='setup'){console.log('中文示例已生成。接下来运行 node run.mjs preview-product');process.exit(0);}
if(action==='check'){
  for(const sample of ['product','data'])run(process.execPath,[hf,'check',join('projects',sample)]);
}else if(action.startsWith('preview-')){
  const sample=action.slice(8),port=sample==='product'?'18831':'18832';
  run(process.execPath,[hf,'preview',join('projects',sample),'--background','--no-open','--port',port]);
  console.log(`浏览器打开 http://127.0.0.1:${port}/#project/${sample} 。停止：node run.mjs stop-${sample}`);
}else{
  const sample=action.slice(7);
  const ff=spawnSync('ffmpeg',['-version'],{stdio:'ignore',shell:false});
  if(ff.error||ff.status!==0){console.error('未找到 FFmpeg，请按 DEPLOY.md 安装后重新打开终端。');process.exit(2);}
  await mkdir(join(root,'renders'),{recursive:true});
  run(process.execPath,[hf,'render',join('projects',sample),'--quality','looks','--workers','2','--fps','30','-o',join(root,'renders',sample+'.mp4')]);
  console.log('导出完成：renders/'+sample+'.mp4（再次导出将更新同名文件，请提前备份）。');
}
