# 고급 투두 리스트 구현 계획서

## Context

사용자가 고급 기능을 갖춘 투두 리스트 앱을 만들고자 합니다. 현재 프로젝트는 React 19 + TanStack Router + Tailwind CSS 4 + connectbase-client 기반입니다. 백엔드 데이터 저장에 connectbase-client를 사용합니다.

---

## 구현할 기능

### 필수 기능
- 할 일 추가/삭제/수정
- 완료 체크 토글
- connectbase-client로 클라우드 저장

### 중급 기능
- 필터링 (전체/완료/미완료)
- 우선순위 (높음/보통/낮음)

### 고급 기능
- 마감일 설정
- 카테고리/태그
- 드래그 앤 드롭 정렬

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | React 19 |
| 라우팅 | TanStack Router |
| 스타일링 | Tailwind CSS 4 |
| 아이콘 | lucide-react |
| 백엔드 | connectbase-client |
| 드래그 앤 드롭 | @dnd-kit (신규 설치 필요) |

---

## 프로젝트 구조

```
src/
├── routes/
│   ├── __root.tsx              # 레이아웃 (수정)
│   └── index.tsx               # 메인 투두 페이지 (수정)
├── components/
│   ├── todo/
│   │   ├── TodoForm.tsx        # 새 할 일 입력 폼
│   │   ├── TodoList.tsx        # 투두 리스트 컨테이너
│   │   ├── TodoItem.tsx        # 개별 투두 아이템
│   │   ├── SubtaskList.tsx     # 서브태스크 리스트 (신규)
│   │   └── SubtaskItem.tsx     # 서브태스크 아이템 (신규)
│   ├── category/
│   │   ├── CategoryTree.tsx    # 카테고리 트리 뷰 (신규)
│   │   ├── CategoryItem.tsx    # 카테고리 아이템 (신규)
│   │   ├── CategoryForm.tsx    # 카테고리 생성/수정 폼 (신규)
│   │   └── CategoryBadge.tsx   # 카테고리 뱃지
│   ├── ui/
│   │   ├── FilterTabs.tsx      # 필터 탭
│   │   ├── PrioritySelector.tsx# 우선순위 선택
│   │   └── TreeNode.tsx        # 재사용 가능한 트리 노드 (신규)
│   └── layout/
│       └── Sidebar.tsx         # 카테고리 사이드바 (신규)
├── context/
│   ├── TodoContext.tsx         # 투두 상태 관리
│   └── CategoryContext.tsx     # 카테고리 상태 관리 (신규)
├── hooks/
│   ├── useTodos.ts             # 투두 CRUD 훅
│   └── useCategories.ts        # 카테고리 CRUD 훅 (신규)
├── services/
│   └── connectbase.ts          # connectbase 클라이언트 설정
├── types/
│   └── todo.ts                 # TypeScript 타입
└── lib/
    ├── storage.ts              # 로컬 스토리지 폴백
    └── tree.ts                 # 트리 유틸리티 함수 (신규)
```

---

## 데이터 모델

```typescript
interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  categoryId?: string      // 소속 카테고리
  parentId?: string        // 상위 투두 (서브태스크용)
  dueDate?: string         // ISO 8601
  order: number            // 드래그 정렬용
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  color: string
  parentId?: string        // 상위 카테고리 (계층 구조용)
  order: number            // 정렬 순서
}
```

### 계층 구조 예시
```
📁 업무 (Category)
  └── 📁 프로젝트 A (Category, parentId: 업무)
       └── ☐ API 개발 (Todo)
            └── ☐ 엔드포인트 설계 (Todo, parentId: API 개발)
            └── ☐ 테스트 작성 (Todo, parentId: API 개발)
📁 개인 (Category)
  └── ☐ 운동하기 (Todo)
       └── ☐ 스트레칭 (Todo, parentId: 운동하기)
```

---

## 구현 단계

### 1단계: 프로젝트 설정
- [ ] @dnd-kit 패키지 설치 (`@dnd-kit/core`, `@dnd-kit/sortable`)
- [ ] 타입 정의 파일 생성 (`src/types/todo.ts`)
- [ ] 트리 유틸리티 함수 생성 (`src/lib/tree.ts`)
- [ ] connectbase 클라이언트 설정 (`src/services/connectbase.ts`)

### 2단계: 상태 관리
- [ ] TodoContext 생성 (`src/context/TodoContext.tsx`)
- [ ] CategoryContext 생성 (`src/context/CategoryContext.tsx`)
- [ ] useTodos 커스텀 훅 구현 (`src/hooks/useTodos.ts`)
- [ ] useCategories 커스텀 훅 구현 (`src/hooks/useCategories.ts`)

### 3단계: 카테고리 UI
- [ ] TreeNode 공통 컴포넌트 구현
- [ ] CategoryTree 구현 (계층형 카테고리 트리)
- [ ] CategoryItem 구현 (드래그, 접기/펼치기)
- [ ] CategoryForm 구현 (카테고리 추가/수정)
- [ ] Sidebar 레이아웃 구현

### 4단계: 투두 UI
- [ ] TodoForm 구현 (제목, 설명, 우선순위, 마감일, 카테고리 선택)
- [ ] TodoItem 구현 (체크박스, 수정/삭제, 서브태스크 토글)
- [ ] SubtaskList/SubtaskItem 구현 (하위 할 일)
- [ ] TodoList 구현 (드래그 앤 드롭)
- [ ] FilterTabs, PrioritySelector 구현

### 5단계: 페이지 통합
- [ ] `__root.tsx` 수정 (Provider 래핑, 사이드바 레이아웃)
- [ ] `index.tsx` 수정 (투두 리스트 메인 UI)

### 6단계: connectbase 연동
- [ ] 게스트 인증 처리
- [ ] 투두 CRUD API 연결
- [ ] 카테고리 CRUD API 연결
- [ ] 에러 핸들링 및 로딩 상태

---

## UI 디자인 방향

### 레이아웃
```
┌──────────────────────────────────────────────────┐
│  Header: Todo App                                │
├─────────────┬────────────────────────────────────┤
│  Sidebar    │  Main Content                      │
│  (카테고리)  │  ┌────────────────────────────────┐│
│             │  │ FilterTabs | + 새 할 일        ││
│  📁 업무    │  ├────────────────────────────────┤│
│    └ 프로젝트│  │ ☐ API 개발          🔴 높음   ││
│  📁 개인    │  │   └ ☐ 엔드포인트 설계          ││
│    └ 건강   │  │   └ ☑ 테스트 작성             ││
│             │  │ ☐ 운동하기          🟡 보통   ││
│  + 카테고리 │  │   └ ☐ 스트레칭                ││
│             │  └────────────────────────────────┘│
└─────────────┴────────────────────────────────────┘
```

### 스타일링
- 다크 모드 기반 (현재 프로젝트 스타일 유지)
- 색상: Cyan/Blue 계열 (기존 테마)
- 사이드바: 250px 고정폭, 접기/펼치기 지원
- 트리 구조: 들여쓰기 + 연결선
- 우선순위별 좌측 보더 색상 구분
  - 높음: red-500
  - 보통: yellow-500
  - 낮음: green-500
- 서브태스크: 부모 대비 작은 폰트, 약간 투명

---

## 검증 방법

1. `pnpm dev`로 개발 서버 실행
2. 투두 추가/수정/삭제 테스트
3. 완료 체크 토글 테스트
4. 필터링 동작 확인
5. 드래그 앤 드롭 정렬 테스트
6. 새로고침 후 데이터 유지 확인
7. connectbase 연동 확인 (네트워크 탭)

---

## 예상 작업 시간

- 1단계 설정: 15분
- 2단계 상태 관리: 30분
- 3단계 카테고리 UI: 40분
- 4단계 투두 UI: 50분
- 5단계 페이지 통합: 20분
- 6단계 백엔드 연동: 25분

**총 예상 시간: 약 3시간**
