from html.parser import HTMLParser
from pathlib import Path
import shutil


class AssetReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ('src', 'href', 'poster') and value and value.startswith('assets/'):
                self.paths.add(value)


def build(root):
    root = Path(root)
    source = root / 'leanix-bitas-2026-demo.html'
    references = AssetReferences()
    references.feed(source.read_text(encoding='utf-8'))
    for asset in references.paths:
        asset_path = root / asset
        if '..' in Path(asset).parts or not asset_path.resolve().is_relative_to((root / 'assets').resolve()):
            raise ValueError(f'Asset is outside assets/: {asset}')
        if not asset_path.is_file():
            raise FileNotFoundError(f'Referenced asset is missing: {asset}')
    output = root / 'public'
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    shutil.copy2(source, output / 'index.html')
    for asset in sorted(references.paths):
        target = output / asset
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / asset, target)
    return len(references.paths)


if __name__ == '__main__':
    count = build(Path(__file__).resolve().parents[1])
    print(f'Built public/index.html and {count} referenced assets.')
