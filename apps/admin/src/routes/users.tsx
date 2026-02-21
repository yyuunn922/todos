import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import {
  fetchAllUsers,
  approveUser,
  rejectUser,
  suspendUser,
  unsuspendUser,
  type ApprovedUserRow,
} from '#/services/connectbase'
import { UserCheck, UserX, Loader2, RefreshCw, Ban, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

type Tab = 'pending' | 'approved' | 'suspended' | 'all'

function UsersPage() {
  const [users, setUsers] = useState<ApprovedUserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('pending')

  const loadUsers = useCallback(() => {
    setIsLoading(true)
    fetchAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleApprove = async (rowId: string) => {
    setActionLoading(rowId)
    try {
      await approveUser(rowId)
      setUsers((prev) =>
        prev.map((u) => (u.id === rowId ? { ...u, approved: true } : u)),
      )
    } catch {
      alert('승인 처리에 실패했습니다')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (rowId: string) => {
    if (!confirm('정말 삭제하시겠습니까? 해당 유저의 데이터가 삭제됩니다.')) return

    setActionLoading(rowId)
    try {
      await rejectUser(rowId)
      setUsers((prev) => prev.filter((u) => u.id !== rowId))
    } catch {
      alert('삭제 처리에 실패했습니다')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (rowId: string) => {
    if (!confirm('해당 유저를 정지하시겠습니까?')) return

    setActionLoading(rowId)
    try {
      await suspendUser(rowId)
      setUsers((prev) =>
        prev.map((u) => (u.id === rowId ? { ...u, suspended: true } : u)),
      )
    } catch {
      alert('정지 처리에 실패했습니다')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnsuspend = async (rowId: string) => {
    setActionLoading(rowId)
    try {
      await unsuspendUser(rowId)
      setUsers((prev) =>
        prev.map((u) => (u.id === rowId ? { ...u, suspended: false } : u)),
      )
    } catch {
      alert('정지 해제에 실패했습니다')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    if (tab === 'pending') return !u.approved && !u.suspended
    if (tab === 'approved') return u.approved && !u.suspended
    if (tab === 'suspended') return u.suspended
    return true
  })

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'pending', label: '대기 중', count: users.filter((u) => !u.approved && !u.suspended).length },
    { key: 'approved', label: '승인됨', count: users.filter((u) => u.approved && !u.suspended).length },
    { key: 'suspended', label: '정지됨', count: users.filter((u) => u.suspended).length },
    { key: 'all', label: '전체', count: users.length },
  ]

  const isActing = (id: string) => actionLoading === id

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">유저 관리</h1>
        <button
          onClick={loadUsers}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-slate-800 rounded-lg p-1 border border-slate-700 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          {tab === 'pending' ? '대기 중인 유저가 없습니다' : '유저가 없습니다'}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-xs font-medium text-slate-400 uppercase px-5 py-3">
                  아이디
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase px-5 py-3">
                  이름
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase px-5 py-3">
                  신청일
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase px-5 py-3">
                  상태
                </th>
                <th className="text-right text-xs font-medium text-slate-400 uppercase px-5 py-3">
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30"
                >
                  <td className="px-5 py-4 text-sm text-white font-medium">
                    {user.login_id}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-300">
                    {user.name || '-'}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">
                    {user.requestedAt
                      ? new Date(user.requestedAt).toLocaleString('ko-KR')
                      : '-'}
                  </td>
                  <td className="px-5 py-4">
                    {user.suspended ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 rounded-full px-2.5 py-1">
                        정지됨
                      </span>
                    ) : user.approved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full px-2.5 py-1">
                        승인됨
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 rounded-full px-2.5 py-1">
                        대기 중
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!user.approved && !user.suspended && (
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={isActing(user.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-400/10 hover:bg-green-400/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isActing(user.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          승인
                        </button>
                      )}
                      {user.approved && !user.suspended && (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          disabled={isActing(user.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isActing(user.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Ban className="w-3 h-3" />
                          )}
                          정지
                        </button>
                      )}
                      {user.suspended && (
                        <button
                          onClick={() => handleUnsuspend(user.id)}
                          disabled={isActing(user.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isActing(user.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          정지 해제
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={isActing(user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isActing(user.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserX className="w-3 h-3" />
                        )}
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
