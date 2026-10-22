다시 DASI 통합 배포판 (2026-10-22)

[중요] ZIP 파일 자체를 GitHub에 업로드하면 사이트가 바뀌지 않습니다. 압축을 풀고 최상위 HTML/JS/CSS 파일을 저장소 루트(main)에 업로드해야 합니다.
GitHub 웹의 Upload files는 같은 이름 파일의 자동 덮어쓰기가 실패하거나 중복 처리될 수 있습니다. 파일별 변경 반영 여부를 반드시 확인하세요.

구성:
index.html 메인 / urgent.html 긴급자금 탐색 / diagnosis.html 5단계 진단 / schemes.html 지원제도 / dashboard.html 회복 로드맵 / chat.html 익명 채팅
site-refresh.js/css 공통 디자인 / data-status.js 자료 점검 기준 표기 / site-config.js 서버 주소 설정
backend/worker.js Cloudflare Worker 서버 / backend/wrangler.toml 배포 설정 / backend/sources.json 출처 목록

서버 설치 전: 사이트/진단/긴급자금 탐색은 정적 파일로 작동합니다. 익명 채팅과 일일 자료 접속 점검은 비활성화 상태로 표시됩니다.
서버 설치: Cloudflare Worker + KV namespace(DASI_KV) + 일일 Cron Trigger 설정 후, 배포된 Worker URL을 site-config.js의 DASI_API_BASE에 입력하고 다시 업로드하세요.
일일 작업은 공식 기관 웹사이트 접속 여부와 점검 시각을 저장합니다. 지원제도 내용 자체를 자동으로 추출·판정·갱신하는 기능이 아니며, 개별 자격 조건의 최신성 보증이 아닙니다.
채팅은 간이 시범용입니다. KV 기반 동시 쓰기 충돌로 메시지 누락 가능성, 공개방 악성 콘텐츠·스팸 위험이 있습니다. 실제 대중 공개 운영 전 Turnstile, 신고/차단, 관리자 삭제, Durable Objects/DB, 보안·개인정보 정책을 구축하세요.
방문자 누적 통계는 미구현입니다. 실제 누적 방문자 수에는 서버 로그/분석 도구와 중복 방문 기준 정의가 필요합니다.
