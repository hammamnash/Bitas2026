# Bitas2026

SAP LeanIX conference demo page. Node.js 22 or newer is required; no Python is needed to build, test, or preview the site.

## Edit and build

Edit `leanix-bitas-2026-demo.html` and its source files in `assets/`.

```bash
npm ci
npm test
npm run build
```

The build recreates `public/` with:

- `index.html`, copied unchanged from the source deck.
- Only local `assets/...` files referenced in HTML `src`, `href`, or `poster` attributes.

`public/` is generated and ignored by Git. Do not edit it directly or store unique files there; rebuilding removes the previous generated output. Missing assets and paths outside `assets/` fail validation before the previous build is replaced.

The generator is intentionally scoped to the current single-file deck. CSS asset URLs, `srcset`, and query strings on asset paths are not supported. Extend the script and tests if those are introduced.

`htmlparser2` reads actual HTML attributes, skipping comments and script contents. `sirv-cli` serves the generated folder locally. Dependency versions are recorded in `package-lock.json`; tests use Node's built-in test runner.

## Local preview

```bash
npm run dev
```

Open `http://127.0.0.1:8123/`. This builds once and serves only `public/`. After editing the source, run `npm run build` in another terminal and refresh the browser. There is no automatic source watcher. Stop the server with Ctrl+C.

The preview binds to localhost by default. Existing `HOST` or `PORT` environment variables override the preview server's flags; unset them if the server reports a different address.

## Opening cover browser tests

The opening cover appears on every load. Start Demo (or Escape) fades and slides it away, then focuses the existing hero. Reduced-motion preferences skip the transition. Without JavaScript, the deck remains directly accessible.

Run `npm run dev`, then launch a separate test-only Chrome instance (Git Bash on Windows):

```bash
'C:/Program Files/Google/Chrome/Application/chrome.exe' --headless=new --disable-gpu --no-first-run --remote-debugging-address=127.0.0.1 --remote-debugging-port=9237 --user-data-dir="$LOCALAPPDATA/Temp/bitas-intro-cdp-9237" about:blank
```

In another terminal, run `npm run test:browser`. The suite uses Node's built-in WebSocket and Chrome DevTools Protocol, with no additional dependencies. `CDP_URL` and `DEMO_URL` can override the defaults `http://127.0.0.1:9237` and `http://127.0.0.1:8123/`. Use a dedicated browser profile: the tests navigate its first page and change its emulation settings. Stop the test browser when finished.

## Cloudflare Pages (Git integration)

Connect the GitHub repository in Workers & Pages, selecting **Pages**, then use:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Root directory | Leave blank (repository root) |
| Node version | `22` via the committed `.node-version` file |

Cloudflare installs dependencies before running the build. Keep development dependencies enabled because the HTML parser is a build tool. If the project has an older `NODE_VERSION` environment override, update it to `22` or remove it so `.node-version` takes effect.

Commit and push `package.json`, `package-lock.json`, `.node-version`, `scripts/build-pages.mjs`, the Node tests, this README, `.gitignore`, the source HTML, and required source assets. Include deletion of the old Python build script and test. Cloudflare generates `public/` during the build; it does not need to exist on GitHub. **Replace the old Python build command or `exit 0` with `npm run build`.**

For Direct Upload, upload the generated `public/` directory after building locally.

## Publication checks

The build excludes audit files and unreferenced assets, but it does not sanitize screenshots or certify the content for publication. Review all referenced screenshots for confidential information, particularly the MCP capture. Presentation content is unchanged by the build.

Local MP4 files are ignored by Git and are currently not referenced by the deck. Do not assume they will be deployed. The historical `audit/` scripts are separate from the site's npm workflow; their Python utilities are not required by this project build.

Cloudflare documentation: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
