import assert from 'node:assert/strict';
import test from 'node:test';
import {connectBrowser} from './helpers/browser.mjs';

const url=process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('chapter navbar stays one row at FHD and scaled desktop widths', {timeout:60000}, async t=>{
  const b=await connectBrowser();
  t.after(async()=>{await b.command('Emulation.setEmulatedMedia',{features:[]});b.close();});
  await b.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.command('Page.navigate',{url:`${url}?navbar-test=1`});
  await b.until(`document.readyState==='complete' && document.querySelector('#demoIntro')?.open`);
  await b.click('#startDemo');
  await b.until(`!document.querySelector('#demoIntro')`);
  await b.evaluate(`document.fonts.ready.then(()=>true)`);
  const measurements=[];
  for(const font of ['', 'Arial, sans-serif', 'Segoe UI, sans-serif']){
    await b.evaluate(`document.querySelector('.stepper').style.fontFamily=${JSON.stringify(font)}`);
    for(const width of [1920,1600,1536,1440,1366,1280,1201,1200,960,768,390,320]){
      await b.command('Emulation.setDeviceMetricsOverride',{width,height:1080,deviceScaleFactor:1,mobile:width<600});
      await b.evaluate(`new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
      const geometry=await b.evaluate(`(() => {
        const header=document.querySelector('.stepper'),nav=document.querySelector('#stepperNav'),links=[...nav.querySelectorAll('a')];
        const shown=getComputedStyle(nav).display!=='none';
        return {viewport:innerWidth,headerHeight:header.offsetHeight,wrapWidth:header.querySelector('.wrap').offsetWidth,
          shown,menuVisible:document.querySelector('#menuToggle').checkVisibility(),
          rows:shown?new Set(links.map(a=>Math.round(a.getBoundingClientRect().top))).size:0,
          navOverflow:shown&&nav.scrollWidth>nav.clientWidth+1,
          clipped:shown&&links.some(a=>{const r=a.getBoundingClientRect();return r.left<0||r.right>innerWidth;}),
          small:shown&&links.some(a=>{const r=a.getBoundingClientRect();return r.height<44||parseFloat(getComputedStyle(a).fontSize)<18;}),
          pageOverflow:document.documentElement.scrollWidth>innerWidth};
      })()`);
      measurements.push({font:font||'Inter',...geometry});
    }
  }
  console.log(`${measurements.length} viewport/font combinations checked; desktop header heights: ${[...new Set(measurements.filter(m=>m.shown).map(m=>m.headerHeight))].join(', ')}px.`);
  for(const m of measurements){
    const label=`${m.font} ${m.viewport}px`;
    assert.ok(m.headerHeight<=80,`${label}: header is ${m.headerHeight}px tall`);
    assert.equal(m.rows,m.shown?1:0,`${label}: wrapped chapter links`);
    assert.equal(m.navOverflow,false,`${label}: navigation overflow`);
    assert.equal(m.clipped,false,`${label}: clipped link`);
    assert.equal(m.small,false,`${label}: small target or text`);
    assert.equal(m.pageOverflow,false,`${label}: page overflow`);
    if(m.viewport>=1280) assert.equal(m.shown,true,`${label}: should fit full navigation`);
    if(!m.shown) assert.equal(m.menuVisible,true,`${label}: navigation unreachable`);
  }
  await b.evaluate(`document.querySelector('.stepper').style.fontFamily=''`);
  for(const width of [1920,1536,1280]){
    await b.command('Emulation.setDeviceMetricsOverride',{width,height:1080,deviceScaleFactor:1,mobile:false});
    for(const id of ['hero','s1','s2','s3','s4','s5','s6']){
      await b.click(`.step[data-t="${id}"]`);
      await b.until(`document.querySelector('.step.active')?.dataset.t==='${id}'`);
    }
  }
  await b.command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.click('#menuToggle');
  assert.equal(await b.evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`),'true');
  await b.click('.step[data-t="s1"]');
  assert.equal(await b.evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`),'false');
  assert.deepEqual(b.errors,[]);
});
