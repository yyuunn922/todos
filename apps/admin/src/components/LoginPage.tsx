import { useState } from 'react'
import { useAuth } from '#/context/AuthContext'
import { AtSign, Lock, LogIn, AlertCircle, Shield } from 'lucide-react'

export function LoginPage() {
  const { signIn, isLoading, error, clearError } = useAuth()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!loginId.trim() || !password.trim()) {
      setLocalError('아이디와 비밀번호를 입력해주세요')
      return
    }

    try {
      await signIn(loginId.trim(), password)
    } catch {
      // AuthContext에서 에러 처리됨
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin</h1>
          <p className="text-slate-400 mt-2">관리자 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
          {displayError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">아이디</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500"
                placeholder="관리자 아이디"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500"
                placeholder="비밀번호"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                로그인
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
