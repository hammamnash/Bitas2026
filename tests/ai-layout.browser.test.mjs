import assert from 'node:assert/strict';
import test from 'node:test';
import { connectBrowser } from './helpers/browser.mjs';

const url = process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('AI jobs show their screenshots alongside the explanation', { timeout: 60000 }, async t => {
  const browser = await connectBrowser();
  const { command, evaluate, until } = browser;
  t.after(async () => {
    await command('Emulation.setEmulatedMedia', { features: [] });
    browser.close();
  });
  await command('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await command('Page.navigate', { url: `${url}?ai-layout-test=1` });
  await until(`document.readyState === 'complete' && document.querySelector('#demoIntro')?.open`);
  await browser.click('#startDemo');
  await until(`!document.querySelector('#demoIntro')`);

  const jobs = await evaluate(`[...document.querySelectorAll('#s5 .ai-job')].map(job => ({
    title:job.querySelector('h3').textContent,
    image:job.querySelector('.capture-card img').getAttribute('src'),
    hiddenInDetails:!!job.querySelector('.capture-card img').closest('details'),
    caption:!!job.querySelector('figcaption')?.textContent.trim()
  }))`);
  assert.deepEqual(jobs, [
    ['Discover and structure', 'inventory-builder.jpg'],
    ['Ask and understand', 'ai-prompt.jpg'],
    ['Connect and extend', 'mcp-agent.jpg'],
  ].map(([title, file]) => ({ title, image: `assets/${file}`, hiddenInDetails: false, caption: true })));
  assert.equal(await evaluate(`document.querySelector('#demoPrompt').closest('.ai-job').id`), 'ai-ask');
  assert.equal(await evaluate(`document.querySelector('.proof-flow').closest('.ai-job').id`), 'ai-connect');
  assert.equal(await evaluate(`document.querySelector('.proof-flow').closest('details').open`), false);
  assert.equal(await evaluate(`document.querySelector('#s5').textContent.includes('Fallback screenshots')`), false);
  assert.equal(await evaluate(`document.querySelectorAll('#s5 .ai-gallery').length`), 0);
  assert.equal(await evaluate(`document.querySelector('#s5').classList.contains('alt')`), true);
  await browser.click('.step[data-t="s5"]');
  await until(`document.querySelector('.step.active')?.dataset.t === 's5'`);
  for (const id of ['ai-discover', 'ai-ask', 'ai-connect']) {
    await browser.click(`#${id} img`);
    assert.equal(await evaluate(`document.querySelector('.lightbox').classList.contains('open')`), true);
    assert.equal(await evaluate(`document.querySelector('.lb-img').src === document.querySelector('#${id} img').src`), true);
    await browser.key('Escape', 'Escape', 27);
    await until(`getComputedStyle(document.querySelector('.lightbox')).visibility === 'hidden'`);
  }
  await browser.click('#promptExamples summary');
  const prompts = [];
  for (const key of ['decision', 'governance', 'briefing']) {
    await browser.click(`[data-prompt="${key}"]`);
    assert.equal(await evaluate(`document.querySelector('.prompt-chip.active').dataset.prompt`), key);
    prompts.push(await evaluate(`document.querySelector('#demoPrompt').value`));
  }
  assert.equal(new Set(prompts).size, 3);
  assert.ok(prompts.every(text => text.length > 100));
  await browser.click('#copyPrompt');
  await until(`document.querySelector('#copyState').textContent.startsWith('Copied.')`);
  await browser.click('#ai-connect summary');
  assert.equal(await evaluate(`document.querySelector('#ai-connect details').open`), true);
  await evaluate(`document.querySelector('#ai-connect summary').focus()`);
  await browser.key('Tab', 'Tab', 9);
  await browser.key('Tab', 'Tab', 9, 8);
  assert.equal(await evaluate(`document.activeElement.matches('#ai-connect summary')`), true);
  assert.equal(await evaluate(`getComputedStyle(document.activeElement).outlineWidth`), '3px');
  await browser.key('Enter', 'Enter', 13);
  assert.equal(await evaluate(`document.querySelector('#ai-connect details').open`), false);
  assert.equal(await evaluate(`document.querySelector('#intToggle').closest('details')`), null);
  for (const panel of ['panelRest', 'panelExcel', 'panelOotb']) {
    await browser.click(`[data-panel="${panel}"]`);
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('#s5 .integration-panel:not([hidden])')].map(n => n.id)`), [panel]);
    assert.equal(await evaluate(`document.querySelector('#${panel} img').naturalWidth > 0`), true);
  }
  for (const [width,height] of [[1920,1080],[960,540],[768,1024],[390,844],[320,568]]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    const layout = await evaluate(`(() => {
      const section = document.querySelector('#s5');
      return {
        overflow:document.documentElement.scrollWidth > innerWidth,
        columns:[...section.querySelectorAll('.ai-job-layout')].map(n => getComputedStyle(n).gridTemplateColumns.split(' ').length),
        clipped:[...section.querySelectorAll('.ai-job h3,.ai-job p,.ai-job figure,.prompt-box')].filter(n => {const r=n.getBoundingClientRect();return r.left < 0 || r.right > innerWidth+1;}).length,
        tinyTargets:[...section.querySelectorAll('button')].filter(n => n.getClientRects().length).filter(n => {const r=n.getBoundingClientRect();return r.width < 44 || r.height < 44;}).length,
        broken:[...section.querySelectorAll('img')].filter(n => !n.complete || !n.naturalWidth).length
      };
    })()`);
    assert.equal(layout.overflow, false, `${width}px overflow`);
    assert.deepEqual(layout.columns, Array(3).fill(width > 900 ? 2 : 1));
    assert.equal(layout.clipped, 0, `${width}px clipped content`);
    assert.equal(layout.tinyTargets, 0, `${width}px small targets`);
    assert.equal(layout.broken, 0);
  }
  assert.deepEqual(browser.errors, []);
});
