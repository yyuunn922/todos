# Connect Base SDK 개발 가이드

이 문서는 Connect Base SDK를 사용하여 웹/앱을 개발할 때 필요한 핵심 기능을 제공합니다.

포함된 기능: Database, Storage, Realtime, Auth, Payment, Push, Ads

---

# Connect Base 개발 가이드

이 문서는 AI 코딩 어시스턴트(Claude, Cursor, Windsurf, ChatGPT, Gemini 등)가 Connect Base SDK를 활용한 개발을 도울 때 참고하는 컨텍스트 파일입니다.

## 개요

이 프로젝트는 Connect Base 플랫폼을 사용하여 백엔드 기능(데이터베이스, 인증, 실시간 통신, 파일 스토리지 등)을 활용하는 애플리케이션입니다.

### 이 문서의 목적

Connect Base SDK를 활용하여 웹 애플리케이션을 개발하는 것입니다.

- ✅ SDK를 사용하는 프론트엔드 코드 작성
- ✅ MCP로 필요한 백엔드 리소스(DB, 스토리지 등) 자동 생성
- ❌ 파일 저장/배포 (사용자가 요청할 때까지 하지 않음)

### 지원 기술 스택

| 방식 | 설명 |
|------|------|
| **순수 HTML/CSS/JS** | 빌드 없이 바로 배포 가능 |
| **React/Vue/Svelte 등** | 로컬에서 빌드 후 dist 폴더 업로드 |

프레임워크 사용 시 빌드된 정적 파일(dist/)을 웹 스토리지에 업로드하면 됩니다.

---

## 보안 주의사항

- API Key는 클라이언트 코드에 노출됩니다 (프론트엔드 전용)
- 민감한 작업은 서버리스 함수를 통해 처리하세요
- API Key 권한은 콘솔에서 제한할 수 있습니다

---

## 중요: 파일 저장 정책

**코드 작성 후 파일 저장(`write_file`)은 자동으로 하지 마세요.**

사용자가 다음과 같이 명시적으로 요청할 때만 저장합니다:
- "저장해줘"
- "스토리지에 올려줘"
- "파일로 만들어줘"

---

## SDK/MCP로 할 수 없는 것

| 작업 | 대안 |
|------|------|
| **웹 스토리지 배포** | 콘솔에서 "배포" 버튼 클릭 |
| **도메인 연결** | 콘솔에서 커스텀 도메인 설정 |
| **API Key 생성** | 콘솔 > 설정 > API 탭에서 생성 |
| **빌링/결제 설정** | 콘솔에서 결제 수단 등록 |
| **앱 삭제** | 콘솔에서 직접 삭제 |

---

## 프로젝트 요구사항

### 진입점 파일
웹 스토리지 루트에 `index.html` 파일이 있어야 합니다.
- **순수 HTML/CSS/JS**: 직접 `index.html` 작성
- **React/Vue/Svelte 등**: 빌드 후 `dist/` 폴더 내용을 업로드 (빌드 도구가 `index.html` 자동 생성)

### 허용되는 파일 확장자
```
.html, .css, .js, .mjs, .ts, .tsx, .jsx
.json, .xml, .txt, .md
.png, .jpg, .jpeg, .gif, .svg, .webp, .ico, .avif
.woff, .woff2, .ttf, .eot, .otf
.mp3, .wav, .ogg, .mp4, .webm
.pdf, .zip
.map, .wasm
```


---

## ⚡ MCP 자동화 워크플로우 (권장)

Connect Base MCP 서버가 연결되어 있다면, 코드 작성 후 필요한 백엔드 리소스를 **자동으로 생성**할 수 있습니다.

### 자동화 순서

1. **코드 작성** - 사용자 요청에 따라 웹 애플리케이션 코드 작성
2. **필요 리소스 분석** - 코드에서 사용하는 Connect Base 기능 파악
3. **MCP로 리소스 자동 생성** - 데이터베이스, 테이블, 스토리지, 함수 등 생성
4. **코드에 ID 반영** - 생성된 리소스 ID를 코드에 자동 적용

> ⚠️ **파일 저장(`write_file`)은 사용자가 명시적으로 요청할 때만** 수행합니다.

### AI 어시스턴트가 수행해야 할 작업

코드를 작성한 후, 다음 기능이 사용되면 MCP 도구로 리소스를 자동 생성하세요:

| 코드에서 사용하는 기능 | MCP 도구 |
|----------------------|----------|
| `cb.database.getData()`, `cb.database.createData()` | `create_database` → `create_table` |
| `cb.storage.uploadFile()`, `cb.storage.getFiles()` | `create_file_storage` |
| `cb.realtime.subscribe()`, `cb.realtime.connect()` | `create_realtime_category` |
| `cb.functions.call()` | `create_function` |
| 워크플로우 자동화 | `create_workflow` |
| 웹훅 이벤트 | `create_webhook` |

> **모든 백엔드 리소스를 MCP로 자동 생성할 수 있습니다.** 사용자가 콘솔에서 수동으로 설정할 필요가 없습니다.

### 자동화 예시

**예시 1: 방명록 앱 (데이터베이스 사용)**
```
사용자: "방명록 웹앱 만들어줘"

AI 어시스턴트 수행 순서:
1. 방명록 HTML/CSS/JS 코드 작성 (cb.database 사용)
2. MCP 도구 호출:
   - create_database(name: "guestbook-db")
   - create_table(name: "entries")
3. 생성된 table_id를 코드에 적용하여 최종 코드 제공

※ JSON 데이터베이스는 스키마리스(Schemaless)로, 컬럼은 데이터 삽입 시 자동 생성됩니다.
```

**예시 2: 실시간 채팅 앱 (WebSocket 사용)**
```
사용자: "실시간 채팅 앱 만들어줘"

AI 어시스턴트 수행 순서:
1. 채팅 HTML/CSS/JS 코드 작성 (cb.realtime 사용)
2. MCP 도구 호출:
   - create_realtime_category(name: "chat-room", persist: true, history_count: 100)
3. 생성된 category name을 코드에 적용하여 최종 코드 제공
```

**예시 3: 파일 갤러리 앱 (파일 스토리지 사용)**
```
사용자: "이미지 갤러리 앱 만들어줘"

AI 어시스턴트 수행 순서:
1. 갤러리 HTML/CSS/JS 코드 작성 (cb.storage 사용)
2. MCP 도구 호출:
   - create_file_storage(name: "gallery-images", description: "이미지 갤러리 스토리지")
3. 생성된 storage_id를 코드에 적용하여 최종 코드 제공
```

### MCP 연결 확인

MCP가 연결되어 있다면 다음 도구들을 사용할 수 있습니다:
- `list_storages`, `create_storage` - 웹 스토리지 관리
- `list_databases`, `create_database`, `create_table` - 데이터베이스 관리
- `list_file_storages`, `create_file_storage` - 파일 스토리지 관리
- `list_realtime_categories`, `create_realtime_category` - 실시간 카테고리 관리
- `list_functions`, `create_function` - 서버리스 함수 관리
- `read_file` - 기존 파일 읽기 (참고용)

> ⚠️ `write_file`, `delete_file`은 사용자가 명시적으로 요청할 때만 사용하세요.

> MCP가 연결되지 않은 경우, 사용자에게 콘솔에서 수동으로 리소스를 생성하도록 안내하세요.

---

## 수동 설정 (MCP 미사용 시)

MCP가 연결되지 않은 경우, [Connect Base 콘솔](https://connectbase.world)에서 직접 생성해야 합니다:

1. **API Key 생성**: 콘솔 > 설정 > API 탭 > "API Key 생성"
   - 생성 시 한 번만 표시되므로 반드시 복사해서 보관
2. **데이터베이스 테이블 생성** (데이터 저장 시): 콘솔 > 데이터베이스 > JSON 데이터베이스 > 테이블 생성
3. **파일 스토리지 생성** (파일 업로드 시): 콘솔 > 스토리지 > 파일 스토리지 > 스토리지 생성
4. **실시간 카테고리 생성** (채팅 등): 콘솔 > WebSocket > 카테고리 생성


---

## Connect Base SDK 사용법

### 설치

**Script 태그로 로드**
```html
<script src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axryec8zhjr9/b/connect-base-public-sdk/o/v1/connect-base.min.js"></script>
<script>
const cb = new ConnectBase({
    apiKey: 'YOUR_API_KEY_HERE'  // TODO: 실제 API Key로 교체
})
</script>
```

**npm 설치** (Node.js 환경)
```bash
npm install connectbase-client
```

---

### CLI (웹 스토리지 배포)

웹 스토리지에 정적 파일을 빠르게 배포할 수 있는 CLI 도구입니다.

**빠른 시작:**
```bash
# 1. 초기화 (최초 1회) - API Key, Storage ID 입력 → 설정 파일 자동 생성
npx connectbase-client init

# 2. 배포
npm run deploy
```

`init` 명령어가 수행하는 작업:
1. API Key를 대화형으로 입력받음
2. 기존 웹 스토리지 목록을 조회하거나 새로 자동 생성
3. `.connectbaserc` 파일 생성
4. `.gitignore`에 `.connectbaserc` 추가
5. `package.json`에 `deploy` 스크립트 자동 등록 (`build` 스크립트가 있으면 빌드 후 배포)

**터널 (로컬 서비스 노출):**
```bash
# 로컬 포트를 인터넷에 노출 (MCP 서버, 개발 서버 등)
npx connectbase-client tunnel 8084 -k <api-key>
# → https://tunnel.connectbase.world/<tunnel-id>/ 로 접근 가능

# GPU 서버 등 응답이 크고 느린 경우 (타임아웃/바디 크기 확장)
npx connectbase-client tunnel 7860 --timeout 300 --max-body 50
```

**터널 옵션 (tunnel 전용):**
| 옵션 | 단축 | 설명 |
|------|------|------|
| `--timeout <sec>` | `-t` | 요청 타임아웃 (초, 플랜 상한 적용) |
| `--max-body <MB>` | | 최대 바디 크기 (MB, 플랜 상한 적용) |

**수동 배포 (init 없이):**
```bash
npx connectbase-client deploy ./dist -s <storage-id> -k <api-key>
```

**CLI 옵션 (deploy):**
| 옵션 | 단축 | 설명 |
|------|------|------|
| `--storage <id>` | `-s` | 스토리지 ID |
| `--api-key <key>` | `-k` | API Key |
| `--base-url <url>` | `-u` | 서버 URL |
| `--help` | `-h` | 도움말 |
| `--version` | `-v` | 버전 |

**설정 파일 (.connectbaserc):**
`init` 명령어가 자동 생성하거나 수동으로 작성:
```json
{
  "apiKey": "your-api-key",
  "storageId": "your-storage-id",
  "deployDir": "./dist"
}
```

**배포 요구사항:**
- `index.html` 필수 (루트에 존재)
- 허용 확장자: `.html`, `.css`, `.js`, `.json`, `.svg`, `.png`, `.jpg`, `.gif`, `.webp`, `.woff`, `.woff2`, `.ttf`, `.mp3`, `.mp4`, `.pdf`, `.wasm` 등

**SSR 프레임워크 주의사항:**

Connect Base 웹 스토리지는 **정적 파일 호스팅**입니다. SSR(Server-Side Rendering) 프레임워크를 사용하는 경우, SPA(Single Page Application) 모드로 전환해야 배포할 수 있습니다.

| 프레임워크 | 변경 방법 |
|-----------|----------|
| **TanStack Start** | `tanstackStart()` 플러그인 → `TanStackRouterVite()` 변경, `index.html` + `src/main.tsx` 엔트리 포인트 생성 |
| **Next.js** | `next.config.js`에 `output: 'export'` 설정 후 `next build` → `out/` 디렉토리 배포 |
| **Nuxt** | `nuxt.config.ts`에 `ssr: false` 설정 후 `nuxt generate` → `.output/public/` 배포 |
| **SvelteKit** | `@sveltejs/adapter-static` 어댑터 사용 → `build/` 배포 |

**TanStack Start → SPA 전환 예시:**

1. 프로젝트 루트에 `index.html` 생성:
```html
<!DOCTYPE html>
<html lang="ko">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

2. `src/main.tsx` 생성:
```tsx
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import './styles.css'

const router = getRouter()
ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
```

3. `vite.config.ts` 수정:
```ts
// before: import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

plugins: [TanStackRouterVite(), viteReact(), ...]
```

4. `__root.tsx`에서 SSR 전용 API(`HeadContent`, `Scripts`, `shellComponent`) 제거하고 `Outlet` 사용

5. 빌드 후 배포: `vite build && connectbase-client deploy ./dist`

### 초기화
```typescript
const cb = new ConnectBase({
    apiKey: 'YOUR_API_KEY_HERE'  // 콘솔에서 발급받은 API Key로 교체
})
```

> **YOUR_API_KEY_HERE** 부분을 실제 API Key로 교체해야 합니다.
> API Key는 콘솔 > 설정 > API 탭에서 생성할 수 있습니다.
> 보안상 키 값은 생성 시 한 번만 표시됩니다.

---

## 환경별 설정

SDK는 자동으로 환경을 감지합니다:

| 환경 | API 서버 | Socket 서버 | WebRTC 서버 |
|------|----------|-------------|-------------|
| localhost | http://localhost:8080 | http://localhost:8083 | http://localhost:8086 |
| 프로덕션 | https://api.connectbase.world | https://socket.connectbase.world | https://webrtc.connectbase.world |

커스텀 서버 사용 시:
```typescript
const cb = new ConnectBase({
    baseUrl: 'https://your-api.com',
    socketUrl: 'https://your-socket.com',
    webrtcUrl: 'https://your-webrtc.com',
    apiKey: 'your-api-key'
})
```

---

## 에러 처리

```typescript
// ApiError, AuthError는 SDK에 포함되어 있습니다

try {
    await cb.database.getData('table-id')
} catch (error) {
    if (error instanceof AuthError) {
        // 인증 에러 (토큰 만료 등)
        console.log('Please login again')
    } else if (error instanceof ApiError) {
        // API 에러
        console.log('Status:', error.status)
        console.log('Message:', error.message)
    } else {
        // 기타 에러
        console.error(error)
    }
}
```

---

## 리소스 ID 찾기

콘솔에서 각 리소스의 ID를 확인할 수 있습니다:

| 리소스 | 콘솔 경로 | ID 위치 |
|--------|----------|---------|
| **API Key** | 설정 > API 탭 | 생성 시 1회만 표시 |
| **테이블 ID** | 데이터베이스 > JSON DB > 테이블 클릭 | URL 또는 상세 페이지 |
| **스토리지 ID** | 스토리지 > 파일 스토리지 클릭 | URL 또는 상세 페이지 |
| **함수 ID** | 함수 > 함수 클릭 | URL 또는 상세 페이지 |
| **카테고리명** | WebSocket > 카테고리 | 카테고리 이름 그대로 사용 |

---

## 코드 작성 시 체크리스트

AI 어시스턴트가 코드 생성 시 확인해야 할 사항:

1. **SDK 스크립트 로드** - `<script src="...connect-base.min.js">` 포함 여부
2. **API Key 설정** - `YOUR_API_KEY_HERE`가 실제 값으로 교체되었는지 확인 요청
3. **리소스 ID 설정** - `your-table-id`, `your-storage-id` 등이 실제 ID로 교체되었는지 확인 요청
4. **에러 처리** - try-catch로 API 호출 감싸기
5. **로딩 상태** - 비동기 작업 중 사용자에게 피드백 제공


---

## SDK 기능별 사용 예시

> 아래 모든 기능은 Connect Base 서버와 통신이 필요합니다.
> 반드시 SDK를 먼저 로드하고 초기화해야 합니다:
> ```html
> <script src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axryec8zhjr9/b/connect-base-public-sdk/o/v1/connect-base.min.js"></script>
> ```

### 1. 데이터베이스 (JSON Database)

```typescript
// 데이터 조회
const { data, total } = await cb.database.getData('table-id', {
    limit: 20,
    offset: 0
})

// 조건부 조회 (Where)
const result = await cb.database.queryData('table-id', {
    where: {
        field: 'status',
        operator: 'eq',
        value: 'active'
    },
    orderBy: 'created_at',
    orderDirection: 'desc',
    limit: 10
})

// 단일 데이터 조회
const item = await cb.database.getDataById('table-id', 'data-id')

// 데이터 생성
const newItem = await cb.database.createData('table-id', {
    data: { name: 'John', age: 30 }
})

// 데이터 수정
const updated = await cb.database.updateData('table-id', 'data-id', {
    data: { name: 'Jane' }
})

// 데이터 삭제
await cb.database.deleteData('table-id', 'data-id')

// 여러 데이터 한번에 생성
const bulkResult = await cb.database.createMany('table-id', [
    { data: { name: 'User1' } },
    { data: { name: 'User2' } },
    { data: { name: 'User3' } }
])

// 조건에 맞는 데이터 삭제
const deleteResult = await cb.database.deleteWhere('table-id', {
    field: 'status',
    operator: 'eq',
    value: 'deleted'
})
```

### Where 연산자
| 연산자 | 설명 | 예시 |
|--------|------|------|
| `eq` | 같음 (=) | `{ field: 'status', operator: 'eq', value: 'active' }` |
| `neq` | 같지 않음 (!=) | `{ field: 'status', operator: 'neq', value: 'deleted' }` |
| `gt` | 큼 (>) | `{ field: 'age', operator: 'gt', value: 18 }` |
| `gte` | 크거나 같음 (>=) | `{ field: 'price', operator: 'gte', value: 1000 }` |
| `lt` | 작음 (<) | `{ field: 'stock', operator: 'lt', value: 10 }` |
| `lte` | 작거나 같음 (<=) | `{ field: 'rating', operator: 'lte', value: 3 }` |
| `like` | 부분 일치 | `{ field: 'name', operator: 'like', value: '김' }` |
| `in` | 배열에 포함 | `{ field: 'category', operator: 'in', value: ['food', 'drink'] }` |
| `nin` | 배열에 미포함 | `{ field: 'status', operator: 'nin', value: ['spam', 'blocked'] }` |
| `between` | 범위 내 | `{ field: 'price', operator: 'between', value: [100, 500] }` |
| `is_null` | NULL 체크 | `{ field: 'deleted_at', operator: 'is_null', value: true }` |
| `is_not_null` | NOT NULL 체크 | `{ field: 'email', operator: 'is_not_null', value: true }` |
| `regex` | 정규식 매칭 | `{ field: 'email', operator: 'regex', value: '^[a-z]+@' }` |
| `array_contains` | 배열 필드에 값 포함 | `{ field: 'tags', operator: 'array_contains', value: 'featured' }` |
| `array_contains_any` | 배열 필드에 값 중 하나 포함 | `{ field: 'tags', operator: 'array_contains_any', value: ['hot', 'new'] }` |

### 복합 조건 (AND/OR)

```typescript
// AND 조건 (배열로 전달)
const result = await cb.database.queryData('table-id', {
    where: [
        { field: 'status', operator: 'eq', value: 'active' },
        { field: 'price', operator: 'gte', value: 1000 }
    ]
})

// OR 조건
const result = await cb.database.queryData('table-id', {
    where: {
        or: [
            { field: 'category', operator: 'eq', value: 'electronics' },
            { field: 'category', operator: 'eq', value: 'computers' }
        ]
    }
})
```

**API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `getData()` | `GET /v1/public/tables/:tableID/data` |
| `queryData()` | `POST /v1/public/tables/:tableID/data/query` |
| `getDataById()` | `GET /v1/public/tables/:tableID/data/:dataID` |
| `createData()` | `POST /v1/public/tables/:tableID/data` |
| `updateData()` | `PUT /v1/public/tables/:tableID/data/:dataID` |
| `deleteData()` | `DELETE /v1/public/tables/:tableID/data/:dataID` |
| `createMany()` | `POST /v1/public/tables/:tableID/data/bulk` |
| `deleteWhere()` | `POST /v1/public/tables/:tableID/data/delete-where` |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**데이터 목록 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/tables/TABLE_ID/data?limit=20&offset=0" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "data": [
    { "id": "data-1", "name": "Alice", "age": 25, "created_at": "2025-01-01T00:00:00Z" },
    { "id": "data-2", "name": "Bob", "age": 30, "created_at": "2025-01-02T00:00:00Z" }
  ],
  "total": 100,
  "has_more": true
}
```

**조건부 쿼리:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/tables/TABLE_ID/data/query" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "where": [
      { "field": "status", "operator": "eq", "value": "active" },
      { "field": "age", "operator": "gte", "value": 18 }
    ],
    "order_by": { "field": "created_at", "direction": "desc" },
    "limit": 10
  }'
```

**지원 연산자:**
| 연산자 | 설명 |
|--------|------|
| `eq`, `neq` | 같음, 다름 |
| `gt`, `gte`, `lt`, `lte` | 크다, 크거나 같다, 작다, 작거나 같다 |
| `in`, `not_in` | 배열에 포함, 미포함 |
| `contains` | 문자열 포함 |
| `starts_with`, `ends_with` | 시작, 끝 문자열 |
| `is_null`, `is_not_null` | NULL 체크 |

**데이터 생성:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/tables/TABLE_ID/data" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charlie",
    "email": "charlie@example.com",
    "age": 28
  }'
```

응답:
```json
{
  "id": "019abc12-...",
  "name": "Charlie",
  "email": "charlie@example.com",
  "age": 28,
  "created_at": "2025-01-20T10:00:00Z"
}
```

**데이터 수정:**
```bash
curl -X PUT "https://api.connectbase.world/v1/public/tables/TABLE_ID/data/DATA_ID" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 29
  }'
```

**데이터 삭제:**
```bash
curl -X DELETE "https://api.connectbase.world/v1/public/tables/TABLE_ID/data/DATA_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

**일괄 생성:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/tables/TABLE_ID/data/bulk" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      { "name": "User1", "email": "user1@example.com" },
      { "name": "User2", "email": "user2@example.com" }
    ]
  }'
```

### 2. 트리거 (자동 실행)

데이터 생성/수정/삭제 시 자동으로 함수, 워크플로우, 웹훅을 실행할 수 있습니다.
콘솔의 JSON Database > 트리거 탭에서 설정하거나, API로 관리합니다.

**이벤트 타입:** `create`, `update`, `delete`, `all`
**핸들러 타입:** `function` (Serverless 함수), `workflow` (워크플로우), `webhook` (외부 URL)

```bash
# 트리거 목록 조회
curl "https://data.connectbase.world/v1/apps/APP_ID/triggers" \
  -H "Authorization: Bearer TOKEN"

# 트리거 생성 (주문 생성 시 알림 함수 실행)
curl -X POST "https://data.connectbase.world/v1/apps/APP_ID/triggers" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "주문 생성 알림",
    "table_name": "orders",
    "event": "create",
    "handler_type": "function",
    "handler_id": "FUNCTION_UUID",
    "is_active": true,
    "order": 0
  }'

# 웹훅 트리거 (외부 URL 호출)
curl -X POST "https://data.connectbase.world/v1/apps/APP_ID/triggers" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Slack 알림",
    "table_name": "orders",
    "event": "create",
    "handler_type": "webhook",
    "handler_url": "https://hooks.slack.com/services/...",
    "is_active": true
  }'

# 트리거 수정
curl -X PUT "https://data.connectbase.world/v1/apps/APP_ID/triggers/TRIGGER_ID" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "is_active": false }'

# 트리거 삭제
curl -X DELETE "https://data.connectbase.world/v1/apps/APP_ID/triggers/TRIGGER_ID" \
  -H "Authorization: Bearer TOKEN"
```

**핸들러에 전달되는 Payload:**
```json
{
  "type": "create",
  "app_id": "앱 UUID",
  "table_name": "orders",
  "doc_id": "문서 UUID",
  "data": { "새 데이터" },
  "old_data": { "이전 데이터 (update/delete)" },
  "member_id": "멤버 ID",
  "timestamp": 1700000000
}
```

> 트리거는 비동기로 실행되며, 실패해도 원본 데이터 작업에는 영향을 주지 않습니다.


---

### 2. 파일 스토리지

```typescript
// 파일 목록 조회
const files = await cb.storage.getFiles('storage-id')

// 파일 업로드
const fileInput = document.querySelector('input[type="file"]')
const result = await cb.storage.uploadFile('storage-id', fileInput.files[0])

// 특정 폴더에 업로드
const result = await cb.storage.uploadFile('storage-id', file, 'folder-id')

// 여러 파일 업로드
const results = await cb.storage.uploadFiles('storage-id', fileList)

// 폴더 생성
const folder = await cb.storage.createFolder('storage-id', {
    name: 'images',
    parent_id: null  // 루트에 생성
})

// 파일/폴더 삭제
await cb.storage.deleteFile('storage-id', 'file-id')

// 파일 이동
await cb.storage.moveFile('storage-id', 'file-id', {
    parent_id: 'new-folder-id'
})

// 파일 이름 변경
await cb.storage.renameFile('storage-id', 'file-id', {
    name: 'new-name.jpg'
})

// 파일 URL 가져오기
const url = cb.storage.getFileUrl(fileItem)

// 경로 기반 업로드 (고정 URL - Firebase Storage 스타일)
// 같은 경로에 다시 업로드하면 URL이 유지된 채로 파일만 교체됨
const result = await cb.storage.uploadByPath(
    'storage-id',
    '/profiles/user123/avatar.png',
    file
)
console.log(result.url) // 항상 동일한 URL

// 경로로 파일 조회
const file = await cb.storage.getByPath('storage-id', '/profiles/user123/avatar.png')

// 경로로 URL만 가져오기 (없으면 null)
const url = await cb.storage.getUrlByPath('storage-id', '/profiles/user123/avatar.png')
```

**API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `getFiles()` | `GET /v1/public/storages/files/:storageID/items` |
| `uploadFile()` | `POST /v1/public/storages/files/:storageID/upload` |
| `uploadByPath()` | `POST /v1/public/storages/files/:storageID/path/*path` |
| `getByPath()` | `GET /v1/public/storages/files/:storageID/path/*path` |
| `deleteFile()` | `DELETE /v1/public/storages/files/:storageID/items/:fileID` |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**파일 목록 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/storages/files/STORAGE_ID/items?parent_id=" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "items": [
    {
      "id": "file-1",
      "name": "image.png",
      "type": "file",
      "size": 102400,
      "mime_type": "image/png",
      "url": "https://storage.connectbase.world/...",
      "created_at": "2025-01-20T10:00:00Z"
    },
    {
      "id": "folder-1",
      "name": "documents",
      "type": "folder",
      "created_at": "2025-01-19T10:00:00Z"
    }
  ]
}
```

**파일 업로드 (multipart/form-data):**
```bash
curl -X POST "https://api.connectbase.world/v1/public/storages/files/STORAGE_ID/upload" \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "file=@/path/to/image.png" \
  -F "parent_id=folder-1"
```

응답:
```json
{
  "id": "file-2",
  "name": "image.png",
  "type": "file",
  "size": 102400,
  "mime_type": "image/png",
  "url": "https://storage.connectbase.world/..."
}
```

**폴더 생성:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/storages/files/STORAGE_ID/folders" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "new-folder",
    "parent_id": null
  }'
```

**파일/폴더 삭제:**
```bash
curl -X DELETE "https://api.connectbase.world/v1/public/storages/files/STORAGE_ID/items/FILE_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

**경로 기반 파일 업로드 (고정 URL):**
```bash
curl -X POST "https://api.connectbase.world/v1/public/storages/files/STORAGE_ID/path/profiles/user123/avatar.png" \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "file=@/path/to/avatar.png" \
  -F "overwrite=true"
```

응답:
```json
{
  "id": "file-2",
  "name": "avatar.png",
  "path": "/profiles/user123/avatar.png",
  "type": "file",
  "size": 102400,
  "mime_type": "image/png",
  "url": "https://storage.connectbase.world/..."
}
```

**경로로 파일 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/storages/files/STORAGE_ID/path/profiles/user123/avatar.png" \
  -H "X-API-Key: YOUR_API_KEY"
```

#### SPA 모드 설정

웹 스토리지에 SPA(Single Page Application)를 배포한 경우, SPA 모드를 활성화하면 존재하지 않는 경로 접근 시 `index.html`을 반환합니다 (기본값: 활성화).

| 설정 | 설명 |
|------|------|
| `spa_mode: true` (기본) | `/oauth/callback` 등 경로 → `index.html` 반환 (React, Vue 등) |
| `spa_mode: false` | 존재하지 않는 경로 → 404 반환 (정적 사이트) |

콘솔 보안 설정 탭에서 토글하거나, MCP 도구 `update_storage_config`로 변경 가능합니다.

⚠️ **주의:** SPA 모드 사용 시 `vite.config.ts`에서 `base: '/'`를 설정하여 모든 asset 경로가 절대 경로(`/assets/...`)가 되도록 해야 합니다. 상대 경로를 사용하면 깊은 경로에서 CSS/JS 로드가 실패합니다.

#### 페이지 메타 (SEO / OG 태그)

SPA의 각 페이지에 동적 OG 태그, JSON-LD 구조화 데이터를 설정하여 검색엔진(Google, Bing, Naver 등) 및 소셜 미디어 공유 시 페이지별 미리보기를 표시할 수 있습니다.

```typescript
// 페이지별 OG 태그 설정 (Upsert - 같은 경로면 업데이트)
await cb.storage.setPageMeta('web-storage-id', {
    path: '/products/123',
    title: '최신 스마트폰 - 내 쇼핑몰',
    description: '최고의 성능, 최저가 보장',
    image: 'https://example.com/product.jpg',
    og_type: 'product',
    json_ld: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "최신 스마트폰",
        "offers": { "@type": "Offer", "price": "999000", "priceCurrency": "KRW" }
    }),
    include_in_sitemap: true,    // sitemap.xml 자동 포함 (기본: true)
    sitemap_priority: 0.8,       // 사이트맵 우선순위 (0.0~1.0)
    canonical_url: 'https://mysite.com/products/123',
    robots_noindex: false        // true면 검색 결과에서 제외 (기본: false)
})

// 여러 페이지 일괄 등록 (최대 100개)
await cb.storage.batchSetPageMeta('web-storage-id', {
    pages: [
        { path: '/products/1', title: '상품 1', description: '설명 1' },
        { path: '/products/2', title: '상품 2', description: '설명 2' },
    ]
})

// 페이지 메타 목록 조회
const { total_count, pages } = await cb.storage.listPageMetas('web-storage-id')

// 특정 경로 조회
const meta = await cb.storage.getPageMeta('web-storage-id', '/products/123')

// 삭제
await cb.storage.deletePageMeta('web-storage-id', '/products/123')
await cb.storage.deleteAllPageMetas('web-storage-id')  // 전체 삭제
```

**API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `setPageMeta()` | `PUT /v1/public/storages/webs/:storageID/page-metas` |
| `batchSetPageMeta()` | `POST /v1/public/storages/webs/:storageID/page-metas/batch` |
| `listPageMetas()` | `GET /v1/public/storages/webs/:storageID/page-metas` |
| `getPageMeta()` | `GET /v1/public/storages/webs/:storageID/page-metas/get?path=...` |
| `deletePageMeta()` | `DELETE /v1/public/storages/webs/:storageID/page-metas?path=...` |
| `deleteAllPageMetas()` | `DELETE /v1/public/storages/webs/:storageID/page-metas/all` |

> 검색엔진(Googlebot, Bingbot, Naver 등) 및 소셜 크롤러(카카오, 페이스북, 트위터, 디스코드 등) 방문 시 자동으로 HTML `<head>`에 OG 태그, `<meta name="description">`, JSON-LD, robots noindex가 주입됩니다. sitemap.xml에는 `lastmod`와 `priority`가 자동 포함됩니다.

---

### 3. 서버리스 함수

```typescript
// 함수 실행 (전체 응답)
const response = await cb.functions.invoke('function-id', {
    name: 'John',
    action: 'greet'
})
// response: { success: true, result: {...}, execution_time: 123 }

// 함수 실행 (결과만)
const result = await cb.functions.call('function-id', {
    name: 'John'
})
// result: 함수가 반환한 데이터

// 타임아웃 설정 (초)
const response = await cb.functions.invoke('function-id', payload, 60)
```

**API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `invoke()` | `POST /v1/public/functions/:functionID/invoke` |
| `call()` | `POST /v1/public/functions/:functionID/invoke` (result만 반환) |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**함수 실행:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/functions/FUNCTION_ID/invoke" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "action": "greet"
  }'
```

응답:
```json
{
  "success": true,
  "result": {
    "message": "Hello, John!"
  },
  "execution_time": 123
}
```


---

### 4. 실시간 통신 (WebSocket)

```typescript
// WebSocket 연결
await cb.realtime.connect({
    userId: 'user-123'  // 선택사항
})

// 카테고리 구독
const chat = await cb.realtime.subscribe('chat-room-1')

// 메시지 수신 핸들러
chat.onMessage((msg) => {
    console.log('From:', msg.from)
    console.log('Data:', msg.data)
    console.log('Time:', new Date(msg.sentAt))
})

// 메시지 전송
await chat.send({
    text: 'Hello, World!',
    type: 'text'
})

// 메시지 전송 (자신 제외)
await chat.send({ text: 'Hello' }, { includeSelf: false })

// 히스토리 조회 (persist=true인 카테고리만)
if (chat.info.persist) {
    const history = await chat.getHistory(50)
    console.log('Messages:', history.messages)
}

// 구독 해제
await chat.unsubscribe()

// 연결 상태 확인
const state = cb.realtime.getState()
// 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

// 상태 변경 감지
cb.realtime.onStateChange((newState) => {
    console.log('Connection state:', newState)
})

// 에러 핸들링
cb.realtime.onError((error) => {
    console.error('Realtime error:', error)
})

// 연결 해제
cb.realtime.disconnect()
```

**WebSocket 엔드포인트:**
```
ws://socket.connectbase.world/ws?api_key=YOUR_API_KEY
wss://socket.connectbase.world/ws?api_key=YOUR_API_KEY  (권장)
```

**REST API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| 카테고리 목록 | `GET /v1/public/realtime/categories` |
| 메시지 히스토리 | `GET /v1/public/realtime/categories/:categoryID/history` |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**카테고리 목록 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/realtime/categories" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "categories": [
    {
      "id": "cat-1",
      "name": "chat-room-1",
      "type": "pubsub",
      "persist": true,
      "created_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

**메시지 히스토리 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/realtime/categories/CATEGORY_ID/history?limit=50" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "messages": [
    {
      "id": "msg-1",
      "from": "user-123",
      "data": { "text": "Hello!", "type": "text" },
      "sent_at": "2025-01-20T10:00:00Z"
    }
  ],
  "has_more": false
}
```

#### WebSocket 메시지 형식

**구독 요청:**
```json
{ "action": "subscribe", "category": "chat-room-1" }
```

**메시지 전송:**
```json
{ "action": "publish", "category": "chat-room-1", "data": { "text": "Hello!" } }
```

**수신 메시지:**
```json
{ "type": "message", "from": "user-456", "data": { "text": "Hello!" }, "sentAt": 1705740000000 }
```

#### AI 스트리밍 (Gemini)

WebSocket을 통한 실시간 AI 텍스트 생성:

```typescript
// WebSocket 연결 필요
await cb.realtime.connect()

// AI 스트리밍 시작
const session = await cb.realtime.stream(
    [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: '양자 컴퓨팅을 쉽게 설명해줘' }
    ],
    {
        onToken: (token, index) => {
            // 토큰이 생성될 때마다 호출
            process.stdout.write(token)
        },
        onDone: (result) => {
            // 생성 완료 시 호출
            console.log('\n완료!')
            console.log('전체 텍스트:', result.fullText)
            console.log('총 토큰:', result.totalTokens)
            console.log('소요 시간:', result.duration, 'ms')
        },
        onError: (error) => {
            console.error('스트리밍 에러:', error.message)
        }
    },
    {
        model: 'gemini-2.0-flash',  // 선택: 기본값
        temperature: 0.7,           // 선택: 0.0-2.0
        maxTokens: 1000             // 선택: 최대 출력 토큰
    }
)

// 필요 시 스트리밍 중지
await session.stop()
```

**스트리밍 옵션:**
| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `provider` | `'gemini'` | `'gemini'` | AI 프로바이더 |
| `model` | `string` | `'gemini-2.0-flash'` | 모델명 |
| `system` | `string` | - | 시스템 프롬프트 |
| `temperature` | `number` | `0.7` | 창의성 (0.0-2.0) |
| `maxTokens` | `number` | - | 최대 출력 토큰 |
| `sessionId` | `string` | 자동 생성 | 세션 추적 ID |
| `metadata` | `object` | - | 사용자 정의 메타데이터 |

**완료 결과 (onDone):**
| 필드 | 타입 | 설명 |
|------|------|------|
| `sessionId` | `string` | 세션 ID |
| `fullText` | `string` | 전체 생성 텍스트 |
| `totalTokens` | `number` | 총 토큰 수 |
| `promptTokens` | `number` | 입력 프롬프트 토큰 |
| `duration` | `number` | 생성 소요 시간 (ms) |

> AI 스트리밍은 `ai_stream_token` 리소스 타입으로 사용량이 기록됩니다.

---

### 5. WebRTC (영상/음성 통화)

```typescript
// API Key/JWT 유효성 사전 검증
const validation = await cb.webrtc.validate()
console.log('인증 상태:', validation.valid, validation.app_id)

// 로컬 미디어 스트림 가져오기
const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})

// WebRTC 연결 (roomId는 'channel:room' 형식 권장)
await cb.webrtc.connect({
    roomId: 'live:room-123',      // 채널:룸 형식
    userId: 'user-456',           // 선택사항
    isBroadcaster: true,          // broadcast 모드에서 방송자 여부
    localStream                   // 로컬 스트림
})

// 피어 참가 이벤트
cb.webrtc.onPeerJoined((peerId, info) => {
    console.log('Peer joined:', peerId, info)
})

// 피어 퇴장 이벤트
cb.webrtc.onPeerLeft((peerId) => {
    console.log('Peer left:', peerId)
})

// 원격 스트림 수신 이벤트
cb.webrtc.onRemoteStream((peerId, stream) => {
    // 원격 비디오/오디오 스트림 표시
    const video = document.getElementById('remote-video')
    video.srcObject = stream
})

// 연결 상태 변경 이벤트
cb.webrtc.onStateChange((state) => {
    // 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed'
    console.log('Connection state:', state)
})

// 에러 이벤트
cb.webrtc.onError((error) => {
    console.error('WebRTC error:', error)
})

// 오디오 음소거/해제
cb.webrtc.setAudioEnabled(false)  // 음소거
cb.webrtc.setAudioEnabled(true)   // 음소거 해제

// 비디오 끄기/켜기
cb.webrtc.setVideoEnabled(false)  // 비디오 끄기
cb.webrtc.setVideoEnabled(true)   // 비디오 켜기

// 로컬 스트림 교체 (카메라 전환 등)
const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
cb.webrtc.replaceLocalStream(newStream)

// 원격 스트림 가져오기
const remoteStream = cb.webrtc.getRemoteStream('peer-id')
const allStreams = cb.webrtc.getAllRemoteStreams()

// 현재 상태 조회
const state = cb.webrtc.getState()
const roomId = cb.webrtc.getRoomId()
const peerId = cb.webrtc.getPeerId()

// 연결 해제
cb.webrtc.disconnect()
```

**채널 타입:**
| 타입 | 설명 |
|------|------|
| `broadcast` | 1:N 방송 (방송자가 송출, 시청자는 수신만) |
| `interactive` | N:N 화상회의 (모든 참가자가 송수신) |

> 채널은 Connect Base 콘솔의 WebRTC > 채널에서 생성합니다.
> roomId는 `채널명:룸ID` 형식으로 지정합니다.

**WebSocket 시그널링 엔드포인트:**
```
wss://webrtc.connectbase.world/v1/apps/{APP_ID}/signaling?api_key=YOUR_API_KEY
wss://webrtc.connectbase.world/v1/apps/{APP_ID}/signaling?access_token=YOUR_ACCESS_TOKEN
```

**시그널링 메시지 형식:**

| 메시지 타입 | 방향 | 설명 |
|------------|------|------|
| `join` | Client → Server | 룸 참가 요청 `{ type: 'join', room_id: 'channel:room', data: { user_id, is_broadcaster } }` |
| `joined` | Server → Client | 참가 완료 `{ type: 'joined', peer_id, data: { peers, channel_type } }` |
| `peer_joined` | Server → Client | 새 피어 참가 `{ type: 'peer_joined', peer_id, data: { user_id } }` |
| `peer_left` | Server → Client | 피어 퇴장 `{ type: 'peer_left', peer_id }` |
| `offer` | Client ↔ Server | SDP Offer `{ type: 'offer', target_id, sdp }` |
| `answer` | Client ↔ Server | SDP Answer `{ type: 'answer', target_id, sdp }` |
| `ice_candidate` | Client ↔ Server | ICE Candidate `{ type: 'ice_candidate', target_id, candidate }` |
| `leave` | Client → Server | 퇴장 `{ type: 'leave' }` |
| `error` | Server → Client | 에러 `{ type: 'error', data: 'error message' }` |

**REST API:**
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/v1/ice-servers` | ICE 서버 목록 (STUN/TURN) |
| GET | `/v1/apps/:appID/validate` | API Key/JWT 유효성 검증 |
| GET | `/v1/apps/:appID/webrtc/stats` | WebRTC 통계 |
| GET | `/v1/apps/:appID/webrtc/rooms` | 활성 룸 목록 |

> WebRTC 시그널링은 WebSocket을 통해 이루어지며, 미디어 스트림은 P2P로 전송됩니다.
> ICE 서버는 기본적으로 Google STUN 서버를 사용하며, NAT 환경에서는 TURN 서버 설정을 권장합니다.


---

### 6. OAuth (소셜 로그인)

```typescript
// 활성화된 OAuth 프로바이더 목록 조회
const { providers } = await cb.oauth.getEnabledProviders()
// [{ provider: 'google', client_id: '...' }, { provider: 'naver', client_id: '...' }]

// 팝업 방식 로그인 (권장)
try {
    const result = await cb.oauth.signInWithPopup('google', 'https://your-site.com/auth/callback')
    console.log('로그인 성공:', result.member_id)
    if (result.is_new_member) {
        console.log('신규 회원입니다!')
    }
} catch (error) {
    console.error('로그인 실패:', error)
}

// 리다이렉트 방식 로그인
await cb.oauth.signIn('naver', 'https://your-site.com/auth/callback')
// 페이지가 Naver 로그인으로 리다이렉트됨

// 콜백 페이지에서 결과 처리
const result = cb.oauth.getCallbackResult()
if (result) {
    if (result.error) {
        console.error('로그인 실패:', result.error)
    } else {
        console.log('로그인 성공:', result.member_id)
        // 메인 페이지로 이동
        window.location.href = '/'
    }
}
```

**지원 프로바이더:**
| 프로바이더 | 설명 |
|-----------|------|
| `google` | Google 로그인 |
| `kakao` | 카카오 로그인 |
| `naver` | 네이버 로그인 |
| `apple` | Apple 로그인 |
| `github` | GitHub 로그인 |
| `discord` | Discord 로그인 |

> OAuth 프로바이더는 MCP의 `toggle_oauth_provider` 도구로 활성화/비활성화할 수 있습니다.

---

### 7. 인증 (앱 멤버)

앱 멤버를 위한 인증 시스템입니다.

#### 인증 설정 확인

로그인 UI를 표시하기 전에 앱에서 허용된 인증 방식을 확인할 수 있습니다.

```typescript
// 인증 설정 조회
const settings = await cb.auth.getAuthSettings()
console.log('아이디/비밀번호 로그인 허용:', settings.allow_id_password_login)
console.log('게스트 로그인 허용:', settings.allow_guest_login)
console.log('활성화된 OAuth:', settings.enabled_oauth_providers)
// enabled_oauth_providers: ['GOOGLE', 'KAKAO', ...] 형태

// 조건부 로그인 UI 표시 예시
if (settings.allow_guest_login) {
    // 게스트 로그인 버튼 표시
    await cb.auth.signInAsGuestMember()
} else if (settings.allow_id_password_login) {
    // 아이디/비밀번호 로그인 폼 표시
} else if (settings.enabled_oauth_providers.includes('GOOGLE')) {
    // 구글 소셜 로그인 버튼 표시
    await cb.oauth.signInWithPopup('google', callbackUrl)
}
```

**API 엔드포인트:** `GET /v1/public/auth-settings` (API Key 인증 필요)

#### 회원가입/로그인

```typescript
// 회원가입
const result = await cb.auth.signUpMember({
    login_id: 'user@example.com',  // 이메일 또는 사용자 ID
    password: 'password123',
    nickname: 'John'  // 선택사항
})
console.log('가입 완료:', result.member_id, result.nickname)

// 로그인
const result = await cb.auth.signInMember({
    login_id: 'user@example.com',
    password: 'password123'
})
console.log('로그인 성공:', result.member_id)

// 게스트 로그인 (계정 없이 임시 사용)
const guest = await cb.auth.signInAsGuestMember()
console.log('게스트 ID:', guest.member_id)

// 로그아웃
await cb.auth.signOut()
cb.clearTokens()
```

**인증 방식 비교:**
| 방식 | 메서드 | API 엔드포인트 |
|------|--------|----------------|
| 인증 설정 조회 | `getAuthSettings()` | `GET /v1/public/auth-settings` |
| 회원가입 | `signUpMember()` | `POST /v1/public/app-members/signup` |
| 로그인 | `signInMember()` | `POST /v1/public/app-members/signin` |
| 게스트 로그인 | `signInAsGuestMember()` | `POST /v1/public/app-members` |
| 소셜 로그인 | `oauth.signInWithPopup()` | OAuth 플로우 사용 |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**인증 설정 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/auth-settings" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "allow_id_password_login": true,
  "allow_guest_login": false,
  "enabled_oauth_providers": ["GOOGLE", "KAKAO"]
}
```

**회원가입:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/app-members/signup" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "login_id": "user@example.com",
    "password": "password123",
    "nickname": "John"
  }'
```

응답:
```json
{
  "member_id": "019abc12-...",
  "nickname": "John",
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG..."
}
```

**로그인:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/app-members/signin" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "login_id": "user@example.com",
    "password": "password123"
  }'
```

응답:
```json
{
  "member_id": "019abc12-...",
  "nickname": "John",
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG..."
}
```

**게스트 로그인:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/app-members" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

응답:
```json
{
  "member_id": "019abc12-...",
  "is_guest": true,
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG..."
}
```


---

### 9. 결제 (토스페이먼츠)

```typescript
// 결제 요청
const payment = await cb.payment.requestPayment({
    amount: 10000,
    orderId: 'order-123',
    orderName: '프리미엄 구독',
    successUrl: 'https://your-site.com/success',
    failUrl: 'https://your-site.com/fail'
})

// 결제 확인
const result = await cb.payment.confirmPayment({
    paymentKey: 'payment-key-from-toss',
    orderId: 'order-123',
    amount: 10000
})

// 결제 내역 조회
const history = await cb.payment.getPaymentHistory()

// 결제 취소
await cb.payment.cancelPayment('payment-key', {
    cancelReason: '고객 요청'
})
```

---

### 10. 정기결제/구독

```typescript
// 구독 플랜 목록
const plans = await cb.subscription.getPlans()

// 구독 시작
const subscription = await cb.subscription.subscribe({
    planId: 'plan-id',
    paymentMethodId: 'card-id'
})

// 현재 구독 상태
const status = await cb.subscription.getStatus()

// 구독 취소
await cb.subscription.cancel({
    reason: '서비스 불만족'
})
```

**결제 API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `requestPayment()` | `POST /v1/public/payments/request` |
| `confirmPayment()` | `POST /v1/public/payments/confirm` |
| `getPaymentHistory()` | `GET /v1/public/payments/history` |
| `cancelPayment()` | `POST /v1/public/payments/:paymentKey/cancel` |

**구독 API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `getPlans()` | `GET /v1/public/subscriptions/plans` |
| `subscribe()` | `POST /v1/public/subscriptions` |
| `getStatus()` | `GET /v1/public/subscriptions/status` |
| `cancel()` | `POST /v1/public/subscriptions/cancel` |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**결제 요청:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/payments/request" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "order_id": "order-123",
    "order_name": "프리미엄 구독",
    "success_url": "https://your-site.com/success",
    "fail_url": "https://your-site.com/fail"
  }'
```

응답:
```json
{
  "payment_url": "https://pay.toss.im/...",
  "order_id": "order-123"
}
```

**결제 확인 (콜백 후):**
```bash
curl -X POST "https://api.connectbase.world/v1/public/payments/confirm" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_key": "payment-key-from-toss",
    "order_id": "order-123",
    "amount": 10000
  }'
```

응답:
```json
{
  "payment_key": "payment-key-from-toss",
  "order_id": "order-123",
  "status": "DONE",
  "approved_at": "2025-01-20T10:00:00Z"
}
```

**결제 내역 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/payments/history?limit=20" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**구독 플랜 목록:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/subscriptions/plans" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "plans": [
    {
      "id": "plan-1",
      "name": "Basic",
      "price": 9900,
      "interval": "month",
      "features": ["기능1", "기능2"]
    }
  ]
}
```

**구독 시작:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/subscriptions" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "plan-1",
    "payment_method_id": "card-id"
  }'
```

---

### 11. 에러 트래커

```typescript
// 초기화 시 설정
const cb = new ConnectBase({
    apiKey: 'your-api-key',
    errorTracker: {
        enabled: true,
        captureUnhandled: true,  // 미처리 에러 자동 캡처
        sampleRate: 1.0,         // 샘플링 비율 (0.0 ~ 1.0)
        maxBreadcrumbs: 50       // 최대 breadcrumb 수
    }
})

// 수동 에러 리포팅
cb.errorTracker.captureError(new Error('Something went wrong'), {
    context: { userId: '123' },
    tags: { feature: 'checkout' }
})

// Breadcrumb 추가 (에러 추적용 컨텍스트)
cb.errorTracker.addBreadcrumb({
    category: 'ui',
    message: 'Button clicked',
    level: 'info'
})
```


---

### 11. 푸시 알림 (Push Notification)

Connect Base는 iOS(APNS), Android(FCM), Web Push를 지원하는 통합 푸시 알림 시스템을 제공합니다.

---

#### 11.1 디바이스 등록

푸시 알림을 받으려면 먼저 디바이스를 등록해야 합니다.

```typescript
// iOS 디바이스 등록 (APNS)
const device = await cb.push.registerDevice({
    device_token: 'apns-device-token-here',
    platform: 'ios',
    device_name: 'iPhone 15 Pro',
    device_model: 'iPhone15,2',
    os_version: '17.0',
    app_version: '1.0.0',
    language: 'ko',
    timezone: 'Asia/Seoul'
})

// Android 디바이스 등록 (FCM)
const device = await cb.push.registerDevice({
    device_token: 'fcm-registration-token-here',
    platform: 'android',
    device_name: 'Galaxy S24',
    device_model: 'SM-S928N',
    os_version: '14',
    app_version: '1.0.0'
})

// 디바이스 등록 해제
await cb.push.unregisterDevice(device.id)

// 등록된 디바이스 목록 조회
const devices = await cb.push.getDevices()
console.log(devices)
// [{ id: '...', platform: 'ios', device_name: 'iPhone 15 Pro', is_active: true, ... }]
```

**RegisterDeviceRequest 필드:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `device_token` | string | O | APNS/FCM 토큰 |
| `platform` | 'ios' \| 'android' \| 'web' | O | 디바이스 플랫폼 |
| `device_id` | string | X | 디바이스 고유 ID |
| `device_name` | string | X | 디바이스 이름 (예: "iPhone 15 Pro") |
| `device_model` | string | X | 디바이스 모델 (예: "iPhone15,2") |
| `os_version` | string | X | OS 버전 (예: "17.0") |
| `app_version` | string | X | 앱 버전 (예: "1.0.0") |
| `language` | string | X | 언어 코드 (예: "ko") |
| `timezone` | string | X | 타임존 (예: "Asia/Seoul") |

---

#### 11.2 토픽 구독

토픽을 사용하면 특정 그룹에만 푸시 알림을 보낼 수 있습니다.

```typescript
// 토픽 구독
await cb.push.subscribeTopic('announcements')  // 공지사항
await cb.push.subscribeTopic('marketing')      // 마케팅
await cb.push.subscribeTopic('news')           // 뉴스

// 토픽 구독 해제
await cb.push.unsubscribeTopic('marketing')

// 구독 중인 토픽 목록 조회
const topics = await cb.push.getSubscribedTopics()
console.log(topics)  // ['announcements', 'news']
```

**토픽 활용 예시:**
- `announcements`: 전체 공지사항
- `marketing`: 프로모션, 이벤트 알림
- `order_updates`: 주문 상태 변경
- `chat_messages`: 새 채팅 메시지
- `social_activity`: 좋아요, 댓글, 팔로우

---

#### 11.3 Web Push (브라우저 푸시)

브라우저에서 푸시 알림을 받으려면 Service Worker와 VAPID 키를 사용합니다.

**1단계: Service Worker 등록**

먼저 Service Worker 파일을 생성합니다 (`sw.js`):

```javascript
// sw.js (Service Worker)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {}

    const options = {
        body: data.body || '새 알림이 있습니다',
        icon: data.icon || '/icon-192.png',
        badge: data.badge || '/badge-72.png',
        image: data.image,
        data: data.data,
        actions: data.actions || []
    }

    event.waitUntil(
        self.registration.showNotification(data.title || '알림', options)
    )
})

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    const url = event.notification.data?.url || '/'
    event.waitUntil(
        clients.openWindow(url)
    )
})
```

**2단계: VAPID 키 조회 및 구독 등록**

```typescript
// VAPID 공개키 조회
const vapidKey = await cb.push.getVAPIDPublicKey()

// Service Worker 등록
const registration = await navigator.serviceWorker.register('/sw.js')
await navigator.serviceWorker.ready

// Push 알림 권한 요청 및 구독
const permission = await Notification.requestPermission()
if (permission === 'granted') {
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey.public_key)
    })

    // Connect Base에 구독 정보 등록
    await cb.push.registerWebPush(subscription)
    console.log('Web Push 등록 완료!')
}

// Web Push 구독 해제
await cb.push.unregisterWebPush()
```

**Base64 변환 헬퍼 함수:**

```typescript
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
```

---

#### 11.4 React에서 Web Push 설정

React 앱에서 Web Push를 설정하는 전체 예제입니다.

```tsx
// hooks/usePushNotification.ts
import { useState, useEffect } from 'react'
import { cb } from '../lib/connect-base'

export function usePushNotification() {
    const [isSupported, setIsSupported] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // 브라우저 지원 여부 확인
        setIsSupported(
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        )

        // 기존 구독 상태 확인
        checkSubscription()
    }, [])

    async function checkSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setIsSubscribed(!!subscription)
        } catch (error) {
            console.error('구독 상태 확인 실패:', error)
        }
    }

    async function subscribe() {
        if (!isSupported) return

        setIsLoading(true)
        try {
            // 1. 권한 요청
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
                throw new Error('알림 권한이 거부되었습니다')
            }

            // 2. VAPID 키 조회
            const vapidKey = await cb.push.getVAPIDPublicKey()

            // 3. Service Worker 준비
            const registration = await navigator.serviceWorker.ready

            // 4. Push 구독
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey.public_key)
            })

            // 5. Connect Base에 등록
            await cb.push.registerWebPush(subscription)

            setIsSubscribed(true)
            console.log('푸시 알림 구독 완료!')
        } catch (error) {
            console.error('푸시 알림 구독 실패:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    async function unsubscribe() {
        setIsLoading(true)
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            if (subscription) {
                await subscription.unsubscribe()
            }

            await cb.push.unregisterWebPush()
            setIsSubscribed(false)
        } catch (error) {
            console.error('푸시 알림 구독 해제 실패:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isSupported,
        isSubscribed,
        isLoading,
        subscribe,
        unsubscribe
    }
}

// 컴포넌트에서 사용
function PushNotificationButton() {
    const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotification()

    if (!isSupported) {
        return <p>이 브라우저는 푸시 알림을 지원하지 않습니다.</p>
    }

    return (
        <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading}
        >
            {isLoading
                ? '처리 중...'
                : isSubscribed
                    ? '푸시 알림 해제'
                    : '푸시 알림 받기'
            }
        </button>
    )
}
```

---

#### 11.5 React Native에서 FCM/APNS 설정

React Native 앱에서 푸시 알림을 설정하는 예제입니다.

```typescript
// React Native + react-native-firebase
import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import { cb } from './lib/connect-base'

// 푸시 알림 초기화
async function initializePushNotification() {
    // 1. 권한 요청 (iOS)
    if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL

        if (!enabled) {
            console.log('푸시 알림 권한이 거부되었습니다')
            return
        }
    }

    // 2. FCM 토큰 가져오기
    const token = await messaging().getToken()

    // 3. Connect Base에 디바이스 등록
    await cb.push.registerDevice({
        device_token: token,
        platform: Platform.OS as 'ios' | 'android',
        device_name: Platform.OS === 'ios' ? 'iPhone' : 'Android',
        os_version: Platform.Version.toString(),
        app_version: '1.0.0',
        language: 'ko',
        timezone: 'Asia/Seoul'
    })

    console.log('푸시 알림 등록 완료!')
}

// 토큰 갱신 리스너
messaging().onTokenRefresh(async (newToken) => {
    // 기존 디바이스 해제 후 새 토큰으로 재등록
    const devices = await cb.push.getDevices()
    const currentDevice = devices.find(d => d.platform === Platform.OS)

    if (currentDevice) {
        await cb.push.unregisterDevice(currentDevice.id)
    }

    await cb.push.registerDevice({
        device_token: newToken,
        platform: Platform.OS as 'ios' | 'android',
    })
})

// 포그라운드 메시지 핸들러
messaging().onMessage(async (remoteMessage) => {
    console.log('포그라운드 메시지:', remoteMessage)
    // 인앱 알림 표시
})

// 백그라운드 메시지 핸들러
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('백그라운드 메시지:', remoteMessage)
})
```

---

#### 11.6 Flutter에서 FCM/APNS 설정

Flutter 앱에서 푸시 알림을 설정하는 예제입니다.

```dart
// Flutter + firebase_messaging
import 'package:firebase_messaging/firebase_messaging.dart';
import 'dart:io';

class PushNotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // 1. 권한 요청
    NotificationSettings settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus != AuthorizationStatus.authorized) {
      print('푸시 알림 권한이 거부되었습니다');
      return;
    }

    // 2. FCM 토큰 가져오기
    String? token = await _messaging.getToken();
    if (token == null) return;

    // 3. Connect Base에 디바이스 등록
    await registerDevice(token);

    // 4. 토큰 갱신 리스너
    _messaging.onTokenRefresh.listen((newToken) {
      registerDevice(newToken);
    });

    // 5. 메시지 핸들러 설정
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);
  }

  Future<void> registerDevice(String token) async {
    // Connect Base SDK 호출
    // await cb.push.registerDevice(...)
    print('디바이스 등록: $token');
  }

  void _handleForegroundMessage(RemoteMessage message) {
    print('포그라운드 메시지: ${message.notification?.title}');
    // 인앱 알림 표시
  }

  void _handleMessageOpenedApp(RemoteMessage message) {
    print('앱 열림: ${message.data}');
    // 딥링크 처리
  }
}
```

---

#### 11.7 API 레퍼런스

**PushAPI 메서드 목록:**

| 메서드 | 설명 | 반환 타입 |
|--------|------|----------|
| `registerDevice(request)` | 디바이스 등록 (APNS/FCM) | `Promise<DeviceInfo>` |
| `unregisterDevice(deviceId)` | 디바이스 등록 해제 | `Promise<void>` |
| `getDevices()` | 등록된 디바이스 목록 조회 | `Promise<DeviceInfo[]>` |
| `subscribeTopic(topicName)` | 토픽 구독 | `Promise<void>` |
| `unsubscribeTopic(topicName)` | 토픽 구독 해제 | `Promise<void>` |
| `getSubscribedTopics()` | 구독 중인 토픽 목록 | `Promise<string[]>` |
| `getVAPIDPublicKey()` | VAPID 공개키 조회 (Web Push용) | `Promise<VAPIDPublicKeyResponse>` |
| `registerWebPush(subscription)` | Web Push 구독 등록 | `Promise<DeviceInfo>` |
| `unregisterWebPush()` | Web Push 구독 해제 | `Promise<void>` |

**API 엔드포인트:**
| 메서드 | API 엔드포인트 |
|--------|----------------|
| `registerDevice()` | `POST /v1/public/push/devices` |
| `unregisterDevice()` | `DELETE /v1/public/push/devices/:deviceID` |
| `getDevices()` | `GET /v1/public/push/devices` |
| `subscribeTopic()` | `POST /v1/public/push/topics/:topicName/subscribe` |
| `unsubscribeTopic()` | `DELETE /v1/public/push/topics/:topicName/subscribe` |
| `getSubscribedTopics()` | `GET /v1/public/push/topics` |
| `getVAPIDPublicKey()` | `GET /v1/public/push/vapid-key` |
| `registerWebPush()` | `POST /v1/public/push/web` |
| `unregisterWebPush()` | `DELETE /v1/public/push/web` |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**디바이스 등록:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/push/devices" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device_token": "fcm-or-apns-token-here",
    "platform": "android",
    "device_name": "Galaxy S24",
    "device_model": "SM-S928N",
    "os_version": "14",
    "app_version": "1.0.0",
    "language": "ko",
    "timezone": "Asia/Seoul"
  }'
```

응답:
```json
{
  "id": "device-123",
  "device_token": "fcm-or-apns-token-here",
  "platform": "android",
  "device_name": "Galaxy S24",
  "is_active": true,
  "created_at": "2025-01-20T10:00:00Z"
}
```

**등록된 디바이스 목록:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/push/devices" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**토픽 구독:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/push/topics/announcements/subscribe" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**VAPID 공개키 조회 (Web Push):**
```bash
curl -X GET "https://api.connectbase.world/v1/public/push/vapid-key" \
  -H "X-API-Key: YOUR_API_KEY"
```

응답:
```json
{
  "public_key": "BNbxGYNMhEIi7..."
}
```

**Web Push 구독 등록:**
```bash
curl -X POST "https://api.connectbase.world/v1/public/push/web" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_...",
      "auth": "tBHItJI5svbpez7KI4CCXg"
    }
  }'
```

**DeviceInfo 응답 타입:**

```typescript
interface DeviceInfo {
    id: string                // 디바이스 고유 ID
    device_token: string      // APNS/FCM/Web Push 토큰
    platform: 'ios' | 'android' | 'web'
    device_id?: string        // 사용자 지정 디바이스 ID
    device_name?: string      // 디바이스 이름
    device_model?: string     // 디바이스 모델
    os_version?: string       // OS 버전
    app_version?: string      // 앱 버전
    language?: string         // 언어
    timezone?: string         // 타임존
    is_active: boolean        // 활성 상태
    last_active_at?: string   // 마지막 활성 시간
    created_at: string        // 등록 시간
    updated_at: string        // 수정 시간
}
```


---

### 12. 광고 (Google AdSense)

Connect Base는 Google AdSense를 통한 광고 수익 조회 기능을 제공합니다.

> 광고 기능을 사용하려면 먼저 Connect Base 콘솔에서 Google AdSense 계정을 연결해야 합니다.
> **콘솔 > 수익화 > 광고**에서 Google 계정을 연결하세요.

---

#### 12.1 AdSense 연결 상태 확인

```typescript
const status = await cb.ads.getConnectionStatus()

if (status.is_connected) {
    console.log('AdSense 연결됨:', status.email)
    console.log('Account ID:', status.adsense_account_id)
} else {
    console.log('AdSense 미연결 - 콘솔에서 Google 계정을 연결하세요')
}
```

**GoogleConnectionStatus 타입:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `is_connected` | boolean | AdSense 연결 여부 |
| `email` | string? | 연결된 Google 계정 이메일 |
| `adsense_account_id` | string? | AdSense 계정 ID (accounts/pub-xxx 형식) |

---

#### 12.2 광고 수익 리포트 조회

```typescript
// 기간 지정 조회
const report = await cb.ads.getReport('2025-01-01', '2025-01-31')

// 요약 데이터
console.log('총 수익:', report.summary.total_earnings)
console.log('총 노출:', report.summary.total_impressions)
console.log('총 클릭:', report.summary.total_clicks)
console.log('CTR:', report.summary.ctr, '%')
console.log('CPC:', report.summary.cpc)
console.log('RPM:', report.summary.rpm)

// 일별 데이터
report.daily.forEach(day => {
    console.log(`${day.date}: $${day.earnings} (노출: ${day.impressions}, 클릭: ${day.clicks})`)
})

// 기간 미지정 시 최근 30일 자동 조회
const defaultReport = await cb.ads.getReport()
```

---

#### 12.3 최근 30일 요약 조회

```typescript
const summary = await cb.ads.getReportSummary()

console.log(`총 수익: $${summary.total_earnings.toFixed(2)}`)
console.log(`총 노출: ${summary.total_impressions.toLocaleString()}`)
console.log(`클릭률: ${summary.ctr.toFixed(2)}%`)
console.log(`RPM: $${summary.rpm.toFixed(2)}`)
```

---

#### 12.4 React에서 광고 수익 대시보드 구현

```tsx
import { useState, useEffect } from 'react'
import { cb } from './lib/connect-base'

function AdDashboard() {
    const [summary, setSummary] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        async function loadAdData() {
            const status = await cb.ads.getConnectionStatus()
            setIsConnected(status.is_connected)

            if (status.is_connected) {
                const data = await cb.ads.getReportSummary()
                setSummary(data)
            }
        }
        loadAdData()
    }, [])

    if (!isConnected) {
        return <p>AdSense가 연결되지 않았습니다. 콘솔에서 연결하세요.</p>
    }

    if (!summary) return <p>로딩 중...</p>

    return (
        <div>
            <h2>광고 수익 요약 (최근 30일)</h2>
            <p>총 수익: ${summary.total_earnings.toFixed(2)}</p>
            <p>노출: {summary.total_impressions.toLocaleString()}</p>
            <p>클릭: {summary.total_clicks.toLocaleString()}</p>
            <p>CTR: {summary.ctr.toFixed(2)}%</p>
            <p>RPM: ${summary.rpm.toFixed(2)}</p>
        </div>
    )
}
```

---

#### 12.5 웹 스토리지에서 AdSense 활성화

Connect Base 웹 스토리지에 배포한 사이트에 Google 자동 광고를 삽입할 수 있습니다.

**설정 방법 (콘솔):**
1. **Google AdSense 계정 연결**: 콘솔 > 수익화 > 광고 > "Google 계정 연결"
2. **웹 스토리지에서 활성화**: 콘솔 > 스토리지 > 웹 > 스토리지 선택 > AdSense 탭
3. **Publisher ID 입력**: `ca-pub-XXXXXXXXXXXXXXXX` 형식
4. **ads.txt 자동 생성**: Publisher ID 입력 시 자동 생성됨 (커스텀 가능)

> ads.txt는 웹 스토리지 도메인의 `/ads.txt` 경로에서 자동으로 제공됩니다.

---

#### 12.6 특정 위치에 수동 광고 배치

자동 광고(Auto Ads) 외에 원하는 위치에 직접 광고를 배치할 수 있습니다.

**1단계: AdSense 콘솔에서 광고 단위 생성**

[Google AdSense 콘솔](https://www.google.com/adsense) > 광고 > 광고 단위별 > 새 광고 단위 만들기

광고 유형:
- **디스플레이 광고**: 반응형 배너 (가장 범용적)
- **인피드 광고**: 피드/목록 사이에 삽입
- **콘텐츠 내 광고**: 글 본문 중간에 삽입
- **멀티플렉스 광고**: 여러 광고를 그리드로 표시

**2단계: HTML에 광고 코드 삽입**

콘솔에서 AdSense를 활성화하면 `adsbygoogle.js` 스크립트가 자동으로 `<head>`에 주입됩니다.
따라서 `<ins>` 태그만 원하는 위치에 삽입하면 됩니다.

```html
<!-- 헤더 아래 배너 광고 -->
<header>...</header>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

<!-- 메인 콘텐츠 -->
<main>
    <article>
        <p>본문 내용...</p>

        <!-- 본문 중간 광고 -->
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="9876543210"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

        <p>본문 계속...</p>
    </article>
</main>
```

**React/SPA에서 광고 배치:**

```tsx
import { useEffect, useRef } from 'react'

function AdBanner({ adSlot, format = 'auto' }: { adSlot: string; format?: string }) {
    const adRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (e) {
            // 광고 차단기 등으로 실패 시 무시
        }
    }, [])

    return (
        <div ref={adRef}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot={adSlot}
                data-ad-format={format}
                data-full-width-responsive="true" />
        </div>
    )
}

// 사용
<AdBanner adSlot="1234567890" />
<AdBanner adSlot="9876543210" format="fluid" />
```

> `data-ad-client`는 콘솔에서 설정한 Publisher ID, `data-ad-slot`은 AdSense에서 생성한 광고 단위 ID입니다.

---

#### 12.7 API 레퍼런스

**AdsAPI 메서드 목록:**

| 메서드 | 설명 | 반환 타입 |
|--------|------|----------|
| `getConnectionStatus()` | AdSense 연결 상태 확인 | `Promise<GoogleConnectionStatus>` |
| `getReport(start?, end?)` | 리포트 조회 (일별 + 요약) | `Promise<AdReportResponse>` |
| `getReportSummary()` | 최근 30일 요약 | `Promise<AdReportSummary>` |

**API 엔드포인트:**

| 메서드 | API 엔드포인트 |
|--------|----------------|
| `getConnectionStatus()` | `GET /v1/public/ads/connection` |
| `getReport()` | `GET /v1/public/ads/reports?start=YYYY-MM-DD&end=YYYY-MM-DD` |
| `getReportSummary()` | `GET /v1/public/ads/reports/summary` |

> 모든 `/v1/public/*` 엔드포인트는 `X-API-Key` 헤더로 API Key 인증이 필요합니다.

#### HTTP API 상세

**연결 상태 확인:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/ads/connection" \
  -H "X-API-Key: YOUR_API_KEY_HERE"
```

응답:
```json
{
  "is_connected": true,
  "email": "user@gmail.com",
  "adsense_account_id": "accounts/pub-1234567890123456"
}
```

**리포트 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/ads/reports?start=2025-01-01&end=2025-01-31" \
  -H "X-API-Key: YOUR_API_KEY_HERE"
```

응답:
```json
{
  "summary": {
    "total_earnings": 125.50,
    "total_impressions": 50000,
    "total_clicks": 250,
    "ctr": 0.5,
    "cpc": 0.50,
    "rpm": 2.51
  },
  "daily": [
    {
      "date": "2025-01-01",
      "earnings": 4.20,
      "impressions": 1680,
      "clicks": 8,
      "ctr": 0.48
    }
  ]
}
```

**30일 요약 조회:**
```bash
curl -X GET "https://api.connectbase.world/v1/public/ads/reports/summary" \
  -H "X-API-Key: YOUR_API_KEY_HERE"
```

**AdReportSummary 응답 타입:**

```typescript
interface AdReportSummary {
    total_earnings: number    // 총 수익 ($)
    total_impressions: number // 총 노출수
    total_clicks: number      // 총 클릭수
    ctr: number               // 클릭률 (%)
    cpc: number               // 클릭당 비용 ($)
    rpm: number               // 1,000 노출당 수익 ($)
}

interface DailyReport {
    date: string              // 날짜 (YYYY-MM-DD)
    earnings: number          // 수익 ($)
    impressions: number       // 노출수
    clicks: number            // 클릭수
    ctr: number               // 클릭률 (%)
}

interface AdReportResponse {
    summary: AdReportSummary  // 기간 합산 요약
    daily: DailyReport[]      // 일별 데이터
}
```


---

## 전체 예시: 간단한 방명록

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>방명록</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        input, textarea { padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
        textarea { min-height: 80px; resize: vertical; }
        button { padding: 12px; background: #4F46E5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        button:hover { background: #4338CA; }
        button:disabled { background: #9CA3AF; cursor: not-allowed; }
        .entry { background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
        .entry-name { font-weight: 600; color: #111; }
        .entry-message { margin: 8px 0; color: #374151; white-space: pre-wrap; }
        .entry-date { font-size: 12px; color: #6B7280; }
        .loading { text-align: center; color: #6B7280; padding: 20px; }
        .error { background: #FEE2E2; color: #DC2626; padding: 12px; border-radius: 6px; margin-bottom: 12px; }
    </style>
</head>
<body>
    <h1>방명록</h1>

    <form id="guestbook-form">
        <input type="text" id="name" placeholder="이름" required maxlength="50">
        <textarea id="message" placeholder="메시지" required maxlength="500"></textarea>
        <button type="submit" id="submit-btn">등록</button>
    </form>

    <div id="error" class="error" style="display: none;"></div>
    <div id="entries"></div>

    <script src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axryec8zhjr9/b/connect-base-public-sdk/o/v1/connect-base.min.js"></script>
    <script>
        const cb = new ConnectBase({
            apiKey: 'YOUR_API_KEY_HERE'  // TODO: 실제 API Key로 교체
        })

        const TABLE_ID = 'YOUR_TABLE_ID_HERE'  // TODO: 실제 테이블 ID로 교체

        // XSS 방지용 HTML 이스케이프 함수
        function escapeHtml(text) {
            const div = document.createElement('div')
            div.textContent = text
            return div.innerHTML
        }

        // 에러 표시
        function showError(message) {
            const errorEl = document.getElementById('error')
            errorEl.textContent = message
            errorEl.style.display = 'block'
            setTimeout(() => { errorEl.style.display = 'none' }, 5000)
        }

        // 방명록 로드
        async function loadEntries() {
            const container = document.getElementById('entries')
            container.innerHTML = '<div class="loading">로딩 중...</div>'

            try {
                const { data } = await cb.database.getData(TABLE_ID, {
                    limit: 50,
                    orderBy: 'created_at',
                    orderDirection: 'desc'
                })

                if (data.length === 0) {
                    container.innerHTML = '<div class="loading">아직 작성된 방명록이 없습니다.</div>'
                    return
                }

                container.innerHTML = data.map(entry => `
                    <div class="entry">
                        <div class="entry-name">${escapeHtml(entry.data.name)}</div>
                        <div class="entry-message">${escapeHtml(entry.data.message)}</div>
                        <div class="entry-date">${new Date(entry.created_at).toLocaleString('ko-KR')}</div>
                    </div>
                `).join('')
            } catch (error) {
                console.error('방명록 로드 실패:', error)
                container.innerHTML = '<div class="loading">방명록을 불러오는데 실패했습니다.</div>'
            }
        }

        // 방명록 등록
        document.getElementById('guestbook-form').addEventListener('submit', async (e) => {
            e.preventDefault()

            const nameInput = document.getElementById('name')
            const messageInput = document.getElementById('message')
            const submitBtn = document.getElementById('submit-btn')

            const name = nameInput.value.trim()
            const message = messageInput.value.trim()

            if (!name || !message) {
                showError('이름과 메시지를 입력해주세요.')
                return
            }

            submitBtn.disabled = true
            submitBtn.textContent = '등록 중...'

            try {
                await cb.database.createData(TABLE_ID, {
                    data: { name, message }
                })

                nameInput.value = ''
                messageInput.value = ''
                await loadEntries()
            } catch (error) {
                console.error('방명록 등록 실패:', error)
                showError('방명록 등록에 실패했습니다. 다시 시도해주세요.')
            } finally {
                submitBtn.disabled = false
                submitBtn.textContent = '등록'
            }
        })

        // 초기 로드
        loadEntries()
    </script>
</body>
</html>
```

---

## 전체 예시: 실시간 채팅

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>실시간 채팅</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; height: 100vh; display: flex; flex-direction: column; }
        #chat-container { flex: 1; overflow-y: auto; padding: 16px; background: #f3f4f6; }
        .message { max-width: 70%; padding: 10px 14px; border-radius: 16px; margin-bottom: 8px; word-wrap: break-word; }
        .message.mine { background: #4F46E5; color: white; margin-left: auto; border-bottom-right-radius: 4px; }
        .message.other { background: white; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
        .message .sender { font-size: 11px; opacity: 0.7; margin-bottom: 4px; }
        .message .content { font-size: 14px; white-space: pre-wrap; }
        #input-area { display: flex; gap: 8px; padding: 12px; background: white; border-top: 1px solid #e5e7eb; }
        #nickname, #message { padding: 10px 14px; border: 1px solid #ddd; border-radius: 20px; font-size: 14px; }
        #nickname { width: 100px; }
        #message { flex: 1; }
        button { padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 20px; cursor: pointer; }
        button:hover { background: #4338CA; }
        button:disabled { background: #9CA3AF; }
        .status { padding: 8px 16px; background: #fef3c7; color: #92400e; font-size: 12px; text-align: center; }
        .status.connected { background: #d1fae5; color: #065f46; }
    </style>
</head>
<body>
    <div id="status" class="status">연결 중...</div>
    <div id="chat-container"></div>
    <div id="input-area">
        <input type="text" id="nickname" placeholder="닉네임" maxlength="20">
        <input type="text" id="message" placeholder="메시지 입력..." maxlength="500">
        <button id="send-btn" disabled>전송</button>
    </div>

    <script src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axryec8zhjr9/b/connect-base-public-sdk/o/v1/connect-base.min.js"></script>
    <script>
        const cb = new ConnectBase({
            apiKey: 'YOUR_API_KEY_HERE'  // TODO: 실제 API Key로 교체
        })

        const CATEGORY_NAME = 'chat-room'  // TODO: 실제 카테고리명으로 교체
        let channel = null
        let myNickname = ''

        // XSS 방지
        function escapeHtml(text) {
            const div = document.createElement('div')
            div.textContent = text
            return div.innerHTML
        }

        // 상태 업데이트
        function updateStatus(connected) {
            const statusEl = document.getElementById('status')
            statusEl.className = connected ? 'status connected' : 'status'
            statusEl.textContent = connected ? '연결됨' : '연결 끊김 - 재연결 중...'
            document.getElementById('send-btn').disabled = !connected
        }

        // 메시지 추가
        function addMessage(nickname, content, isMine = false) {
            const container = document.getElementById('chat-container')
            const msgEl = document.createElement('div')
            msgEl.className = `message ${isMine ? 'mine' : 'other'}`
            msgEl.innerHTML = `
                <div class="sender">${escapeHtml(nickname)}</div>
                <div class="content">${escapeHtml(content)}</div>
            `
            container.appendChild(msgEl)
            container.scrollTop = container.scrollHeight
        }

        // 메시지 전송
        async function sendMessage() {
            const nicknameInput = document.getElementById('nickname')
            const messageInput = document.getElementById('message')
            const content = messageInput.value.trim()

            myNickname = nicknameInput.value.trim() || '익명'
            if (!content || !channel) return

            try {
                await channel.send({
                    nickname: myNickname,
                    content: content,
                    timestamp: Date.now()
                })
                messageInput.value = ''
            } catch (error) {
                console.error('전송 실패:', error)
            }
        }

        // 초기화
        async function init() {
            try {
                // WebSocket 연결
                await cb.realtime.connect()
                updateStatus(true)

                // 채팅방 구독
                channel = await cb.realtime.subscribe(CATEGORY_NAME)

                // 메시지 수신
                channel.on('message', (msg) => {
                    const isMine = msg.data.nickname === myNickname
                    addMessage(msg.data.nickname, msg.data.content, isMine)
                })

                // 연결 해제 감지
                cb.realtime.onDisconnect(() => {
                    updateStatus(false)
                })

                cb.realtime.onReconnect(() => {
                    updateStatus(true)
                })

            } catch (error) {
                console.error('연결 실패:', error)
                updateStatus(false)
            }
        }

        // 이벤트 리스너
        document.getElementById('send-btn').addEventListener('click', sendMessage)
        document.getElementById('message').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage()
        })

        init()
    </script>
</body>
</html>
```

---

## 전체 예시: 이미지 갤러리

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이미지 갤러리</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #111; margin-bottom: 20px; }
        .upload-area { border: 2px dashed #ddd; border-radius: 12px; padding: 40px; text-align: center; margin-bottom: 24px; transition: all 0.2s; }
        .upload-area:hover, .upload-area.dragover { border-color: #4F46E5; background: #f5f3ff; }
        .upload-area input { display: none; }
        .upload-area label { cursor: pointer; color: #4F46E5; font-weight: 500; }
        .upload-area p { color: #6B7280; font-size: 14px; margin-top: 8px; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .gallery-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #f3f4f6; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-item .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; }
        .gallery-item:hover .overlay { opacity: 1; }
        .gallery-item .delete-btn { background: #EF4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
        .loading { text-align: center; padding: 40px; color: #6B7280; }
        .progress { height: 4px; background: #e5e7eb; border-radius: 2px; margin-top: 12px; overflow: hidden; }
        .progress-bar { height: 100%; background: #4F46E5; transition: width 0.3s; }
        .empty { text-align: center; padding: 60px; color: #9CA3AF; }
    </style>
</head>
<body>
    <h1>이미지 갤러리</h1>

    <div class="upload-area" id="drop-zone">
        <input type="file" id="file-input" accept="image/*" multiple>
        <label for="file-input">이미지 선택</label>
        <p>또는 여기에 파일을 드래그하세요</p>
        <div class="progress" id="progress" style="display: none;">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
    </div>

    <div id="gallery" class="gallery"></div>

    <script src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axryec8zhjr9/b/connect-base-public-sdk/o/v1/connect-base.min.js"></script>
    <script>
        const cb = new ConnectBase({
            apiKey: 'YOUR_API_KEY_HERE'  // TODO: 실제 API Key로 교체
        })

        const STORAGE_ID = 'YOUR_STORAGE_ID_HERE'  // TODO: 실제 스토리지 ID로 교체

        // 갤러리 로드
        async function loadGallery() {
            const gallery = document.getElementById('gallery')
            gallery.innerHTML = '<div class="loading">로딩 중...</div>'

            try {
                const files = await cb.storage.getFiles(STORAGE_ID)
                const images = files.filter(f => f.mime_type?.startsWith('image/'))

                if (images.length === 0) {
                    gallery.innerHTML = '<div class="empty">아직 업로드된 이미지가 없습니다.</div>'
                    return
                }

                gallery.innerHTML = images.map(file => `
                    <div class="gallery-item" data-id="${file.id}">
                        <img src="${file.url}" alt="${file.name}" loading="lazy">
                        <div class="overlay">
                            <button class="delete-btn" onclick="deleteImage('${file.id}')">삭제</button>
                        </div>
                    </div>
                `).join('')
            } catch (error) {
                console.error('갤러리 로드 실패:', error)
                gallery.innerHTML = '<div class="loading">갤러리를 불러오는데 실패했습니다.</div>'
            }
        }

        // 이미지 업로드
        async function uploadImages(files) {
            const progress = document.getElementById('progress')
            const progressBar = document.getElementById('progress-bar')

            progress.style.display = 'block'
            progressBar.style.width = '0%'

            const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
            if (imageFiles.length === 0) {
                alert('이미지 파일만 업로드 가능합니다.')
                progress.style.display = 'none'
                return
            }

            try {
                for (let i = 0; i < imageFiles.length; i++) {
                    await cb.storage.uploadFile(STORAGE_ID, imageFiles[i])
                    progressBar.style.width = `${((i + 1) / imageFiles.length) * 100}%`
                }

                await loadGallery()
            } catch (error) {
                console.error('업로드 실패:', error)
                alert('이미지 업로드에 실패했습니다.')
            } finally {
                setTimeout(() => { progress.style.display = 'none' }, 500)
            }
        }

        // 이미지 삭제
        async function deleteImage(fileId) {
            if (!confirm('이 이미지를 삭제하시겠습니까?')) return

            try {
                await cb.storage.deleteFile(STORAGE_ID, fileId)
                await loadGallery()
            } catch (error) {
                console.error('삭제 실패:', error)
                alert('이미지 삭제에 실패했습니다.')
            }
        }
        window.deleteImage = deleteImage  // 전역 함수로 등록

        // 이벤트 리스너
        document.getElementById('file-input').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadImages(e.target.files)
            }
        })

        // 드래그 앤 드롭
        const dropZone = document.getElementById('drop-zone')
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault()
            dropZone.classList.add('dragover')
        })
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover')
        })
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault()
            dropZone.classList.remove('dragover')
            if (e.dataTransfer.files.length > 0) {
                uploadImages(e.dataTransfer.files)
            }
        })

        // 초기 로드
        loadGallery()
    </script>
</body>
</html>
```


---

## Connect Base MCP 서버 (AI 도구 연동)

Connect Base는 MCP(Model Context Protocol) 서버를 제공합니다.
Claude Desktop, Cursor, Windsurf 등 MCP를 지원하는 AI 도구에서 Connect Base 리소스를 직접 조회/관리할 수 있습니다.

### MCP란?

MCP(Model Context Protocol)는 AI 모델이 외부 도구와 상호작용할 수 있게 해주는 표준 프로토콜입니다.
Connect Base MCP 서버를 연동하면 AI 클라이언트에서 직접 웹 스토리지, JSON 데이터베이스, 파일 스토리지를 관리할 수 있습니다.

**MCP Server URL**: `https://mcp.connectbase.world/mcp`

---

### Claude Desktop 설정

**설정 파일 경로:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "connect-base": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.connectbase.world/mcp",
        "--header",
        "X-API-Key:YOUR_API_KEY_HERE"
      ]
    }
  }
}
```

> Node.js가 설치되어 있어야 합니다. mcp-remote는 자동으로 설치됩니다.

---

### Cursor 설정

**설정 파일 경로:**
- macOS: `~/.cursor/mcp.json`
- Windows: `%USERPROFILE%\.cursor\mcp.json`
- Linux: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "connect-base": {
      "url": "https://mcp.connectbase.world/mcp",
      "headers": {
        "X-API-Key": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

---

### Windsurf 설정

**설정 파일 경로:**
- macOS: `~/.codeium/windsurf/mcp_config.json`
- Windows: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`
- Linux: `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "connect-base": {
      "serverUrl": "https://mcp.connectbase.world/mcp",
      "headers": {
        "X-API-Key": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

---

### Claude Code (CLI) 설정

터미널에서 다음 명령어로 MCP 서버를 추가합니다:

```bash
# 전역 추가 (모든 프로젝트에서 사용) - 기본값
claude mcp add --transport http connect-base https://mcp.connectbase.world/mcp \
  --header "Authorization: Bearer YOUR_API_KEY_HERE"

# 현재 프로젝트에만 추가
claude mcp add -s project --transport http connect-base https://mcp.connectbase.world/mcp \
  --header "Authorization: Bearer YOUR_API_KEY_HERE"
```

**Scope 옵션:** `-s user` (전역, 기본값) 또는 `-s project` (현재 프로젝트만)

추가된 서버 확인:
```bash
claude mcp list
```

서버 제거:
```bash
claude mcp remove connect-base
```

---

### Cline (VS Code) 설정

**설정 파일 경로:**
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "connect-base": {
      "url": "https://mcp.connectbase.world/mcp",
      "headers": {
        "X-API-Key": "YOUR_API_KEY_HERE"
      },
      "disabled": false
    }
  }
}
```

---

### Continue (VS Code/JetBrains) 설정

**설정 파일 경로:**
- macOS: `~/.continue/config.json`
- Windows: `%USERPROFILE%\.continue\config.json`
- Linux: `~/.continue/config.json`

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "sse",
          "url": "https://mcp.connectbase.world/mcp",
          "headers": {
            "X-API-Key": "YOUR_API_KEY_HERE"
          }
        }
      }
    ]
  }
}
```


---

## 제공되는 도구 (Tools)

### 웹 스토리지
| 도구 | 설명 |
|------|------|
| `list_storages` | 웹 스토리지 목록 조회 |
| `create_storage` | 새 웹 스토리지 생성 |
| `delete_storage` | 웹 스토리지 삭제 |
| `get_storage_config` | 스토리지 설정 조회 |
| `update_storage_config` | 스토리지 설정 수정 (SPA 모드, 보안 설정 등) |
| `get_project_structure` | 프로젝트 구조 트리 조회 |
| `search_in_files` | 파일 내용 검색 |
| `list_files` | 파일 목록 조회 |
| `read_file` | 파일 내용 읽기 |
| `write_file` | 파일 생성/수정 ⚠️ **사용자 요청 시에만** |
| `delete_file` | 파일 삭제 ⚠️ **사용자 요청 시에만** |

### JSON 데이터베이스
| 도구 | 설명 |
|------|------|
| `list_databases` | 데이터베이스 목록 조회 |
| `create_database` | 새 데이터베이스 생성 |
| `list_tables` | 테이블 목록 조회 |
| `create_table` | 새 테이블 생성 |
| `get_table_schema` | 테이블 스키마 조회 |
| `query_table_data` | 데이터 조회 |
| `insert_row` | 데이터 삽입 |
| `update_row` | 데이터 수정 |
| `delete_row` | 데이터 삭제 |

### 파일 스토리지
| 도구 | 설명 |
|------|------|
| `list_file_storages` | 파일 스토리지 목록 |
| `create_file_storage` | **새 파일 스토리지 생성** |
| `list_file_items` | 파일/폴더 목록 |
| `create_folder` | 폴더 생성 |
| `delete_file_item` | 파일/폴더 삭제 |

### 서버리스 함수
| 도구 | 설명 |
|------|------|
| `list_functions` | 함수 목록 조회 |
| `get_function` | 함수 상세 정보 |
| `create_function` | 새 함수 생성 |
| `update_function_code` | 함수 코드 수정 |
| `get_function_logs` | 함수 실행 로그 |

### 실시간 통신 (WebSocket)
| 도구 | 설명 |
|------|------|
| `list_realtime_categories` | 실시간 카테고리 목록 |
| `create_realtime_category` | **새 실시간 카테고리 생성** |
| `get_category_info` | 카테고리 상세 정보 |
| `get_realtime_history` | 메시지 히스토리 조회 |

### 인증 설정
| 도구 | 설명 |
|------|------|
| `get_auth_settings` | 앱 인증 설정 조회 (아이디/비밀번호, 게스트, OAuth 허용 여부) |
| `list_oauth_providers` | OAuth 프로바이더 목록 + 활성화 상태 조회 |
| `toggle_oauth_provider` | 프로바이더 활성화/비활성화 (GOOGLE, KAKAO, NAVER, APPLE, GITHUB, DISCORD) |
| `get_oauth_provider_status` | 특정 프로바이더 상태 확인 |

### WebRTC
| 도구 | 설명 |
|------|------|
| `validate_webrtc` | WebRTC 서버 연결 및 API Key 유효성 검증 |
| `get_webrtc_stats` | WebRTC 통계 조회 (활성 룸, 참가자 수) |
| `list_webrtc_rooms` | 활성 WebRTC 룸 목록 |
| `get_webrtc_room` | 특정 룸 상세 정보 |
| `delete_webrtc_room` | 룸 종료 및 전체 피어 연결 해제 |
| `get_webrtc_room_peers` | 룸 내 피어 목록 |
| `kick_webrtc_peer` | 특정 피어 강제 퇴장 |

### 게임 서버
| 도구 | 설명 |
|------|------|
| `get_game_stats` | 게임 서버 통계 |
| `list_game_rooms` | 활성 게임 룸 목록 |
| `get_game_room` | 특정 게임 룸 상세 정보 |
| `delete_game_room` | 게임 룸 삭제 |
| `list_leaderboards` | 리더보드 목록 |
| `get_leaderboard` | 리더보드 상세 및 순위 |
| `list_matchmaking_queues` | 매치메이킹 큐 목록 |
| `get_matchmaking_queue` | 매치메이킹 큐 상세 |

### 비디오 서버
| 도구 | 설명 |
|------|------|
| `list_videos` | 비디오 목록 |
| `get_video` | 비디오 상세 정보 |
| `delete_video` | 비디오 삭제 |
| `get_video_stats` | 비디오 서버 통계 |
| `list_channels` | 채널 목록 |
| `create_channel` | 새 채널 생성 |
| `list_playlists` | 플레이리스트 목록 |
| `create_playlist` | 새 플레이리스트 생성 |
| `list_live_streams` | 라이브 스트림 목록 |
| `delete_live_stream` | 라이브 스트림 삭제 |
| `get_trending_videos` | 인기 비디오 조회 |

### 앱 템플릿
| 도구 | 설명 |
|------|------|
| `export_app_template` | 앱 전체 설정을 앱 템플릿 JSON으로 내보내기 |
| `validate_app_template` | 앱 템플릿 JSON 유효성 검증 및 적용 미리보기 |
| `apply_app_template` | 앱 템플릿을 앱에 적용하여 리소스 자동 생성 |

### 기타
| 도구 | 설명 |
|------|------|
| `list_workflows` | 워크플로우 목록 |
| `create_workflow` | 새 워크플로우 생성 |
| `list_webhooks` | 웹훅 목록 |
| `create_webhook` | 새 웹훅 생성 |
| `get_balance` | 잔액 조회 |
| `get_usage_stats` | 사용량 통계 |
| `list_logs` | 활동 로그 |

### 진단 (Diagnostic)
| 도구 | 설명 |
|------|------|
| `check_cors` | 서버의 CORS 설정 진단 (OPTIONS preflight 요청 + 헤더 분석) |
| `list_servers` | 진단 가능한 서버 목록 조회 |

---

### 사용 예시

MCP가 설정된 AI 도구에서 다음과 같이 질문하면 됩니다:

- "내 웹 스토리지 목록 보여줘"
- "테이블에서 최근 데이터 10개 조회해줘"
- "index.html 파일 내용 읽어줘"
- "새 서버리스 함수 만들어줘"
- "이번 달 사용량 확인해줘"
- "프로젝트 구조 보여줘"
- "SPA 모드 비활성화해줘"
- "OAuth 프로바이더 목록 보여줘"
- "Google 로그인 활성화해줘"
- "인증 설정 확인해줘" (아이디/비밀번호, 게스트, OAuth 허용 여부)
- "WebRTC 서버 CORS 설정 확인해줘"
- "core 서버에 https://myapp.com 에서 접근 가능한지 확인해줘"
- "활성 WebRTC 룸 목록 보여줘"
- "게임 서버 통계 조회해줘"
- "이 앱의 앱 템플릿 내보내줘"
- "앱 템플릿 파일 검증해줘"

AI가 MCP 도구를 호출하여 Connect Base에서 실시간 정보를 가져오고 작업을 수행합니다.



---

## 추가 리소스

### 공식 문서
- [Connect Base 콘솔](https://connectbase.world) - 웹 대시보드
- [Connect Base SDK (npm)](https://www.npmjs.com/package/@connectbase/client) - 클라이언트 SDK

### 게임 개발
- [Babylon.js 공식 문서](https://doc.babylonjs.com/) - 3D 게임 엔진
- [Babylon.js Playground](https://playground.babylonjs.com/) - 온라인 코드 테스트

### 비디오 플랫폼
- [HLS.js 문서](https://github.com/video-dev/hls.js/) - HLS 스트리밍 플레이어
- [FFmpeg 문서](https://ffmpeg.org/documentation.html) - 비디오 트랜스코딩

### 실시간 통신
- [WebSocket API (MDN)](https://developer.mozilla.org/ko/docs/Web/API/WebSocket)
- [WebRTC API (MDN)](https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API)

### MCP (Model Context Protocol)
- [MCP 공식 문서](https://modelcontextprotocol.io/) - AI 도구 연동 프로토콜

