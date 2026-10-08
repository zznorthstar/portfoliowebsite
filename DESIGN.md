# Hamdi Bouzidi: Unite & Multiply

## Design direction

A personal portfolio for people evaluating Hamdi's AI systems work, research,
and commercial experience. A clear introduction leads into real projects,
the studio's direction, the thinking behind it, and a direct contact action.

The visual language uses an editorial grid, generous space, large typography,
warm white surfaces, and one orange accent. It is an independent design inspired
by the craft of [Mistral's website](https://mistral.ai/).

Design dials: variance **8**, motion **7**, density **3**. The brief calls for a
complete visual overhaul with expressive motion. Asymmetric compositions and
different section layouts provide variety; spacious content keeps it readable.
Research articles use greater density where the material requires it.

## Evaluation

The proposed design was scored before implementation:

| Category | Score | Reason |
| --- | ---: | --- |
| Intuitive | 9/10 | Two-line introduction, direct work CTA, four main navigation destinations. |
| Ease of use | 9/10 | Responsive navigation, project details on demand, readable research, keyboard image previews. |
| Delight | 10/10 | Meaningful logo animation, project storytelling, entry motion, responsive hover feedback. |
| Aesthetics | 9/10 | Consistent typography, spacing, borders, palette, and real project imagery. |
| Total | **37/40** | Self-assessment, rather than a substitute for user research. |

## Implementation

- Static HTML is retained. There is no new framework, build requirement, or backend.
- `assets/site.css` owns typography, color tokens, responsive layouts, and theme variants.
- `assets/site.js` owns navigation, theme preferences, image dialogs, and motion.
- Manrope is a local variable font; IBM Plex Mono provides restrained technical labels.
- Local GSAP and ScrollTrigger handle animation. Versions and license references are
  documented in `assets/vendor/README.md`; font licenses are in `assets/fonts`.
- WebP derivatives and responsive image sources reduce transfer size. Original
  project photos and screenshots remain available.
- The reimagined mark assembles into a plus and turns into a multiplication sign,
  connecting the identity to the headline. It uses the same orange throughout.

Inspection of Mistral's public page showed Astro script artifacts, bundled GSAP,
ScrollTrigger and Three.js, and Lenis integration markers. This portfolio uses
GSAP/ScrollTrigger for comparable scroll choreography. Its existing static
architecture remains appropriate; WebGL and smooth-scroll interception are not
required for the implemented design.

## Motion and accessibility

- Hero entry establishes reading order; section reveals connect content to scrolling.
- The desktop project track pins at `top top` and progresses with native scrolling.
  Mobile and reduced-motion visitors get a normal vertical project list.
- Keyboard focus brings an off-screen project into view. Resize and motion
  preference changes clean up the pin and transformations.
- Reduced motion disables GSAP animations, looping motion, and CSS transitions.
  The existing animated proof screenshot has a static alternative in this mode.
- Native dialogs provide mobile navigation and enlarged screenshots, including
  Escape dismissal and focus return. A skip link and visible focus styles are shared.
- Themes follow system preferences until a visitor chooses light or dark; that
  choice persists locally. Content and navigation remain available without JavaScript.

## Content changes

- Removed the Skills.md destination and its two detail pages, navigation links,
  and sitemap entries.
- Removed UnitUp from the career section. The related proof-of-work case study is
  described without the employer name; its working external project link remains.
- Preserved research section anchors, citations, project destinations, and demo
  interactions. Existing editorial claims and research qualifications remain intact.

## Verification

Browser checks cover all 16 remaining pages at 390, 768, and 1440 pixels, with
additional breakpoint checks at 1024 and 1280. Checks cover light/dark appearance,
menu interaction, keyboard image previews, project pinning and cleanup, reduced
motion, demo navigation, candidate details, local notes, and saved drag/drop positions.
Local link targets, article anchors, JSON-LD, and research citations were audited.

Screenshots and Lighthouse reports were generated against a local static preview.
These are local development measurements, not claims about deployed performance.
Deployment is separate from this local redesign.

Final mobile Lighthouse: performance **95**, accessibility **100**, best practices
**100**, SEO **100**. Largest contentful paint was **2.9 seconds**, cumulative
layout shift **0.038**, and total blocking time **10 milliseconds** in the
throttled local run. Deployment should enable compression and asset caching;
the local Python preview does not provide production delivery optimizations.

## Pixel companion refinement

The subsequent update preserves this design and addresses three observed issues:
desktop caption clearance around the large mark, mobile project frames following
the image's natural height, and platform-independent pixel arrows in place of
Unicode arrow characters.

Proposed refinement score: **38/40** (intuitive 9, ease of use 9, delight 10,
aesthetics 10). Variance, motion, and density remain **8 / 7 / 3**.

One orange-and-cream pixel cat lives on a ledge beneath the hero headline. It
sleeps with a dangling paw, wakes briefly, walks along the ledge, and returns to
sleep. As section edges become visible, the same character moves to project,
studio, research, about, and footer perches. Project frames cover the lower sprite
to give its peeking head a sense of depth. Other pages have an introductory ledge
and a footer perch; proof-of-work galleries provide additional hiding places.

`assets/mascot.css` and `assets/mascot.js` isolate this decoration from the existing
site interactions. The character is hidden from assistive technology and never
intercepts clicks. IntersectionObserver selects visible perches without a scroll
listener. Animation stops off-screen or while the tab is hidden; reduced motion
uses a still pose. The introductory ledges are present in the HTML before paint
so the animation script does not shift page content.

The original generated artwork, optimized delivery asset, and generation prompt
are documented in `assets/mascot/README.md`.

Verification of the refinement covers caption clearance and overflow at 360, 390,
768, 820, 1024, 1280, 1440, 1600, and 2000 pixels, plus all 16 pages at mobile and
desktop sizes. Browser checks confirm the wake/walk sequence, section peeks,
footer return, intrinsic mobile image ratios, reduced motion, menu, image dialogs,
and demo navigation. No console errors or failed asset responses were observed.
The final local mobile Lighthouse run scored **93 / 100 / 100 / 100** for
performance, accessibility, best practices, and SEO, with **0.038** layout shift
and **0 ms** total blocking time.

## Interactive companion refinement

Proposed score: **38/40** — intuitive 9, ease of use 9, delight 10, aesthetics 10.
This preserves the approved layout, typography, palette, responsive image sizing,
caption clearance, pixel arrows, project links, and demo behavior.

The opening ledge now tells one story: breathing and pixel snores, an expanding
sleep bubble, a small pop, a startled hop, a stretch, and a long walk along the
available ledge. Eight new walk frames replace the old two-pose approximation.
Horizontal travel uses a normalized position, so every step remains inside the
current line at every viewport width. The end-of-page scene licks a paw, washes
its face, then turns to meet the viewer's gaze.

Middle appearances mark selected section boundaries, with six entrance styles,
varied positions and facing directions, and variation by page and visit. They
physically retreat behind the edge after a few seconds. Individual project images
and gallery frames no longer each get a cat. A visible cat keeps its scene until
it leaves the viewport; viewport-height and browser-toolbar changes never restart
the animation or fade it. Width changes only register its horizontal position.

This supersedes the earlier decorative-only interaction: the character is now a
native, labelled button, usable with touch, mouse, Enter, or Space. A first pet
gets a warm reaction and a pixel heart. Repeated taps within a short interval get
a mild, charmingly annoyed reaction. The interrupted scene resumes in place.
Reactions have a polite accessible status. Reduced motion retains still poses and
tap feedback without animated effects or haptics.

WebHaptics 0.0.6 is pinned and served locally with its MIT license. Very short
feedback is enabled only on touch devices after a trusted interaction. Taps are
rate limited, and ambient scene feedback has a fourteen-second cooldown. No
feedback accompanies individual footsteps or continuous scrolling, and no debug
audio is enabled. Physical feedback depends on the device and browser.

The generated masters, registered delivery atlas, exact generation prompt, and
reproducible asset registration script are in `assets/mascot/`.

Verification: all sixteen pages at 390 and 1440 pixels, including opening and
footer scenes, curated cue touch targets, no horizontal overflow, no interactive
button inside links or hidden accessibility ancestors, and no failed asset loads
or page errors. Focused checks cover snore/pop/startle timing, all eight walk
frames, travel bounds, rapid petting and cooldown, keyboard petting, scene resume,
mobile scroll jitter and height changes, reduced motion, mobile navigation, and
the unsupported-vibration fallback. Haptic timing was checked with a browser
stub; physical device feedback was not measured. The local mobile Lighthouse run
remains **93 / 100 / 100 / 100**, with **0.038** CLS and **0 ms** blocking time.
