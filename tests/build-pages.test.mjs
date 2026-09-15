import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { Parser } from 'htmlparser2';

test('deck uses the ATD logo as its favicon', () => {
  const icons = [];
  const parser = new Parser({
    onopentag(name, attributes) {
      if (name === 'link' && attributes.rel?.split(/\s+/).includes('icon')) icons.push(attributes);
    },
  });
  parser.end(readFileSync(new URL('../leanix-bitas-2026-demo.html', import.meta.url), 'utf8'));
  assert.equal(icons.length, 1, 'The deck must declare one favicon');
  assert.equal(icons[0].href, 'assets/atd-logo.jpg');
  assert.equal(icons[0].type, 'image/jpeg');
  assert.ok(existsSync(new URL('../assets/atd-logo.jpg', import.meta.url)));
});

const script = new URL('../scripts/build-pages.mjs', import.meta.url);

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'bitas-pages-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'assets'));
  mkdirSync(join(root, 'public'));
  return root;
}

async function builder() {
  assert.ok(existsSync(script), 'Node publish-folder generator is missing');
  return (await import(script.href)).build;
}

test('publishes unchanged HTML and only referenced assets on repeated builds', async (t) => {
  const build = await builder();
  const root = fixture(t);
  const html = `<!doctype html><img src="assets/used.jpg"><img src='assets/used.jpg'>
    <video poster=assets/poster.jpg></video><a href="assets/a&amp;b.pdf">Download</a>
    <!-- <img src="assets/commented.jpg"> -->
    <script>const example = '<img src="assets/example.jpg">';</script>
    <a href="https://example.org">External</a><a href="#closing">Closing</a>`;
  writeFileSync(join(root, 'leanix-bitas-2026-demo.html'), html);
  for (const name of ['used.jpg', 'poster.jpg', 'a&b.pdf', 'unused.jpg']) {
    writeFileSync(join(root, 'assets', name), `fixture: ${name}`);
  }
  mkdirSync(join(root, 'audit'));
  writeFileSync(join(root, 'audit', 'report.md'), 'private audit fixture');
  writeFileSync(join(root, 'public', 'stale.txt'), 'stale generated file');

  for (let run = 0; run < 2; run++) {
    assert.equal(build(root), 3);
    assert.deepEqual(readdirSync(join(root, 'public')).sort(), ['assets', 'index.html']);
    assert.deepEqual(readdirSync(join(root, 'public', 'assets')).sort(), ['a&b.pdf', 'poster.jpg', 'used.jpg']);
    assert.deepEqual(readFileSync(join(root, 'public', 'index.html')), readFileSync(join(root, 'leanix-bitas-2026-demo.html')));
    for (const name of ['used.jpg', 'poster.jpg', 'a&b.pdf']) {
      assert.deepEqual(readFileSync(join(root, 'public', 'assets', name)), readFileSync(join(root, 'assets', name)));
    }
  }
});

test('rejects missing, non-file, and escaping assets before replacing output', async (t) => {
  const build = await builder();
  for (const asset of ['assets/missing.jpg', 'assets/folder', 'assets/../private.txt', 'assets/..\\private.txt', 'assets/linked/private.txt']) {
    await t.test(asset, () => {
      const root = fixture(t);
      mkdirSync(join(root, 'assets', 'folder'));
      mkdirSync(join(root, 'outside'));
      writeFileSync(join(root, 'private.txt'), 'private fixture');
      writeFileSync(join(root, 'outside', 'private.txt'), 'outside fixture');
      symlinkSync(join(root, 'outside'), join(root, 'assets', 'linked'), 'junction');
      writeFileSync(join(root, 'leanix-bitas-2026-demo.html'), `<img src="${asset}">`);
      const previous = join(root, 'public', 'index.html');
      writeFileSync(previous, 'previous build');
      assert.throws(() => build(root), /Referenced asset|outside assets/);
      assert.equal(readFileSync(previous, 'utf8'), 'previous build');
    });
  }
});
