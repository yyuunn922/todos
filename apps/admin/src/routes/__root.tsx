import { Outlet, Link, createRootRoute, useRouterState } from '@tanstack/react-router'
import { AuthProvider, useAuth } from '#/context/AuthContext'
import { LoginPage } from '#/components/LoginPage'
import { LayoutDashboard, Users, LogOut, Shield, Loader2 } from 'lucide-react'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}

function AuthenticatedApp() {
  const { isAuthenticated, isApproved, isLoading, user, signOut } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">접근 권한 없음</h1>
          <p className="text-slate-400 mb-6">관리자 승인이 필요합니다.</p>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar userName={user?.name || user?.loginId} onSignOut={signOut} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

function Sidebar({ userName, onSignOut }: { userName?: string; onSignOut: () => void }) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: '대시보드' },
    { to: '/users', icon: Users, label: '유저 관리' },
  ] as const

  return (
    <aside className="w-60 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <span className="text-lg font-bold text-white">Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <div className="text-xs text-slate-500 px-3 mb-2 truncate">{userName}</div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
