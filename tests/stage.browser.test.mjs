import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdir,writeFile} from 'node:fs/promises';
import {connectBrowser} from './helpers/browser.mjs';
const url=process.env.DEMO_URL || 'http://127.0.0.1:8123/';

async function clickFixed(b,selector){
  const point=await b.evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  for(const type of ['mousePressed','mouseReleased']) await b.command('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...point});
}

async function setup(t){
  const b=await connectBrowser();
  t.after(async()=>{await b.command('Emulation.setEmulatedMedia',{features:[]});b.close();});
  await b.command('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await b.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.command('Page.navigate',{url:`${url}?stage-test=1`});
  await b.until(`document.readyState==='complete' && document.querySelector('#demoIntro')?.open`,15000);
  await b.evaluate('document.fonts.ready.then(()=>true)');
  return b;
}

test('stage controls follow all H2/H3 headings and support mobile exit', {timeout:90000}, async t=>{
  const b=await setup(t);
  await b.click('#startDemo');await b.until(`!document.querySelector('#demoIntro')`);
  const labels=await b.evaluate(`[...document.querySelectorAll('#hero h1,section h2,section h3,section .h3')].map(h=>h.textContent.trim())`);
  await b.key('s','KeyS',83);
  assert.equal(await b.evaluate(`document.querySelector('#stagePrevious').disabled`),true);
  for(const label of labels.slice(1)){
    await clickFixed(b,'#stageNext');
    assert.equal(await b.evaluate(`document.activeElement.textContent.trim()`),label);
    assert.ok(await b.evaluate(`document.activeElement.getBoundingClientRect().top>=23`));
  }
  assert.equal(await b.evaluate(`document.querySelector('#stageNext').textContent`),'Demo materials');
  await clickFixed(b,'#stageNext');await b.until(`document.querySelector('#materialsDialog').open`);
  assert.equal(await b.evaluate(`document.querySelector('#stageControls').hidden`),true);
  await b.key('Escape','Escape',27);
  await b.until(`!document.querySelector('#materialsDialog').open && !document.querySelector('#stageControls').hidden`);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),true);
  for(const label of labels.slice(0,-1).reverse()){
    await clickFixed(b,'#stagePrevious');
    assert.equal(await b.evaluate(`document.activeElement.textContent.trim()`),label);
  }
  assert.equal(await b.evaluate(`document.querySelector('#stagePrevious').disabled`),true);
  for(const key of ['1','2','3','4','5','6','0']){
    await b.key(key,`Digit${key}`,48+Number(key));
    assert.equal(await b.evaluate(`document.activeElement.closest('section').id`),key==='0'?'hero':`s${key}`);
  }
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate(`document.activeElement.matches('#s1 h2')`),true);
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate(`document.activeElement.dataset.demoStop`),'The three core layers');
  await clickFixed(b,'#stageNext');
  assert.equal(await b.evaluate(`document.activeElement.id`),'synergyTitle');
  await b.key('ArrowUp','ArrowUp',38);
  assert.equal(await b.evaluate(`document.activeElement.dataset.demoStop`),'The three core layers');
  for(const [width,height] of [[1920,1080],[1536,864],[1280,720],[960,540],[768,1024],[390,844],[320,568],[844,390]]){
    await b.command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});
    await b.evaluate(`new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
    const geometry=await b.evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('#stageControls button')].map(b=>{const r=b.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:r.width,h:r.height}})})`);
    assert.equal(geometry.overflow,false,`${width}px overflow`);
    assert.ok(geometry.controls.every(r=>r.left>=0&&r.right<=width&&r.top>=0&&r.bottom<=height&&r.w>=44&&r.h>=44),`${width}px controls`);
    await b.evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
    await b.until(`document.querySelector('#stageNext').textContent==='Demo materials'`);
    assert.ok(await b.evaluate(`document.querySelector('footer .wrap').getBoundingClientRect().bottom < document.querySelector('#stageControls').getBoundingClientRect().top`),'Footer obscured');
  }
  await b.command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.key('4','Digit4',52);
  const y=await b.evaluate(`document.querySelector('#s4 h2').getBoundingClientRect().top`);
  await clickFixed(b,'#stageExit');
  assert.equal(await b.evaluate(`document.activeElement.id`),'menuToggle');
  assert.ok(Math.abs(await b.evaluate(`document.querySelector('#s4 h2').getBoundingClientRect().top`)-y)<2);
  await clickFixed(b,'#menuToggle');
  await b.click('#stageToggle');
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),true);
  assert.equal(await b.evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`),'false');
  assert.deepEqual(b.errors,[]);
});

test('stage shortcuts respect dialogs and fields; presenter interactions remain usable', {timeout:60000}, async t=>{
  const b=await setup(t);
  await b.click('#startDemo');await b.until(`!document.querySelector('#demoIntro')`);
  await b.key('s','KeyS',83);
  await b.click('.hero .capture-card img');
  await b.key('s','KeyS',83);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode') && document.querySelector('.lightbox').open`),true);
  await b.key('Escape','Escape',27);
  await b.until(`!document.querySelector('.lightbox').open`);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),true,'Escape closes only the top overlay');
  await b.key('Escape','Escape',27);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false);
  await b.click('#promptExamples summary');
  await b.evaluate(`document.querySelector('#demoPrompt').focus()`);
  for(const key of ['s','5','Escape']) await b.key(key,key==='s'?'KeyS':key==='5'?'Digit5':'Escape',key==='s'?83:key==='5'?53:27);
  assert.equal(await b.evaluate(`document.activeElement.id`),'demoPrompt');
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false);
  await b.evaluate(`document.activeElement.blur()`);
  for(const modifier of ['ctrlKey','metaKey','altKey','shiftKey','isComposing']){
    assert.equal(await b.evaluate(`(()=>{const e=new KeyboardEvent('keydown',{key:'s',${modifier}:true,bubbles:true,cancelable:true});document.body.dispatchEvent(e);return e.defaultPrevented})()`),false);
  }
  await b.key('s','KeyS',83);
  await b.click('[data-prompt="governance"]');
  await b.click('#copyPrompt');await b.until(`document.querySelector('#copyState').textContent.startsWith('Copied.')`);
  for(const panel of ['panelRest','panelExcel','panelOotb']){
    await b.click(`[data-panel="${panel}"]`);
    assert.equal(await b.evaluate(`document.querySelector('#${panel}').hidden`),false);
  }
  assert.equal(await b.evaluate(`document.querySelector('.impact-brief-link').target`),'_blank');
  // Real smooth scroll is interrupted by Exit stage, without continuing afterwards.
  await b.key('0','Digit0',48);
  await b.command('Emulation.setEmulatedMedia',{features:[]});
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate(`document.querySelector('#stageNext').disabled`),true);
  await b.key('Escape','Escape',27);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false);
  assert.equal(await b.evaluate(`document.querySelector('.sec-next').getAttribute('aria-disabled')`),null);
  await b.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.key('s','KeyS',83);
  await mkdir(new URL('../audit/2026-09-16/',import.meta.url),{recursive:true});
  for(const [width,height] of [[1920,1080],[390,844]]){
    await b.command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    await b.key('1','Digit1',49);
    await b.evaluate(`document.activeElement.blur();new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
    const shot=await b.command('Page.captureScreenshot',{format:'png'});
    await writeFile(new URL(`../audit/2026-09-16/stage-${width}.png`,import.meta.url),Buffer.from(shot.data,'base64'));
  }
  assert.deepEqual(b.errors,[]);
});

test('stage mode is opt-in, keeps position and provides a visible exit', {timeout:60000}, async t=>{
  const b=await setup(t);
  assert.equal(await b.evaluate(`!!document.querySelector('#stageToggle')`),true,'Missing stage-mode entry control');
  await b.key('s','KeyS',83);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false,'Cover must not start stage mode');
  await b.click('#startDemo');await b.until(`!document.querySelector('#demoIntro')`);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false);
  await b.click('.step[data-t="s4"]');
  await b.evaluate(`window.scrollBy({top:220,behavior:'instant'})`);
  const top=await b.evaluate(`document.querySelector('#s4 h2').getBoundingClientRect().top`);
  await clickFixed(b,'#stageToggle');
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),true);
  assert.equal(await b.evaluate(`document.querySelector('#stageToggle').getAttribute('aria-pressed')`),'true');
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('.stepper')).display`),'none');
  assert.equal(await b.evaluate(`document.querySelector('.sec-next').hidden`),true);
  assert.equal(await b.evaluate(`document.querySelector('#stageControls').hidden`),false);
  assert.equal(await b.evaluate(`document.querySelector('#stageExit').checkVisibility()`),true);
  assert.ok(Math.abs(await b.evaluate(`document.querySelector('#s4 h2').getBoundingClientRect().top`)-top)<2,'Entry must preserve content position');
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('.hero-bg'),'::after').animationName`),'none');
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('#s4'),'::before').display`),'none');
  assert.equal(await b.evaluate(`document.fullscreenElement`),null,'Stage mode must not force fullscreen');
  await clickFixed(b,'#stageExit');
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false);
  assert.ok(Math.abs(await b.evaluate(`document.querySelector('#s4 h2').getBoundingClientRect().top`)-top)<2,'Exit must preserve content position');
  assert.equal(await b.evaluate(`document.querySelector('#stageControls').hidden`),true);
  assert.equal(await b.evaluate(`document.activeElement.id`),'stageToggle');
  await b.key('s','KeyS',83);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),true);
  await b.key('Escape','Escape',27);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false);
  await b.key('s','KeyS',83);
  await b.command('Page.reload');
  await b.until(`document.querySelector('#demoIntro')?.open`);
  assert.equal(await b.evaluate(`document.body.classList.contains('stage-mode')`),false,'Refresh must start in normal mode');
  assert.deepEqual(b.errors,[]);
});
