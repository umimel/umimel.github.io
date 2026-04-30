#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CATEGORY_DIRS = [
    ("algorithms", "アルゴリズム"),
    ("graphs", "グラフ"),
    ("data-structures", "データ構造"),
    ("math", "数学"),
]

ARTICLES_DIR = ROOT / "articles"
PROFILES_DIR = ROOT / "profiles"


def title_from_md(text: str, fallback: str) -> str:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def summary_from_md(text: str) -> str:
    for line in text.splitlines():
        if line.strip() and not line.startswith("#"):
            return re.sub(r"[`*_#]", "", line).strip()
    return ""


def write_flat_manifest(folder: Path) -> None:
    items = []
    if folder.exists():
        for path in sorted(folder.glob("*.md")):
            if path.name == "index.md":
                continue
            text = path.read_text(encoding="utf-8")
            items.append({
                "slug": path.stem,
                "title": title_from_md(text, path.stem),
                "summary": summary_from_md(text),
            })
    out = folder / "manifest.json"
    out.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out}")


# Articles by category
articles = []
for slug, label in CATEGORY_DIRS:
    category_dir = ARTICLES_DIR / slug
    if not category_dir.exists():
        continue
    for path in sorted(category_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        articles.append({
            "category": slug,
            "categoryLabel": label,
            "slug": path.stem,
            "title": title_from_md(text, path.stem),
            "summary": summary_from_md(text),
        })

out = ARTICLES_DIR / "manifest.json"
out.write_text(json.dumps({"items": articles, "categories": CATEGORY_DIRS}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {out}")

# Profiles (flat list)
write_flat_manifest(PROFILES_DIR)
