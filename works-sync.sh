#!/bin/bash
# works-sync.sh — billyjo-detailcard 최신 룰북 동기화
# 사용법: ./works-sync.sh

set -e
cd "$(dirname "$0")/works"

echo "→ Fetching latest from billyjo-detailcard..."
git fetch origin main --quiet

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "✅ Already up to date ($LOCAL)"
else
  echo "→ Pulling new commits..."
  git pull origin main --ff-only
  echo "✅ Synced to $(git rev-parse --short HEAD)"
  echo ""
  echo "최근 5개 commit:"
  git log --oneline -5
fi
