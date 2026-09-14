import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Parser } from 'htmlparser2';

export function build(root) {
  const source = join(root, 'leanix-bitas-2026-demo.html');
  const assets = new Set();
  const parser = new Parser({
    onopentag(_name, attributes) {
      for (const name of ['src', 'href', 'poster']) {
        const value = attributes[name];
        if (value?.startsWith('assets/')) assets.add(value);
      }
    },
  });
  parser.end(readFileSync(source, 'utf8'));

  for (const asset of assets) {
    const path = join(root, asset);
    if (asset.includes('\\') || asset.split('/').includes('..')) {
      throw new Error(`Asset is outside assets/: ${asset}`);
    }
    if (!existsSync(path) || !statSync(path).isFile()) {
      throw new Error(`Referenced asset is missing or not a file: ${asset}`);
    }
    const resolved = relative(realpathSync(join(root, 'assets')), realpathSync(path));
    if (resolved === '..' || resolved.startsWith(`..${sep}`) || isAbsolute(resolved)) {
      throw new Error(`Asset is outside assets/: ${asset}`);
    }
  }

  const output = join(root, 'public');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output);
  copyFileSync(source, join(output, 'index.html'));
  for (const asset of [...assets].sort()) {
    const target = join(output, asset);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(root, asset), target);
  }
  return assets.size;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const count = build(fileURLToPath(new URL('../', import.meta.url)));
  console.log(`Built public/index.html and ${count} referenced assets.`);
}
