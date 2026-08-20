#!/bin/bash
# 상세페이지 하단 고정 위젯 카나리 — 실제 상품 상세를 열어 위젯이 viewport 안에 보이는지 확인.
#
# cron 예시:
#   45 5 * * * .../deploy/bottom-widget-canary-cron.sh >> .../deploy/.logs/bottom-widget-canary.log 2>&1
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="${HOME:-/Users/appsilon}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1
mkdir -p "$SCRIPT_DIR/.logs"

STATUS="failed"
NOTE="unknown"

echo "[$(date '+%F %T')] 하단 위젯 카나리 시작"
OUT=$(node bottom-widget-check.js 2>&1)
RC=$?
echo "$OUT"

if [ "$RC" -eq 0 ]; then
  STATUS="success"
  NOTE=$(echo "$OUT" | grep -E "^OK — " | tail -1 | cut -c1-160)
  [ -n "$NOTE" ] || NOTE="ok"
else
  NOTE=$(echo "$OUT" | grep -E "^- " | head -1 | cut -c1-180)
  [ -n "$NOTE" ] || NOTE="check failed (rc=$RC)"
fi
echo "[$(date '+%F %T')] 결과: $STATUS ($NOTE)"

OPS_ENV="${BJ_OPS_ENV:-$HOME/.config/billyjo/ops.env}"
# shellcheck disable=SC1090
[ -f "$OPS_ENV" ] && . "$OPS_ENV"
API_BASE="${ADMIN2_API_BASE:-https://admin2-api.billyjo.co.kr}"
HB_SECRET="${HEARTBEAT_SECRET:-${CRON_SECRET:-}}"

if [ -n "$HB_SECRET" ]; then
  HB_BODY=$(node -e 'const [key,status,note]=process.argv.slice(1); process.stdout.write(JSON.stringify({key,status,detail:{note}}));' \
    "bottom_widget_canary" "$STATUS" "$NOTE")
  HB_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
    -X POST "$API_BASE/internal/cron/heartbeat" \
    -H "Authorization: Bearer $HB_SECRET" \
    -H "Content-Type: application/json" \
    -d "$HB_BODY" \
    2>/dev/null)
  echo "  heartbeat: bottom_widget_canary=$STATUS (HTTP ${HB_CODE:-000})"
else
  echo "  heartbeat: 건너뜀 ($OPS_ENV 에 HEARTBEAT_SECRET 없음)"
fi

echo "$NOTE"
[ "$STATUS" = "success" ] || exit 1
