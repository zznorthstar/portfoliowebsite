# Pixel companion artwork

Generated using the built-in imagegen tool. No generation service is used at runtime.

- `cat-sprites.png`: original transparent artwork, 1254 × 1254 pixels, preserved unchanged.
- `cat-sprites.webp`: 384 × 384 delivery derivative, nearest-neighbor sampling and
  lossless WebP encoding. About 85 KB; transparency is preserved.
- Four equal cells: sleeping, awake, walking, and peeking, in reading order.
- The original four-pose implementation used this sheet directly. The interactive
  companion now uses the registered atlas described below.

## Generation prompt

Use case: stylized-concept. Asset type: production pixel-art mascot animation sprite
sheet for a modern personal portfolio. Create ONE square 1024x1024 transparent PNG
sprite sheet with EXACTLY FOUR cells in a precise 2 by 2 grid. Each cell occupies
512x512. No text, no labels, no floor, no background, no shadow, no border, no extra
graphics. All four show the SAME charming small orange cat, original design, not a
copy of any existing mascot. Palette strictly terracotta orange #ed8355, deeper
orange #b84a22, warm cream #f3f3e9, charcoal #242422. Chunky sharp square pixels,
classic low-resolution 32x32 pixel-art sprite aesthetic enlarged with nearest-neighbor
blocks, no blur/gradients/smooth curves/anti-aliased painting. Cute triangular ears,
tiny charcoal eyes, cream muzzle and chest, distinct tail, orange paws. Consistent
character size and silhouette across cells. Keep each entire cat within its cell
and generously separated from other cells. Row1 column1: horizontal sleeping cat
facing RIGHT, curled tail on LEFT, head resting on body to RIGHT, eyes closed, one
front paw hanging DOWN over an imagined invisible ledge. Its body rests on a
baseline at y=416 within its cell; hanging paw extends down to y=464. Row1 column2:
awake cat in side profile facing RIGHT, all feet on baseline y=416 within its cell,
ears perked, sweet attentive expression. Row2 column1: same cat walking RIGHT in
side profile, tail lifted LEFT, alternate front and back paws mid-step, foot
baseline y=416 within its cell. Row2 column2: same cat facing forward, peeking head
and two front paws over an imagined invisible panel; head and ears above baseline
y=416 within its cell, paws rest over that baseline and extend slightly below.
IMPORTANT: exact square 2x2 grid, cells equally sized, no artwork crosses a cell
boundary. Genuine transparent alpha everywhere around sprites. Draw no ledges or
ground lines: website CSS supplies those. Pixel artwork only, consistent sprite character.

## Interactive story artwork (October 2026)

- `cat-story-source.png`: original 1254 × 1254, 4 × 4, sixteen-pose transparent generated
  master, preserved unchanged.
- `cat-atlas.webp`: 1824 × 96, nineteen registered 96 × 96 frames; lossless WebP,
  about 159 KB. Nearest-neighbor delivery resizing, common scale for the new
  frames, center registration, and a shared foot baseline keep the walk grounded.
- Frames 0–7: full eight-frame walking cycle. Frames 8–11: paw licking, face
  grooming, head turn, and front-facing gaze. Frames 12–15: happy pet, annoyed
  pet, startled hop, and stretch. Frames 16–18: original sleep, awake, and peek.
- Sleep's paw hangs below the ledge; all walking feet register to y=78/96.
  Snoring, the breathing bubble, pop particles, hearts, and steam are code-native
  decorations in the site's palette. No audio or generation runs in the browser.
- `register-atlas.py` reproduces the delivery atlas using Pillow. It only trims
  transparent cell padding and registers/resizes frames; it does not edit masters.
- One native button visits curated section edges. It is keyboard accessible,
  touchable in every pose, and respects reduced motion. No cat per gallery image.

### Mobile rendering correction

The atlas is decoded once, then exact 96 × 96 integer source rectangles are drawn
to a canvas. CSS no longer positions a scaled nineteen-frame background strip.
Only walking installs a frame ticker; it stops when interrupted or off-screen.
Grooming and reaction poses paint a complete tile when the pose changes. The
sleep bubble's bottom-left origin is registered to nose coordinate (62, 66),
so it grows above the muzzle. On phones, section cameos require clear space
across their entrance area and are omitted where text or controls would overlap.

### Exact generation prompt

Create a production pixel-art CHARACTER ANIMATION SPRITE SHEET extending the orange cat in the reference. Preserve the same original orange tabby identity, proportions, face, stripes, cream muzzle/chest, palette (#ed8355 orange, #b84a22 darker orange, #f3f3e9 cream, #242422 charcoal), chunky crisp pixels, and cute expression. Transparent alpha, no shadows, text, labels, grid lines, backgrounds or ground. EXACT 4 columns x 4 rows square grid, SIXTEEN equal cells, generous transparent padding around every pose. Every character fully inside its cell. Consistent scale and ground baseline at 80% of each cell height. All side views face RIGHT, tail LEFT. Row 1 cells 1-4 and Row 2 cells 1-4: EIGHT sequential frames of one natural feline WALK CYCLE in profile, not running. Same body/head position in all eight frames; only limbs, shoulder bob, and tail move naturally through contact, recoil, passing, high-point and opposite contacts. Four legs clearly distinct and anatomically sensible; alternating front/back paws and relaxed lifted tail. These are sequential animation frames and must align perfectly in size and baseline. Row3 cell1: sitting, licking raised right front paw, head tipped down, eyes closed. Row3 cell2: sitting, paw sweeps over ear/face while grooming. Row3 cell3: seated, grooming paw lowered, turning head toward viewer. Row3 cell4: seated, looking straight AT VIEWER with very cute big eyes and relaxed cream front paws, soft smile. Row4 cell1: delighted friendly touch reaction, eyes closed happy, head leaned into pet, tiny lifted front paw, NO floating symbols. Row4 cell2: slightly annoyed but still charming, narrowed eyes, ears sideways, flicked tail, NO aggression or scary features. Row4 cell3: startled wake-up, ears alert, eyes wide, paws off ground as a tiny surprised hop. Row4 cell4: stretch after waking, front paws extended right, back gently arched, tail lifted. The reference sheet is for CHARACTER IDENTITY ONLY. Make a fresh sheet with the sixteen specified frames, not the old four poses. Same pixel resolution and style in every cell. Very clean pixel-art animation asset, no blur/antialias painting, transparency everywhere around the character.
