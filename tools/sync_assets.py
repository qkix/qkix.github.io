#!/usr/bin/env python3
"""Copies the games' art, trailers and privacy policies into the site (run from the repo root):

    python3 tools/sync_assets.py [path/to/arcade]      # default: ../arcade

The games live in private repos (cloned under arcade/), so everything the site shows is copied
here and committed: public/img (diorama sprites, the pixel font), public/<game>/ (icon, feature
graphic, store screenshots), public/video (trailers + posters), src/content/privacy (the policies'
source text, the games' docs/privacy-policy.md). Pixel art is only ever scaled by whole numbers.
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ARCADE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "arcade"
PUB = ROOT / "public"

# game -> store screenshots shown on its page (store/screenshots/<lang>/<name>.png, en at the top)
SHOTS = {
    "hoplow": ["2_run", "3_fox", "6_tunnel", "5_win", "7_levels"],
    "inchway": ["2_drive", "6_emergency", "7_winter", "9_city", "10_garage"],
    "brick-tanks": ["2_battle", "6_boss", "4_winter", "5_night", "8_hangar"],
}
LANGS = ["en", "pl"]

# the home page's diorama: site name -> game sprite
H, I, B = "hoplow/assets/sprites/", "inchway/assets/sprites/", "brick-tanks/assets/sprites/"
SPRITES = {
    "grass": H + "outer_meadow.png", "flowers0": H + "flowers_meadow_0.png", "flowers1": H + "flowers_meadow_1.png",
    "carrot": H + "carrot.png", "shadow": H + "shadow.png", "sparkle0": H + "sparkle_0.png",
    "sparkle": H + "sparkle_1.png", "heart": H + "heart.png",
    "bfly0": H + "butterfly_1_0.png", "bfly1": H + "butterfly_1_1.png",
    **{f"tree{i}": H + f"tree_meadow_{i}.png" for i in range(4)},
    **{f"bunny_{d}_{f}": H + f"bunny_white_{d}_{f}.png"
       for d in ("side", "left", "down") for f in ("idle0", "idle1", "hop", "blink")},
    **{f"friend_{d}_{f}": H + f"friend_grey_{d}_{f}.png"
       for d, fs in (("side", ("idle0", "hop")), ("left", ("idle0", "hop")),
                     ("down", ("idle0", "idle1", "blink", "wave0", "wave1"))) for f in fs},
    "asphalt": I + "asphalt_tile.png", "player": I + "player_gold.png",
    **{f"car{i}": I + f"car_{c}.png" for i, c in enumerate(["white", "yellow", "green", "black"])},
    "brick": B + "brick.png", "bush": B + "trees.png", "tank": B + "tank_player.png",
}


def save(im, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)


def scaled(src, width):
    """Nearest-neighbour to `width` (store art is a whole multiple of the game's pixels)."""
    im = Image.open(src).convert("RGBA")
    return im.resize((width, round(im.height * width / im.width)), Image.NEAREST)


def policy(game):
    """docs/privacy-policy.md -> frontmatter (title, updated) + the body from the first section."""
    md = (ARCADE / game / "docs" / "privacy-policy.md").read_text(encoding="utf-8")
    title = re.search(r"^# (.+)$", md, re.M).group(1).strip()
    updated = re.search(r"^_Last updated: (.+)_$", md, re.M).group(1).strip()
    body = md[md.index("\n", md.index("_Last updated")) + 1:].strip() + "\n"
    out = ROOT / "src" / "content" / "privacy" / f"{game}.md"
    out.write_text(f"---\ntitle: \"{title}\"\nupdated: \"{updated}\"\n---\n\n{body}", encoding="utf-8")


def video(game, lang):
    """build/trailer/trailer_<lang>.mp4 (1920x1080, make_trailer.py) -> 1280x720 for the web + a poster."""
    src = ARCADE / game / "build" / "trailer" / f"trailer_{lang}.mp4"
    out = PUB / "video" / f"{game}_{lang}.mp4"
    if not src.exists():
        return out.exists()
    out.parent.mkdir(parents=True, exist_ok=True)
    ff = ["ffmpeg", "-loglevel", "error", "-y"]
    subprocess.run(ff + ["-i", str(src), "-vf", "scale=1280:720:flags=area", "-c:v", "libx264", "-preset", "slow",
                         "-crf", "22", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)], check=True)
    subprocess.run(ff + ["-ss", "1", "-i", str(out), "-frames:v", "1", "-q:v", "3",
                         str(out.with_suffix(".jpg"))], check=True)
    return True


def main():
    if not (ARCADE / "hoplow").exists():
        sys.exit(f"no games under {ARCADE} - pass the arcade folder")
    for name, src in SPRITES.items():
        save(Image.open(ARCADE / src).convert("RGBA"), PUB / "img" / "sprites" / f"{name}.png")
    (PUB / "fonts").mkdir(parents=True, exist_ok=True)
    shutil.copy(ARCADE / "inchway" / "assets" / "fonts" / "QkixPixel.ttf", PUB / "fonts" / "QkixPixel.ttf")
    for game, names in SHOTS.items():
        store = ARCADE / game / "store"
        save(scaled(store / "icon_512.png", 256), PUB / game / "icon.png")
        save(scaled(store / "feature_graphic.png", 1024), PUB / game / "feature.png")
        for lang in LANGS:
            folder = store / "screenshots" / ("" if lang == "en" else lang)
            for n in names:
                if (folder / f"{n}.png").exists():
                    save(scaled(folder / f"{n}.png", 360), PUB / game / "shots" / lang / f"{n}.png")
            if not video(game, lang) and lang == "en":
                print(f"warning: no trailer for {game} (build/trailer/trailer_en.mp4)")
        policy(game)
    print("OK")


if __name__ == "__main__":
    main()
