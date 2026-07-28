#!/bin/bash
# 추천 카드 이미지 카나리 (주 1회) — 실제 상세페이지를 열어 카드 이미지가 뜨는지 확인.
#
# 데이터 파이프라인(admin2 image_status, 매일 04:30)이 막아야 정상이지만, 파이프라인이
# 굳거나 사이트 마크업이 바뀌면 또 샌다. 이 카나리는 **화면 기준**의 마지막 확인이다.
#
# 결과는 ops_heartbeats(key=reco_image_canary)로 보고 → 워치독이 실패/노후를 알린다.
# 로그만 남기면 아무도 안 본다는 걸 works-sync 때 배웠다.
#
# cron: 30 5 * * 0 .../deploy/reco-image-canary-cron.sh >> .../deploy/.logs/reco-image-canary.log 2>&1
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="${HOME:-/Users/appsilon}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1
mkdir -p "$SCRIPT_DIR/.logs"

STATUS="failed"
NOTE="unknown"

echo "[$(date '+%F %T')] 추천 카드 이미지 카나리 시작"
OUT=$(node reco-image-check.js 2>&1)
RC=$?
echo "$OUT"

if [ "$RC" -eq 0 ]; then
  STATUS="success"
  NOTE=$(echo "$OUT" | grep -E "^OK — " | tail -1 | cut -c1-120)
  [ -n "$NOTE" ] || NOTE="ok"
else
  NOTE=$(echo "$OUT" | grep -E "^- " | head -1 | cut -c1-160)
  [ -n "$NOTE" ] || NOTE="check failed (rc=$RC)"
fi
echo "[$(date '+%F %T')] 결과: $STATUS ($NOTE)"

OPS_ENV="${BJ_OPS_ENV:-$HOME/.config/billyjo/ops.env}"
# shellcheck disable=SC1090
[ -f "$OPS_ENV" ] && . "$OPS_ENV"
API_BASE="${ADMIN2_API_BASE:-https://admin2-api.billyjo.co.kr}"
HB_SECRET="${HEARTBEAT_SECRET:-${CRON_SECRET:-}}"

if [ -n "$HB_SECRET" ]; then
  HB_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
    -X POST "$API_BASE/internal/cron/heartbeat" \
    -H "Authorization: Bearer $HB_SECRET" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"reco_image_canary\",\"status\":\"$STATUS\",\"detail\":{\"note\":\"$NOTE\"}}" \
    2>/dev/null)
  echo "  heartbeat: reco_image_canary=$STATUS (HTTP ${HB_CODE:-000})"
else
  echo "  heartbeat: 건너뜀 ($OPS_ENV 에 HEARTBEAT_SECRET 없음)"
fi
# /collections 목록의 '최근 결과'는 stdout 마지막 줄이 그대로 들어간다 — 여기서 한 줄로 요약.
echo "$NOTE"

[ "$STATUS" = "success" ] || exit 1
