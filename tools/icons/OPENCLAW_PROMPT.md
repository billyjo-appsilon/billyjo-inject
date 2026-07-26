# openclaw 위임 프롬프트 — Lordicon Lottie JSON 수급

브라우저를 직접 몰 수 있는 에이전트(openclaw 등)에게 넘길 때 아래를 **그대로** 붙여넣는다.
`bjicon` 파이프라인에서 **로그인이 필요한 단 한 단계**만 위임하는 것이다. 나머지(카탈로그·검색·
시각 선정·리컬러·GIF 변환)는 로그인 없이 이미 자동화되어 있으니 시키지 말 것.

---

## 붙여넣을 프롬프트

```
당신은 lordicon.com 에서 지정된 애니메이션 아이콘의 Lottie JSON 파일을 내려받는 작업을 합니다.

## 배경
- 이 계정은 Lordicon 웹 PRO 연간 구독 상태입니다. 전 아이콘 다운로드 권리가 있습니다.
- 아이콘 "선정"은 이미 끝났습니다. 당신은 고르지 않습니다. 아래 목록만 정확히 받아옵니다.

## 사전 조건
- 브라우저에서 lordicon.com 에 PRO 계정으로 로그인되어 있어야 합니다.
  로그인이 안 되어 있으면 즉시 중단하고 사람에게 로그인을 요청하세요. 직접 계정을 만들거나
  다른 계정으로 로그인하지 마세요.

## 받을 아이콘 목록
<<여기에 목록을 넣는다. 형식: family/style/index-name  — 예시>>
wired/outline/463-headset-customer-support
wired/outline/3589-phone-circle
wired/outline/412-gift

각 항목의 상세 페이지 URL 은 다음 규칙으로 만들어집니다:
  https://lordicon.com/icons/<family>/<style>/<index>-<name>

## 각 아이콘마다 할 일
1. 위 규칙으로 만든 상세 페이지로 이동합니다.
2. 다운로드 UI 를 열고 **포맷은 반드시 "Lottie" / JSON** 을 선택합니다.
   GIF·MP4·WebP·PNG·SVG 는 받지 마세요. 우리는 JSON 에서 직접 변환합니다.
3. 색상·스트로크·상태(state)는 **기본값 그대로** 둡니다. 편집기에서 색을 바꾸지 마세요.
   테마 적용은 다운로드 이후 우리 파이프라인이 합니다.
4. 파일을 아래 폴더에 저장합니다. 하위 폴더 구조는 유지하지 않아도 됩니다.
     <<저장 경로를 넣는다. 예: /Users/appsilon/repos/jaden/billyjo-inject/icons/library/>>
5. 저장된 파일명은 `<family>-<style>-<index>-<name>.json` 형태로 맞춰 주세요.
   (예: wired-outline-463-headset-customer-support.json)

## 반드시 지킬 것
- `.li` 파일(media.lordicon.com 의 .li 확장자)을 받아서 변환하려 하지 마세요.
  Lordicon 자체 보호 포맷이며 우회는 금지입니다. 정식 다운로드 UI 만 사용합니다.
- api.lordicon.com (개발자 API) 를 쓰지 마세요. 별도 과금 상품이며 이 작업과 무관합니다.
- 계정 설정, 결제, 구독 플랜을 건드리지 마세요.
- 목록에 없는 아이콘을 임의로 추가하지 마세요.
- 다운로드가 막히면(권한·한도 등) 우회하지 말고 그 아이콘을 건너뛴 뒤 사유를 보고하세요.

## 완료 보고
다음을 표로 보고하세요:
- 요청 건수 / 성공 건수 / 실패 건수
- 실패한 항목과 사유
- 저장된 파일 목록 (파일명과 바이트 크기)
- 각 파일이 유효한 JSON 인지 (첫 글자가 `{` 이고 "layers" 키가 있는지)
```

---

## 넘긴 뒤 이쪽에서 할 일

```bash
cd billyjo-inject
node tools/icons/bjicon.mjs index                        # 받은 JSON 색인
node tools/icons/bjicon.mjs add <id> --as <이름>          # 채택 + 테마 리컬러
```

받은 파일에 `watermark` 레이어가 있으면 무료 경로로 받힌 것이다 — `bjicon add` 가 경고한다.
그 경우 PRO 로그인 상태를 다시 확인하고 재수급한다.
