import { useState } from 'react'
import { Menu, X, CheckSquare, LogOut, User } from 'lucide-react'
import { CategoryTree } from '#/components/category/CategoryTree'
import { useAuth } from '#/context/AuthContext'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg lg:hidden"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <CheckSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Todo App</h1>
              <p className="text-xs text-slate-400">할 일을 관리하세요</p>
            </div>
          </div>

          {/* Category Tree */}
          <div className="flex-1 overflow-hidden">
            <CategoryTree />
          </div>

          {/* User Profile */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || user?.loginId || '사용자'}
                </p>
                <p className="text-xs text-slate-500 truncate">@{user?.loginId}</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
