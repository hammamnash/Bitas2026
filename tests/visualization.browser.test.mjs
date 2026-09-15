import assert from 'node:assert/strict';
import test from 'node:test';
import { connectBrowser } from './helpers/browser.mjs';

const url = process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('Visualization screenshots, layout, and retained interactions', { timeout: 60000 }, async t => {
  const browser = await connectBrowser();
  const { command, evaluate, until } = browser;
  t.after(async () => {
    await command('Emulation.setEmulatedMedia', { features:[] });
    browser.close();
  });
  await command('Emulation.setDeviceMetricsOverride', { width:1920,height:1080,deviceScaleFactor:1,mobile:false });
  await command('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] });
  await command('Page.navigate', { url:`${url}?visualization-test=1` });
  await until(`document.readyState === 'complete' && document.querySelector('#demoIntro')?.open`);
  await browser.click('#startDemo');
  await until(`!document.querySelector('#demoIntro')`);
  await browser.click('.step[data-t="s4"]');
  await until(`document.querySelector('.step.active')?.dataset.t === 's4'`);
  const content = await evaluate(`({
    headings:[...document.querySelectorAll('#s4 h3')].map(n=>n.textContent),
    slots:[...document.querySelectorAll('#s4 [data-image]')].map(n=>n.dataset.image),
    broken:[...document.querySelectorAll('#s4 img')].filter(n=>!n.complete || !n.naturalWidth).map(n=>n.src)
  })`);
  assert.deepEqual(content.headings,['Fact Sheets','Diagrams','Portal','Dashboards & Reports']);
  assert.deepEqual(content.slots,[]);
  assert.deepEqual(content.broken,[]);

  await browser.click('#s4 .viz-report-example summary');
  assert.equal(await evaluate(`document.querySelector('#s4 .viz-report-example').open`),true);
  for (const file of ['fact-sheet-detail.jpg','fact-sheet-changes.jpg','reports.jpg','diagram.jpg','diagram-history.jpg','portal.jpg','dashboard.jpg','eol-dashboard.jpg']) {
    await browser.click(`#s4 img[src="assets/${file}"]`);
    assert.equal(await evaluate(`document.querySelector('.lightbox').classList.contains('open')`),true);
    assert.ok((await evaluate(`document.querySelector('.lb-img').src`)).endsWith(`/${file}`));
    await browser.key('Escape','Escape',27);
    await until(`getComputedStyle(document.querySelector('.lightbox')).visibility === 'hidden'`);
  }
  await evaluate(`document.querySelector('#s4 .viz-report-example summary').focus()`);
  await browser.key('Enter','Enter',13);
  assert.equal(await evaluate(`document.querySelector('#s4 .viz-report-example').open`),false);
  await browser.click('#s4 > .wrap > details > summary');
  assert.equal(await evaluate(`document.querySelector('#s4 > .wrap > details').open`),true);

  for (const [width,height] of [[1920,1080],[768,1024],[390,844],[320,568],[640,360]]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    const layout = await evaluate(`(() => {
      const section=document.querySelector('#s4');
      section.scrollIntoView({behavior:'instant'});
      return {
        overflow:document.documentElement.scrollWidth>innerWidth,
        clipped:[...section.querySelectorAll('img,h3,figcaption')].filter(n=>n.getClientRects().length).filter(n=>{const r=n.getBoundingClientRect();return r.left<0 || r.right>innerWidth+1}).length,
        fontSizes:[...section.querySelectorAll('figcaption')].map(n=>parseFloat(getComputedStyle(n).fontSize)),
        columns:getComputedStyle(section.querySelector('.viz-group .grid2')).gridTemplateColumns.split(' ').length
      };
    })()`);
    assert.equal(layout.overflow,false,`${width}px horizontal overflow`);
    assert.equal(layout.clipped,0,`${width}px clipped content`);
    assert.ok(layout.fontSizes.every(size=>size>=20));
    assert.equal(layout.columns,width>900?2:1);
  }
  assert.deepEqual(browser.errors,[]);
});
