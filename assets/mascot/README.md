# Pixel companion artwork

Generated using the built-in imagegen tool. No generation service is used at runtime.

- `cat-sprites.png`: original transparent artwork, 1254 × 1254 pixels, preserved unchanged.
- `cat-sprites.webp`: 384 × 384 delivery derivative, nearest-neighbor sampling and
  lossless WebP encoding. About 85 KB; transparency is preserved.
- Four equal cells: sleeping, awake, walking, and peeking, in reading order.
- CSS in `../mascot.css` selects cells with background position. A single character
  is moved between decorative perches by `../mascot.js`.

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
