# Editorial showcases and landing motion

[Editable Figma file](https://www.figma.com/design/75oJWNsf8h0YFhQjXnTk8a)

## Delivered design

Four reusable project families: DocChaser, RecruiterAI, Listing Photo Pipeline,
and AskSQL. Each has independently composed desktop (960 × 540) and mobile
(600 × 480) variants in the actual portfolio light and dark palettes.

Six component sets, editable text/vector UI, shared Manrope/IBM Plex Mono styles,
and 45 scoped palette/geometry variables provide the reusable system. Apartment
photography comes from the existing original/edited evidence. No Community
assets or additional runtime libraries were used.

DocChaser uses the existing dashboard, capture, upload and signature workflow as
source material. The neutral presentation replaces the product's original
blue-marble branding. Labels represent existing UI; the illustrated QR is a
presentation fragment, not a live capture link. Project titles/descriptions
remain webpage text.

Reviewed at approximately 796px desktop and 342px mobile in both themes before
export. Native alpha masks and transparent outer margins merge into the page;
1px panel borders, quiet surfaces and sparse orange status accents maintain the
site identity. An explicit group scope fixes Figma's mask propagation across
frames. All exported PNGs were checked for real transparency.

Design self-assessment: **38/40** — intuitive 10, ease of use 9, delight 9,
aesthetics 10. This is a subjective design assessment, separate from browser QA.

## Files and integration

- `exports/`: sixteen clean sRGB PNG masters at 2×, plus WebP manifest.
- `../../../assets/images/showcases/`: responsive WebP delivery files.
- `export-webp.py`: repeatable Pillow encoding of the reviewed PNG masters.
- `state.json`: current paid-team file key and source composition/prototype IDs.
- `motion-context.json`: authoritative Figma motion export used for implementation.
- `foundations.js`, `showcases.js`, `motion-prototypes.js`: design authoring source.
  These run in the Figma Plugin API context, not the website. Existing-node guards
  prevent accidental duplicate builds. Image hashes are file specific.
- `repair-layout.js`: historical repair for the abandoned Starter-account draft;
  do not run against the current file. Current construction incorporates the fixes.

The homepage uses responsive compositions for its three existing projects.
DocChaser and RecruiterAI proof galleries use one responsive composition each,
rather than repeated device posters. The photo pipeline adds a composition while
preserving the existing script preview and original/edited photographic evidence.
AskSQL's selectable native SQL example is retained; its Figma/export variants
are available for reuse. Theme changes update native `<picture>` sources, and
keyboard-accessible enlargement opens the matching full-resolution variant.

## Secondary audit decisions

| Element                           | Weakness                                                    | Why Figma helps                                                        | Treatment                                 |
| --------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| Project artwork                   | Device frames and glossy canvases consume useful UI space   | Independent hierarchy, theme variants, masks and mobile layouts        | Designed assets                           |
| Hero entrance                     | Separate large movements lack coordinated rhythm            | Review masks, timing and easing together                               | Native HTML/CSS                           |
| Project transitions               | Artwork needs a quiet arrival during horizontal travel      | Prototype opacity/translation/scale                                    | Existing GSAP/ScrollTrigger               |
| AskSQL example                    | Simple explanatory UI already benefits from selectable text | Useful reusable visual composition, not a reason to rasterize the page | Keep native HTML                          |
| Pixel arrows and identity         | Already distinctive and crisp                               | No clear gain from replacement                                         | Retain SVG                                |
| Studio geometry/research diagrams | Already match the editorial identity                        | No clear gain from new assets                                          | Retain current native visuals             |
| Mascot                            | Recently corrected mobile rendering and clearance           | No new artwork required                                                | Preserve canvas renderer and interactions |

## Motion

Native Figma keyframes were previewed through sampled timeline phases before
implementation. Easing: `cubic-bezier(.22,1,.36,1)` throughout the new motion.

| Element        |    Start |                     Duration | Motion                                                   |
| -------------- | -------: | ---------------------------: | -------------------------------------------------------- |
| Intro          |      0ms |                        420ms | 8px rise, opacity .5 → 1                                 |
| Headline 1     |     60ms | 720ms desktop / 620ms mobile | Masked 36px / 15px rise, opacity .35 → 1                 |
| Headline 2     |    180ms |                         Same | Second reading beat                                      |
| Portrait       |     80ms |                        800ms | 16px / 10px rise, scale 1.025 → 1                        |
| Identity tile  |    220ms |                        750ms | 10px lateral/8px vertical settle, −8° → 0                |
| Description    |    240ms |                        500ms | 10px rise, opacity .4 → 1                                |
| Actions        |    360ms |                        400ms | 6px rise, opacity .65 → 1                                |
| Project visual | On entry | 700ms desktop / 600ms mobile | 20px / 14px rise, opacity .55 → 1, desktop scale .98 → 1 |

Figma's timeline preview loops, and its public authoring API exposes duration
but no playback-loop setting. The exported snippets include that preview loop.
Per the website brief, the implementation deliberately plays **one cycle**.
CSS handles the entrance with no runtime dependency; existing GSAP handles project
arrivals and desktop pinning. Its easing function evaluates the actual Figma
Bezier coordinates. No video/GIF animation is deployed. Diagnostic video exports
were used only for prototype QA.

The entrance settles in under one second, does not block interaction, and uses
visible opacity floors. Reduced motion removes the entrance, project reveals,
and existing scroll motion. The mascot retains its own approved scenes and touch
feedback. Mobile reveal triggers run once, so scroll jitter cannot replay them.

References: [Vercel's motion guidance](https://vercel.com/design/guidelines) and
[Mistral](https://mistral.ai/). Timings and compositions are original to this site.

## Browser verification

Chrome checks covered 360, 390, 768, 1024, 1440 and 2000px widths, normal/reduced
motion, both themes, responsive asset selection, native image ratios, keyboard
zoom and focus return, mobile navigation, and no horizontal overflow. Small-screen
compositions remain active through 1023px so narrow tablet columns retain legibility.
Additional checks covered no-JS images, Firefox mobile, changing reduced-motion
preferences at runtime, the exact entrance timing/easing, and the existing cat's
happy touch reaction. No page errors occurred in the final targeted checks.
