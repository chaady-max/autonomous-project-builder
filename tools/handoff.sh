#!/usr/bin/env bash
set -euo pipefail

OUT="${1:-TASK.md}"

{
  echo "# TASK HANDOFF"
  echo ""
  echo "## Timestamp"
  date
  echo ""

  echo "## Objective (fill in)"
  echo "- "
  echo ""

  echo "## Current state (fill in)"
  echo "- "
  echo ""

  echo "## Git status"
  git status --porcelain=v1 || true
  echo ""

  echo "## Branch / HEAD"
  echo "branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  echo "head:   $(git rev-parse --short HEAD 2>/dev/null || true)"
  echo ""

  echo "## Files changed (summary)"
  git --no-pager diff --name-status || true
  echo ""

  echo "## Diff (staged)"
  git --no-pager diff --cached || true
  echo ""

  echo "## Diff (unstaged)"
  git --no-pager diff || true
  echo ""

  echo "## TODO/FIXME (top hits)"
  git --no-pager grep -n -E "TODO|FIXME|HACK" -- . 2>/dev/null | head -n 50 || true
  echo ""

  echo "## Next actions (fill in)"
  cat <<'EOF'
- Next step:
- Exact commands to run:
- What “done” looks like:
- Known errors / failing tests:
EOF
} > "$OUT"

echo "Wrote $OUT"
