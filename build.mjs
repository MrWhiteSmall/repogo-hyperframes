// Original RepoGo sample generator. No remote media, model API or paid assets.
import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
const base=dirname(fileURLToPath(import.meta.url));
const source=process.argv[2] || join(base,'content.json');
const content=JSON.parse(await readFile(source,'utf8'));
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const key of ['name','headline','detail','label']) if(typeof content.product?.[key]!=='string'||content.product[key].length>60) throw Error('product text must be <=60 characters');
if(!Array.isArray(content.data?.values)||content.data.values.length!==4||content.data.values.some(v=>!Number.isFinite(v)||v<=0||v>1000)) throw Error('data.values requires four numbers in (0,1000]');
if(!Array.isArray(content.data.labels)||content.data.labels.length!==4) throw Error('data.labels requires four labels');
const common=`*{box-sizing:border-box;margin:0} @font-face{font-family:"PingFang SC";src:local("PingFang SC")} @font-face{font-family:"Hiragino Sans GB";src:local("Hiragino Sans GB")} @font-face{font-family:"Microsoft YaHei";src:local("Microsoft YaHei")} @font-face{font-family:"Noto Sans CJK SC";src:local("Noto Sans CJK SC")} html,body{width:1920px;height:1080px;overflow:hidden} #root{position:absolute;inset:0;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC",sans-serif;color:#f5f0df} .eyebrow{font-size:26px;letter-spacing:5px} .note{font-size:28px;color:#c8c8b9}`;
const product=`<template><style>${common}
#root{background:#152e29} .scene{position:absolute;inset:0;background:#152e29} #copy{position:absolute;left:144px;top:185px;width:940px} #product-name{font-size:30px;letter-spacing:9px;color:#d8b88a} #headline{font-size:86px;line-height:1.35;width:940px;margin-top:35px;font-weight:600} #detail{position:absolute;left:144px;top:830px;font-size:30px;color:#eed1a4} #source{position:absolute;left:144px;bottom:82px} #lamp-hero{position:absolute;left:785px;top:205px;width:1000px;height:650px} #endline{position:absolute;left:144px;top:615px;font-size:40px;color:#eed1a4} #scene-number{position:absolute;right:144px;top:96px;font-size:28px;color:#cfbd9a}
</style><div id="root" data-composition-id="product-scene" data-width="1920" data-height="1080"><div class="scene" data-layout-allow-overlap="true"><div id="copy"><div id="product-name">${esc(content.product.name)}</div><h1 id="headline">${esc(content.product.headline)}</h1></div><div id="scene-number">01 — 让一个概念动起来</div><svg id="lamp-hero" viewBox="0 0 1000 650" aria-label="原创阅读灯概念插画"><ellipse id="table-shadow" cx="565" cy="565" rx="330" ry="35" fill="#10231f"/><path d="M70 565H940" stroke="#8ea49a" stroke-width="3"/><g id="book"><path d="M110 480Q260 445 410 485V555Q255 515 110 548Z" fill="#f3e8cb"/><path d="M410 485Q535 438 670 472V540Q535 512 410 555Z" fill="#d5c8a7"/><path d="M410 485V555" stroke="#99865f" stroke-width="3"/><path d="M152 495Q260 477 359 503M152 511Q260 493 359 519M455 499Q540 475 620 492M455 515Q540 492 620 508" fill="none" stroke="#b0a17b" stroke-width="3"/></g><path id="beam" d="M500 235L165 525Q410 575 672 512Z" fill="#f6c776" opacity=".22"/><g id="lamp"><ellipse cx="790" cy="550" rx="110" ry="20" fill="#ba8a4f"/><path d="M790 540V305L610 175" fill="none" stroke="#d5b580" stroke-width="23" stroke-linecap="round"/><circle cx="790" cy="305" r="23" fill="#b4874c"/><g id="lamp-head"><path d="M610 175Q535 132 470 220L620 282Q668 202 610 175Z" fill="#d5b580"/><path d="M470 220L620 282" stroke="#f6e4b8" stroke-width="18" stroke-linecap="round"/></g></g><circle id="light-dot" cx="600" cy="610" r="8" fill="#f6d596"/></svg><div id="endline">从一页文字，到一个可播放的片段。</div><div id="detail">${esc(content.product.detail)}</div><div id="source" class="note">${esc(content.product.label)}</div></div></div><script>
const tl=gsap.timeline({paused:true});
tl.fromTo('#lamp-hero',{y:85,opacity:0},{y:0,opacity:1,duration:1.2,ease:'power3.out'},.2);
tl.fromTo('#product-name',{y:30,opacity:0},{y:0,opacity:1,duration:.7},.4);
tl.fromTo('#headline',{y:45,opacity:0},{y:0,opacity:1,duration:.9},.8);
tl.fromTo('#lamp-head',{rotation:-24,svgOrigin:'610 175'},{rotation:0,duration:1.6,ease:'power2.inOut'},2.2);
tl.fromTo('#beam',{opacity:0},{opacity:.26,duration:1.5},3.1);
tl.fromTo('#book',{y:35,opacity:0},{y:0,opacity:1,duration:1.0},3.1);
tl.fromTo('#detail',{y:25,opacity:0},{y:0,opacity:1,duration:.7},4.2);
tl.fromTo('#endline',{opacity:0,y:25},{opacity:1,y:0,duration:.8},6.8);
tl.to('#light-dot',{attr:{cx:880},duration:3,ease:'none'},7.4);
tl.to('#beam',{opacity:.14,duration:1.1},10.3);
tl.to({}, {duration:.6},11.4);
window.__timelines['product-scene']=tl;
</script></template>`;
const ds=content.data, max=Math.max(...ds.values), axisMax=Math.ceil(max/20)*20;
const bars=ds.values.map((v,i)=>`<div class="column" style="left:${170+i*365}px"><div class="barwrap" data-layout-allow-overflow="true"><div id="bar-${i}" class="bar" style="height:${Math.round(v/axisMax*470)}px;background:${i===3?'#dd6a3f':'#bbb8a8'}"></div><div id="number-${i}" class="number" style="bottom:${Math.round(v/axisMax*470)+16}px">${v}<small>${esc(ds.unit)}</small></div></div><div class="label">${esc(ds.labels[i])}</div></div>`).join('');
const data=`<template><style>${common}
#root{background:#f3eee1;color:#25352f} #data-title{position:absolute;left:144px;top:180px;font-size:70px;font-weight:600} #data-subtitle{position:absolute;left:144px;top:110px;font-size:28px;color:#626b5f;letter-spacing:4px} #chart{position:absolute;left:140px;top:330px;width:1640px;height:570px} #baseline{position:absolute;left:65px;right:70px;top:470px;height:2px;background:#7b8175}.column{position:absolute;top:0;width:210px;height:550px}.barwrap{position:relative;width:200px;height:470px}.bar{position:absolute;bottom:0;width:200px;transform-origin:bottom;border-radius:4px 4px 0 0}.number{position:absolute;left:0;width:200px;text-align:center;font-size:54px;line-height:1;font-variant-numeric:tabular-nums}.number small{font-size:28px;margin-left:9px}.label{font-size:28px;text-align:center;margin-top:25px} #annotation{position:absolute;left:144px;top:915px;font-size:31px;color:#a73e1c} #data-source{position:absolute;left:144px;bottom:75px;font-size:28px;color:#626b5f} #metric{position:absolute;right:160px;top:115px;font-size:28px;color:#a73e1c}
</style><div id="root" data-composition-id="data-scene" data-width="1920" data-height="1080"><div id="data-subtitle">${esc(ds.subtitle)}</div><h1 id="data-title">${esc(ds.title)}</h1><div id="metric">01 → 04 周</div><div id="chart" data-layout-allow-overlap="true"><div id="baseline"></div>${bars}</div><div id="annotation">第四周：${ds.values[3]}${esc(ds.unit)}，逐周看变化</div><div id="data-source">${esc(ds.source)} · 刻度上限 ${axisMax}${esc(ds.unit)}</div></div><script>
const tl=gsap.timeline({paused:true});
tl.fromTo('#data-title',{y:35,opacity:0},{y:0,opacity:1,duration:.8},.2);
tl.fromTo('#baseline',{scaleX:0,transformOrigin:'left'},{scaleX:1,duration:.7},.7);
${ds.values.map((v,i)=>`tl.fromTo('#bar-${i}',{scaleY:0},{scaleY:1,duration:1.5,ease:'power3.out'},${1.2+i*1.5});tl.fromTo('#number-${i}',{opacity:0,y:20},{opacity:1,y:0,duration:.6},${2.1+i*1.5});`).join('\n')}
tl.fromTo('#annotation',{opacity:0,x:-30},{opacity:1,x:0,duration:.8},7.8);
tl.to('#bar-3',{backgroundColor:'#b64b27',duration:.8},8.4);
tl.to({}, {duration:2.8},9.2);
window.__timelines['data-scene']=tl;
</script></template>`;
for(const [name,id,scene] of [['product','product-scene',product],['data','data-scene',data]]) {
 const dir=join(base,'projects',name); await mkdir(join(dir,'compositions'),{recursive:true});await mkdir(join(dir,'assets'),{recursive:true});
 await copyFile(join(base,'node_modules/gsap/dist/gsap.min.js'),join(dir,'assets/gsap.min.js'));
 await writeFile(join(dir,'compositions/scene.html'),scene);
 await writeFile(join(dir,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1920,height=1080"><script src="assets/gsap.min.js"></script><style>html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:${name==='product'?'#152e29':'#f3eee1'}}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="12" data-width="1920" data-height="1080"><div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/scene.html" data-start="0" data-duration="12" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div></div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true}).to({},{duration:12});</script></body></html>`);
 await writeFile(join(dir,'hyperframes.json'),JSON.stringify({name:`repogo-${name}`,version:'1.0.0'},null,2)+'\n');
}
console.log('Prepared two 12-second original compositions in projects/product and projects/data');
