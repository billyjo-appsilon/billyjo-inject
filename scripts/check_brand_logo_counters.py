#!/usr/bin/env python3
"""Regression checks for transparent counters in active product-card logos."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "images" / "brands"

EXPECTED_TRANSPARENT = {
    "wells-transparent-counters-20261127.png": ((230, 58),),
    "chungho-transparent-counters-20261127.png": ((79, 15), (114, 15), (60, 22)),
    "cuckoo-transparent-counters-20261127.png": ((73, 12), (90, 12)),
    "coway-transparent-counters-20261127.png": ((32, 10), (80, 10)),
    "quming-transparent-counters-20261127.png": ((55, 50), (55, 93), (445, 82)),
}

EXPECTED_OPAQUE = {
    "wells-transparent-counters-20261127.png": ((20, 70),),
    "chungho-transparent-counters-20261127.png": ((15, 16), (60, 10)),
    "cuckoo-transparent-counters-20261127.png": ((8, 12),),
    "coway-transparent-counters-20261127.png": ((8, 10),),
    "quming-transparent-counters-20261127.png": ((20, 70), (320, 80)),
    "lg-electronics-horizontal-20261119.png": ((55, 55),),
}


def main() -> None:
    failures: list[str] = []
    for name, points in EXPECTED_TRANSPARENT.items():
        with Image.open(BRAND_DIR / name).convert("RGBA") as image:
            minimum, maximum = image.getchannel("A").getextrema()
            if (minimum, maximum) != (0, 255):
                failures.append(f"{name}: alpha range {(minimum, maximum)} != (0, 255)")
            for point in points:
                alpha = image.getpixel(point)[3]
                if alpha != 0:
                    failures.append(f"{name}: counter {point} alpha={alpha}, expected 0")

    for name, points in EXPECTED_OPAQUE.items():
        with Image.open(BRAND_DIR / name).convert("RGBA") as image:
            for point in points:
                alpha = image.getpixel(point)[3]
                if alpha < 240:
                    failures.append(f"{name}: protected artwork {point} alpha={alpha}, expected >=240")

    if failures:
        raise SystemExit("\n".join(failures))
    print(f"brand logo counter alpha checks passed: {sum(map(len, EXPECTED_TRANSPARENT.values()))} counters")


if __name__ == "__main__":
    main()
