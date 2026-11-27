#!/usr/bin/env python3
"""Normalize home-card product cutouts to the Lovely Tree visual box.

Sources stay untouched. Each output is a versioned PNG on a 570px transparent
canvas. The non-transparent product silhouette is centered and contained in the
523x352px box measured from WP-50C90621N (New Lovely Tree).
"""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
INJECT = ROOT / "inject.js"
CANVAS = (570, 570)
TARGET_BOX = (523, 352)


def product_images() -> list[Path]:
    source = INJECT.read_text(encoding="utf-8")
    match = re.search(r"var PRODUCTS = \[(.*?)\n  \];\n  var TIERS", source, re.S)
    if not match:
        raise RuntimeError("home PRODUCTS block not found")
    paths = re.findall(r"image:\s*'([^']+)'", match.group(1))
    if len(paths) != 24 or len(set(paths)) != 24:
        raise RuntimeError(f"expected 24 unique home product images, got {len(paths)}")
    return [ROOT / path for path in paths]


def output_path(source: Path) -> Path:
    return source.with_name(f"{source.stem}-normalized-v2.png")


def normalize(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError(f"no visible pixels: {source}")
    foreground = image.crop(bbox)
    scale = min(TARGET_BOX[0] / foreground.width, TARGET_BOX[1] / foreground.height)
    size = (
        max(1, round(foreground.width * scale)),
        max(1, round(foreground.height * scale)),
    )
    foreground = foreground.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    position = ((CANVAS[0] - size[0]) // 2, (CANVAS[1] - size[1]) // 2)
    canvas.alpha_composite(foreground, position)
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, "PNG", optimize=True)


def main() -> None:
    for source in product_images():
        if not source.is_file():
            raise FileNotFoundError(source)
        destination = output_path(source)
        normalize(source, destination)
        print(destination.relative_to(ROOT))


if __name__ == "__main__":
    main()
