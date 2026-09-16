import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {connectBrowser} from './helpers/browser.mjs';

const url=process.env.DEMO_URL || 'http://127.0.0.1:8123/';
const endpoint=process.env.CDP_URL || 'http://127.0.0.1:9237';
const path='salesforce-experience-cloud-impact-brief.html';

test('Connect and extend opens the saved Salesforce brief in a separate tab', {timeout:60000}, async t=>{
  const b=await connectBrowser();
  let popupId;
  t.after(async()=>{
    if(popupId) await b.command('Target.closeTarget',{targetId:popupId});
    await b.command('Emulation.setEmulatedMedia',{features:[]});
    b.close();
  });
  await b.command('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await b.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.command('Page.navigate',{url:`${url}?impact-link=1`});
  await b.until(`document.readyState==='complete' && document.querySelector('#demoIntro')?.open`);
  await b.click('#startDemo');
  await b.until(`!document.querySelector('#demoIntro')`);
  const link=await b.evaluate(`(() => {
    const a=document.querySelector('#ai-connect .impact-brief-link');
    return a && {text:a.textContent.trim(),href:a.getAttribute('href'),target:a.target,rel:a.rel,hidden:!!a.closest('details'),note:a.parentElement.textContent};
  })()`);
  assert.ok(link,'Missing impact brief link under Connect and extend');
  assert.equal(link.text,'View AI-generated impact brief');
  assert.equal(link.href,`/${path}`);
  assert.equal(link.target,'_blank');
  assert.ok(link.rel.split(' ').includes('noopener'));
  assert.equal(link.hidden,false);
  assert.match(link.note,/saved MCP result/i);
  assert.match(link.note,/new tab/i);
  const source=await readFile(new URL(`../generated/${path}`,import.meta.url));
  const response=await fetch(`${url}${path}`);
  assert.equal(response.status,200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),source,'Route must serve the brief, not a homepage fallback');
  for(const width of [1920,768,390,320]){
    await b.command('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width<600});
    const bounds=await b.evaluate(`(() => {
      const a=document.querySelector('.impact-brief-link'),r=a.getBoundingClientRect();
      return {left:r.left,right:r.right,height:r.height,width:r.width,overflow:document.documentElement.scrollWidth>innerWidth};
    })()`);
    assert.equal(bounds.overflow,false);
    assert.ok(bounds.left>=0 && bounds.right<=width && bounds.height>=44 && bounds.width>=44,`${width}px link geometry`);
  }
  await b.evaluate(`document.querySelector('.impact-brief-link').scrollIntoView({behavior:'instant',block:'center'})`);
  const before=await b.evaluate(`({url:location.href,y:scrollY})`);
  const oldIds=new Set((await b.command('Target.getTargets')).targetInfos.map(n=>n.targetId));
  await b.click('.impact-brief-link');
  let popup;
  for(let i=0;i<50;i++){
    popup=(await b.command('Target.getTargets')).targetInfos.find(n=>!oldIds.has(n.targetId)&&n.type==='page'&&n.url.includes(path));
    if(popup) break;
    await new Promise(r=>setTimeout(r,40));
  }
  assert.ok(popup,'Click must create a new tab');
  popupId=popup.targetId;
  assert.deepEqual(await b.evaluate(`({url:location.href,y:scrollY})`),before,'Original presentation must keep its position');
  const targets=await (await fetch(`${endpoint}/json/list`)).json();
  const target=targets.find(n=>n.id===popupId);
  const ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  try{
    const state=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Popup verification timed out')),10000);
      ws.addEventListener('message',event=>{
        const m=JSON.parse(event.data);if(m.id!==1)return;clearTimeout(timer);
        if(m.error||m.result.exceptionDetails)reject(new Error(JSON.stringify(m)));else resolve(m.result.result.value);
      });
      ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:`new Promise(resolve=>{const done=()=>resolve({title:document.title,opener:window.opener===null,nodes:document.querySelectorAll('.mind-node').length});document.readyState==='complete'?done():addEventListener('load',done,{once:true});})`,awaitPromise:true,returnByValue:true}}));
    });
    assert.equal(state.title,'Salesforce Experience Cloud | Executive Impact Map');
    assert.equal(state.opener,true);
    assert.equal(state.nodes,6);
  }finally{ws.close();}
  assert.deepEqual(b.errors,[]);
});
