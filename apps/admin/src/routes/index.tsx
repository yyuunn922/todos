import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { fetchAllUsers, type ApprovedUserRow } from '#/services/connectbase'
import { Users, UserCheck, Clock, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const [users, setUsers] = useState<ApprovedUserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false))
  }, [])

  const pendingCount = users.filter((u) => !u.approved).length
  const approvedCount = users.filter((u) => u.approved).length

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">대시보드</h1>

      {isLoading ? (
        <div className="text-slate-400">로딩 중...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6 text-cyan-400" />}
              label="전체 유저"
              value={users.length}
              bg="bg-cyan-500/10"
            />
            <StatCard
              icon={<Clock className="w-6 h-6 text-yellow-400" />}
              label="승인 대기"
              value={pendingCount}
              bg="bg-yellow-500/10"
            />
            <StatCard
              icon={<UserCheck className="w-6 h-6 text-green-400" />}
              label="승인 완료"
              value={approvedCount}
              bg="bg-green-500/10"
            />
          </div>

          {pendingCount > 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">최근 가입 신청</h2>
                <Link
                  to="/users"
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  전체 보기 <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {users
                  .filter((u) => !u.approved)
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-3"
                    >
                      <div>
                        <span className="text-white text-sm font-medium">{user.login_id}</span>
                        {user.name && (
                          <span className="text-slate-400 text-sm ml-2">({user.name})</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {user.requestedAt
                          ? new Date(user.requestedAt).toLocaleDateString('ko-KR')
                          : ''}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bg: string
}) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  )
}
