import { Clock, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '#/context/AuthContext'
import { restoreSession, setStoredUser } from '#/services/connectbase'
import { useState } from 'react'

export function PendingApproval() {
  const { user, signOut } = useAuth()
  const [isChecking, setIsChecking] = useState(false)

  const handleCheckStatus = async () => {
    setIsChecking(true)
    try {
      const updatedUser = await restoreSession()
      if (updatedUser) {
        setStoredUser(updatedUser)
        window.location.reload()
      }
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">승인 대기 중</h1>
          <p className="text-slate-400 mb-6">
            관리자가 계정을 검토하고 있습니다.
            <br />
            승인이 완료되면 서비스를 이용할 수 있습니다.
          </p>

          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-500 mb-1">로그인된 계정</p>
            <p className="text-white font-medium">@{user?.loginId}</p>
            {user?.name && (
              <p className="text-slate-400 text-sm">{user.name}</p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isChecking ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  승인 상태 확인
                </>
              )}
            </button>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
