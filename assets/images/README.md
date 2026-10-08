# Refreshed project imagery

The seven user-supplied PNG sources live at the repository root. All are
1448 × 1086 (4:3). They are preserved as supplied, without cropping, outpainting,
or regenerated content.

| Source                    | Delivery name            | Placement                                                  |
| ------------------------- | ------------------------ | ---------------------------------------------------------- |
| `docchaser-1.png`         | `docchaser-1`            | Homepage preview and Doc Chaser gallery                    |
| `docchaser-2.png`         | `docchaser-2`            | Doc Chaser gallery                                         |
| `docchaser-3.png`         | `docchaser-3`            | Doc Chaser gallery                                         |
| `docchaser-4.png`         | `docchaser-4`            | Doc Chaser gallery                                         |
| `recruiterai-board.png`   | `recruiterai-landing`    | RecruiterAI role-entry / landing gallery image             |
| `recruiterai-landing.png` | `recruiterai-board`      | Homepage board preview and RecruiterAI board gallery image |
| `auto image editor.png`   | `listing-photo-pipeline` | Homepage Listing photo pipeline preview                    |

`prepare-project-images.py` makes WebP delivery files at 640 × 480, 960 × 720,
and the native 1448 × 1086. It requires Pillow, preserves the entire composition,
and uses Lanczos resizing with WebP quality 88. No source is upscaled. No image
generation was necessary because the supplied aspect ratio fits the existing
contain-style gallery and project preview components.

The two supplied RecruiterAI filenames describe the opposite screens: the source
named `recruiterai-landing.png` shows the board, and `recruiterai-board.png` shows
the role-entry simulator. Delivery names follow the actual screen content while
the original source filenames remain untouched.

HTML dimensions and responsive source descriptors match these files. The pipeline
illustration uses the existing project preview treatment rather than the old
photo-cover treatment, so titles and callouts remain fully visible. Gallery
enlargement requests the native-width WebP instead of the smaller mobile source.
The existing gallery grids, frame heights, spacing, and project layout are retained.
