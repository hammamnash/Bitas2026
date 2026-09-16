import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Parser } from 'htmlparser2';

export function build(root) {
  const pages = [
    ['leanix-bitas-2026-demo.html', 'index.html'],
    ['generated/salesforce-experience-cloud-impact-brief.html', 'salesforce-experience-cloud-impact-brief.html'],
  ];
  const assets = new Set();
  for (const [source] of pages) {
    const path = join(root, source);
    if (!existsSync(path) || !statSync(path).isFile()) {
      throw new Error(`Published page is missing or not a file: ${source}`);
    }
    if (realpathSync(path) !== join(realpathSync(root), source)) {
      throw new Error(`Published page must not redirect through a symlink: ${source}`);
    }
    const parser = new Parser({
      onopentag(_name, attributes) {
        for (const name of ['src', 'href', 'poster']) {
          const value = attributes[name];
          if (value?.startsWith('assets/')) assets.add(value);
        }
      },
    });
    parser.end(readFileSync(join(root, source), 'utf8'));
  }

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
  for (const [source, destination] of pages) {
    copyFileSync(join(root, source), join(output, destination));
  }
  for (const asset of [...assets].sort()) {
    const target = join(output, asset);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(root, asset), target);
  }
  return assets.size;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const count = build(fileURLToPath(new URL('../', import.meta.url)));
  console.log(`Built the demo and Salesforce impact brief in public/ with ${count} referenced assets.`);
}
