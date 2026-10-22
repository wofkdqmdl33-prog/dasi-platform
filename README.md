# 다시 — 2단계 공식 제도 탐색 시제품

## 실행

`python -m http.server 8000` 후 `/schemes.html` 접속. `node test-schemes.cjs`로 20개 테스트 실행.

## 현재 제공

- 8개 공식 자료 기반 제도·기관 탐색 레코드
- 연소득, 연체일수, 사업 유형, 채무조정 상환 회차 등에 따른 **일부 기본 조건 탐색**
- 우선 검토 / 확인 필요 / 제한 가능성 높음 분류
- 제도별 출처 URL 및 자료 확인일
- 검색·분류·반응형 UI, 브라우저 내 처리

## 중요한 한계

- `우선 검토`는 **지원 대상 확정이 아님**. 확인되지 않은 제외요건이 남아 있음.
- 2026-10-22 공식 페이지 확인 기준. 이후 변경될 수 있음.
- 신용평점 하위 20%, 기존 불법사금융예방대출 이용 이력, 조세체납 등은 입력·검증이 추가로 필요.
- 채무조정은 연체일수만으로 최종 판정 불가.
- 새출발기금은 사업 영위 시기·부실 상태·대상 금융채무 등 확인 필요. 신규 대출 아님.
- 생활·주거 지원은 공식 안내 디렉터리이며 개별 모집공고 자격 판정 미제공.
- 2단계 시제품은 GitHub 최신 Codex 개선본에 직접 병합하지 않은 **독립 추가 모듈**입니다. 저장소에 `schemes.html`, `schemes.js`, `test-schemes.cjs`를 추가하면 기존 파일을 건드리지 않고 실행할 수 있습니다.

## 자료 출처

- https://www.kinfa.or.kr/notificationPromotion/newsDetail.do?seq=29254
- https://www.kinfa.or.kr/notificationPromotion/noticeDetail.do?seq=33654
- https://www.kinfa.or.kr/financialProduct/policyMicrofinanceBenefits.do
- https://www.newstartfund.or.kr/Contents/Findmatchprogram.do
- https://www.newstartfund.or.kr/Contents/Prod.do
- https://www.newstartfund.or.kr/Faq/List.do
- https://www.kinfa.or.kr/financialLife/complexSupportDetail.do
- https://www.myhome.go.kr

## 3단계 연결 모듈 (2026-10-22)

현재 GitHub 저장소의 최신 `diagnosis.js`, `diagnosis.html`을 기준으로 진단 완료 시 같은 페이지에 제도 카드가 표시되도록 하는 연결 모듈입니다.

1. ZIP의 `schemes.js`, `schemes.html`, `diagnosis-schemes.js`, `apply-integration.py`, `test-integration.cjs`를 저장소 루트에 복사합니다.
2. 저장소 루트에서 `python apply-integration.py` 실행. **GitHub 웹 업로드만으로는 기존 diagnosis 파일의 자동 수정이 이루어지지 않습니다.** 실행 후 수정된 `diagnosis.js`, `diagnosis.html`도 GitHub에 반영해야 합니다.
3. `node test-schemes.cjs`와 `node test-integration.cjs` 실행, 기존 `node test-engine.js`도 실행합니다.
4. `diagnosis.html`에서 진단 완료 → 페이지 하단의 '내 상황과 연결된 지원제도' 확인.

개인정보 보호: 진단 객체는 CustomEvent를 통해 같은 브라우저 메모리에서만 전달하며 localStorage, sessionStorage, 쿠키, URL 쿼리, 서버로 저장·전송하지 않습니다. 진단의 월 세후 소득을 연 세전 소득으로 추정하지 않으며, 채무 상태만으로 연체일수를 임의 추정하지 않습니다. 이에 따라 대부분 결과는 '확인 필요'가 정상입니다.
