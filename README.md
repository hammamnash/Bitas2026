# Bitas2026

SAP LeanIX conference demo page.

## Edit and build

Edit `leanix-bitas-2026-demo.html` and its source files in `assets/`.

```bash
python -m unittest discover -s tests -v
python scripts/build_pages.py
```

The build recreates `public/` with:

- `index.html`, copied unchanged from the source deck.
- Only local `assets/...` files referenced in HTML `src`, `href`, or `poster` attributes.

`public/` is generated and ignored by Git. Do not edit it directly or store unique files there; rebuilding removes the previous generated output. Missing assets and paths outside `assets/` fail validation before the previous build is replaced.

The generator is intentionally scoped to the current single-file deck. CSS asset URLs and `srcset` are not collected. Extend the script and tests if those are introduced.

## Cloudflare Pages (Git integration)

Connect the GitHub repository in Workers & Pages, selecting **Pages**, then use:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `python3 scripts/build_pages.py` |
| Build output directory | `public` |
| Root directory | Leave blank (repository root) |
| Environment variables | None |

Commit and push `scripts/build_pages.py`, the tests, this README, `.gitignore`, the source HTML, and required source assets. Cloudflare generates `public/` during the build; it does not need to exist on GitHub. **Do not use `exit 0` with this generated-output approach.**

For a local preview:

```bash
python -m http.server 8123 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8123/`. A direct-upload deployment can also upload the generated `public/` directory.

## Publication checks

The build excludes audit files and unreferenced assets, but it does not sanitize screenshots or certify the content for publication. Review all referenced screenshots for confidential information, particularly the MCP capture. Existing placeholder links, QR content, and other audit findings remain unchanged.

Local MP4 files are ignored by Git and are currently not referenced by the deck. Do not assume they will be deployed. Do not use `git add .` to stage the local `audit/` directory accidentally.

Cloudflare documentation: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
