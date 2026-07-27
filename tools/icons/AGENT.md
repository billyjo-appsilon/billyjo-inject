# 아이콘 툴체인은 여기 없습니다

Lordicon 아이콘 파이프라인(검색·선정·수급·리컬러·래스터)은 사내 공용 레포로 옮겼습니다.

**→ https://github.com/appsilon-ai/icon-lordicon** (private)

아이콘 작업 전에 그 레포의 `AGENT.md` 를 먼저 읽으세요.

```bash
git clone https://github.com/appsilon-ai/icon-lordicon.git
cd icon-lordicon && node tools/icon.mjs find "<검색어>" --service billyjo
```

---

## 이 레포에 남은 것 — 자사몰이 실제로 서빙하는 자산뿐

| 경로 | 용도 |
|---|---|
| `icons/lottie/*.brand-mono.json` (13개) | 메인 카드 그리드 아이콘. `inject.js` 가 jsDelivr 로 로드 |
| `tools/icons/vendor/lottie_light.min.js` | Lottie 런타임. 같이 지연 로드 |
| `icons/benefit-*.svg`, `icons/*.gif` | 이전부터 쓰던 정적 자산 |

원본(`icons/src/`)·다른 테마·래스터·카탈로그·툴체인은 전부 `icon-lordicon` 으로 갔습니다.
**공개 레포에 Lordicon PRO 자산을 쌓아두지 않기 위해서**이기도 합니다 — 여기엔 실제로 서빙되는
것만 둡니다.

## 아이콘을 바꾸거나 추가하려면

1. `icon-lordicon` 에서 고르고 테마를 입힌다 (`icon add ... --service billyjo`)
2. 결과물 중 **필요한 것만** 이 레포 `icons/lottie/` 로 복사
3. `inject.js` 끝 IIFE 의 `MAP` 에 `#i-<심볼>` → `<이름>` 매핑 추가
4. 커밋 → push → jsDelivr 200 확인 → 로그스크립트 핀 갱신 (`WORKLOG.md` 참고)

`inject.js` 의 `BASE` 는 자산 커밋 SHA 로 핀되어 있습니다. 자산을 새로 넣으면
그 커밋 SHA 로 `BASE` 를 갱신해야 합니다 (`@main` 은 jsDelivr 캐시 지연이 있어 씁니다).
