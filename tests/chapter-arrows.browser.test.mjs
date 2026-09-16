import assert from 'node:assert/strict';
import test from 'node:test';
import {connectBrowser} from './helpers/browser.mjs';
const url=process.env.DEMO_URL || 'http://127.0.0.1:8123/';

async function unhandledArrows(b){
  const result=await b.evaluate(`['ArrowUp','ArrowDown'].map(key=>{
    const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});
    document.activeElement.dispatchEvent(event);return event.defaultPrevented;
  })`);
  assert.deepEqual(result,[false,false],'Subsection navigation must leave this interaction alone');
}

test('subsection arrows leave overlays, menus, editable controls and modified keys alone', {timeout:60000}, async t=>{
  const b=await openDemo(t,false);
  await unhandledArrows(b);
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate(`document.querySelector('#demoIntro').open && scrollY===0`),true);
  await b.click('#startDemo');await b.until(`!document.querySelector('#demoIntro')`);
  await b.click('.hero .capture-card img');
  await unhandledArrows(b);
  const imageY=await b.evaluate('scrollY');
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate('scrollY'),imageY);
  await b.key('Escape','Escape',27);
  await b.until(`getComputedStyle(document.querySelector('.lightbox')).visibility==='hidden'`);
  await b.evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
  await b.until(`document.querySelector('.sec-next').textContent==='Continue: Demo materials'`);
  await b.click('.sec-next');await b.until(`document.querySelector('#materialsDialog').open`);
  await unhandledArrows(b);
  await b.key('Escape','Escape',27);
  await b.until(`!document.querySelector('#materialsDialog').open && !document.querySelector('.sec-next').hidden`);
  await b.command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.click('#menuToggle');await unhandledArrows(b);
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`),'true');
  await b.key('Escape','Escape',27);
  await b.click('#promptExamples summary');
  await b.until(`document.querySelector('#promptExamples').open`);
  await b.evaluate(`document.querySelector('#demoPrompt').focus()`);
  assert.equal(await b.evaluate('document.activeElement.id'),'demoPrompt');
  await unhandledArrows(b);
  await b.key('ArrowDown','ArrowDown',40);
  assert.equal(await b.evaluate('document.activeElement.id'),'demoPrompt');
  await b.evaluate(`document.querySelector('#demoPrompt').blur();window.scrollTo({top:0,behavior:'instant'})`);
  // Temporary native/editor fixtures exercise protections without adding UI to the deck.
  for(const html of ['<input>','<select><option>One</option><option>Two</option></select>','<div contenteditable="true"><span>Editor</span></div>','<div role="slider" tabindex="0"></div>']){
    await b.evaluate(`(()=>{const f=document.createElement('div');f.id='arrowFixture';f.innerHTML=${JSON.stringify(html)};document.body.append(f);f.firstElementChild.focus({preventScroll:true})})()`);
    await unhandledArrows(b);
    await b.evaluate(`document.querySelector('#arrowFixture').remove()`);
  }
  for(const modifier of ['ctrlKey','altKey','metaKey','shiftKey','isComposing']){
    assert.equal(await b.evaluate(`(()=>{const e=new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true,${modifier}:true});document.body.dispatchEvent(e);return e.defaultPrevented})()`),false);
  }
  await b.evaluate(`document.querySelector('#hero h1').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})`);
  const repeated=await b.evaluate(`(()=>{const e=new KeyboardEvent('keydown',{key:'ArrowDown',repeat:true,bubbles:true,cancelable:true});document.body.dispatchEvent(e);return {prevented:e.defaultPrevented,y:scrollY}})()`);
  assert.deepEqual(repeated,{prevented:true,y:0});
  await b.key('ArrowDown','ArrowDown',40);await landed(b,'Bringing all domains together');
  assert.deepEqual(b.errors,[]);
});

test('smooth subsection jumps ignore repeats and rapid presses until landing', {timeout:60000}, async t=>{
  const b=await openDemo(t);
  await b.command('Emulation.setEmulatedMedia',{features:[]});
  await b.command('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
  assert.equal(await b.evaluate(`document.activeElement.closest('section')?.id`),'s1');
  assert.equal(await b.evaluate(`document.querySelector('.sec-next').getAttribute('aria-disabled')`),'true');
  for(let i=0;i<5;i++)await b.command('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40,autoRepeat:true});
  await b.command('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
  await b.key('ArrowDown','ArrowDown',40);
  await b.key('ArrowUp','ArrowUp',38);
  await b.until(`document.querySelector('.sec-next').getAttribute('aria-disabled')!=='true'`);
  await landed(b,'Bringing all domains together');
  await b.key('ArrowDown','ArrowDown',40);
  await b.until(`document.querySelector('.sec-next').getAttribute('aria-disabled')!=='true'`);
  await landed(b,'The three core layers');
  await b.key('ArrowUp','ArrowUp',38);
  await b.until(`document.querySelector('.sec-next').getAttribute('aria-disabled')!=='true'`);
  await landed(b,'Bringing all domains together');
  await b.key('ArrowUp','ArrowUp',38);
  await b.until(`document.querySelector('.sec-next').getAttribute('aria-disabled')!=='true'`);
  await landed(b,'hero');
  // Manual navigation still cancels the shared navigation lock.
  await b.key('ArrowDown','ArrowDown',40);
  await b.key('End','End',35);
  await b.until(`document.querySelector('.sec-next').getAttribute('aria-disabled')!=='true'`);
  await b.until(`scrollY + innerHeight >= document.documentElement.scrollHeight - 2`);
  await b.evaluate(`window.scrollTo({top:0,behavior:'instant'});document.querySelector('#hero h1').focus({preventScroll:true})`);
  await b.evaluate(`new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
  await b.key('ArrowDown','ArrowDown',40);
  await b.until(`document.querySelector('.sec-next').getAttribute('aria-disabled')!=='true'`);
  await landed(b,'Bringing all domains together');
  assert.deepEqual(b.errors,[]);
});

async function openDemo(t, dismiss=true){
  const b=await connectBrowser();
  t.after(async()=>{await b.command('Emulation.setEmulatedMedia',{features:[]});b.close();});
  await b.command('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await b.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.command('Page.navigate',{url:`${url}?chapter-arrows=1`});
  await b.until(`document.readyState==='complete' && document.querySelector('#demoIntro')?.open`,15000);
  if(dismiss){await b.click('#startDemo');await b.until(`!document.querySelector('#demoIntro')`);}
  await b.evaluate('document.fonts.ready.then(()=>true)');
  return b;
}

async function landed(b,id){
  const heading=id==='hero' ? `document.querySelector('#hero h1')` : `[...document.querySelectorAll('section h2,section h3,section .h3')].find(h=>h.dataset.demoStop===${JSON.stringify(id)} || h.textContent.trim()===${JSON.stringify(id)})`;
  await b.until(`Math.abs(scrollY - (${id==='hero'?'0':`stopPosition(${heading})`}))<2`);
  assert.equal(await b.evaluate(`document.activeElement === (${heading})`),true,`Focus must land on ${id}`);
  if(id!=='hero'){
    const box=await b.evaluate(`(() => {
      const heading=(${heading}).getBoundingClientRect(),header=document.querySelector('.stepper').getBoundingClientRect(),next=document.querySelector('.sec-next').getBoundingClientRect();
      return {top:heading.top,bottom:heading.bottom,headerBottom:header.bottom,nextTop:next.top,nextBottom:next.bottom,mobile:innerWidth<=900};
    })()`);
    assert.ok(box.top>=box.headerBottom && (box.mobile?box.bottom<=box.nextTop:box.top>=box.nextBottom),`${id} heading hidden by navigation`);
  }
}

test('arrows visit every H2 and H3 in page order, including side-by-side headings', {timeout:90000}, async t=>{
  const b=await openDemo(t);
  const headings=['Bringing all domains together','The three core layers','AI-EA Synergies','Overview LeanIX','The SAP EA Approach & Fact Sheet types','Out-of-the-box views','Governance & data that stays fresh','Different views of the same architecture','Fact Sheets','Object Explorer','Diagrams','Portal','Dashboards & Reports','Give AI enterprise context','Three jobs for AI','Discover and structure','Ask and understand','Connect and extend','Supporting integration paths','Context before automation','Key takeaways','Resources'];
  assert.deepEqual(await b.evaluate(`[...document.querySelectorAll('section h2,section h3,section .h3')].map(h=>h.dataset.demoStop==='The three core layers' ? h.dataset.demoStop : h.textContent.trim())`),headings);
  for(const [width,height] of [[1920,1080],[1536,864],[960,540],[768,1024],[390,844],[320,568]]){
    await b.command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    await b.evaluate(`window.scrollTo({top:0,behavior:'instant'});document.querySelector('#hero h1').focus({preventScroll:true})`);
    await b.key('ArrowUp','ArrowUp',38);
    assert.equal(await b.evaluate('scrollY'),0,'Up at hero must not wrap');
    for(const id of headings){
      await b.key('ArrowDown','ArrowDown',40);
      await landed(b,id);
    }
    const last=await b.evaluate('scrollY');
    await b.key('ArrowDown','ArrowDown',40);
    assert.equal(await b.evaluate('scrollY'),last,'Down at final heading must not wrap or open materials');
    assert.equal(await b.evaluate(`document.querySelector('#materialsDialog').open`),false);
    for(const id of [...headings.slice(0,-1).reverse(),'hero']){
      await b.key('ArrowUp','ArrowUp',38);
      await landed(b,id);
    }
    await b.evaluate(`document.querySelector('#viz-objects').setAttribute('tabindex','-1');document.querySelector('#viz-objects').focus({preventScroll:true});window.scrollTo({top:stopPosition(document.querySelector('#viz-objects'))+100,behavior:'instant'})`);
    await b.key('ArrowUp','ArrowUp',38);
    await landed(b,'Object Explorer');
    await b.key('ArrowUp','ArrowUp',38);
    await landed(b,'Fact Sheets');
    await b.evaluate(`window.scrollTo({top:stopPosition(document.querySelector('[data-demo-stop="Object Explorer"]')),behavior:'instant'})`);
    await b.key('ArrowDown','ArrowDown',40);
    await landed(b,'Diagrams');
    await b.key('ArrowUp','ArrowUp',38);
    await landed(b,'Object Explorer');
    await b.click('.sec-next');
    assert.equal(await b.evaluate(`document.querySelector('.sec-next').textContent`),'Next: Portal','Next must retain topic navigation');
    await b.evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
    await b.key('ArrowUp','ArrowUp',38);
    await landed(b,'Resources');
  }
  assert.deepEqual(b.errors,[]);
});
