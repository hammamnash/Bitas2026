# LeanIX MCP Executive Impact Demo Runbook

## Objective

Keep the on-stage explanation fast and reliable while retaining a live SAP LeanIX proof point.

The generated impact brief is the primary presentation surface. LeanIX and the MCP query are evidence sources, not the pacing mechanism.

## Before the event

1. Run the approved read-only impact query against the named IT Component.
2. Verify the exact Fact Sheet ID and all returned paths.
3. Generate the standalone HTML brief in `generated/`.
4. Validate the file locally at desktop and mobile widths.
5. Open the page in the Hermes preview pane before screen sharing.
6. Open the target IT Component and related Application in LeanIX in separate tabs.
7. Keep this runbook and the source IDs available offline.

## Recommended 90-second stage flow

| Time | Action | Message |
|---|---|---|
| 0:00–0:20 | Open the overview | “The documented impact is one direct application and fifteen downstream paths.” |
| 0:20–0:45 | Press `2`; click Application, Capability, Organization, Initiative | “Every business impact shown here is reached through the application. Nothing missing was inferred.” |
| 0:45–1:10 | Switch once to LeanIX and open the IT Component → Application relation | “This is the source edge behind the trace.” |
| 1:10–1:30 | Return to the brief; press `4` | “The gaps are part of the result: no direct initiative mapping, no responsible team, and incomplete fit attributes.” |

## Presenter controls

- `1`: overview
- `2`: clickable relationship map
- `3`: stage workflow
- `4`: evidence and gaps
- `S`: toggle distraction-free stage mode
- `Esc`: exit stage mode
- `Tab`, then `Enter` or `Space`: inspect mind-map nodes without a mouse

## Presenter script

Use the short version below rather than narrating tool execution:

> I traced this hosting component through the relationships already documented in LeanIX. It has one direct application dependency. That application carries the impact into four capabilities, three business contexts, six organizations, and two initiatives. The map preserves all fifteen downstream paths. When a mapping is missing, the brief says so instead of letting AI invent impact.

Then select these nodes in order: Application → Business Capability → Organization → Initiative.

## Failure-safe branches

### MCP is slow

Continue with the cached HTML. State that it contains the read-only result retrieved before the session. Do not wait in silence for a repeated query.

### LeanIX login or network fails

Use the IDs in the detail panel as the evidence trail. Explain the relation semantics and offer to open the source after connectivity returns.

### The agenda is running late

Skip the live query entirely. Show the relationship map and one mapping gap. This preserves the decision story in under one minute.

### The result has changed since rehearsal

Do not merge new live results into the cached story verbally. Say that the workspace changed, treat the live system as authoritative, and regenerate the brief after the session.

## Refresh procedure

When the source object or relationships change:

1. Re-run the exact read-only traversal.
2. Preserve every complete path as `IT Component → Application → target`.
3. Separate direct relations from indirect paths.
4. Keep null and empty fields as “not recorded.”
5. Update the node data object and evidence summary in the generated HTML.
6. Run repository tests, HTML parsing, JavaScript syntax checking, desktop interaction checks, mobile overflow checks, and keyboard checks.
7. Reopen the final file in the Hermes preview pane.

## Source boundaries

- Do not invent canonical Fact Sheet URLs when LeanIX does not return them.
- Do not promote semantic-search candidates to relationship evidence.
- Do not infer impact from a Fact Sheet name.
- Keep read-only mode for conference analysis unless a separate write action is explicitly approved.
- No need to shou UUID on generated page
