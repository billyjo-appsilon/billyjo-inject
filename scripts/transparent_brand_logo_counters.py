#!/usr/bin/env python3
"""Remove white matte from enclosed brand-letter counters.

The source cutouts remain unchanged.  Outputs are versioned PNGs so the
original artwork stays available as a rollback asset.  Most affected marks
are single-colour wordmarks, where white-to-alpha is safe over the full
canvas.  CHUNGHO keeps its intentional white English lettering, so only the
Korean wordmark region is processed.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "images" / "brands"

JOBS = (
    ("wells-horizontal-20261119.png", "wells-transparent-counters-20261127.png", None),
    ("chungho-horizontal-20261119.png", "chungho-transparent-counters-20261127.png", ((48, 0, 145, 34),)),
    ("cuckoo-horizontal-20261119.png", "cuckoo-transparent-counters-20261127.png", None),
    ("coway-horizontal-20261119.png", "coway-transparent-counters-20261127.png", None),
    ("quming-horizontal-20261119.png", "quming-transparent-counters-20261127.png", None),
)


def white_to_alpha(
    image: Image.Image,
    regions: tuple[tuple[int, int, int, int], ...] | None,
    soft_start: int = 200,
) -> tuple[Image.Image, int]:
    output = image.convert("RGBA")
    pixels = output.load()
    boxes = regions or ((0, 0, output.width, output.height),)
    changed = 0

    for left, top, right, bottom in boxes:
        if not (0 <= left < right <= output.width and 0 <= top < bottom <= output.height):
            raise ValueError(f"invalid processing region {(left, top, right, bottom)} for {output.size}")
        for y in range(top, bottom):
            for x in range(left, right):
                red, green, blue, source_alpha = pixels[x, y]
                if source_alpha == 0:
                    continue

                # GIMP-style color-to-alpha for a white matte.  A solid brand
                # colour remains opaque; pure white becomes transparent; and
                # anti-aliased white blends become partially transparent with
                # their underlying brand colour recovered.
                minimum_channel = min(red, green, blue)
                if minimum_channel <= soft_start:
                    continue
                alpha_factor = 0 if minimum_channel >= 244 else (255 - minimum_channel) / (255 - soft_start)
                target_alpha = round(source_alpha * alpha_factor)
                if target_alpha == 0 or alpha_factor == 0:
                    pixels[x, y] = (0, 0, 0, 0)
                else:
                    restored = tuple(
                        max(0, min(255, round((channel - 255 * (1 - alpha_factor)) / alpha_factor)))
                        for channel in (red, green, blue)
                    )
                    pixels[x, y] = (*restored, target_alpha)
                changed += 1

    return output, changed


def main() -> None:
    for source_name, output_name, regions in JOBS:
        source_path = BRAND_DIR / source_name
        output_path = BRAND_DIR / output_name
        with Image.open(source_path) as source:
            output, changed = white_to_alpha(source, regions)
        output.save(output_path, format="PNG", optimize=True)
        alpha = output.getchannel("A")
        minimum, maximum = alpha.getextrema()
        if minimum != 0 or maximum != 255:
            raise RuntimeError(f"{output_name}: expected full alpha range, got {(minimum, maximum)}")
        print(f"{output_name}: {output.width}x{output.height}, alpha-adjusted pixels={changed}")


if __name__ == "__main__":
    main()
