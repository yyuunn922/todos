import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  restoreSession,
  type User,
} from '#/services/connectbase'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isApproved: boolean
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    restoreSession()
      .then((restoredUser) => {
        setUser(restoredUser)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const loggedInUser = await authSignIn(email, password)
      setUser(loggedInUser)
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const newUser = await authSignUp(email, password, name)
      setUser(newUser)
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await authSignOut()
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isApproved: user?.isApproved ?? false,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
