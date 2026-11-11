"""PreToolUse: generated files are not edited by hand."""
import json
import sys

payload = json.load(sys.stdin)
path = (payload.get("tool_input") or {}).get("file_path", "")
if path.endswith(("bun.lock", "tsconfig.tsbuildinfo")) or "/dist/" in path:
    print(f"{path} is generated; change package.json / source and let the tools rebuild it.", file=sys.stderr)
    sys.exit(2)
