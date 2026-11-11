"""Stop: typecheck and lint when Claude finishes; failures send Claude back to fix them."""
import json
import os
import subprocess
import sys

payload = json.load(sys.stdin)
if payload.get("stop_hook_active"):
    sys.exit(0)
root = os.environ.get("CLAUDE_PROJECT_DIR", ".")
if not os.path.isdir(os.path.join(root, "node_modules")):
    sys.exit(0)
for command in (["npx", "tsc", "--noEmit"], ["npx", "oxlint"]):
    result = subprocess.run(command, cwd=root, capture_output=True, text=True)
    if result.returncode != 0:
        print((result.stdout + result.stderr)[-2000:], file=sys.stderr)
        sys.exit(2)
