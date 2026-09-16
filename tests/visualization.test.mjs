import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { Parser } from 'htmlparser2';

function visualization() {
  const result = { headings: [], images: [], placeholders: [], captions: [] };
  let active = false;
  let heading = null;
  let caption = null;
  let placeholder = null;
  let placeholderDepth = 0;
  const parser = new Parser({
    onopentag(name, attrs) {
      if (name === 'section') active = attrs.id === 's4';
      if (!active) return;
      if (name === 'h3') heading = '';
      if (name === 'figcaption') caption = '';
      if (name === 'img') result.images.push(attrs);
      if (placeholder && name === 'div') placeholderDepth++;
      if (attrs['data-image']) {
        placeholder = { path: attrs['data-image'], text: '' };
        placeholderDepth = 1;
      }
    },
    ontext(text) {
      if (!active) return;
      if (heading !== null) heading += text;
      if (caption !== null) caption += text;
      if (placeholder) placeholder.text += text;
    },
    onclosetag(name) {
      if (!active) return;
      if (name === 'h3') { result.headings.push(heading.trim()); heading = null; }
      if (name === 'figcaption') { result.captions.push(caption.trim()); caption = null; }
      if (placeholder && name === 'div' && --placeholderDepth === 0) {
        result.placeholders.push(placeholder);
        placeholder = null;
      }
      if (name === 'section') active = false;
    },
  });
  parser.end(readFileSync(new URL('../leanix-bitas-2026-demo.html', import.meta.url), 'utf8'));
  return result;
}

test('Visualization displays all nine supplied screenshots without capture placeholders', () => {
  const section = visualization();
  assert.deepEqual(section.headings, ['Fact Sheets', 'Object Explorer', 'Diagrams', 'Portal', 'Dashboards & Reports']);
  assert.deepEqual(section.placeholders, []);
  assert.deepEqual(section.images.map(img => img.src).sort(), [
    'assets/fact-sheet-detail.jpg', 'assets/fact-sheet-changes.jpg', 'assets/reports.jpg',
    'assets/diagram.jpg', 'assets/diagram-history.jpg', 'assets/portal.jpg',
    'assets/dashboard.jpg', 'assets/eol-dashboard.jpg', 'assets/object-explore.jpg',
  ].sort());
  for (const image of section.images) {
    assert.ok(image.alt?.trim());
    assert.ok(existsSync(new URL(`../${image.src}`, import.meta.url)), image.src);
  }
  assert.equal(section.captions.length, 9);
  assert.ok(section.captions.some(text => text.includes('Technology Lifecycle report')));
});
