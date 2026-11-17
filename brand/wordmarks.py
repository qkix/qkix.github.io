#!/usr/bin/env python3
"""HISTORY: the wordmark candidates the owner picked from (17 Nov 2026: number 4, QKIX on blocks - now gen_brand.py).
Wordmark candidates for the qkix lockup (owner, 17 Nov 2026: the thin pixel "qkix" was so-so) - a contact sheet
to pick from: brand/out/wordmarks.png (each beside the mark's tile, on light and on dark).

    python3 brand/wordmarks.py
"""
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

import gen_brand as B

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand" / "out"
RUBIK = ROOT / "node_modules" / "@fontsource" / "rubik" / "files" / "rubik-latin-800-normal.woff"
S = 0.5                                              # the sheet's scale (tile 512 -> 256)
NAVY, CREAM, AMBER = B.NAVY, B.CREAM, B.AMBER


def grid_word(d, x0, y0, letters, cell, ink, gap=1):
    """Letters from grids ('X' ink, 'A' amber); returns the right edge."""
    x = x0
    for rows in letters:
        for y, row in enumerate(rows):
            for cx, ch in enumerate(row):
                if ch != ".":
                    d.rectangle((x + cx * cell, y0 + y * cell, x + (cx + 1) * cell - 1, y0 + (y + 1) * cell - 1),
                                fill=AMBER if ch == "A" else ink)
        x += (max(len(r) for r in rows) + gap) * cell
    return x - gap * cell


def mark(d, x0, y0, size, frame):
    """The bare mark (frame + sliding block) in a size x size box."""
    k = size / 336.0                                    # the mark spans 88..424 in tile units
    for x, y, w, h, c in B.rects_mark(frame=frame):
        d.rectangle((x0 + (x - 88) * k, y0 + (y - 88) * k, x0 + (x - 88 + w) * k - 1, y0 + (y - 88 + h) * k - 1), fill=c)


def v1(d, x0, y0, ink, bg):        # the mark is the q; k i x from the same blocks (cell = a third of the frame)
    c = 300 * S / 3
    mark(d, x0, y0 + c, 336 * S, CREAM if bg == NAVY else NAVY)
    letters = [["X..", "X.X", "XX.", "X.X"], ["A", "X", "X", "X"], ["X.X", ".X.", "X.X"]]
    x = x0 + 336 * S + c * 0.6
    x = grid_word(d, x, y0, letters[:1], c, ink)
    x = grid_word(d, x + c, y0, letters[1:2], c, ink)
    grid_word(d, x + c, y0 + c, letters[2:], c, ink)


def v2(d, x0, y0, ink, bg, font):  # Rubik 800, dotless i + the amber block as its dot
    size = int(330 * S)
    d.text((x0, y0 + 300 * S), "qkıx", font=font, fill=ink, anchor="ls")
    w_qk = d.textlength("qk", font=font)
    l, t, r, _ = font.getbbox("\u0131", anchor="ls")         # the dotless i's stem, relative to the baseline
    base = y0 + 300 * S
    stem = r - l
    x = x0 + w_qk + l
    d.rectangle((x, base + t - stem * 1.35, x + stem - 1, base + t - stem * 0.35 - 1), fill=AMBER)


def v3(d, x0, y0, ink, bg):        # heavy pixel: 2-cell strokes
    c = 300 * S / 10
    letters = [
        ["......", "......", "......", "......", "XXXXXX", "XXXXXX", "XX..XX", "XX..XX", "XXXXXX", "XXXXXX", "....XX", "....XX"],
        ["XX....", "XX....", "XX....", "XX....", "XX..XX", "XX.XX.", "XXXX..", "XXXX..", "XX.XX.", "XX..XX", "......", "......"],
        ["AA", "AA", "..", "..", "XX", "XX", "XX", "XX", "XX", "XX", "..", ".."],
        ["......", "......", "......", "......", "XX..XX", "XX..XX", ".XXXX.", ".XXXX.", "XX..XX", "XX..XX", "......", "......"],
    ]
    grid_word(d, x0, y0, letters, c, ink)


def v4(d, x0, y0, ink, bg):        # QKIX in capitals on 3x3 blocks, the Q = the mark
    c = 300 * S / 3
    mark(d, x0, y0, 336 * S, CREAM if bg == NAVY else NAVY)
    letters = [["X.X", "XX.", "X.X"], ["A", "X", "X"], ["X.X", ".X.", "X.X"]]
    x = x0 + 336 * S + c * 0.5
    for L in letters:
        x = grid_word(d, x, y0, [L], c, ink) + c * 0.5


def main():
    tt = TTFont(str(RUBIK))
    tt.flavor = None
    ttf = Path(tempfile.gettempdir()) / "qkix-rubik-800.ttf"           # PIL needs a TTF; not kept in the repo
    tt.save(str(ttf))
    font = ImageFont.truetype(str(ttf), int(330 * S))
    variants = [("1  the mark is the q, k i x from its blocks", v1), ("2  Rubik heavy, the amber block as the dot", None),
                ("3  heavy pixel, 2-cell strokes", v3), ("4  QKIX in capitals, Q = the mark", v4)]
    W, rowh = 1500, int(512 * S) + 60
    sheet = Image.new("RGB", (W * 2 + 40, rowh * len(variants) + 20), (120, 120, 120))
    lab = ImageFont.truetype(str(ttf), 22)
    for r, (name, fn) in enumerate(variants):
        for col, (bg, ink) in enumerate(((255, 255, 255), NAVY), ((NAVY, CREAM),)) if False else enumerate((("#ffffff", NAVY), (NAVY, CREAM))):
            panel = Image.new("RGB", (W, rowh - 10), bg)
            d = ImageDraw.Draw(panel)
            tile = B.png(*([B.TILE, B.TILE, B.rects_mark()]), int(512 * S), B.NAVY, B.RADIUS)
            if fn not in (v1, v4):
                panel.paste(tile, (20, 30), tile)
                x0 = 20 + int(512 * S) + 50
            else:
                x0 = 40
            y0 = 30 + int(88 * S)
            if fn is None:
                v2(d, x0, y0, ink, bg, font)
            else:
                fn(d, x0, y0, ink, bg)
            d.text((12, 6), name, font=lab, fill=(150, 150, 150))
            sheet.paste(panel, (col * (W + 20) + 10, r * rowh + 10))
    sheet.save(OUT / "wordmarks.png")
    print(OUT / "wordmarks.png")


if __name__ == "__main__":
    main()
