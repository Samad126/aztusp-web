"""PostToolUse: after a locale file is edited, the en and az files must define the same keys."""
import json
import os
import re
import sys

payload = json.load(sys.stdin)
path = (payload.get("tool_input") or {}).get("file_path", "")
if not re.search(r"src/i18n/locales/(en|az)\.ts$", path):
    sys.exit(0)
folder = os.path.dirname(path)


def keys(name: str) -> set[str]:
    with open(os.path.join(folder, name), encoding="utf-8") as handle:
        return set(re.findall(r"^\s*'([^']+)':", handle.read(), re.M))


en, az = keys("en.ts"), keys("az.ts")
if en != az:
    missing = sorted((en ^ az))[:15]
    print("en.ts and az.ts differ in keys: " + ", ".join(missing), file=sys.stderr)
    sys.exit(2)
