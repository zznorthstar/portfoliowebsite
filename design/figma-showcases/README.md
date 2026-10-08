# Editorial showcase and landing motion pass

## Status: draft, blocked by Figma MCP access

[Open the Figma file](https://www.figma.com/design/Wa7vjVT9NN2Dx3PbemiIa5).

The connected Starter team reached its Figma MCP call limit during visual review.
The first actual-size screenshots revealed clipped auto-layout content. The fix
is prepared in `repair-layout.js` but **has not been applied to Figma**. These
compositions are **not ready for export or deployment**. The live website and its
HTML/CSS/JS remain unchanged.

## Source of truth

- Current portfolio: Manrope, IBM Plex Mono, existing spacing and theme tokens.
- Original DocChaser applications, QR capture, document upload and signature UI
  recovered from portfolio commit `0a12e3a` for reference.
- RecruiterAI's existing native demo and candidate board.
- Existing original/edited apartment photos for the photo pipeline.
- The exact question and source SQL already shown by AskSQL.

## Design and acceptance checks

Flat, editable interface panels replace device mockups and glossy advertising
backgrounds. Orange is limited to state markers and focal actions. The main
surface dominates; supporting fragments describe a related workflow. No project
titles or marketing descriptions are embedded in the artwork.

Four project families have independent 960 × 540 desktop and 600 × 480 mobile
compositions, each in light and dark variants. The mobile versions simplify and
recompose the hierarchy instead of cropping desktop. Alpha edge masks let the
export merge with the page's actual background, with no baked outer frame.

The reusable system includes document rows, applicant cards, project composition
variants, shared text styles, and 45 scoped variables bound to the actual site
palette and geometry. Separate one-mode light/dark collections accommodate the
connected Starter plan. UI is editable text, vectors and component instances;
apartment photography remains image content. No Community assets were imported.

Proposed self-assessment: **38/40** — intuitive 10, ease of use 9, delight 9,
aesthetics 10. This is a design proposal score, not completed QA.

Required final checks:

1. Apply the existing-node repair and inspect desktop around 796px and mobile
   around 342px. Smaller proof-gallery placements need their own size check.
2. Verify all text, QR, signature and document fragments are legible and clear.
3. Review native Figma motion before translating it to the existing site stack.
   Remove the temporary source capture (`3:2`) and photo placement nodes
   (`5:60`, `5:61`) after their image fills are reused in the final components.
4. Export clean sRGB PNG masters and transparent responsive WebP delivery files.
5. Integrate only showcase media and native landing motion. Preserve actual HTML
   navigation, buttons, type, layouts, project destinations and interactions.
6. Verify light/dark, mobile/desktop, keyboard use, no-JS content, reduced motion,
   scroll cleanup and existing mascot stability before deployment.

## Secondary audit

| Element | Current weakness | Would Figma help? | Decision |
| --- | --- | --- | --- |
| Project artwork | Device frames and glossy backgrounds reduce useful UI size and clash with the editorial page | Yes: editable hierarchy, theme variants, masks and mobile composition | Replace as designed assets after QA |
| Hero entrance | Copy, portrait and spinning tile have separate, relatively large movements | Yes: coordinate timing and masks in a prototype | Keep all actual content and animation native HTML/CSS/JS |
| Project transitions | Horizontal travel exists, but artwork has little coordinated arrival motion | Yes: prototype restrained opacity/translation timing | Keep scrolling native; refine the existing GSAP timeline |
| Pixel arrows and identity mark | Already distinctive and crisp at all sizes | Little benefit from rasterization | Retain native SVG |
| Studio geometry and research diagrams | Already align with the site's restrained geometric identity | No clear improvement justifies a new asset | Retain current native visuals |
| Mascot | Recently corrected canvas rendering and mobile clearance | No new artwork is needed for this pass | Preserve its renderer, scenes and touch behavior |

## Proposed motion, not yet prototyped or implemented

Use the current easing `cubic-bezier(.22,1,.36,1)`. A short coordinated entrance
establishes reading order. All content remains accessible; there is no blocking
intro. The prototype source is prepared in `motion-prototypes.js`.

| Element | Start | Duration | Motion |
| --- | ---: | ---: | --- |
| Intro label | 0ms | 420ms | 8px rise, opacity .5 → 1 |
| First headline line | 60ms | 720ms desktop / 620ms mobile | Masked 36px / 15px rise, opacity .35 → 1 |
| Second headline line | 180ms | Same | Coordinated second beat |
| Portrait | 80ms | 800ms | 16px / 10px rise, scale 1.025 → 1 |
| Identity tile | 220ms | 750ms | Small 10px lateral/8px vertical settle and 8° correction |
| Description | 240ms | 500ms | 10px rise, opacity .4 → 1 |
| Actions | 360ms | 400ms | 6px rise, opacity .65 → 1 |
| Project visual | On entry | 700ms / 600ms | 20px / 14px rise, opacity .55 → 1, desktop scale .98 → 1 |

Project arrivals should run once; mobile scroll jitter must not replay them or
fade the mascot. Keep existing desktop pinning and keyboard focus behavior.
Use compositor transforms and opacity, reduce long travel, and disable motion
under `prefers-reduced-motion`. Keep the current local GSAP installation for
coordinated timelines and CSS for hover feedback. No new runtime dependency or
smooth-scroll interception is proposed.

Reference principles: [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
recommend purposeful, interruptible motion, transform/opacity animation, and
reduced-motion support. The current [Mistral site](https://mistral.ai/) was also
reviewed as a reference; these timings are original to this portfolio.

## Resume without recreating the file

`state.json` contains the returned Figma IDs, source-component inventory and
pending validations. Use that ledger and inspect existing nodes before mutation.

- `repair-layout.js`: fix the existing clipped auto-layout frames in place.
- `showcases.js`: corrected construction source; its guard prevents a duplicate
  build in the current file. Do not rerun it as the repair.
- `foundations.js`: historical token construction source. It uses the installed
  Figma library skill's `createVariableCollection` / `createSemanticTokens` helpers.
- `motion-prototypes.js`: prepared native Figma motion authoring script; run only
  after composition repair. It has passed syntax checking, not Figma runtime QA.

These scripts target the connected `use_figma` execution environment. They are
design tooling, not scripts loaded by the website.
