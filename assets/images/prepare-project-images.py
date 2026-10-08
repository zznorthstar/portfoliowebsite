"""Make responsive WebP derivatives of supplied project artwork; requires Pillow."""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SOURCES = {
    **{f"docchaser-{n}": f"docchaser-{n}.png" for n in range(1, 5)},
    # The supplied filenames are reversed relative to the screens they depict.
    "recruiterai-landing": "recruiterai-board.png",
    "recruiterai-board": "recruiterai-landing.png",
    "listing-photo-pipeline": "auto image editor.png",
}


def main():
    for name, filename in SOURCES.items():
        image = ImageOps.exif_transpose(Image.open(ROOT / filename)).convert("RGB")
        for width in [640, 960, image.width]:
            resized = image if width == image.width else image.resize(
                (width, round(image.height * width / image.width)),
                Image.Resampling.LANCZOS,
            )
            suffix = "" if width == image.width else f"-{width}"
            output = ROOT / "assets/images" / f"{name}{suffix}.webp"
            resized.save(output, "WEBP", quality=88, method=6)
            print(output.name, resized.size, output.stat().st_size)


if __name__ == "__main__":
    main()
