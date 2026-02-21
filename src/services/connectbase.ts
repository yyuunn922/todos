import { ConnectBase } from 'connectbase-client'

const STORAGE_KEY = 'connectbase_auth'
const USER_KEY = 'connectbase_user'

export interface User {
  id: string
  loginId: string
  name?: string
  isApproved: boolean
}

interface StoredAuth {
  accessToken: string
  refreshToken: string
}

function getStoredAuth(): StoredAuth | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredAuth(auth: StoredAuth | null) {
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export const client = new ConnectBase({
  baseUrl: import.meta.env.VITE_CONNECTBASE_URL || 'https://api.connectbase.world',
  apiKey: import.meta.env.VITE_CONNECTBASE_API_KEY,
})

export async function signIn(loginId: string, password: string): Promise<User> {
  const result = await client.auth.signInMember({
    login_id: loginId,
    password: password,
  })

  const auth = {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  }
  setStoredAuth(auth)
  client.updateConfig({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  })

  // 승인된 사용자인지 확인
  const isApproved = await checkUserApproval(loginId)

  const user: User = {
    id: result.member_id,
    loginId: loginId,
    name: result.nickname,
    isApproved,
  }
  setStoredUser(user)

  return user
}

export async function signUp(loginId: string, password: string, name?: string): Promise<User> {
  const result = await client.auth.signUpMember({
    login_id: loginId,
    password: password,
    nickname: name,
  })

  const auth = {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  }
  setStoredAuth(auth)
  client.updateConfig({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  })

  const user: User = {
    id: result.member_id,
    loginId: loginId,
    name: result.nickname,
    isApproved: false, // 새 사용자는 기본적으로 미승인
  }
  setStoredUser(user)

  // 승인 대기 목록에 추가
  await addPendingUser(loginId, name)

  return user
}

export async function signOut(): Promise<void> {
  try {
    await client.auth.signOut()
  } catch {
    // 로그아웃 API 실패해도 로컬 상태는 정리
  }
  setStoredAuth(null)
  setStoredUser(null)
  client.updateConfig({
    accessToken: undefined,
    refreshToken: undefined,
  })
}

export async function restoreSession(): Promise<User | null> {
  const stored = getStoredAuth()
  const storedUser = getStoredUser()

  if (!stored || !storedUser) {
    return null
  }

  client.updateConfig({
    accessToken: stored.accessToken,
    refreshToken: stored.refreshToken,
  })

  // 승인 상태 재확인
  const isApproved = await checkUserApproval(storedUser.loginId)
  const user = { ...storedUser, isApproved }
  setStoredUser(user)

  return user
}

// 승인된 사용자 목록 (하드코딩 또는 테이블에서 조회)
const APPROVED_LOGIN_IDS: string[] = [
  // 여기에 승인된 아이디 추가
  // 'admin',
]

async function checkUserApproval(loginId: string): Promise<boolean> {
  // 하드코딩된 목록 확인
  if (APPROVED_LOGIN_IDS.includes(loginId)) {
    return true
  }

  // connectbase 테이블에서 승인된 사용자 확인
  try {
    const result = await client.table(TABLE_IDS.approvedUsers).select({
      filter: { login_id: { eq: loginId }, approved: { eq: true } },
      limit: 1,
    })
    return result.data.length > 0
  } catch {
    // 테이블이 없거나 오류 시 하드코딩 목록만 사용
    return APPROVED_LOGIN_IDS.includes(loginId)
  }
}

async function addPendingUser(loginId: string, name?: string): Promise<void> {
  try {
    await client.table(TABLE_IDS.approvedUsers).insert({
      login_id: loginId,
      name: name || '',
      approved: false,
      requestedAt: new Date().toISOString(),
    })
  } catch {
    // 테이블이 없으면 무시
  }
}

export const TABLE_IDS = {
  todos: import.meta.env.VITE_CONNECTBASE_TODOS_TABLE || 'todos',
  categories: import.meta.env.VITE_CONNECTBASE_CATEGORIES_TABLE || 'categories',
  approvedUsers: import.meta.env.VITE_CONNECTBASE_APPROVED_USERS_TABLE || 'approved_users',
}
