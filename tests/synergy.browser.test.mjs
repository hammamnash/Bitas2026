import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {connectBrowser} from './helpers/browser.mjs';
const url=process.env.DEMO_URL || 'http://127.0.0.1:8123/';

test('EA Shift presents reciprocal AI-EA synergy beside the core layers', {timeout:60000}, async t=>{
  const b=await connectBrowser();
  t.after(async()=>{await b.command('Emulation.setEmulatedMedia',{features:[]});b.close();});
  await b.command('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await b.command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.command('Page.navigate',{url:`${url}?synergy-test=1`});
  await b.until(`document.readyState==='complete' && document.querySelector('#demoIntro')?.open`);
  await b.click('#startDemo');
  await b.until(`!document.querySelector('#demoIntro')`);
  assert.equal(await b.evaluate(`!!document.querySelector('#aiEaSynergies')`),true,'Missing AI-EA Synergies subsection');
  const content=await b.evaluate(`(() => {
    const panel=document.querySelector('#aiEaSynergies');
    return {title:panel.querySelector('h3').textContent,heading:panel.querySelector('h3').dataset.demoStop,
      terms:[...panel.querySelectorAll('dt')].map(n=>n.textContent),text:panel.textContent,
      layers:panel.previousElementSibling.querySelector('[data-demo-stop]').textContent,
      old:document.querySelector('#s1').textContent.includes('EA = (Solution Architect'),
      image:document.querySelector('.synergy-illustration img')?.getAttribute('src')};
  })()`);
  assert.equal(content.title,'AI-EA Synergies');
  assert.equal(content.heading,'AI-EA Synergies');
  assert.equal(content.layers,'The three core layers');
  assert.equal(content.old,false);
  assert.deepEqual(content.terms,['EA → AI: Enterprise context','AI → EA: Faster architecture work']);
  assert.match(content.text,/human validation/i);
  assert.equal(content.image,'assets/ai-ea-teamwork.png');
  const placement=await b.evaluate(`(() => {
    const panel=document.querySelector('#aiEaSynergies'),layers=panel.previousElementSibling;
    return {
      robotsUnderExplanation:panel.querySelector('.synergy-foundation + .synergy-illustration img')?.getAttribute('src'),
      landscapeUnderLayers:layers.querySelector('.features + .capture-card img')?.getAttribute('src'),
      landscapeCount:document.querySelectorAll('#s1 img[src="assets/AbbSbb.png"]').length
    };
  })()`);
  assert.equal(placement.robotsUnderExplanation,'assets/ai-ea-teamwork.png','Robots must follow the synergy explanation in the same column');
  assert.equal(placement.landscapeUnderLayers,'assets/AbbSbb.png','Landscape must follow the core layers in the same column');
  assert.equal(placement.landscapeCount,1);
  const response=await fetch(`${url}${content.image}`);
  assert.equal(response.status,200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(new URL(`../${content.image}`,import.meta.url)));
  const folder=new URL('../audit/2026-09-16/',import.meta.url);
  await mkdir(folder,{recursive:true});
  for(const [width,height] of [[1920,1080],[960,540],[900,900],[768,1024],[390,844],[320,568]]){
    await b.command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    await b.evaluate(`document.fonts.ready.then(()=>true)`);
    await b.evaluate(`new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
    await b.evaluate(`window.scrollTo({top:stopPosition(document.querySelector('[data-demo-stop="The three core layers"]')),behavior:'instant'})`);
    await b.until(`document.querySelector('.synergy-illustration img').complete && document.querySelector('.synergy-illustration img').naturalWidth>0`);
    const layout=await b.evaluate(`(() => {
      const panel=document.querySelector('#aiEaSynergies'),previous=panel.previousElementSibling;
      const r=panel.getBoundingClientRect(),p=previous.getBoundingClientRect(),img=document.querySelector('.synergy-illustration img'),ir=img.getBoundingClientRect();
      return {left:r.left,top:r.top,prevRight:p.right,prevBottom:p.bottom,prevTop:p.top,overflow:document.documentElement.scrollWidth>innerWidth,
        robotTop:ir.top,explanationBottom:panel.querySelector('.synergy-foundation').getBoundingClientRect().bottom,
        landscapeTop:previous.querySelector('.capture-card').getBoundingClientRect().top,layersBottom:previous.querySelector('.features').getBoundingClientRect().bottom,
        clipped:[...panel.querySelectorAll('h3,p,dt,dd'),img].filter(n=>{const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).length,
        imageHeight:ir.height,imageWidth:ir.width,imageRatio:img.naturalWidth/img.naturalHeight,
        imageRole:img.getAttribute('role'),caption:document.querySelector('.synergy-illustration figcaption').textContent};
    })()`);
    assert.equal(layout.overflow,false,`${width}px overflow`);
    assert.equal(layout.clipped,0,`${width}px clipped content`);
    assert.ok(layout.robotTop>=layout.explanationBottom,`${width}px robots must be below explanation`);
    assert.ok(layout.landscapeTop>=layout.layersBottom,`${width}px landscape must be below core layers`);
    assert.equal(layout.imageRole,null,'Illustration must not be included as a LeanIX capture');
    assert.ok(Math.abs(layout.imageWidth/layout.imageHeight-layout.imageRatio)<.02,'Illustration distorted');
    if(width>900){
      assert.ok(layout.left>=layout.prevRight,`${width}px synergy must be beside layers`);
      assert.ok(Math.abs(layout.top-layout.prevTop)<2,'Columns should start together');
      await b.until(`document.querySelector('.sec-next').textContent==='Next: Overview'`);
    }else{
      assert.ok(layout.top>=layout.prevBottom,`${width}px synergy must stack below layers`);
      await b.until(`document.querySelector('.sec-next').textContent==='Next: AI-EA Synergies'`);
      await b.click('.sec-next');
      await b.until(`document.querySelector('.sec-next').textContent==='Next: Overview'`);
    }
    if(width===1920||width===390){
      const shot=await b.command('Page.captureScreenshot',{format:'png'});
      await writeFile(new URL(`synergy-${width}.png`,folder),Buffer.from(shot.data,'base64'));
    }
  }
  assert.deepEqual(b.errors,[]);
});
