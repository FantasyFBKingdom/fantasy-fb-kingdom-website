"""Trims the weekly export files so the site loads faster.

Removes data the website never reads:
  - rankings.json: each player's "logLast" (week-by-week stats, already in players.json)
    and "oppLogo", plus the top-level "lastSeason" block.
  - players.json: old hand-written card fields ("tiles", "gameLog", ...) on players
    that already have the newer "prof" stats.

Usage (from the repo root):
  python tools/trim-export.py                      # trims every rankings file + players.json
  python tools/trim-export.py path/to/file.json    # trims just these files

Safe to run more than once. Uses only the Python standard library.
"""
import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "docs" / "data"

RANKINGS_TOP_LEVEL = ["lastSeason"]
RANKINGS_PLAYER = ["logLast", "oppLogo"]
LEGACY_PLAYER = ["tiles", "gameLog", "volume", "redZone", "upcoming", "lastSeason", "panic"]


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def dump(data, expand):
    """Same layout as the exporter: one top-level key per line, and one entry per
    line inside the keys listed in `expand` (e.g. positions, players)."""
    lines = []
    for key, value in data.items():
        if key in expand and isinstance(value, dict) and value:
            inner = [f"    {compact(k)}: {compact(v)}" for k, v in value.items()]
            lines.append(f"  {compact(key)}: {{\n" + ",\n".join(inner) + "\n  }")
        else:
            lines.append(f"  {compact(key)}: {compact(value)}")
    return "{\n" + ",\n".join(lines) + "\n}\n"


def trim_rankings(data):
    for key in RANKINGS_TOP_LEVEL:
        data.pop(key, None)
    for entry in (data.get("players") or {}).values():
        for key in RANKINGS_PLAYER:
            entry.pop(key, None)
    return dump(data, {"positions", "players"})


def trim_players(data):
    for p in data.values():
        if p.get("prof"):
            for key in LEGACY_PLAYER:
                p.pop(key, None)
    return "{\n" + ",\n".join(f"  {compact(k)}: {compact(v)}" for k, v in data.items()) + "\n}\n"


def trim(path):
    before = path.stat().st_size
    data = json.loads(path.read_text(encoding="utf-8"))
    text = trim_players(data) if path.name == "players.json" else trim_rankings(data)
    path.write_text(text, encoding="utf-8", newline="\n")
    after = path.stat().st_size
    print(f"{path.relative_to(DATA.parent.parent)}: {before // 1024} KB -> {after // 1024} KB")


def main():
    files = [Path(a).resolve() for a in sys.argv[1:]]
    if not files:
        files = sorted(DATA.glob("*/*/rankings.json")) + sorted(DATA.glob("*/ros-history/*.json")) + [DATA / "players.json"]
    for f in files:
        trim(f)


if __name__ == "__main__":
    main()
