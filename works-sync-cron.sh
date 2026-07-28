#!/bin/bash
# works-sync-cron.sh — cron 실행용 wrapper (PATH·로그 보장)
# crontab에서 호출되는 진입점. 직접 호출 시에는 works-sync.sh 사용.

# Homebrew + 시스템 git을 모두 PATH에 보장
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="${HOME:-/Users/appsilon}"

# 스크립트 자신의 위치를 기준으로 동작한다. 클론을 옮겨도 crontab 경로만 바꾸면 되고,
# 두 클론에 같은 스크립트가 있을 때 엉뚱한 쪽 works/ 를 건드리는 사고도 막는다.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

LOG_DIR="$SCRIPT_DIR/.logs"
LOG_FILE="$LOG_DIR/works-sync.log"
mkdir -p "$LOG_DIR"

TS=$(date "+%Y-%m-%d %H:%M:%S")
{
  echo "===== $TS ====="
  cd "$SCRIPT_DIR/works" || { echo "❌ works directory not found"; exit 1; }
  git fetch origin main --quiet
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/main)
  if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Already up to date ($(echo $LOCAL | cut -c1-7))"
  else
    git pull origin main --ff-only --quiet
    NEW=$(git rev-parse --short HEAD)
    echo "✅ Synced: $(echo $LOCAL | cut -c1-7) → $NEW"
    git log --oneline "$LOCAL..HEAD"
  fi
  echo ""
} >> "$LOG_FILE" 2>&1

# 로그 파일 크기 제한 (1MB 초과 시 절반으로 잘라냄)
if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE") -gt 1048576 ]; then
  tail -c 524288 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi
