import assert from 'node:assert/strict';
import test from 'node:test';
import { connectBrowser } from './helpers/browser.mjs';

const url = process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('opening cover', { timeout: 60000 }, async t => {
  const browser = await connectBrowser();
  const { command, evaluate, until } = browser;
  t.after(browser.close);
  await command('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url });
  await until(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`);

  await t.test('opens a full-screen modal with the title and all three sponsor logos', async () => {
    const state = await evaluate(`(() => {
      const intro = document.querySelector('#demoIntro');
      if (!intro) return null;
      const rect = intro.getBoundingClientRect();
      return {
        modal: intro.matches(':modal'),
        title: document.querySelector('#introTitle').textContent.replace(/\\s+/g, ' ').trim(),
        size: [rect.x, rect.y, rect.width, rect.height],
        images: [...intro.querySelectorAll('img')].map(img => ({src:img.getAttribute('src'), loaded:img.complete && img.naturalWidth > 0})),
        focus: document.activeElement.id,
        overflow: getComputedStyle(document.documentElement).overflowY,
        heroAnimation: getComputedStyle(document.querySelector('.hero .display')).animationPlayState
      };
    })()`);
    assert.ok(state, 'Opening cover is missing');
    assert.equal(state.modal, true);
    assert.equal(state.title, 'SAP LeanIX: AI Powered EA Tools Demo');
    assert.deepEqual(state.size, [0, 0, 1920, 1080]);
    assert.deepEqual(state.images, ['iasa.png', 'atd-logo.jpg', 'sap-logo.jpg'].map(name => ({src:`assets/${name}`,loaded:true})));
    assert.equal(state.focus, 'startDemo');
    assert.equal(state.overflow, 'hidden');
    assert.equal(state.heroAnimation, 'paused');
  });

  await t.test('Start Demo fades and slides the cover away, then focuses the unchanged hero', async () => {
    await browser.click('#startDemo');
    const motion = await evaluate(`document.querySelector('#demoIntro').getAnimations().map(animation => ({
      duration:animation.effect.getTiming().duration,
      frames:animation.effect.getKeyframes().map(frame => ({opacity:frame.opacity,transform:frame.transform}))
    }))`);
    assert.equal(motion.length, 1, 'Start Demo must animate the cover');
    assert.equal(motion[0].duration, 550);
    assert.deepEqual(motion[0].frames, [
      { opacity: '1', transform: 'translateY(0px)' },
      { opacity: '0', transform: 'translateY(-48px)' }
    ]);
    await until(`!document.querySelector('#demoIntro')`);
    assert.equal(await evaluate(`document.documentElement.classList.contains('intro-open')`), false);
    assert.equal(await evaluate(`document.activeElement.matches('#hero h1')`), true);
    assert.equal(await evaluate('scrollY'), 0);
    assert.equal(await evaluate('location.href'), url);
    assert.equal(await evaluate(`document.querySelector('#hero h1').textContent`), 'From architecture datato AI-assisted decisions.');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hero .display')).animationPlayState`), 'running');
  });

  await t.test('refresh restores the cover and Escape uses the same clean dismissal', async () => {
    await command('Page.reload', { ignoreCache: true });
    await until(`document.querySelector('#demoIntro')?.matches(':modal') && document.readyState === 'complete'`);
    await browser.key('Escape', 'Escape', 27);
    await until(`!document.querySelector('#demoIntro')`);
    assert.equal(await evaluate(`document.documentElement.classList.contains('intro-open')`), false);
    assert.equal(await evaluate(`document.activeElement.matches('#hero h1')`), true);
  });

  await t.test('modal blocks background scrolling and focus, while keyboard activation works', async () => {
    await command('Page.reload', { ignoreCache: true });
    await until(`document.querySelector('#demoIntro')?.matches(':modal') && document.readyState === 'complete'`);
    await evaluate(`document.querySelector('.hero .pill-btn').focus()`);
    assert.equal(await evaluate('document.activeElement.id'), 'startDemo');
    for (const modifiers of [0, 0, 8, 8]) {
      await browser.key('Tab', 'Tab', 9, modifiers);
      assert.equal(await evaluate(`document.activeElement === document.body || document.querySelector('#demoIntro').contains(document.activeElement)`), true);
    }
    const y = await evaluate('scrollY');
    await command('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 20, y: 20, deltaX: 0, deltaY: 600 });
    await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
    assert.equal(await evaluate('scrollY'), y);
    await evaluate(`document.querySelector('#startDemo').focus()`);
    const ring = await evaluate(`getComputedStyle(document.querySelector('#startDemo')).outlineWidth`);
    assert.equal(ring, '3px');
    await browser.key('Enter', 'Enter', 13);
    await until(`!document.querySelector('#demoIntro')`);
    await browser.click('.hero .pill-btn');
    await until(`document.querySelector('.step.active')?.dataset.t === 's1'`);
  });

  await t.test('cover reflows without clipping or horizontal overflow', async () => {
    await command('Page.reload', { ignoreCache: true });
    await until(`document.querySelector('#demoIntro')?.matches(':modal') && document.readyState === 'complete'`);
    for (const [width, height] of [[1920,1080], [1366,768], [768,1024], [390,844], [320,568], [844,390], [640,360]]) {
      await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
      const layout = await evaluate(`(() => {
        const intro = document.querySelector('#demoIntro');
        intro.scrollTop = 0;
        const rect = intro.getBoundingClientRect();
        const children = [...intro.querySelectorAll('h2,p,img,button')].map(node => {
          const box = node.getBoundingClientRect();
          return {left:box.left,right:box.right,top:box.top};
        });
        const button = document.querySelector('#startDemo');
        button.scrollIntoView({behavior:'instant',block:'nearest'});
        const box = button.getBoundingClientRect();
        return {size:[rect.width,rect.height],overflow:intro.scrollWidth > intro.clientWidth,
          children,buttonVisible:box.top >= 0 && box.bottom <= innerHeight,
          target:[box.width,box.height]};
      })()`);
      assert.deepEqual(layout.size, [width,height]);
      assert.equal(layout.overflow, false, `${width}px horizontal overflow`);
      assert.ok(layout.children.every(box => box.left >= 0 && box.right <= width && box.top >= 0), `${width}px clipped content`);
      assert.equal(layout.buttonVisible, true, `${width}px start button unreachable`);
      assert.ok(layout.target.every(size => size >= 44));
    }
  });

  await t.test('reduced motion skips the exit animation and Space starts the demo', async () => {
    await command('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'reduce'}] });
    await command('Page.reload', { ignoreCache: true });
    await until(`document.querySelector('#demoIntro')?.matches(':modal') && document.readyState === 'complete'`);
    await browser.key(' ', 'Space', 32);
    assert.equal(await evaluate(`document.querySelector('#demoIntro') === null`), true);
    assert.equal(await evaluate(`document.activeElement.matches('#hero h1')`), true);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hero .display')).animationName`), 'none');
    await command('Emulation.setEmulatedMedia', { features: [] });
  });

  await t.test('repeated clicks and a deep-link load still reveal the hero safely', async () => {
    await command('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await command('Page.navigate', { url: `${url}#s5` });
    await command('Page.reload', { ignoreCache: true });
    await until(`document.querySelector('#demoIntro')?.matches(':modal') && document.readyState === 'complete'`);
    await evaluate(`document.querySelector('#startDemo').click();document.querySelector('#startDemo').click()`);
    assert.equal(await evaluate(`document.querySelector('#demoIntro').getAnimations().length`), 1);
    await until(`!document.querySelector('#demoIntro')`);
    assert.equal(await evaluate('scrollY'), 0);
    await browser.click('.hero .capture-card img');
    assert.equal(await evaluate(`document.querySelector('.lightbox').classList.contains('open')`), true);
    await browser.key('Escape', 'Escape', 27);
    assert.equal(await evaluate(`document.querySelector('.lightbox').classList.contains('open')`), false);
    await until(`getComputedStyle(document.querySelector('.lightbox')).visibility === 'hidden'`);
    await browser.click('#s5 > .wrap > details > summary');
    await until(`document.querySelector('#intToggle').closest('details').open`);
    await browser.click('[data-panel="panelRest"]');
    assert.equal(await evaluate(`document.querySelector('#panelRest').hidden`), false);
  });

  await t.test('without JavaScript the original deck remains accessible', async () => {
    await command('Emulation.setScriptExecutionDisabled', { value: true });
    try {
      const noScriptUrl = `${url}?no-script=1`;
      await command('Page.navigate', { url: noScriptUrl });
      await until(`document.readyState === 'complete' && location.href === ${JSON.stringify(noScriptUrl)}`);
      assert.equal(await evaluate(`document.querySelector('#demoIntro').open`), false);
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('#demoIntro')).display`), 'none');
      assert.equal(await evaluate(`getComputedStyle(document.documentElement).overflowY`), 'visible');
    } finally {
      await command('Emulation.setScriptExecutionDisabled', { value: false });
    }
  });

  assert.deepEqual(browser.errors, [], 'No runtime exceptions');
});
