"""Encode the reviewed Figma PNG masters without changing their composition."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / "assets/images/showcases"
DEST.mkdir(parents=True, exist_ok=True)
manifest = []
for source in sorted((Path(__file__).parent / "exports").glob("*.png")):
    image = Image.open(source).convert("RGBA")
    widths = [600, 1200] if "-mobile-" in source.stem else [960, 1920]
    assert image.width == max(widths), f"Expected a 2x Figma export: {source}"
    assert image.getchannel("A").getextrema() == (0, 255), f"Missing alpha: {source}"
    for width in widths:
        size = (width, round(image.height * width / image.width))
        scaled = image if size == image.size else image.resize(size, Image.Resampling.LANCZOS)
        target = DEST / f"{source.stem}-{width}.webp"
        scaled.save(target, "WEBP", quality=94, method=6, exact=True)
        manifest.append({"file": str(target.relative_to(ROOT)), "width": width,
                         "height": size[1], "bytes": target.stat().st_size})
(Path(__file__).parent / "exports/manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
