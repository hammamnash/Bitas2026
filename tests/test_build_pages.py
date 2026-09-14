import importlib.util
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'build_pages.py'


class BuildPagesTests(unittest.TestCase):
    def builder(self):
        self.assertTrue(SCRIPT.is_file(), 'Publish-folder generator is missing')
        spec = importlib.util.spec_from_file_location('build_pages', SCRIPT)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module.build

    def test_publishes_homepage_and_only_referenced_assets(self):
        build = self.builder()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'assets').mkdir()
            (root / 'assets' / 'used.jpg').write_bytes(b'test image fixture')
            (root / 'assets' / 'unused.jpg').write_bytes(b'not for publication')
            (root / 'audit').mkdir()
            (root / 'audit' / 'report.md').write_text('private audit fixture')
            html = '<img src="assets/used.jpg"><img src="assets/used.jpg">'
            (root / 'leanix-bitas-2026-demo.html').write_text(html)
            (root / 'public').mkdir()
            (root / 'public' / 'stale.txt').write_text('stale generated file')
            build(root)
            files = sorted(p.relative_to(root / 'public').as_posix()
                           for p in (root / 'public').rglob('*') if p.is_file())
            self.assertEqual(files, ['assets/used.jpg', 'index.html'])
            self.assertEqual((root / 'public' / 'index.html').read_text(), html)
            self.assertEqual((root / 'public' / 'assets' / 'used.jpg').read_bytes(),
                             (root / 'assets' / 'used.jpg').read_bytes())

    def test_invalid_asset_preserves_previous_build(self):
        build = self.builder()
        for asset in ('assets/missing.jpg', 'assets/../private.txt'):
            with self.subTest(asset=asset), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                (root / 'assets').mkdir()
                (root / 'private.txt').write_text('private fixture')
                (root / 'leanix-bitas-2026-demo.html').write_text(f'<img src="{asset}">')
                (root / 'public').mkdir()
                previous = root / 'public' / 'index.html'
                previous.write_text('previous build')
                with self.assertRaises((FileNotFoundError, ValueError)):
                    build(root)
                self.assertEqual(previous.read_text(), 'previous build')


if __name__ == '__main__':
    unittest.main()
