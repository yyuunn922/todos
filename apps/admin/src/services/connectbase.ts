import { ConnectBase } from 'connectbase-client'

const STORAGE_KEY = 'admin_auth'
const USER_KEY = 'admin_user'

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

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredUser(user: User | null) {
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

const TABLE_ID = import.meta.env.VITE_CONNECTBASE_APPROVED_USERS_TABLE || 'approved_users'

// --- 인증 ---

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

  const isApproved = await checkUserApproval(loginId)

  const user: User = {
    id: result.member_id,
    loginId,
    name: result.nickname,
    isApproved,
  }
  setStoredUser(user)
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

  const isApproved = await checkUserApproval(storedUser.loginId)
  const user = { ...storedUser, isApproved }
  setStoredUser(user)
  return user
}

async function checkUserApproval(loginId: string): Promise<boolean> {
  try {
    const result = await client.database.getData(TABLE_ID, { limit: 1000 })
    return result.data.some(
      (item) =>
        item.data.login_id === loginId &&
        item.data.approved === true &&
        item.data.suspended !== true,
    )
  } catch {
    return false
  }
}

// --- 유저 관리 ---

export interface ApprovedUserRow {
  id: string
  login_id: string
  name: string
  approved: boolean
  suspended: boolean
  requestedAt: string
}

export async function fetchAllUsers(): Promise<ApprovedUserRow[]> {
  const result = await client.database.getData(TABLE_ID, { limit: 1000 })
  return result.data.map((item) => ({
    id: item.id,
    login_id: item.data.login_id as string,
    name: item.data.name as string,
    approved: item.data.approved as boolean,
    suspended: (item.data.suspended as boolean) || false,
    requestedAt: item.data.requestedAt as string,
  }))
}

export async function approveUser(rowId: string): Promise<void> {
  await client.database.updateData(TABLE_ID, rowId, {
    data: { approved: true },
  })
}

export async function rejectUser(rowId: string): Promise<void> {
  await client.database.deleteData(TABLE_ID, rowId)
}

export async function suspendUser(rowId: string): Promise<void> {
  await client.database.updateData(TABLE_ID, rowId, {
    data: { suspended: true },
  })
}

export async function unsuspendUser(rowId: string): Promise<void> {
  await client.database.updateData(TABLE_ID, rowId, {
    data: { suspended: false },
  })
}
