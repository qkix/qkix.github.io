#!/usr/bin/env python3
"""The Strapi plugins' pages from their own repo (qkix/strapi-plugins, cloned next to this one):

    python3 tools/sync_plugins.py [path to strapi-plugins]     # (npm run sync runs it too)

For each plugin in src/data/plugins.ts (PLUGIN_DIRS below, same order):
  * packages/<dir>/docs/*.{png,svg,gif} -> public/strapi-plugins/<id>/   (logos, screenshots)
  * packages/<dir>/README.md -> src/content/plugins/<id>.md: without its centred header (logo, title, badges - the
    page draws its own) and with images pointed at the copies above
  * src/data/plugins.json: each plugin's version (package.json), its CHANGELOG's latest entries, and the npm downloads
    of the last month (api.npmjs.org, public) of every package it lists
"""
import json
import re
import shutil
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "strapi-plugins"
RAW = "https://raw.githubusercontent.com/qkix/strapi-plugins/main/packages/"
PLUGIN_DIRS = {   # site id -> the plugin's package folder, and every npm package that belongs to the product
    "better-blocks": ("strapi-plugin-better-blocks", ["strapi-plugin-better-blocks", "better-blocks-react-renderer",
                      "better-blocks-astro-renderer", "better-blocks-vue-renderer", "better-blocks-core"]),
    "chartkit": ("strapi-plugin-chartkit", ["strapi-plugin-chartkit", "chartkit-core", "chartkit-react-renderer",
                 "chartkit-astro-renderer", "chartkit-vue-renderer", "chartkit-editor"]),
    "rewind": ("strapi-plugin-rewind", ["strapi-plugin-rewind"]),
    "greenlight": ("strapi-plugin-greenlight", ["strapi-plugin-greenlight"]),
    "blueprint": ("strapi-plugin-blueprint", ["strapi-plugin-blueprint"]),
    "ferry": ("strapi-plugin-ferry", ["strapi-plugin-ferry"]),
}


def downloads(pkg):
    try:
        with urllib.request.urlopen(f"https://api.npmjs.org/downloads/point/last-month/@qkix/{pkg}", timeout=15) as r:
            return int(json.load(r).get("downloads", 0))
    except Exception as e:                       # offline: keep the page buildable, say so
        print(f"  npm downloads of {pkg}: {e}")
        return None


def readme(text, pid, folder):
    # the header: everything up to the first markdown paragraph / heading after the centred <p>/<h1> blocks
    body = re.sub(r"\A(\s*(<p[^>]*>.*?</p>|<h1[^>]*>.*?</h1>)\s*)+", "", text, flags=re.S)
    body = body.replace(RAW + folder + "/docs/", f"/strapi-plugins/{pid}/")
    body = re.sub(r"\]\(\./docs/", f"](/strapi-plugins/{pid}/", body)
    body = re.sub(r'src="\./docs/', f'src="/strapi-plugins/{pid}/', body)
    # links to other files in the repo -> GitHub
    body = re.sub(r"\]\(\.\./([^)]+)\)", r"](https://github.com/qkix/strapi-plugins/tree/main/packages/\1)", body)
    body = re.sub(r"\]\(\./(?!docs/)([^)#]+)\)", rf"](https://github.com/qkix/strapi-plugins/blob/main/packages/{folder}/\1)", body)
    return body.lstrip()


def changelog(text, n=3):
    """The latest n entries: [{version, notes: [lines]}] (changesets' format: '## 0.4.3' then '### Patch Changes')."""
    out = []
    for block in re.split(r"(?m)^## ", text)[1:n + 1]:
        head, _, rest = block.partition("\n")
        notes = [re.sub(r"\s*\(\[#\d+\]\([^)]*\)\)", "", re.sub(r"^[-*] (\*\*[^*]+:\*\* )?", "", l.strip()))
                 for l in rest.splitlines() if re.match(r"\s*[-*] .+ .+", l)]     # real notes, not bare author names
        out.append({"version": head.strip(), "notes": notes[:6]})
    return out


def main():
    if not (SRC / "packages").is_dir():
        sys.exit(f"no strapi-plugins checkout at {SRC}")
    meta = {}
    content = ROOT / "src" / "content" / "plugins"
    content.mkdir(parents=True, exist_ok=True)
    for pid, (folder, pkgs) in PLUGIN_DIRS.items():
        pkg = SRC / "packages" / folder
        pub = ROOT / "public" / "strapi-plugins" / pid
        if pub.exists():
            shutil.rmtree(pub)
        pub.mkdir(parents=True)
        for f in (pkg / "docs").iterdir():
            if f.suffix.lower() in (".png", ".svg", ".gif", ".jpg", ".webp"):
                shutil.copy2(f, pub / f.name)
        (content / f"{pid}.md").write_text(readme((pkg / "README.md").read_text(), pid, folder))
        version = json.loads((pkg / "package.json").read_text())["version"]
        dl = {p: downloads(p) for p in pkgs}
        log = changelog((pkg / "CHANGELOG.md").read_text()) if (pkg / "CHANGELOG.md").exists() else []
        meta[pid] = {"version": version, "packages": pkgs, "downloads": dl,
                     "monthly": sum(v for v in dl.values() if v), "changelog": log}
        print(f"{pid}: {version}, {meta[pid]['monthly']} downloads/month, {len(list(pub.iterdir()))} files")
    (ROOT / "src" / "data" / "plugins.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
