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

## AI-EA Synergies

Section 01 places AI-EA Synergies beside the core architecture layers. The two directions explain how EA grounds AI in enterprise context and how AI can accelerate architecture work and decision support, with current repository data and human validation as the shared foundation.

`assets/ai-ea-teamwork.png` is an AI-generated concept illustration of two robots labeled AI and EA holding hands. It sits directly below the AI-EA Synergies explanation, is not a LeanIX screenshot, and is intentionally excluded from the screenshot viewer. The EA landscape screenshot sits directly below the core-layer list in the other column. Desktop shows the two columns together; mobile keeps each explanation with its image and gives AI-EA Synergies its own Next stop.

## Visualization screenshots

Section 04 groups Fact Sheets, Object Explorer, Diagrams, Portal, and Dashboards & Reports. Object Explorer uses `assets/object-explore.jpg` to illustrate cross-domain dependency tracing and potential change impacts through recorded relationships. Its full-width screenshot opens in the image viewer, and it has its own presentation stop between Fact Sheets and Diagrams. All three former placeholders now reference supplied screenshots:

| File under `assets/` | Content |
|---|---|
| `fact-sheet-detail.jpg` | Application Fact Sheet with Sourcing expanded: technical fit and linked IT components. |
| `fact-sheet-changes.jpg` | BPOS Fact Sheet change history with events, old/new values, users, and timestamps. This is a different application from the detail screenshot. |
| `reports.jpg` | All Reports catalog with previews, search, and filters; not an individual report. |

Each image is clickable to enlarge. The existing `fact-history.jpg` in Governance remains unchanged.

The build copies only actual `src`/`href`/`poster` references, so adding files alone does not publish them. When adding or replacing screenshots, wire their exact paths into the source HTML, keep captions accurate, run `npm test` and `npm run build`, then refresh. Include referenced assets when committing for deployment and review screenshots for sensitive information before publishing.

Existing views use `diagram.jpg`, `diagram-history.jpg`, `portal.jpg`, and `dashboard.jpg`. `eol-dashboard.jpg` is retained in the expandable Technology Lifecycle example and is correctly labeled as a report, despite its filename.

## Local preview

```bash
npm run dev
```

Open `http://127.0.0.1:8123/`. This builds once and serves only `public/`. After editing the source, run `npm run build` in another terminal and refresh the browser. There is no automatic source watcher. Stop the server with Ctrl+C.

The preview binds to localhost by default. Existing `HOST` or `PORT` environment variables override the preview server's flags; unset them if the server reports a different address.

## Presentation navigation and materials

The persistent **Next: [topic]** button advances through explicit `data-demo-stop` markers. It stops at each chapter introduction and subsection, skips headings sharing the same desktop row, and recalculates after manual scrolling. Targets clear the sticky navigation. The prompt workbench starts collapsed; clicking its summary or advancing to that stop opens it. Supporting integration paths are permanently visible.

At widths up to 1200px, chapter links start collapsed behind **Menu**. Selecting a chapter, tapping outside, pressing Escape, or tabbing out closes the menu. At 900px and below, sections use a reading layout with smaller headings, stacked content, and no full-screen minimum height. **Next** moves to the bottom with reserved space so the footer stays reachable. Desktop projection typography is unchanged.

Screenshots support touch, Enter, and Space to open the viewer. On phones, image/caption content sits between the close control and previous/next controls rather than underneath them. Escape closes the viewer and returns focus to the original screenshot.

After the closing topics, **Continue: Demo materials** opens a full-screen QR overlay. Close materials or Escape returns to the same place. The supplied `assets/demoresource.png` encodes **https://bitas.hammamnash.site/**; the visible link uses that same destination. The original QR image and its white scanning margin are preserved. Include this asset when committing for deployment.

## Browser tests

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
