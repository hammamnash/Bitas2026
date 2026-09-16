import assert from 'node:assert/strict';
import test from 'node:test';
import { connectBrowser } from './helpers/browser.mjs';

const url = process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('presentation navigation follows topics instead of screenfuls', { timeout: 60000 }, async t => {
  const browser = await connectBrowser();
  const { command, evaluate, until } = browser;
  t.after(async () => {
    await command('Emulation.setEmulatedMedia', { features: [] });
    browser.close();
  });
  await command('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await command('Page.navigate', { url: `${url}?presentation-nav=1` });
  await until(`document.readyState === 'complete' && document.querySelector('#demoIntro')?.open`);
  assert.equal(await evaluate(`document.querySelector('.sec-next').hidden`), true);
  await browser.click('#startDemo');
  await until(`!document.querySelector('#demoIntro')`);
  assert.equal(await evaluate(`document.querySelector('.sec-next').hidden`), false);
  assert.equal(await evaluate(`document.querySelector('.sec-next').textContent.trim()`), 'Next: EA Shift');
  await browser.click('.sec-next');
  await until(`document.querySelector('.sec-next').getAttribute('aria-disabled') !== 'true'`);
  assert.equal(await evaluate(`document.querySelector('.sec-next').textContent.trim()`), 'Next: The three core layers');

  // Starting at a chapter introduction must not skip its first topic.
  await browser.click('.step[data-t="s4"]');
  await until(`document.querySelector('.sec-next').textContent.trim() === 'Next: Fact Sheets'`);
  for (const label of ['Fact Sheets', 'Object Explorer', 'Diagrams', 'Portal', 'Dashboards & Reports', 'AI & Integration', 'Discover and structure', 'Ask and understand', 'Prompt workbench', 'Connect and extend', 'Supporting integration paths', 'Closing']) {
    assert.equal(await evaluate(`document.querySelector('.sec-next').textContent.trim()`), `Next: ${label}`);
    await browser.click('.sec-next');
    await until(`document.querySelector('.sec-next').getAttribute('aria-disabled') !== 'true'`);
    const alignment = await evaluate(`(() => {
      const stop = [...document.querySelectorAll('[data-demo-stop]')].find(n => n.dataset.demoStop === ${JSON.stringify(label)});
      const anchor = stop.matches('section') ? stop.querySelector('.sec-head') : stop;
      return {top:anchor.getBoundingClientRect().top,buttonBottom:document.querySelector('.sec-next').getBoundingClientRect().bottom};
    })()`);
    assert.ok(alignment.top >= alignment.buttonBottom - 2, `${label} hidden by navigation`);
    if (label === 'Supporting integration paths') {
      assert.equal(await evaluate(`document.querySelector('#intToggle').closest('details')`), null);
    }
  }
  await evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
  await until(`document.querySelector('.sec-next').textContent === 'Continue: Demo materials'`);
  await browser.click('.sec-next');
  await until(`document.querySelector('#materialsDialog').open`);
  await browser.key('Escape','Escape',27);
  await until(`!document.querySelector('#materialsDialog').open`);
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);

  await browser.click('.hero .capture-card img');
  assert.equal(await evaluate(`document.querySelector('.sec-next').hidden`), true);
  await browser.key('Escape', 'Escape', 27);
  assert.equal(await evaluate(`document.querySelector('.sec-next').hidden`), false);
  await until(`getComputedStyle(document.querySelector('.lightbox')).visibility === 'hidden'`);

  for (const [width,height] of [[1920,1080],[960,540],[768,1024],[390,844],[320,568]]) {
    await command('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:width<600});
    await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
    await until(`document.querySelector('.sec-next').textContent === 'Next: EA Shift'`);
    await browser.click('.sec-next');
    try {
      await until(`document.querySelector('.sec-next').textContent === 'Next: The three core layers'`);
    } catch(error) {
      console.log({width, state:await evaluate(`({y:scrollY,label:document.querySelector('.sec-next').textContent,focus:document.activeElement.className})`)});
      throw error;
    }
    await browser.click('.sec-next');
    await until(`document.querySelector('.sec-next').textContent === ${JSON.stringify('Next: ')} + (innerWidth > 900 ? 'Overview' : 'AI-EA Synergies')`);
    const box = await evaluate(`(() => {
      const b=document.querySelector('.sec-next'), r=b.getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,height:r.height,display:getComputedStyle(b).display,animation:getComputedStyle(b).animationName,overflow:document.documentElement.scrollWidth>innerWidth};
    })()`);
    assert.notEqual(box.display, 'none');
    assert.equal(box.animation, 'none');
    assert.equal(box.overflow, false, `${width}px overflow`);
    assert.ok(box.left >= 0 && box.right <= width && box.top >= 0 && box.bottom <= height && box.height >= 44);
    // Manually scrolling back must recompute the destination, not retain a stale index.
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
    await until(`document.querySelector('.sec-next').textContent === 'Next: EA Shift'`);
  }
  await evaluate(`document.querySelector('.sec-next').focus()`);
  await browser.key('Tab','Tab',9,8);
  await browser.key('Tab','Tab',9);
  assert.equal(await evaluate(`document.activeElement.matches('.sec-next')`), true);
  assert.equal(await evaluate(`getComputedStyle(document.activeElement).outlineWidth`), '3px');
  // Shift+Tab visits the preceding footer link and scrolls it into view.
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
  await until(`document.querySelector('.sec-next').textContent === 'Next: EA Shift'`);
  await browser.key('Enter','Enter',13);
  await until(`document.querySelector('.sec-next').textContent === 'Next: The three core layers'`);
  await browser.key(' ','Space',32);
  await until(`document.querySelector('.sec-next').textContent === 'Next: AI-EA Synergies'`);

  // Real smooth scrolling must ignore a second click until the first landing settles.
  await command('Emulation.setDeviceMetricsOverride', {width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
  await until(`document.querySelector('.sec-next').textContent === 'Next: EA Shift'`);
  await command('Emulation.setEmulatedMedia', {features:[]});
  await browser.click('.sec-next');
  assert.equal(await evaluate(`document.querySelector('.sec-next').getAttribute('aria-disabled')`), 'true');
  await browser.click('.sec-next');
  await until(`document.querySelector('.sec-next').getAttribute('aria-disabled') !== 'true'`);
  assert.equal(await evaluate(`document.querySelector('.sec-next').textContent`), 'Next: The three core layers');
  await command('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await command('Emulation.setScriptExecutionDisabled', {value:true});
  try {
    await command('Page.navigate', {url:`${url}?nav-noscript=1`});
    await until(`location.search === '?nav-noscript=1' && document.readyState === 'complete'`);
    assert.equal(await evaluate(`document.querySelector('.sec-next')`), null);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.stepper')).display !== 'none'`), true);
  } finally {
    await command('Emulation.setScriptExecutionDisabled', {value:false});
  }
  assert.deepEqual(browser.errors, []);
});
