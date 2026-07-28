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

# 실패를 기본값으로 두고 성공 경로에서만 뒤집는다 — 새 실패 경로가 생겨도
# 조용히 'success' 로 보고되는 일이 없다.
STATUS="failed"
NOTE="unknown"
HEAD_SHA=""

TS=$(date "+%Y-%m-%d %H:%M:%S")
{
  echo "===== $TS ====="
  if ! cd "$SCRIPT_DIR/works" 2>/dev/null; then
    echo "❌ works directory not found"
    NOTE="works directory not found"
  elif ! git fetch origin main --quiet; then
    echo "❌ git fetch 실패"
    NOTE="git fetch failed"
  else
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    if [ "$LOCAL" = "$REMOTE" ]; then
      HEAD_SHA=$(echo "$LOCAL" | cut -c1-7)
      echo "✅ Already up to date ($HEAD_SHA)"
      STATUS="success"; NOTE="up-to-date"
    elif git pull origin main --ff-only --quiet; then
      HEAD_SHA=$(git rev-parse --short HEAD)
      echo "✅ Synced: $(echo "$LOCAL" | cut -c1-7) → $HEAD_SHA"
      git log --oneline "$LOCAL..HEAD"
      STATUS="success"; NOTE="synced"
    else
      echo "❌ git pull --ff-only 실패(원격이 갈라졌을 수 있음)"
      NOTE="git pull --ff-only failed"
    fi
  fi
} >> "$LOG_FILE" 2>&1

# ── 하트비트 ─────────────────────────────────────────────────────────────
# prod(Vercel) 워치독은 이 맥의 디스크를 못 본다. 이 잡이 며칠째 안 돌았는지
# 판단할 근거는 여기서 남기는 하트비트가 유일하다(로그는 로컬에만 있음).
#
# 비밀값은 이 파일에 두지 않는다. 설정이 없으면 동기화는 그대로 수행하고
# 하트비트만 건너뛴다 — 감시 설정 누락이 동기화 자체를 막으면 본말전도다.
OPS_ENV="${BJ_OPS_ENV:-$HOME/.config/billyjo/ops.env}"
# shellcheck disable=SC1090
[ -f "$OPS_ENV" ] && . "$OPS_ENV"
API_BASE="${ADMIN2_API_BASE:-https://admin2-api.billyjo.co.kr}"
# 최소권한 전용 키를 우선 쓰고, 없으면 CRON_SECRET 으로 폴백(서버도 둘 다 받는다).
HB_SECRET="${HEARTBEAT_SECRET:-$CRON_SECRET}"

if [ -n "$HB_SECRET" ]; then
  HB_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
    -X POST "$API_BASE/internal/cron/heartbeat" \
    -H "Authorization: Bearer $HB_SECRET" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"works_sync\",\"status\":\"$STATUS\",\"detail\":{\"head\":\"$HEAD_SHA\",\"note\":\"$NOTE\"}}" \
    2>/dev/null)
  echo "  heartbeat: works_sync=$STATUS (HTTP ${HB_CODE:-000})" >> "$LOG_FILE"
else
  echo "  heartbeat: 건너뜀 ($OPS_ENV 에 HEARTBEAT_SECRET 없음)" >> "$LOG_FILE"
fi
echo "" >> "$LOG_FILE"

# 로그 파일 크기 제한 (1MB 초과 시 절반으로 잘라냄)
if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE") -gt 1048576 ]; then
  tail -c 524288 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

# 실패는 종료코드로도 드러낸다(cron 메일·상위 래퍼가 감지 가능).
[ "$STATUS" = "success" ] || exit 1
