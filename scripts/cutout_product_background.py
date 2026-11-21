#!/usr/bin/env python3
"""Remove only border-connected near-white product-photo backgrounds.

Unlike the logo normalizer, this keeps the source canvas so product scale and
placement remain stable in the live cards. Animated inputs remain animated
when the output extension is .webp.
"""

from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--soft-start", type=int, default=230)
    parser.add_argument("--transparent-at", type=int, default=248)
    return parser.parse_args()


def cutout_frame(source: Image.Image, soft_start: int, transparent_at: int) -> Image.Image:
    image = source.convert("RGBA")
    width, height = image.size
    pixels = image.load()
    connected = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def eligible(x: int, y: int) -> bool:
        red, green, blue, alpha = pixels[x, y]
        return alpha > 0 and min(red, green, blue) >= soft_start

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if connected[index] or not eligible(x, y):
            return
        connected[index] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if not connected[index]:
                continue
            red, green, blue, alpha = pixels[x, y]
            white = min(red, green, blue)
            if white >= transparent_at:
                replacement_alpha = 0
            else:
                replacement_alpha = round(
                    255 * (transparent_at - white) / (transparent_at - soft_start)
                )
            pixels[x, y] = (red, green, blue, min(alpha, replacement_alpha))

    return image


def main() -> None:
    args = parse_args()
    if not 0 <= args.soft_start < args.transparent_at <= 255:
        raise SystemExit("require 0 <= soft-start < transparent-at <= 255")

    source = Image.open(args.input)
    frame_count = getattr(source, "n_frames", 1)
    frames: list[Image.Image] = []
    durations: list[int] = []

    for index in range(frame_count):
        source.seek(index)
        frames.append(cutout_frame(source, args.soft_start, args.transparent_at))
        durations.append(int(source.info.get("duration", 0)))

    args.output.parent.mkdir(parents=True, exist_ok=True)
    save_options: dict[str, object] = {}
    if frame_count > 1:
        if args.output.suffix.lower() != ".webp":
            raise SystemExit("animated input requires a .webp output")
        save_options = {
            "save_all": True,
            "append_images": frames[1:],
            "duration": durations,
            "loop": int(source.info.get("loop", 0)),
            "lossless": True,
            "method": 6,
        }
    elif args.output.suffix.lower() == ".webp":
        save_options = {"lossless": True, "method": 6}
    else:
        save_options = {"optimize": True}

    frames[0].save(args.output, **save_options)
    alpha_extrema = frames[0].getchannel("A").getextrema()
    report = {
        "input": str(args.input),
        "output": str(args.output),
        "size": list(frames[0].size),
        "frames": frame_count,
        "alphaMin": alpha_extrema[0],
        "alphaMax": alpha_extrema[1],
    }
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
