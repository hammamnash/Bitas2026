import assert from 'node:assert/strict';
import test from 'node:test';
import { connectBrowser } from './helpers/browser.mjs';

const url = process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('integration paths stay visible and prompt examples are opt-in', async t => {
  const browser = await connectBrowser();
  const { command, evaluate, until } = browser;
  t.after(async () => {
    await command('Emulation.setEmulatedMedia', { features: [] });
    browser.close();
  });
  await command('Emulation.setDeviceMetricsOverride', { width:1920,height:1080,deviceScaleFactor:1,mobile:false });
  await command('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] });
  await command('Page.navigate', { url: `${url}?materials-test=1` });
  await until(`document.readyState === 'complete' && document.querySelector('#demoIntro')?.open`);
  await browser.click('#startDemo');
  await until(`!document.querySelector('#demoIntro')`);
  assert.equal(await evaluate(`document.querySelector('#intToggle').closest('details')`), null);
  assert.equal(await evaluate(`document.querySelector('#intToggle').checkVisibility()`), true);
  for (const panel of ['panelRest','panelExcel','panelOotb']) {
    await browser.click(`[data-panel="${panel}"]`);
    assert.equal(await evaluate(`document.querySelector('#${panel}').hidden`), false);
  }
  assert.equal(await evaluate(`document.querySelector('#promptExamples')?.open`), false);
  assert.equal(await evaluate(`document.querySelector('#demoPrompt').checkVisibility()`), false);
  await browser.click('#promptExamples summary');
  assert.equal(await evaluate(`document.querySelector('#promptExamples').open`), true);
  await browser.click('[data-prompt="governance"]');
  await browser.click('#copyPrompt');
  await until(`document.querySelector('#copyState').textContent.startsWith('Copied.')`);
  await browser.click('#promptExamples summary');
  assert.equal(await evaluate(`document.querySelector('#promptExamples').open`), false);
  await evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
  await until(`scrollY + innerHeight >= document.documentElement.scrollHeight - 2`);
  await browser.click('.sec-next');
  assert.equal(await evaluate(`document.querySelector('#materialsDialog')?.open`), true);
  assert.equal(await evaluate(`document.querySelector('.sec-next').hidden`), true);
  assert.equal(await evaluate(`document.querySelector('#materialsDialog img').getAttribute('src')`), 'assets/demoresource.png');
  assert.equal(await evaluate(`document.querySelector('#materialsDialog a').href`), 'https://bitas.hammamnash.site/');
  assert.equal(await evaluate(`document.querySelector('#materialsDialog img').naturalWidth`), 148);
  const endY = await evaluate('scrollY');
  for(let i=0;i<5;i++) {
    await browser.key('Tab','Tab',9);
    assert.equal(await evaluate(`!!document.activeElement.closest('#materialsDialog')`), true);
  }
  await browser.key('Escape','Escape',27);
  await until(`!document.querySelector('#materialsDialog').open`);
  assert.equal(await evaluate('scrollY'), endY);
  await until(`document.activeElement.matches('.sec-next')`);
  await browser.click('.sec-next');
  await browser.click('#closeMaterials');
  await until(`!document.querySelector('#materialsDialog').open`);
  await until(`!document.querySelector('.sec-next').hidden`);
  for (const [width,height] of [[1920,1080],[960,540],[768,1024],[390,844],[320,568]]) {
    await command('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:width<600});
    await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
    await evaluate(`window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);
    await until(`document.querySelector('.sec-next').textContent === 'Continue: Demo materials'`);
    await browser.click('.sec-next');
    await until(`document.querySelector('#materialsDialog').open`);
    const layout = await evaluate(`(() => {
      const d=document.querySelector('#materialsDialog'),q=d.querySelector('img'),r=q.getBoundingClientRect();
      return {overflow:d.scrollWidth>d.clientWidth,width:d.getBoundingClientRect().width,height:d.getBoundingClientRect().height,qrWidth:r.width,qrHeight:r.height,qrLeft:r.left,qrRight:r.right,rendering:getComputedStyle(q).imageRendering};
    })()`);
    assert.equal(layout.overflow,false,`${width}px modal overflow`);
    assert.equal(layout.width,width);
    assert.equal(layout.height,height);
    assert.equal(layout.qrWidth,layout.qrHeight);
    assert.ok(layout.qrLeft>=0 && layout.qrRight<=width);
    assert.equal(layout.rendering,'pixelated');
    await browser.key('Tab','Tab',9,8);
    assert.equal(await evaluate(`document.activeElement.matches('#materialsDialog a')`),true);
    await browser.key('Tab','Tab',9);
    assert.equal(await evaluate(`document.activeElement.id`),'closeMaterials');
    await browser.click('#closeMaterials');
    await until(`!document.querySelector('#materialsDialog').open`);
  }
  await command('Page.reload');
  await until(`document.readyState === 'complete' && document.querySelector('#demoIntro')?.open`);
  assert.equal(await evaluate(`document.querySelector('#promptExamples').open`),false);
  assert.equal(await evaluate(`document.querySelector('#materialsDialog').open`),false);
  assert.deepEqual(browser.errors, []);
});
