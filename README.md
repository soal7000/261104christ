# Tabula Rasa Lab

이재열 교수(Tabula Rasa · 인성교육)의 **연구·수업 자료 아카이브 + 학생 토론** 웹사이트입니다.

- 연구·수업 자료: 저장소 안의 JSON/Markdown 파일로 관리합니다. GitHub에서 파일만 고치면 사이트가 갱신됩니다.
- 토론(댓글): Firebase **Spark 무료 요금제**의 Authentication(구글 로그인)과 Firestore만 사용합니다.
- 배포: Netlify 정적 사이트. 서버 코드, Cloud Functions, Storage, Firebase Hosting은 쓰지 않습니다.
- **Firebase를 설정하지 않아도 사이트는 정상 동작합니다.** 이때 로그인은 "준비 중", 토론은 "토론 기능 준비 중"으로 표시됩니다.

---

## 목차

1. [로컬 실행 방법](#1-로컬-실행-방법)
2. [콘텐츠(연구/수업) 추가·수정 방법](#2-콘텐츠연구수업-추가수정-방법)
3. [GitHub 업로드 → Netlify 배포](#3-github-업로드--netlify-배포)
4. [배포 후 Firebase 연동 체크리스트](#4-배포-후-firebase-연동-체크리스트)
5. [무료 한도 관련 주의사항](#5-무료-한도-관련-주의사항)
6. [추후 기능 확장 아이디어](#6-추후-기능-확장-아이디어)
7. [폴더 구조와 기술 메모](#7-폴더-구조와-기술-메모)

---

## 1. 로컬 실행 방법

준비물: [Node.js](https://nodejs.org/) 20 이상(권장 22 LTS)

```bash
npm install
```

```bash
npm run dev
```

터미널에 나오는 주소(보통 http://localhost:5173)를 브라우저로 엽니다.

배포용 빌드를 확인하려면:

```bash
npm run build
```

```bash
npm run preview
```

Firebase까지 로컬에서 시험하려면 `.env.example`을 복사해 `.env`를 만들고 값을 채운 뒤 `npm run dev`를 다시 실행합니다. (`.env`는 `.gitignore`에 들어 있어 GitHub에 올라가지 않습니다.)

```bash
cp .env.example .env
```

---

## 2. 콘텐츠(연구/수업) 추가·수정 방법

GitHub 웹사이트에서 파일을 열고 연필(✏️) 아이콘으로 수정 → **Commit changes**를 누르면 Netlify가 자동으로 다시 배포합니다(1~2분).

### 2-1. 사이트 기본 정보 — `src/content/site.ts`

사이트 이름, 소개 문구, 교수 소개, 연락처, 관리자 이메일을 바꿉니다. 따옴표 안의 글자만 고치면 됩니다.

### 2-2. 연구 — `src/content/research.json`

`[ ... ]` 안에 `{ ... }` 묶음 하나가 연구 하나입니다. 새 연구는 기존 묶음을 복사해 붙여넣고, **묶음 사이에 쉼표(,)** 를 꼭 넣으세요.

```json
{
  "id": "my-new-research",
  "title": "새 연구 제목",
  "summary": "목록과 상세 페이지 상단에 보이는 한두 문장 요약",
  "year": 2026,
  "tags": ["인성교육", "새 태그"],
  "links": [
    { "label": "논문 PDF", "url": "https://drive.google.com/..." },
    { "label": "발표 영상", "url": "https://www.youtube.com/watch?v=..." }
  ],
  "body": "research/my-new-research.md"
}
```

| 필드 | 설명 |
| --- | --- |
| `id` | 주소에 쓰입니다(`/research/my-new-research`). **영문 소문자·숫자·하이픈**만, 다른 연구와 겹치지 않게. 한 번 정하면 바꾸지 마세요(바꾸면 기존 댓글과 연결이 끊깁니다). |
| `year` | 숫자. 목록은 연도 최신순으로 정렬됩니다. |
| `tags` | 연구 목록의 태그 필터에 자동으로 나타납니다. |
| `links` | 관련 자료 링크. Google Drive·YouTube 링크 또는 `/files/파일명.pdf` |
| `body` | 본문. 두 가지 방법 중 하나 ↓ |

**본문 작성 방법**

- 긴 본문: `src/content/research/` 폴더에 `my-new-research.md` 파일을 만들고 `"body": "research/my-new-research.md"`로 적습니다.
- 짧은 본문: `"body": "본문 내용을 여기에 바로 씁니다.\n\n## 소제목"`처럼 직접 적어도 됩니다. (`\n`은 줄바꿈)

본문은 [마크다운](https://www.markdownguide.org/basic-syntax/) 문법을 씁니다: `## 소제목`, `**굵게**`, `- 목록`, `> 인용`, 표 등.

### 2-3. 수업 — `src/content/courses.json`

```json
{
  "id": "new-course",
  "title": "새 수업 이름",
  "semester": "2027-1학기",
  "description": "수업 소개 문장",
  "materials": [
    { "label": "강의계획서", "url": "https://drive.google.com/..." },
    { "label": "1주차 슬라이드", "url": "https://docs.google.com/presentation/..." }
  ]
}
```

수업은 JSON에 적은 순서대로 표시됩니다.

### 2-4. 파일(PDF 등) 연결

- **권장:** Google Drive에 올리고 "링크가 있는 모든 사용자 보기"로 공유한 뒤 링크를 붙여넣습니다. 영상은 YouTube(일부 공개도 가능).
- 작은 PDF(수 MB 이하)는 `public/files/` 폴더에 올리고 url을 `/files/파일명.pdf`로 적어도 됩니다.
- 이 사이트에는 **파일 업로드 기능이 없습니다**(Firebase Storage는 유료 전환 위험이 있어 사용하지 않음).

> JSON 문법이 틀리면 Netlify 빌드가 실패하고 **이전 버전 사이트가 그대로 유지**됩니다. Netlify의 Deploys 화면에서 실패 원인을 확인하거나 [JSON 검사기](https://jsonlint.com/)에 붙여넣어 확인하세요. 흔한 실수: 마지막 항목 뒤 쉼표, 따옴표 누락.

---

## 3. GitHub 업로드 → Netlify 배포

1. 이 코드를 GitHub 저장소에 올립니다(이미 올라가 있다면 생략).
2. [Netlify](https://app.netlify.com/)에 GitHub 계정으로 로그인합니다.
3. **Add new site → Import an existing project → GitHub** → 이 저장소 선택.
4. 빌드 설정은 `netlify.toml`에서 자동으로 읽습니다. 화면에 다음처럼 보이면 그대로 **Deploy** 를 누릅니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node 버전은 `netlify.toml`에서 22로 고정됨
5. 1~2분 뒤 `https://임의이름.netlify.app` 주소가 생깁니다. **Site configuration → Change site name**에서 주소 앞부분을 바꿀 수 있습니다.
6. 이후에는 GitHub에 커밋할 때마다 자동으로 재배포됩니다.

`netlify.toml`에는 SPA 리다이렉트(`/* → /index.html 200`)가 들어 있어 `/research/abc` 같은 주소로 바로 접속하거나 새로고침해도 404가 나지 않습니다.

### Netlify 환경변수 등록 방법

1. Netlify 사이트 화면 → **Site configuration → Environment variables → Add a variable → Add a single variable**
2. 아래 변수들을 하나씩 추가합니다. **이름은 반드시 `VITE_`로 시작해야** 빌드된 사이트에 들어갑니다.

| 변수 이름 | 값 (Firebase 콘솔에서 복사) |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_APP_ID` | `appId` |
| `VITE_ADMIN_EMAIL` (선택) | 교수님 구글 이메일. 여러 개면 쉼표로 구분 |

3. 변수는 **빌드할 때** 들어가므로, 등록 후 **Deploys → Trigger deploy → Deploy site** 로 꼭 재배포합니다.

> Firebase 웹 설정값(apiKey 등)은 비밀번호가 아니라 공개되어도 되는 식별자입니다. 실제 보안은 `firestore.rules`가 담당합니다. 그래도 저장소에는 올리지 않고 환경변수로 관리합니다.

---

## 4. 배포 후 Firebase 연동 체크리스트

순서대로 하나씩 체크하세요.

- [ ] **1. Firebase 프로젝트 생성**
  [Firebase 콘솔](https://console.firebase.google.com/) → 프로젝트 추가. Google 애널리틱스는 꺼도 됩니다.
  요금제는 **Spark(무료)** 그대로 둡니다. "Blaze로 업그레이드" 버튼은 누르지 마세요.

- [ ] **2. 웹 앱 등록 후 설정값 복사**
  프로젝트 개요 옆 ⚙️ → 프로젝트 설정 → 일반 → 내 앱 → **웹(`</>`)** 아이콘 → 앱 닉네임 입력 → 등록.
  ("Firebase Hosting 설정" 체크는 **하지 않습니다**.)
  나타나는 `firebaseConfig`에서 `apiKey`, `authDomain`, `projectId`, `appId` 4개를 메모합니다.

- [ ] **3. Google 로그인 사용 설정**
  Authentication → 시작하기 → **로그인 방법(Sign-in method)** → Google → 사용 설정 → 프로젝트 지원 이메일 선택 → 저장.

- [ ] **4. 승인된 도메인에 Netlify 도메인 추가** ⚠️ *가장 많이 빠뜨리는 단계*
  Authentication → **설정(Settings) → 승인된 도메인(Authorized domains)** → 도메인 추가 →
  `내사이트이름.netlify.app` 입력(https:// 없이). 개인 도메인을 연결했다면 그 도메인도 추가합니다.
  이걸 빼먹으면 로그인 시 `auth/unauthorized-domain` 오류가 납니다.

- [ ] **5. Firestore 데이터베이스 생성 + 보안 규칙 게시**
  Firestore Database → 데이터베이스 만들기 → 위치 `asia-northeast3 (서울)` 권장(나중에 변경 불가) → **프로덕션 모드**로 시작.
  생성 후 **규칙(Rules)** 탭 → 저장소의 `firestore.rules` 내용을 전부 복사해 붙여넣기 →
  `professor@example.com`을 **교수님 구글 이메일로 바꾼 뒤** → **게시(Publish)**.

- [ ] **6. 복합 인덱스 생성**
  댓글 조회(`targetType` + `targetId` + `createdAt` 최신순)에는 복합 인덱스가 필요합니다. 둘 중 한 방법:
  - (쉬움) 사이트에서 댓글이 있는 페이지를 열었을 때 "인덱스가 준비되지 않았습니다" 메시지가 나오면, 브라우저 개발자도구(F12) 콘솔의 오류 메시지에 있는 링크를 클릭 → **인덱스 만들기**.
  - (직접) Firestore → **색인(Indexes) → 복합 → 색인 추가**
    - 컬렉션 ID: `comments`
    - `targetType` 오름차순, `targetId` 오름차순, `createdAt` 내림차순
    - 쿼리 범위: 컬렉션
  - 생성에 몇 분 걸립니다. (`firestore.indexes.json`에 같은 정의가 있으니 Firebase CLI를 쓴다면 그것으로 배포해도 됩니다.)

- [ ] **7. 관리자 이메일 맞추기**
  `src/content/site.ts`의 `adminEmails`(또는 Netlify 변수 `VITE_ADMIN_EMAIL`)를 `firestore.rules`의 이메일과 **같게** 맞춥니다.
  (화면의 '삭제 (관리자)' 버튼 표시용. 실제 권한은 규칙이 결정합니다.)

- [ ] **8. Netlify 환경변수 등록 후 재배포** ([위 방법](#netlify-환경변수-등록-방법))

- [ ] **9. 동작 확인 (순서대로)**
  1. 사이트 접속 → 헤더에 **구글 로그인** 버튼이 활성화되어 있는지 확인
  2. 학생용(관리자 아닌) 구글 계정으로 로그인 → 헤더에 이름 표시 확인
  3. 아무 연구 페이지 하단 토론에 댓글 작성 → 목록 맨 위에 나타나는지 확인
     (Firebase 콘솔 → Firestore → `comments` 컬렉션에 문서가 생겼는지도 확인)
  4. 본인 댓글의 **삭제** 버튼으로 삭제되는지 확인
  5. 로그아웃 → 댓글은 보이지만 작성란 대신 로그인 버튼이 보이는지 확인
  6. 학생 계정으로 댓글을 하나 남긴 뒤, **교수님 계정**으로 로그인 → 헤더에 `(관리자)` 표시, 학생 댓글에 **삭제 (관리자)** 버튼이 보이고 삭제되는지 확인

**문제 해결**

| 증상 | 원인 / 해결 |
| --- | --- |
| 로그인 버튼이 계속 "준비 중" | 환경변수 4개 중 누락·오타가 있거나, 등록 후 재배포를 안 함 |
| 로그인 팝업 후 "도메인이 허용되지 않았습니다" | 4번 승인된 도메인 미등록 |
| 댓글 등록 시 "권한이 없습니다" | 규칙 미게시, 또는 댓글이 1000자 초과/공백 |
| 관리자 삭제가 "권한이 없습니다" | `firestore.rules`의 관리자 이메일이 다르거나 게시하지 않음 |
| "인덱스가 준비되지 않았습니다" | 6번 복합 인덱스 생성(생성 중이면 몇 분 대기) |

---

## 5. 무료 한도 관련 주의사항

Spark 요금제는 카드 등록이 없어 **요금이 청구되지 않습니다.** 한도를 넘으면 그날은 기능이 멈추고 다음 날(태평양 시간 자정 = 한국 오후 4~5시경) 초기화됩니다.

| 항목 | 일일 무료 한도 | 이 사이트에서 소모되는 경우 |
| --- | --- | --- |
| Firestore 읽기 | 50,000 | 상세 페이지의 토론 영역을 볼 때 댓글 수만큼(최대 20개, "더 보기"마다 20개) |
| Firestore 쓰기 | 20,000 | 댓글 작성 1회 = 1 |
| Firestore 삭제 | 20,000 | 댓글 삭제 1회 = 1 |
| 저장 용량 | 1 GiB | 댓글 텍스트만 저장하므로 사실상 걱정 없음 |
| Authentication | 구글 로그인은 사실상 무제한 | — |

**이미 적용된 절약 설계**
- 연구·수업 자료는 Firestore가 아니라 정적 파일 → 페이지 방문 자체는 읽기 0회
- 댓글은 실시간 리스너(onSnapshot) 없이 필요할 때만 조회(getDocs)
- 한 번에 20개만 조회하고 "더 보기"로 추가 조회
- 토론 영역이 화면에 가까워졌을 때만 조회(본문만 읽고 나가면 읽기 0회)
- 같은 페이지 재방문 시 1분간 메모리 캐시 사용
- 댓글 작성 후 목록을 다시 불러오지 않고 화면에 바로 추가

**사용량 확인 위치**
- Firestore: Firebase 콘솔 → Firestore Database → **사용량(Usage)** 탭
- 전체: Firebase 콘솔 → 왼쪽 아래 **Spark 요금제** 표시 옆 → 사용량 및 결제 → 세부정보 및 설정
- Netlify: Team → Usage (무료: 월 대역폭·빌드 시간 한도. 빌드는 커밋할 때만 사용)

> 계산 예: 학생 100명이 하루에 댓글 20개가 달린 토론 페이지를 각각 10번 열면 100 × 10 × 20 = 20,000 읽기입니다(캐시로 실제는 더 적음). 수백 명이 동시에 쓰는 행사 전에는 사용량 탭을 확인하세요.

---

## 6. 추후 기능 확장 아이디어

데이터 접근은 `src/services/`에 모여 있어, 새 기능은 서비스 함수 + `firestore.rules` 규칙을 추가하는 방식으로 확장합니다.

- **대댓글(1단계)**: `comments`에 `parentId` 필드 추가, 규칙의 허용 필드 목록에도 추가
- **좋아요**: `comments/{id}/likes/{uid}` 하위 문서(사용자당 1개로 중복 방지)
- **신고**: `reports` 컬렉션(작성만 허용, 읽기는 관리자만) + 관리자 화면
- **공지사항**: `src/content/notices.json` 정적 파일로 추가(DB 비용 0)
- **댓글 수정**: 규칙에서 `text`만 변경 허용 + `editedAt` 필드
- **학교 계정만 작성 허용**: `firestore.rules`의 주석 처리된 `isSchoolAccount()` 사용
- **관리자 대시보드**: 최근 댓글 모아 보기(`orderBy('createdAt','desc').limit(50)`)
- **수업별 비공개 토론**: 수강생 명단(`allowlist`) 기반 읽기 제한
- **검색 고도화**: 본문(Markdown)까지 검색, 연도 필터
- **RSS / 사이트맵**: 빌드 시 JSON에서 자동 생성(SEO)
- **Netlify Forms**: 문의하기 폼(무료 한도 내, 서버 코드 불필요)

---

## 7. 폴더 구조와 기술 메모

```
├── firestore.rules          # Firestore 보안 규칙 (콘솔에 붙여넣기)
├── firestore.indexes.json   # 필요한 복합 인덱스 정의
├── netlify.toml             # Netlify 빌드·SPA 리다이렉트·Node 버전
├── .env.example             # 환경변수 예시 (.env 는 커밋 금지)
├── public/files/            # 작은 PDF 등 정적 파일
└── src/
    ├── content/             # ★ 교수님이 수정하는 콘텐츠
    │   ├── site.ts          #   사이트 설정·소개·연락처·관리자 이메일
    │   ├── research.json    #   연구 목록
    │   ├── courses.json     #   수업 목록
    │   ├── research/*.md    #   연구 본문(마크다운)
    │   └── index.ts         #   타입 정의·불러오기 (수정 불필요)
    ├── lib/firebase.ts      # 환경변수 확인 후에만 Firebase 초기화 (isFirebaseEnabled)
    ├── services/            # 데이터 접근 계층 (UI는 여기만 호출)
    │   ├── auth.ts          #   구글 로그인/로그아웃/관리자 판별
    │   └── comments.ts      #   댓글 조회(페이지네이션·캐시)/작성/삭제
    ├── hooks/               # useAuth(로그인 상태 공유), useDocumentTitle
    ├── components/          # Header, Footer, Discussion, Markdown, LinkList 등
    └── pages/               # Home, ResearchList/Detail, CourseList/Detail, About, NotFound
```

**기술 스택**: Vite + React + TypeScript, Tailwind CSS v4, react-router-dom, firebase 모듈러 SDK

**추가한 라이브러리와 이유**
- `react-markdown`: 연구 본문(Markdown)을 표시합니다. HTML을 직접 삽입하지 않아 XSS에 안전합니다.
- `remark-gfm`: 마크다운에서 표·체크리스트 등 GitHub 문법을 쓸 수 있게 합니다.
- `@tailwindcss/vite`: Tailwind CSS v4를 Vite에 연결하는 공식 플러그인입니다.

**설계 메모**
- Firebase SDK는 동적 import로 불러옵니다. 환경변수가 없으면 SDK 파일 자체를 내려받지 않아 첫 화면이 가볍습니다.
- 사용하는 Firebase 기능은 `firebase/app`, `firebase/auth`, `firebase/firestore` 뿐입니다(Functions·Storage·Hosting 미사용).
- 다크모드는 시스템 설정을 따르고, 헤더의 달/해 버튼으로 바꿀 수 있습니다(브라우저에 저장).
- 폰트: 본문 Pretendard(jsDelivr CDN), 제목 Noto Serif KR(Google Fonts).
