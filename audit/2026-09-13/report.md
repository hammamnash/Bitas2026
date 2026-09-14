# BITAS 2026: LeanIX conference-page audit

[certain] The page is functional in many places, but its AI demonstration, product wording, and presentation layout are not yet ready to use unchanged on 16 September.

**Audit date:** 13 September 2026. **Target:** `leanix-bitas-2026-demo.html` in the Bitas2026 project. **Mode:** audit only; presentation HTML and assets were not changed. No commit, push, or deployment was made.

[certain] Evidence consists of source inspection, real local Chrome 152 execution, DOM measurements, screenshots, selected image-content analysis, and official SAP/LeanIX documentation. [likely] Recommendations below are professional judgments, not measured audience reactions. High priority means resolve before the relevant content is shown, not a security incident or total website failure.

## Executive assessment

| Area | Assessment |
|---|---|
| Web functionality | [certain] Navigation, integrations, accordions, image enlargement, and Continue work in tested flows. One sample prompt is broken; resources are placeholders; keyboard access is incomplete. |
| Content | [certain] AI starts after 30 minutes of a 42-minute agenda. Several statements conflict with official documentation or the supplied screenshots. |
| Performance | [certain] Fast locally, but all 7.31 MB of images load immediately. A constrained-network test took 6.31 seconds to finish loading. |
| Aesthetics | [likely] Keep the red/ink/white identity. Improve evidence size and screen composition rather than applying another design system. |
| Live readiness | [certain] The page has demo checklists but no complete runbook with destinations, expected results, cut points, and verified fallbacks. Actual tenant access and live workflows were not tested. |

[certain] Findings: **14 consolidated findings: 10 High, 3 Medium, 1 Low.** These include content and rehearsal risks, not just software defects.

## What already works

- [certain] All **18 referenced screenshots** resolve and decode; no capture-frame placeholders remain.
- [certain] All **7 section navigation items** reach their target and update the active section in settled DOM tests.
- [certain] All **3 integration tabs** switch to exactly one visible panel; their screenshots load.
- [certain] All **3 accordions** open. Every visible reveal element became visible during the full-page sweep.
- [certain] All **18 screenshots** open in the lightbox through DOM activation. A representative screenshot also opened with synthesized mouse input. Previous, next, close button, backdrop close, Escape, and arrow-key navigation worked in the exercised flows.
- [certain] Continue remained within the tested sections. On Closing it makes a small final scroll because viewport-height content plus the sticky-header offset still extends below the viewport.
- [certain] No JavaScript exception was observed. The only normal-load network error was the local server's missing favicon, not a presentation blocker.
- [certain] The local file rendered with JavaScript active and all 18 images loaded while both Google Fonts hosts were blocked. This is a useful local-copy fallback, not proof that LeanIX itself works offline.
- [certain] Reduced-motion emulation removed CSS animations. Offscreen reveal items still use IntersectionObserver; ordinary full-page scrolling revealed them.

## Findings and recommended fixes

### 01. High: EA and AI is not yet the narrative spine

**Category:** Content / presentation. **Rules:** C-3, R-05, R-16. **Evidence:** HTML 381–382, 409–572, 657–670.

[certain] The opening is “From rigid EA to Agile EA.” AI is not in the headline or opening explanation. The section allocations are 5 + 7 + 10 + 8 + 10 + 2 = 42 minutes. AI begins after 30 minutes and shares ten minutes with ServiceNow, APIs, and Excel. There is no separate opening allowance, Q&A allowance, or switch/failure buffer.

[likely] The audience will remember a broad feature tour rather than why EA matters for AI. Add a clear distinction between **AI helping architects** and **EA supplying context, ownership, dependencies, and risk information for AI decisions**. Do not claim the latter is a turnkey compliance or AI-governance solution without showing the configuration.

[likely] Use one running question: “Which applications have missing technology relationships, and what should we review before acting?” The supplied EA Assistant capture already illustrates this class of question. Connect the repository, Quality Seal, history, diagrams, and AI answer to that question instead of introducing unrelated feature examples.

### 02. High: AI simulator is both misleading and partly broken

**Category:** Functional / content integrity. **Rules:** R-17, R-26, R-36, R-38. **Evidence:** HTML 586–592 and 740–760; `browser-audit.json`, `interaction-audit.json`; `screenshots/prompt-missing-result.png`.

[certain] The page tells the audience to see “the instant result ... in LeanIX,” but the results are fixed JavaScript strings, not a LeanIX request. They include unsourced counts and risk percentages. The first answer says six applications while displaying four; the second says seven while displaying two, without an excerpt label.

[certain] Clicking **Capability w/o owner** returns only `…`. Its `data-prompt` is “Which capability does not have an owning application?” while the JavaScript key is “Capability without an owning application.” Mouse input reproduced the failure.

[likely] Best fix: remove the simulator and show the real, sanitized EA Assistant prompt/result screenshot or the live tenant. If retained, label it prominently **“Illustrative simulation, not connected to LeanIX”**, remove unsupported specifics, and fix all three states. Use “capability without a supporting application” rather than implying an application owns a capability unless that is explicitly your modeling convention.

### 03. High: the closing resource journey is unfinished

**Category:** Functional / content. **Rules:** R-23, R-24, R-26. **Evidence:** HTML 385, 676–683; mouse checks in `interaction-audit.json`.

[certain] Download materials, Consultation sign-up, and SAP LeanIX docs all have `href="#"`. Each returned to page top in mouse tests. “Download summary” points to Closing, not a file. The QR is the literal text “QR,” not a scannable code.

[likely] Provide one real resource landing destination, a real downloadable summary, a real documentation URL, and a QR generated from the final public address. Do not put a localhost/file URL into the audience QR. Rename the hero button if it merely jumps to resources. Add the presenter's name/role and a usable follow-up channel; do not invent these details.

### 04. High: correct the product claims before rehearsal

**Category:** Content accuracy. **Rules:** C-5, R-36. **Evidence:** HTML lines below; retrieved sources listed at the end.

| Current wording | Evidence-based correction |
|---|---|
| “11 fact-sheet types” (451) | [certain] SAP documents **12 default types in meta model v4**. The supplied metamodel image also contains twelve labels. Distinguish default types, optional/custom types, and the actual demo workspace configuration.[1] |
| “Each quality rule is validated automatically” and “rule-by-rule pass/fail” (490, 508) | [certain] Quality Seal assigns review/approval responsibility. Required-field checkboxes indicate completeness, not independent validation of every business rule. Explain required attributes, accountable review, seal-breaking, and renewal separately.[6][9] |
| Diagrams “always match the repository” / “always consistent” (527, 532) | [certain] The current documentation says users receive inventory-change notifications and choose when to refresh a diagram. Say “linked to repository data, with controlled refresh” rather than promising automatic universal consistency.[47] |
| Diagram history as a “timeline slider” showing last year to today (535–536) | [certain] Documented diagram history creates versions when changes are saved and lets users select/compare versions. Distinguish saved diagram versions from lifecycle/time-based report views.[26] |
| Fact sheets “simpler than ArchiMate/TOGAF ... interchangeable” (446) | [certain] The cited LeanIX material distinguishes ArchiMate as a modeling language and TOGAF as a broader architecture framework. [likely] Describe a practical repository model that can support an EA method, not unconditional interchangeability.[22] |
| Portal can “order software” (543) | [certain] Portal request/ordering links must be configured in Fact Sheet Resources. Say “find approved software and follow a configured request link,” unless a connected order workflow will actually be demonstrated.[18] |
| Risk views “answer audit & compliance” (547, 669) | [certain] The documented calculation is technology-obsolescence risk based on supporting IT Component lifecycles. [likely] Say “supports audit evidence and technology-risk decisions”; a color-coded risk view alone does not demonstrate compliance with a named regulation.[42] |
| ServiceNow automatically synchronizes the complete chain and lifecycle data back (613) | [certain] Synchronization directions and mappings are configured. [likely] Present the available connector and show the actual configured mapping, not a universal out-of-the-box data flow.[36] |

[likely] Replace the reductive equation “EA = (Solution Architect + Business Architect) + Strategic” with a concrete relationship between strategy, capabilities, applications, data, technology, and investment decisions. Avoid implying that architecture disciplines are simply interchangeable job titles.

### 05. High: convert demo intentions into a rehearsable runbook

**Category:** Live-demo resilience. **Rules:** C-2, R-35. **Evidence:** HTML 504–511, 551–558, 634–643; `.gitignore` 8–9; local asset inventory.

[certain] The page proposes creating/running a survey, live diagram editing, AI descriptions, Inventory Builder, optional MCP, ServiceNow/API examples, and an Excel round trip. It does not record the exact prepared objects, live destinations, expected visible results, recovery instructions, or steps to skip when behind schedule.

[certain] Inventory Builder is separately activated for eligible workspaces; its documentation lists AI terms and assigned AI units as prerequisites. Its workflow includes review before creating discovered records and relationships.[17] [certain] MCP tools depend on the authenticated user's permissions, and the toolsets include mutations, not just reads.[32][33]

[likely] Add a **private presenter runbook**, not more audience controls. For each live segment record: opening tab/object, exact action or prompt, expected evidence, time box, fallback file, and return point in the deck. Rehearse with the actual tenant and presentation account. Use prepared demo records, a pre-created survey with responses, and a prepared input diagram. Keep writes in a demo scope with a reset plan; do not send survey invitations to real recipients on stage.

[certain] Two MP4 files are present locally in `assets/` but not referenced by the HTML, and `.gitignore` excludes MP4 assets. [likely] They may be useful fallback candidates, but playback/content/licensing were not verified and they will not accompany a Git-based deployment as currently configured. Verify them before deciding to use them.

[likely] Set a short recovery rule, for example: after 20–30 seconds without a useful response, show the labeled recorded result and continue. This is a proposed rehearsal policy, not measured tenant latency.

### 06. High: muted text fails normal-text contrast

**Category:** Accessibility / projection. **Rules:** R-25. **Evidence:** CSS 44, 100–102, 118, 155, 191, 202; measured pairs in `browser-audit.json`.

[certain] `#8e8e95` on white measures **3.25:1**. It is used for 18 px navigation, 20 px captions, and 22 px secondary prose. These regular-weight sizes require 4.5:1 under the normal-text AA threshold. Increasing them to 20–22 px did not solve contrast.

[likely] Darken secondary text on light surfaces and independently retain suitable lighter text on dark surfaces. For projection, captions that carry the argument should be darker and larger than ordinary website metadata. Verify final pairs numerically. Brand red `#D22129` should remain.

### 07. High: screenshots are present but too small to serve as evidence

**Category:** Visual / presentation. **Rules:** C-3, R-06, R-22, R-35. **Evidence:** `browser-audit.json`; `screenshots/1920-s3.png`, `1920-s5.png`, and the hero.

[certain] At 1920 × 1080, Governance screenshots are about **473 px wide**; Quality Seal is reduced from 2816 px to 473 px. The AI gallery's two smaller images are about **353 px wide**. The initial AI viewport shows capability copy and a ServiceNow help-page capture, while the actual EA Assistant evidence is below the fold.

[certain] Six of seven sections are taller than 1080 px. Visualization is about **2324 px** tall; AI & Integration about **2417 px**. Continue overlaps content in the observed Governance and mobile hero frames. Mixed portrait and landscape screenshots create unbalanced cards and empty areas.

[likely] Do not force everything into one dense slide or simply shrink the font. Keep the web format, but break long sections into deliberate screen-sized beats: **one question, one focused capture, one takeaway**. Crop browser chrome and irrelevant panels; annotate the exact field/result to inspect. Move Continue outside the evidence area. Keep zoom as a fallback, not the only way to read a critical point.

### 08. High: sanitize the MCP screenshot and live environment

**Category:** Information exposure / content. **Rules:** R-23, R-36. **Evidence:** `assets/mcp-agent.jpg` visual review.

[certain] The MCP capture is an agent's connectivity-test summary. It displays workspace identity, token-expiry metadata, inventory statistics, and data-quality counts, and shows a configuration-file tab. The underlying raw tool responses are not visible. No raw token value was identified in the reviewed image.

[likely] These details are unnecessary for the conference story and could be distracting or sensitive. Use an approved demo workspace and a sanitized business-question/result capture. Hide configuration tabs, account identifiers, and unnecessary internal counts. Do not describe a formatted agent success summary as independently verified underlying data. Disable notifications and prepare only the tabs needed for the presentation.

### 09. High: screenshot zoom is mouse-only and dialog focus is incomplete

**Category:** Accessibility / presenter controls. **Rules:** R-32, C-4. **Evidence:** HTML 813–842; keyboard and tab-stop results.

[certain] All 18 image triggers have `tabIndex = -1` and no button semantics. Opening the modal leaves focus in the page navigation, and Tab continues moving through background links. Escape and left/right arrows work after the modal opens, but that does not provide keyboard access to opening it or a complete modal focus flow.

[likely] Wrap zoom triggers in accessible buttons, move focus into the modal, contain focus while open, make background content inert, and restore focus to the trigger on close. Add a visible high-contrast focus treatment. A predictable keyboard chapter-advance action is useful for a presenter remote, but should not conflict with lightbox controls.

### 10. High: responsive navigation consumes the content area

**Category:** Responsive / accessibility. **Rules:** R-03. **Evidence:** `browser-audit.json`; `screenshots/390-hero.png`.

[certain] Header height is about 70 px at 1920 px width, 119 px at 1366, 168 px at 1024, 315 px at 768, and **364 px at 390**. The phone header takes roughly **43%** of an 844 px-high viewport. The headline stays 96 px, and Continue overlaps it. The tested layouts did not show document-level horizontal overflow; the actual failure is lost usable space and obstruction, not a proven sideways-scroll bug.

[likely] Keep a compact chapter navigation on laptops and use a collapsed/labeled menu or a single-line scrollable chapter strip on phones. Introduce a fluid heading and spacing scale. Mobile matters for the shared post-event page, but the first acceptance target should be the actual laptop/projector resolution. Also check 200% browser zoom explicitly; that was not exercised in this audit.

### 11. Medium: optimize for venue resilience, not a vanity speed score

**Category:** Performance. **Rules:** C-4, R-35. **Evidence:** `assets.json`, `performance-audit.json`, HTML 34–36 and image tags.

[certain] Referenced images total **7,308,350 bytes**. All eighteen load eagerly, including hidden integration panels. None has width/height attributes. `AbbSbb.png` alone is 1.77 MB, about 24% of the image payload. Four files with `.jpg` names contain PNG data; Chrome decodes them, but naming and delivered MIME should be cleaned up in a controlled asset pass.

| Test | Measured result |
|---|---|
| Three cache-cleared local runs | [certain] Load event 0.15–0.24 s; FCP 0.25–0.32 s; observed LCP 0.96–1.12 s |
| 10 Mbps down, 80 ms latency, 4× CPU throttling | [certain] FCP 0.716 s; observed LCP 2.236 s; load event 6.311 s |
| Layout shift in these runs | [certain] Sum of observed non-input shifts about 0.000425 |
| Google Fonts blocked, local file opened | [certain] JavaScript active, 18/18 screenshots loaded |

[certain] These are synthetic local Chrome observations, not production Core Web Vitals, venue Wi-Fi measurements, or a Lighthouse score. The constrained test is one sample. INP and production cache/compression behavior were not measured.

[likely] Preserve text sharpness while resizing/compressing oversized captures; add intrinsic dimensions and responsive sources. For the public site, lazy-load below-fold content. For the stage, explicitly preload the selected fallback images/video before presenting so the next visual does not arrive late. Self-host the font or use a tested system stack, and keep a complete local folder copy. No framework migration is justified by this audit.

### 12. Medium: captions do not consistently describe the evidence

**Category:** Content / evidence quality. **Rules:** C-5, R-22, R-38. **Evidence:** HTML 389–390, 489–490, 580, 597–601, 615–616; image review.

[certain] The hero's “Landscape / one connected graph” is actually a dashboard capture. The Quality Seal image shows a Fact Sheet's Last update history and approval status, not a rule-by-rule validation panel. The AI screenshot is labeled **EA Assistant** and asks about missing IT Component relations, not the page's cloud/data-owner example. The ServiceNow capture shown on the AI screen is documentation, not a tenant configuration or sync result.

[likely] Name each screenshot for what is actually visible. Distinguish **Live**, **Recorded example**, **Documentation**, and **Illustrative** in small, readable status labels. Replace “Capture 06” style authoring labels with the question the evidence answers. Confirm which assistant interface will be on stage; do not indiscriminately call EA Assistant, Joule, and Copilot the same interface. Official Joule documentation describes its own access path and capabilities.[16]

### 13. Medium: language and closing takeaways need one editorial pass

**Category:** Copy. **Rules:** R-02, R-16, R-20. **Evidence:** HTML 381–385, 407–451, 657–683.

[certain] Most content is English, while the main start action is Indonesian. The close repeats categories of tool rather than a concrete decision/outcome. Presenter identity and event date are not displayed.

[likely] Choose one audience language; retain product labels in their real interface language. If Indonesian is chosen, use concise Indonesian explanations rather than translating Fact Sheet or Quality Seal inconsistently. End with a practical outcome and next step, not “one source of truth” alone. “Connected, governed architecture context; AI suggestions reviewed by accountable people” is a stronger conclusion. Replace editorial “Capture” numbering and unnecessary metaphor before expanding feature coverage.

### 14. Low: reduce decorative motion rather than redesign the brand

**Category:** Aesthetic refinement. **Rules:** R-07, R-19, R-31. **Evidence:** CSS 287–305, 329–330.

[certain] The page includes a dot-grid texture, large outlined numerals, an endlessly moving hero background, and a continuously bouncing Continue control. Reduced-motion styling exists.

[likely] Keep the alternating light/dark chapters, red accent, and clear heading hierarchy. Reduce persistent motion once the presenter is speaking; use transitions for navigation feedback. The principal design problem is evidence legibility, not insufficient decoration. Do not add stock AI artwork or another design framework three days before the conference.

## Suggested conference structure

[likely] For a **45-minute total slot**, use a 35-minute core, five minutes of recovery/switching buffer, and five minutes of Q&A. This is a proposed allocation, not a confirmed event schedule.

| Beat | Minutes | Audience question / purpose |
|---|---:|---|
| Problem and promise | 3 | Why do AI answers need connected architectural context? |
| Connected repository | 5 | What does this application support, depend on, and who owns it? |
| Trustworthy data | 6 | How do we review completeness, approval, and changes? |
| Dependency and risk view | 5 | What could be affected by a change? |
| AI workflow | 10 | What can AI suggest, what evidence is available, and what must a person verify? |
| Integration boundary | 3 | Where does the architecture context come from? |
| Conclusion and resources | 3 | What should the audience do next? |
| Buffer + Q&A | 10 | Preserve a clean ending rather than consuming the entire slot with features. |

[likely] Within AI, choose **two live moments at most**: the EA Assistant question with result verification, then Inventory Builder review if enabled and rehearsed. MCP can be the second live moment instead if that is the differentiated story; move the other to a recorded fallback. Keep AI descriptions as a short supporting step, not a separate detour. Keep detailed ServiceNow setup, API code, Excel import, full survey creation, and portal ordering out of the critical path.

[likely] Add one concise **EA for AI** example: an AI initiative/use case connected to affected applications, data, owners, and technology dependencies. Use only fields and relationships you have configured and verified. That balances “AI speeds up EA work” with “EA helps assess AI adoption” without inventing a new product capability.

## Recommended work order before 16 September

1. [likely] **First:** correct claims; remove/label the simulator; replace dead resources/QR; sanitize public evidence.
2. [likely] **Second:** reshape the AI story and long sections into projection-sized beats; fix contrast, screenshot crops, controls, and responsive navigation.
3. [likely] **Third:** build the private runbook and verify local fallback media; rehearse the actual tenant with a timer and an interruption/failure drill.
4. [likely] **Last:** optimize image payload, verify deployment/local copy, and freeze content. Avoid broad redesign and new untested integrations.

## Scope and limitations

[certain] Tested at 1920×1080, 1366×768, 1024×768, 768×1024, and 390×844 in a separate local headless Chrome session. Functional coverage used DOM activation for the complete control inventory and synthesized mouse/keyboard input for representative navigation, prompts, tabs, accordion, modal, and all three resource links. DOM activation alone does not prove every pointer hit target.

[certain] No authenticated LeanIX workflow, actual projector, presentation remote, mobile device, 200% browser zoom, public deployment, Safari/Firefox, video playback, network-loss behavior of the live tenant, regulatory mapping, or complete screenshot privacy clearance was verified. The content-research subtask timed out before producing its final memo; its retrieved source files and quotations were recovered and independently read for the claims used here.

[certain] Supporting files: `browser-audit.json`, `interaction-audit.json`, `performance-audit.json`, `assets.json`, screenshot evidence, and `sources/`. These audit screenshots contain copies of existing deck content and should not be published automatically without review.

## Decisions needed before implementation

- Exact slot length and whether Q&A is included.
- Audience language: Indonesian, English, or an intentional bilingual format.
- The live AI centerpiece and confirmed tenant availability: EA Assistant/Joule, Inventory Builder, or MCP.
- Final public resource URL, downloadable materials, and approved presenter/contact details.

## Sources

[1] https://help.sap.com/docs/leanix/ea/meta-model — Meta Model - SAP LeanIX
[6] https://help.sap.com/docs/leanix/ea/quality-seal — Quality Seal - SAP LeanIX
[9] https://help.sap.com/docs/leanix/ea/mandatory-attributes — Mandatory Attributes - SAP LeanIX - SAP Help Portal
[16] https://help.sap.com/docs/leanix/ea/joule-in-sap-leanix — Joule in SAP LeanIX | SAP Help Portal
[17] https://help.sap.com/docs/leanix/ea/inventory-builder — AI-Assisted Inventory Builder | SAP Help Portal
[18] https://help.sap.com/docs/leanix/ea/portal-faqs — Portal FAQs - SAP LeanIX
[22] https://www.leanix.net/en/wiki/ea/what-is-archimate — What is ArchiMate? Key Components & Comparisons - SAP LeanIX
[26] https://help.sap.com/docs/leanix/ea/managing-diagram-versions — Managing Diagram Versions - SAP LeanIX
[32] https://help.sap.com/docs/leanix/ea/connecting-to-mcp-server — Connecting to the MCP Server | SAP Help Portal
[33] https://help.sap.com/docs/leanix/ea/mcp-server-toolsets — MCP Server Toolsets | SAP Help Portal
[36] https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix — Fact Sheet Mapping Between ServiceNow and SAP LeanIX
[42] https://help.sap.com/docs/leanix/ea/technology-obsolescence-risk-statuses-and-views-in-reports — Technology Obsolescence Risk Statuses and Views in Reports
[47] https://help.sap.com/docs/leanix/ea/diagrams — Diagrams - SAP LeanIX
