"""Register generated sprite cells into a lossless delivery atlas (requires Pillow)."""

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
TILE = 96


def bounds(image):
    """Trim transparent padding using the largest connected opaque silhouette."""
    mask = image.getchannel("A").point(lambda value: 255 if value >= 160 else 0)
    width, height = mask.size
    pixels = mask.load()
    seen, largest = set(), []
    for y in range(height):
        for x in range(width):
            if not pixels[x, y] or (x, y) in seen:
                continue
            queue = deque([(x, y)])
            seen.add((x, y))
            component = []
            while queue:
                xx, yy = queue.popleft()
                component.append((xx, yy))
                for point in [(xx - 1, yy), (xx + 1, yy), (xx, yy - 1), (xx, yy + 1)]:
                    px, py = point
                    if (0 <= px < width and 0 <= py < height
                            and point not in seen and pixels[px, py]):
                        seen.add(point)
                        queue.append(point)
            if len(component) > len(largest):
                largest = component
    if not largest:
        raise ValueError("Expected an opaque character in each sprite cell")
    xs, ys = zip(*largest)
    return (max(0, min(xs) - 3), max(0, min(ys) - 3),
            min(width, max(xs) + 4), min(height, max(ys) + 4))


def cell(sheet, column, row, columns):
    image = sheet.crop((
        column * sheet.width // columns, row * sheet.height // columns,
        (column + 1) * sheet.width // columns, (row + 1) * sheet.height // columns,
    ))
    return image.crop(bounds(image))


def place(atlas, image, index, scale, baseline):
    image = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.NEAREST,
    )
    atlas.alpha_composite(
        image, (index * TILE + (TILE - image.width) // 2, baseline - image.height),
    )


def main():
    # Masters are read only. Registration changes delivery geometry, never artwork.
    new = Image.open(ROOT / "cat-story-source.png").convert("RGBA")
    old = Image.open(ROOT / "cat-sprites.png").convert("RGBA")
    frames = [cell(new, column, row, 4) for row in range(4) for column in range(4)]
    scale = min(90 / max(i.width for i in frames), 76 / max(i.height for i in frames))
    atlas = Image.new("RGBA", (TILE * 19, TILE))
    for index, image in enumerate(frames):
        place(atlas, image, index, scale, 78)
    for index, (column, row) in enumerate([(0, 0), (1, 0), (1, 1)], 16):
        image = cell(old, column, row, 2)
        scale = min(90 / image.width, 76 / image.height)
        baseline = 92 if index == 16 else 82 if index == 18 else 78
        place(atlas, image, index, scale, baseline)
    output = ROOT / "cat-atlas.webp"
    atlas.save(output, "WEBP", lossless=True, method=6)
    print(f"Registered 19 frames: {atlas.size}, {output.stat().st_size} bytes")


if __name__ == "__main__":
    main()
