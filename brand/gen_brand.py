#!/usr/bin/env python3
"""qkix's logo, drawn from pixel grids (owner's pick, 17 Nov 2026: Fable's concept 3 "slot block").

The mark: a cream 3x3 block frame read as a Q - its centre is the counter, its bottom-right cell is missing, and an
amber block is sliding into that slot (a game piece clicking into place, a plugin slotting in). The wordmark: QKIX, the
mark as its Q and K I X from the same blocks, the I's top block amber. Everything is whole cells, so the
SVGs are crisp at any size and the PNGs are drawn straight from the same grids (no SVG renderer needed).

    python3 brand/gen_brand.py      # -> brand/out/*.svg *.png and public/brand/ (what the site serves)
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand" / "out"
PUB = ROOT / "public" / "brand"
NAVY, CREAM, AMBER = "#1c1f33", "#f7f1df", "#f0a500"
TILE, RADIUS = 512, 112                 # the app-icon-like tile the mark sits on

# The mark on a 100-unit grid inside the 512 tile: the frame (cells) + the sliding block (its own offset).
FRAME = ["XXX",
         "X.X",
         "XX."]
FRAME_AT, CELL = 88, 100
BLOCK_AT = 324                          # the amber block: 36 units out of its slot, sliding in
# The wordmark (owner's pick of four, 17 Nov 2026): QKIX in capitals on the mark's own 3x3 block grid - the Q IS the mark
# (frame + the amber block sliding in), then K, I, X from the same 100-unit blocks; the I's top block is amber.
LETTERS = {"K": ["X.X", "XX.", "X.X"], "I": ["A", "X", "X"], "X": ["X.X", ".X.", "X.X"]}
LGAP = 50                               # between letters (half a block)


def rects_mark(scale=1.0, dx=0.0, dy=0.0, frame=CREAM):
    """[(x, y, w, h, colour)] of the mark (frame + block), in tile units."""
    out = []
    for y, row in enumerate(FRAME):
        for x, ch in enumerate(row):
            if ch == "X":
                out.append((FRAME_AT + x * CELL, FRAME_AT + y * CELL, CELL, CELL, frame))
    out.append((BLOCK_AT, BLOCK_AT, CELL, CELL, AMBER))
    return [(dx + x * scale, dy + y * scale, w * scale, h * scale, c) for x, y, w, h, c in out]


def rects_word(ink):
    """The QKIX wordmark in its own units: (rects, width, height). The Q = the mark (frame in `ink`)."""
    out = [(x - FRAME_AT, y - FRAME_AT, w, h, c) for x, y, w, h, c in rects_mark(frame=ink)]
    x = BLOCK_AT - FRAME_AT + CELL + LGAP                  # after the sliding block
    for ch in "KIX":
        rows = LETTERS[ch]
        for y, row in enumerate(rows):
            for cx, c in enumerate(row):
                if c != ".":
                    out.append((x + cx * CELL, y * CELL, CELL, CELL, AMBER if c == "A" else ink))
        x += len(rows[0]) * CELL + LGAP
    return out, x - LGAP, BLOCK_AT - FRAME_AT + CELL


def svg(w, h, rects, bg=None, rx=0, comment="", tile=False):
    by = {}
    for x, y, rw, rh, c in rects:
        by.setdefault(c, []).append(f"M{x:g} {y:g}h{rw:g}v{rh:g}h{-rw:g}z")
    body = [f'<rect width="{w:g}" height="{h:g}" rx="{rx:g}" fill="{bg}"/>'] if bg else []
    if tile:
        body.append(f'<rect width="{TILE}" height="{TILE}" rx="{RADIUS}" fill="{NAVY}"/>')
    body += [f'<path fill="{c}" d="{"".join(p)}"/>' for c, p in by.items()]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}">\n'
            f'  <!-- {comment} -->\n  ' + "\n  ".join(body) + "\n</svg>\n")


def png(w, h, rects, size, bg=None, rx=0, circle=False, tile=False):
    k = size / w
    im = Image.new("RGBA", (round(w * k), round(h * k)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if bg:
        if circle:
            d.ellipse((0, 0, im.width - 1, im.height - 1), fill=bg)
        else:
            d.rounded_rectangle((0, 0, im.width - 1, im.height - 1), radius=rx * k, fill=bg)
    if tile:
        d.rounded_rectangle((0, 0, round(TILE * k) - 1, round(TILE * k) - 1), radius=RADIUS * k, fill=NAVY)
    for x, y, rw, rh, c in rects:
        d.rectangle((round(x * k), round(y * k), round((x + rw) * k) - 1, round((y + rh) * k) - 1), fill=c)
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PUB.mkdir(parents=True, exist_ok=True)
    files = {}
    # 1. the mark on its navy tile (app-icon style) and bare (cream + amber, for dark backgrounds)
    files["mark"] = (TILE, TILE, rects_mark(), NAVY, RADIUS, "qkix mark: the slot block on its tile")
    files["mark-bare"] = (TILE - 2 * 76, TILE - 2 * 76, rects_mark(dx=-76, dy=-76), None, 0,
                          "qkix mark without its tile, for dark backgrounds")
    files["mark-navy"] = (TILE - 2 * 76, TILE - 2 * 76, rects_mark(dx=-76, dy=-76, frame=NAVY), None, 0,
                          "qkix mark in navy, for light backgrounds")
    # 2. the wordmark QKIX (also served as lockup*.svg - the site's header): navy for light backgrounds, cream for dark
    for name, ink in (("lockup", NAVY), ("lockup-dark", CREAM)):
        rects, w, h = rects_word(ink)
        files[name] = (w, h, rects, None, 0, f"qkix wordmark QKIX ({'light' if ink == NAVY else 'dark'} background)")
    # 3. the avatar for round crops (X, Instagram, YouTube, GitHub): navy square, the mark smaller in the middle
    av = rects_mark(scale=0.78, dx=256 - 256 * 0.78, dy=256 - 256 * 0.78)
    files["avatar"] = (TILE, TILE, av, NAVY, 0, "qkix avatar: navy square, safe inside a circle crop")
    for name, (w, h, rects, bg, rx, comment) in files.items():
        (OUT / f"{name}.svg").write_text(svg(w, h, rects, bg, rx, comment))
    png(*files["mark"][:3], 512, NAVY, RADIUS).save(OUT / "mark-512.png")
    png(*files["avatar"][:3], 1024, NAVY).save(OUT / "avatar-1024.png")          # upload this to the socials
    png(*files["avatar"][:3], 1024, NAVY, circle=True).save(OUT / "avatar-preview-circle.png")
    png(*files["lockup"][:3], 1600).save(OUT / "lockup-1600.png")
    png(*files["lockup-dark"][:3], 1600).save(OUT / "lockup-dark-1600.png")
    for n in (180, 32, 16):
        png(*files["mark"][:3], n, NAVY, RADIUS).save(OUT / f"mark-{n}.png")
    # what the site serves
    for name in ("mark", "mark-bare", "mark-navy", "lockup", "lockup-dark"):
        (PUB / f"{name}.svg").write_text((OUT / f"{name}.svg").read_text())
    (ROOT / "public" / "favicon.svg").write_text((OUT / "mark.svg").read_text())
    png(*files["mark"][:3], 180, NAVY, RADIUS).save(PUB / "apple-touch-icon.png")
    card = Image.new("RGBA", (1200, 630), NAVY)                       # the social card (og:image) of the home / plugins
    lock = png(*files["lockup-dark"][:3], 760)
    card.alpha_composite(lock, ((1200 - lock.width) // 2, (630 - lock.height) // 2))
    card.convert("RGB").save(PUB / "card.png")
    print("ok:", ", ".join(sorted(p.name for p in OUT.iterdir())))


if __name__ == "__main__":
    main()
