# 💍 Mobile Wedding Card Skill (모바일 청첩장 템플릿 & 에이전트 스킬)

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![Pure Vanilla](https://img.shields.io/badge/Vanilla-HTML5%20%2F%20CSS3%20%2F%20JS-orange.svg)]()

모든 AI 코딩 에이전트(Antigravity, Claude Code, Cursor, Windsurf, Copilot 등)와 개발자가 **완성도 높은 모바일 청첩장 웹사이트**를 손쉽게 대화형으로 제작, 커스터마이징, 테스트, 배포할 수 있는 **스킬 팩(Skill Package) & 인터랙티브 CLI 템플릿**입니다.

---

## 🌸 주요 특징 (Key Highlights)

- ⚡ **Zero-Build & Pure Vanilla**: 리액트/뷰 등 무거운 빌드 과정 없이 순수 HTML/CSS/JS로 초경량 로딩 & 모바일 브라우저 100% 호환
- 💬 **대화형 커스터마이징 (Interactive Wizard)**: `npm run init` 실행 시 터미널에서 신랑/신부 정보, 예식 일정, 계좌번호, 컬러 테마, 꽃잎 효과를 대화형으로 설정
- 🎨 **감성적인 디자인 & 테마**: 
  - *Romantic Rose (로맨틱 핑크)*
  - *Classic Elegance (네이비 & 샴페인 골드)*
  - *Modern Pure (모던 미니멀 블랙&화이트)*
- 🌸 **꽃잎 흩날림 애니메이션 (`petals.js`)**: 터치 및 클릭을 방해하지 않는 고성능 벚꽃/꽃잎 흩날림 오버레이 (`prefers-reduced-motion` 웹 접근성 지원)
- 📅 **인터랙티브 캘린더 & D-Day 실시간 카운트다운**
- 🖼️ **터치 스와이프 지원 라이트박스 갤러리**: 모바일 터치 제스처로 넘겨보는 고화질 갤러리
- 📊 **서버리스 RSVP & 방명록**: Google Sheets + Google Apps Script를 활용한 무료/영구 백엔드 (비밀번호 기반 글 삭제 지원)
- 🗺️ **지도 & 교통편 연동**: 구글 맵 임베드, 카카오맵/네이버지도 바로가기 링크, 주소 복사
- 💳 **축의금 계좌번호 복사 & 아코디언**
- 🖼️ **고화질 사진 자동 압축 (`optimize_images.js`)**: Sharp 라이브러리로 수십 MB의 원본 사진을 100~200KB 대의 초경량 웹 이미지로 최적화
- 🛡️ **사전 렌더링 품질 보증 (`test_render_jsdom.js`)**: JSDOM을 통한 자동 검증으로 배포 시 백화 현상 및 JS 런타임 오류 원천 차단
- 🚀 **원클릭 배포 (`deploy.sh`)**: 테스트 통과 시 GitHub Pages로 자동 배포

---

## 🚀 빠른 시작 (Quick Start)

### 1. 대화형 위저드로 새 청첩장 만들기 (Interactive CLI)

```bash
# 저장소 클론
git clone https://github.com/unoShin/mobile-wedding-card-skill.git
cd mobile-wedding-card-skill

# 대화형 생성 마법사 실행
npm run init ./my-wedding-card
```

터미널의 질문에 따라 신랑/신부 이름, 예식 일시, 장소, 계좌번호, 테마를 입력하면 맞춤형 청첩장 프로젝트가 즉시 생성됩니다!

```text
=====================================================
  💍 모바일 청첩장 맞춤 제작 위저드 (Mobile Wedding Card)
=====================================================
📁 생성할 프로젝트 경로 [./my-wedding-card]: 
--- 🤵 신랑 정보 ---
신랑 성 [신]: 
신랑 이름 [윤호]: 
신랑 연락처 [010-1234-5678]: 
...
```

---

## 🤖 AI 에이전트에서 스킬로 사용하기 (For AI Agents)

이 저장소는 **Antigravity, Cursor, Claude Code, Windsurf, Roo Code** 등 모든 AI 코딩 에이전트 표준을 지원합니다.

### Antigravity / Gemini CLI
스킬 폴더를 `~/.gemini/config/skills/mobile-wedding-card/` 또는 프로젝트의 `.agents/skills/mobile-wedding-card/`에 복사하면 에이전트가 자동으로 스킬을 감지합니다.

```bash
# 전역 스킬 등록
mkdir -p ~/.gemini/config/skills
cp -r . ~/.gemini/config/skills/mobile-wedding-card
```

### Cursor / Claude Code / Windsurf
프로젝트 루트의 [`AGENTS.md`](./AGENTS.md), [`CLAUDE.md`](./CLAUDE.md), [`SKILL.md`](./SKILL.md) 지침에 따라 에이전트가 사용자에게 필요한 청첩장 정보를 질의한 뒤 맞춤형 코드를 생성합니다.

---

## 📁 프로젝트 구조

```text
mobile-wedding-card-skill/
├── SKILL.md                          # 에이전트 공통 스킬 규격 파일
├── AGENTS.md                         # 범용 AI 에이전트 지침
├── CLAUDE.md                         # Claude Code 설정
├── GEMINI.md                         # Antigravity/Gemini 설정
├── bin/                              # 실행 바이너리
├── scripts/
│   ├── init.js                       # 대화형 프로젝트 생성 CLI
│   └── scaffold.js                   # 기본 템플릿 복제 스크립트
├── templates/                        # 청첩장 웹 템플릿
│   ├── data/config.json              # 데이터 중앙 관리 파일
│   ├── css/                          # 분리형 CSS 스타일시트
│   ├── js/app.js                     # 청첩장 코어 스크립트
│   ├── js/petals.js                  # 꽃잎 흩날림 애니메이션
│   ├── google_apps_script.js         # Google Apps Script 백엔드 코드
│   ├── optimize_images.js            # Sharp 이미지 경량화 도구
│   ├── test_render_jsdom.js          # JSDOM 사전 검증 테스트
│   ├── deploy.sh                     # 배포 스크립트
│   └── index.html                    # 메인 단일 페이지
└── references/
    ├── backend-setup.md              # Google Apps Script 백엔드 연동 가이드
    ├── customization-guide.md        # 디자인/테마/컴포넌트 커스텀 가이드
    └── troubleshooting.md            # 모바일 웹뷰 대응 및 트러블슈팅
```

---

## 📋 제작 및 배포 워크플로우

1. **프로젝트 초기화**: `npm run init ./my-wedding-card`
2. **의존성 설치**: `cd ./my-wedding-card && npm install`
3. **사진 추가 및 최적화**:
   - `images/final/` 폴더에 웨딩 사진(`new_main.jpg`, `01.jpg` ~ `15.jpg`) 넣기
   - `node optimize_images.js` 실행 (고화질 사진 자동 압축)
4. **구글 시트 백엔드 연동**:
   - [Google Apps Script 백엔드 연동 가이드](./references/backend-setup.md)를 참조하여 RSVP 및 방명록 URL을 `data/config.json`에 입력
5. **품질 검증 테스트**:
   - `npm test` (JSDOM 기반 백화 현상 및 런타임 오류 자동 검증)
6. **GitHub Pages 배포**:
   - `./deploy.sh` 실행

---

## 📄 라이선스 (License)

이 프로젝트는 [MIT License](./LICENSE)를 따릅니다.
누구나 자유롭게 수정하고 나만의 모바일 청첩장을 제작할 수 있습니다.
