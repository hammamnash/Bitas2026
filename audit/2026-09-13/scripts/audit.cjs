const fs=require('fs');
const path=require('path');
const OUT='C:/Users/ATDSOL/Working Directory/Personal Project/Bitas2026/audit/2026-09-13';
const URL='http://127.0.0.1:8123/leanix-bitas-2026-demo.html';
fs.mkdirSync(path.join(OUT,'screenshots'),{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const targets=await (await fetch('http://127.0.0.1:9236/json')).json();
const ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map(),events=[];
ws.addEventListener('message',e=>{let m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}else events.push(m);});
const call=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const shot=async name=>{const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(OUT,'screenshots',name+'.png'),Buffer.from(r.data,'base64'));};
const click=async selector=>{await ev(`document.querySelector(${JSON.stringify(selector)}).click()`);await sleep(950);};
const metrics=async()=>ev(`(()=>({viewport:{w:innerWidth,h:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},header:document.querySelector('.stepper').getBoundingClientRect().height,sections:[...document.querySelectorAll('section')].map(e=>({id:e.id,height:Math.round(e.getBoundingClientRect().height),words:e.innerText.split(/\\s+/).length})),outside:[...document.querySelectorAll('h1,h2,h3,.h3,p,button,a,summary,img')].filter(e=>e.getClientRects().length).map(e=>({tag:e.tagName,text:(e.innerText||e.alt||'').slice(0,100),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)})).filter(e=>e.left<0||e.right>innerWidth+1),images:[...document.querySelectorAll('.capture-card img')].map(e=>({src:e.getAttribute('src'),natural:[e.naturalWidth,e.naturalHeight],display:[Math.round(e.getBoundingClientRect().width),Math.round(e.getBoundingClientRect().height)],tabIndex:e.tabIndex,loading:e.loading,width:e.getAttribute('width'),height:e.getAttribute('height')}))}))()`);
await call('Page.enable');await call('Runtime.enable');await call('Network.enable');await call('Log.enable');
await call('Page.addScriptToEvaluateOnNewDocument',{source:`window.__audit={lcp:[],cls:[],long:[]};new PerformanceObserver(l=>window.__audit.lcp.push(...l.getEntries().map(e=>({time:e.startTime,size:e.size,url:e.url})))).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>window.__audit.cls.push(...l.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>window.__audit.long.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:true});`});
await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
await call('Network.setCacheDisabled',{cacheDisabled:true});
await call('Page.navigate',{url:URL});await sleep(3000);await ev('document.fonts.ready.then(()=>true)');
const result={url:URL,baseline:await metrics()};
result.performance=await ev(`({timing:performance.getEntriesByType('navigation').map(e=>({domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd,responseStart:e.responseStart})),paint:performance.getEntriesByType('paint').map(e=>({name:e.name,start:e.startTime})),observer:window.__audit,resources:performance.getEntriesByType('resource').map(e=>({name:e.name,size:e.encodedBodySize,transfer:e.transferSize,duration:e.duration,type:e.initiatorType}))})`);
await shot('1920-hero');
result.navigation=[];
for(const sec of ['hero','s1','s2','s3','s4','s5','s6']){
await click(`.step[data-t="${sec}"]`);
result.navigation.push(await ev(`({target:'${sec}',active:document.querySelector('.step.active')?.dataset.t,top:Math.round(document.getElementById('${sec}').getBoundingClientRect().top),scrollY:Math.round(scrollY),hash:location.hash,continue:document.querySelector('.sec-next').classList.contains('show')})`));
await shot('1920-'+sec);
}
result.accordions=[];
for(let i=0;i<3;i++){await click(`details.acc:nth-of-type(999)` ).catch(()=>{}); const a=await ev(`(()=>{const d=document.querySelectorAll('details.acc')[${i}];d.scrollIntoView({behavior:'instant',block:'center'});d.querySelector('summary').click();return {index:${i},open:d.open,text:d.innerText}})()`);result.accordions.push(a);await ev(`document.querySelectorAll('details.acc')[${i}].querySelector('summary').click()`);}
await click('.step[data-t="s5"]');
result.prompts=[];for(let i=0;i<3;i++){await ev(`document.querySelectorAll('.prompt-chip')[${i}].click()`);result.prompts.push(await ev(`({index:${i},text:document.querySelector('#promptResult').innerText})`));}
await ev(`document.querySelector('.prompt-box').scrollIntoView({behavior:'instant',block:'center'})`);await sleep(300);await shot('prompt-missing-result');
result.tabs=[];for(const p of ['panelOotb','panelRest','panelExcel']){await click(`[data-panel="${p}"]`);result.tabs.push(await ev(`({target:'${p}',visible:[...document.querySelectorAll('.integration-panel')].filter(e=>!e.hidden).map(e=>e.id),images:[...document.querySelector('#${p}').querySelectorAll('img')].map(e=>({loaded:e.naturalWidth>0,opacity:getComputedStyle(e.closest('.capture-card')).opacity}))})`));}
await click('[data-panel="panelOotb"]');
result.lightbox=[];
for(let i=0,n=await ev(`document.querySelectorAll('.capture-card img').length`);i<n;i++){await ev(`document.querySelectorAll('.capture-card img')[${i}].click()`);await sleep(50);result.lightbox.push(await ev(`({index:${i},open:document.querySelector('.lightbox').classList.contains('open'),src:document.querySelector('.lb-img').getAttribute('src'),count:document.querySelector('.lb-count').innerText,loaded:document.querySelector('.lb-img').naturalWidth>0})`));await ev(`document.querySelector('.lb-close').click()`);}
await click('.step[data-t="hero"]');await ev(`document.querySelector('.step').focus();document.querySelector('.capture-card img').click()`);await sleep(300);await shot('1920-lightbox');
result.lightboxKeyboard={openedFocus:await ev(`({tag:document.activeElement.tagName,cls:document.activeElement.className,inside:!!document.activeElement.closest('.lightbox')})`)};
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});result.lightboxKeyboard.afterTab=await ev(`({tag:document.activeElement.tagName,cls:document.activeElement.className,inside:!!document.activeElement.closest('.lightbox')})`);
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});result.lightboxKeyboard.rightCount=await ev(`document.querySelector('.lb-count').innerText`);
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowLeft',code:'ArrowLeft',windowsVirtualKeyCode:37});result.lightboxKeyboard.leftCount=await ev(`document.querySelector('.lb-count').innerText`);
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});result.lightboxKeyboard.escapeClosed=await ev(`!document.querySelector('.lightbox').classList.contains('open')`);
result.continue=[];for(const sec of ['s1','s4','s6']){await click(`.step[data-t="${sec}"]`);const before=await ev(`scrollY`);await click('.sec-next');result.continue.push(await ev(`({sec:'${sec}',before:${before},after:scrollY,sectionBottom:document.getElementById('${sec}').offsetTop+document.getElementById('${sec}').offsetHeight,nextSectionTop:document.getElementById('${sec}').nextElementSibling?.offsetTop,shown:document.querySelector('.sec-next').classList.contains('show')})`));}
result.resources=[];for(let i=0;i<3;i++){await click('.step[data-t="s6"]');await ev(`document.querySelectorAll('.hub .text-link')[${i}].click()`);await sleep(1200);result.resources.push(await ev(`({index:${i},href:document.querySelectorAll('.hub .text-link')[${i}].getAttribute('href'),scrollY,hash:location.hash})`));}
result.breakpoints=[];
for(const [w,h] of [[1366,768],[1024,768],[768,1024],[390,844]]){
await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});await ev(`scrollTo({top:0,behavior:'instant'})`);await sleep(600);result.breakpoints.push(await metrics());await shot(w+'-hero');await click('.step[data-t="s5"]');await shot(w+'-ai');
}
await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
result.contrast=await ev(`(()=>{const rgb=s=>s.match(/[\\d.]+/g).map(Number);const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const bg=e=>{let a=[255,255,255];const chain=[];for(let p=e;p;p=p.parentElement)chain.unshift(p);for(const p of chain){const c=rgb(getComputedStyle(p).backgroundColor);let t=c[3]??1;a=a.map((v,i)=>c[i]*t+v*(1-t));}return a};return [...document.querySelectorAll('.sub,.caption,.muted,.sec-kicker,.time-chip,.sec-num,.capture-card figcaption,.features small,.step')].filter(e=>e.getClientRects().length).map(e=>{const c=getComputedStyle(e),f=rgb(c.color),b=bg(e),a=lum(f),z=lum(b),ratio=(Math.max(a,z)+.05)/(Math.min(a,z)+.05),size=parseFloat(c.fontSize),bold=parseInt(c.fontWeight)>=700,threshold=(size>=24||(bold&&size>=18.667))?3:4.5;return {selector:e.className,text:e.textContent.trim().slice(0,95),section:e.closest('section')?.id,font:size,weight:c.fontWeight,fg:c.color,bg:b,ratio:Math.round(ratio*100)/100,threshold,pass:ratio>=threshold}})})()`);
result.errors=events.filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Log.entryAdded'&&e.params.entry.level==='error')||e.method==='Network.loadingFailed');
fs.writeFileSync(path.join(OUT,'browser-audit.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({report:path.join(OUT,'browser-audit.json'),navigation:result.navigation,prompts:result.prompts,tabs:result.tabs,lightboxCount:result.lightbox.length,lightboxKeyboard:result.lightboxKeyboard,continue:result.continue,resources:result.resources,breakpoints:result.breakpoints.map(b=>({viewport:b.viewport,header:b.header,outside:b.outside})),contrastFailures:result.contrast.filter(c=>!c.pass),errors:result.errors},null,2));
ws.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
