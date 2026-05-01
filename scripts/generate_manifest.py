#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CATEGORY_DIRS = [
    ("graph-algorithm", "Graph Algorithm"),
]

ARTICLES_DIR = ROOT / "articles"
PROFILES_DIR = ROOT / "profiles"


def title_from_md(text: str, fallback: str) -> str:
    text = strip_front_matter(text)
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def summary_from_md(text: str) -> str:
    text = strip_front_matter(text)
    for line in text.splitlines():
        if line.strip() and not line.startswith("#"):
            return re.sub(r"[`*_#]", "", line).strip()
    return ""


def date_from_md(text: str) -> str:
    match = re.search(r"^date:\s*(.+?)\s*$", text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def tags_from_md(text: str) -> list[str]:
    inline = re.search(r"^tags:\s*\[(.*?)\]\s*$", text, re.MULTILINE)
    if inline:
        return [tag.strip().strip("\"'") for tag in inline.group(1).split(",") if tag.strip()]

    block = re.search(r"^tags:[ \t]*\n((?:[ \t]*-[ \t]+.+\n?)+)", text, re.MULTILINE)
    if not block:
        return []
    tags = []
    for line in block.group(1).splitlines():
        match = re.match(r"[ \t]*-[ \t]+(.+?)[ \t]*$", line)
        if match:
            tags.append(match.group(1).strip().strip("\"'"))
    return tags


def strip_front_matter(text: str) -> str:
    if not text.startswith("---\n"):
        return text
    parts = text.split("---\n", 2)
    if len(parts) < 3:
        return text
    return parts[2]


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
                "date": date_from_md(text),
                "tags": tags_from_md(text),
                "summary": summary_from_md(text),
            })
    items.sort(key=lambda item: item.get("date", ""), reverse=True)
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
            "date": date_from_md(text),
            "tags": tags_from_md(text),
            "summary": summary_from_md(text),
        })

articles.sort(key=lambda item: item.get("date", ""), reverse=True)

out = ARTICLES_DIR / "manifest.json"
out.write_text(json.dumps({"items": articles, "categories": CATEGORY_DIRS}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {out}")

# Profiles (flat list)
write_flat_manifest(PROFILES_DIR)
