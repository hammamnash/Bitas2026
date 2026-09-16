import assert from 'node:assert/strict';
import test from 'node:test';
import { connectBrowser } from './helpers/browser.mjs';

const url = process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('mobile hero retains word spacing and readable secondary text', async t => {
  const browser=await openDemo(t);
  assert.match(await browser.evaluate(`document.querySelector('h1').innerText`),/data\s+to/);
  const color=await browser.evaluate(`getComputedStyle(document.querySelector('.hero .sub')).color`);
  const rgb=color.match(/\d+/g).map(Number).slice(0,3);
  const luminance=rgb.map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);
  assert.ok(1.05/(luminance+.05)>=4.5,`${color} does not meet normal-text contrast`);
});

test('mobile Next control stays below content and clears chapter landings', { timeout: 60000 }, async t => {
  const browser=await openDemo(t,320,568);
  const {evaluate,until}=browser;
  assert.ok(await evaluate(`document.querySelector('.sec-next').getBoundingClientRect().top > innerHeight/2`),'Next should be at the bottom on phones');
  const labels=[];
  for(let i=0;i<40;i++){
    const label=await evaluate(`document.querySelector('.sec-next').textContent`);
    labels.push(label);
    if(label==='Continue: Demo materials') break;
    await browser.click('.sec-next');
    await until(`document.querySelector('.sec-next').getAttribute('aria-disabled') !== 'true'`);
    const top=await evaluate(`(() => {
      const stop=[...document.querySelectorAll('[data-demo-stop]')].find(n=>n.dataset.demoStop===${JSON.stringify(label.slice(6))});
      return (stop.matches('section')?stop.querySelector('.sec-head'):stop).getBoundingClientRect().top;
    })()`);
    const bounds=await evaluate(`({header:document.querySelector('.stepper').getBoundingClientRect().bottom,next:document.querySelector('.sec-next').getBoundingClientRect().top})`);
    assert.ok(top>=bounds.header && top<bounds.next,`${label}: landing obscured`);
  }
  assert.equal(labels.at(-1),'Continue: Demo materials');
  assert.ok(labels.includes('Next: Resources'));
  await evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
  assert.ok(await evaluate(`document.querySelector('footer .wrap').getBoundingClientRect().bottom < document.querySelector('.sec-next').getBoundingClientRect().top`),'Footer hidden by fixed control');
  await browser.click('.sec-next');
  await until(`document.querySelector('#materialsDialog').open`);
  await browser.key('Escape','Escape',27);
  assert.deepEqual(browser.errors,[]);
});

test('mobile screenshot viewer keeps image clear of controls and supports keyboard focus', { timeout: 60000 }, async t => {
  const browser=await openDemo(t,320,568);
  const {evaluate,command,until}=browser;
  const image='.hero .capture-card img';
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(image)}).tabIndex`),0,'Screenshot cannot receive keyboard focus');
  await evaluate(`document.querySelector(${JSON.stringify(image)}).focus()`);
  await browser.key('Enter','Enter',13);
  await until(`document.querySelector('.lightbox').classList.contains('open')`);
  assert.equal(await evaluate(`!!document.activeElement.closest('.lightbox')`),true);
  for(const [width,height] of [[320,568],[390,844],[844,390]]){
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    const imageCount=await evaluate(`document.querySelectorAll('.capture-card img').length`);
    for(let i=0;i<imageCount;i++){
      await until(`document.querySelector('.lb-img').complete && document.querySelector('.lb-img').naturalWidth>0`);
      const geometry=await evaluate(`(() => {
        const image=document.querySelector('.lb-img').getBoundingClientRect();
        const cap=document.querySelector('.lb-cap').getBoundingClientRect();
        const close=document.querySelector('.lb-close').getBoundingClientRect();
        const next=document.querySelector('.lb-next').getBoundingClientRect();
        return {imageTop:image.top,imageBottom:image.bottom,capBottom:cap.bottom,closeBottom:close.bottom,nextTop:next.top,width:document.querySelector('.lightbox').scrollWidth};
      })()`);
      assert.ok(geometry.imageTop>=geometry.closeBottom,`${width}px close covers image`);
      assert.ok(geometry.imageBottom<=geometry.nextTop && geometry.capBottom<=geometry.nextTop,`${width}px navigation covers image/caption`);
      assert.ok(geometry.width<=width,`${width}px viewer overflow`);
      await browser.click('.lb-next');
    }
  }
  await browser.click('.lb-prev');
  await browser.key('ArrowLeft','ArrowLeft',37);
  await browser.key('ArrowRight','ArrowRight',39);
  await browser.key('Escape','Escape',27);
  await until(`getComputedStyle(document.querySelector('.lightbox')).visibility==='hidden'`);
  assert.equal(await evaluate(`document.activeElement.matches(${JSON.stringify(image)})`),true);
  assert.deepEqual(browser.errors,[]);
});

test('all sections reflow without clipped text or undersized controls', { timeout: 60000 }, async t => {
  const browser = await openDemo(t, 320, 568);
  const { evaluate, command } = browser;
  for (const [width,height] of [[320,568],[360,800],[390,844],[600,800],[768,1024],[900,600],[960,540],[1200,800],[1280,800],[1920,1080]]) {
    await command('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:width<600});
    await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
    await evaluate(`document.querySelectorAll('details').forEach(n=>n.open=true)`);
    const layout = await evaluate(`(() => {
      const clipped=[];
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const n=walker.currentNode, p=n.parentElement;
        if(!n.textContent.trim() || !p.closest('section,footer') || !p.checkVisibility()) continue;
        const range=document.createRange();range.selectNodeContents(n);
        if([...range.getClientRects()].some(r=>r.left < -1 || r.right > innerWidth+1)) clipped.push(n.textContent.trim().slice(0,80));
      }
      return {
        headline:parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
        sectionPadding:parseFloat(getComputedStyle(document.querySelector('#s1')).paddingTop),
        sectionMinHeight:getComputedStyle(document.querySelector('#s1')).minHeight,
        clipped,
        tiny:[...document.querySelectorAll('section a,section button,section summary,footer a')].filter(n=>n.checkVisibility()).filter(n=>{const r=n.getBoundingClientRect();return r.width<44 || r.height<44;}).map(n=>n.textContent.trim()),
        overflow:document.documentElement.scrollWidth>innerWidth,
        grids:[...document.querySelectorAll('.grid2,.grid3,.hub,.artifacts')].map(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length)
      };
    })()`);
    if(width<=900){
      assert.ok(layout.headline<=64, `${width}px fixed desktop headline: ${layout.headline}px`);
      assert.ok(layout.sectionPadding<=64, `${width}px oversized section spacing`);
      assert.equal(layout.sectionMinHeight, '0px');
      assert.ok(layout.grids.every(n=>n===1), `${width}px multi-column content`);
    }
    assert.equal(layout.overflow,false,`${width}px page overflow`);
    assert.deepEqual(layout.clipped,[],`${width}px clipped text`);
    assert.deepEqual(layout.tiny,[],`${width}px small controls`);
  }
  assert.deepEqual(browser.errors,[]);
});

async function openDemo(t, width = 390, height = 844) {
  const browser = await connectBrowser();
  t.after(async () => {
    await browser.command('Emulation.setTouchEmulationEnabled', { enabled: false });
    await browser.command('Emulation.setEmulatedMedia', { features: [] });
    browser.close();
  });
  await browser.command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true });
  await browser.command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await browser.command('Page.navigate', { url: `${url}?mobile-test=${width}` });
  await browser.until(`document.readyState === 'complete' && document.querySelector('#demoIntro')?.open`);
  await browser.click('#startDemo');
  await browser.until(`!document.querySelector('#demoIntro')`);
  await browser.evaluate('document.fonts.ready.then(()=>true)');
  return browser;
}

async function tap(browser, selector) {
  const point = await browser.evaluate(`(() => {
    const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
    return {x:r.x+r.width/2,y:r.y+r.height/2};
  })()`);
  await browser.command('Emulation.setTouchEmulationEnabled', { enabled: true });
  await browser.command('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  await browser.command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test('mobile chapter menu is collapsed, touch-operable and keyboard dismissible', { timeout: 60000 }, async t => {
  const browser = await openDemo(t);
  const { evaluate, until, command } = browser;
  assert.equal(await evaluate(`!!document.querySelector('#menuToggle')`), true, 'Missing mobile menu control');
  assert.equal(await evaluate(`document.querySelector('#menuToggle').getAttribute('aria-controls')`), 'stepperNav');
  assert.equal(await evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`), 'false');
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#stepperNav')).display`), 'none');
  assert.ok(await evaluate(`document.querySelector('.stepper').offsetHeight <= 80`), 'Header consumes too much phone height');
  await tap(browser, '#menuToggle');
  await until(`document.querySelector('#menuToggle').getAttribute('aria-expanded') === 'true'`);
  assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('#stepperNav')).display`), 'none');
  assert.equal(await evaluate(`document.querySelector('.sec-next').hidden`), true);
  for (const id of ['s1', 's2', 's3', 's4', 's5', 's6', 'hero']) {
    await tap(browser, `.step[data-t="${id}"]`);
    await until(`document.querySelector('#menuToggle').getAttribute('aria-expanded') === 'false'`);
    assert.equal(await evaluate(`document.activeElement.closest('section')?.id`), id);
    if(id!=='hero'){
      await until(`document.querySelector('.sec-next').textContent !== 'Next: ' + document.getElementById('${id}').dataset.demoStop`);
    }
    await tap(browser, '#menuToggle');
    await until(`document.querySelector('#menuToggle').getAttribute('aria-expanded') === 'true'`);
  }
  await browser.key('Tab', 'Tab', 9);
  assert.equal(await evaluate(`document.activeElement.matches('#stepperNav a')`), true);
  await browser.key('Escape', 'Escape', 27);
  assert.equal(await evaluate(`document.activeElement.id`), 'menuToggle');
  assert.equal(await evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`), 'false');
  await browser.key('Tab', 'Tab', 9);
  assert.equal(await evaluate(`!!document.activeElement.closest('#stepperNav')`), false, 'Collapsed links must leave tab order');
  await evaluate(`document.querySelector('#menuToggle').focus()`);
  await browser.key('Enter', 'Enter', 13);
  assert.equal(await evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`), 'true');
  const outside = await evaluate(`(() => {
    for(let y=innerHeight-20;y>70;y-=10){
      const node=document.elementFromPoint(10,y);
      if(node && !node.closest('.stepper,button,a,[role="button"]')) return {x:10,y};
    }
    throw new Error('No unobstructed point outside the menu');
  })()`);
  assert.equal(await evaluate(`!!document.elementFromPoint(${outside.x},${outside.y}).closest('.stepper')`), false);
  await command('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [outside] });
  await command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await until(`document.querySelector('#menuToggle').getAttribute('aria-expanded') === 'false'`);
  await evaluate(`document.querySelector('#menuToggle').focus()`);
  await browser.key(' ', 'Space', 32);
  assert.equal(await evaluate(`document.querySelector('#menuToggle').getAttribute('aria-expanded')`), 'true');
  await command('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await until(`getComputedStyle(document.querySelector('#menuToggle')).display === 'none'`);
  assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('#stepperNav')).display`), 'none');
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await until(`document.querySelector('#menuToggle').getAttribute('aria-expanded') === 'false'`);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#stepperNav')).display`), 'none');
  assert.deepEqual(browser.errors, []);
});
