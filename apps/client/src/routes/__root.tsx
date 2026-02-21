import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { TodoProvider } from '#/context/TodoContext'
import { CategoryProvider } from '#/context/CategoryContext'
import { AuthProvider, useAuth } from '#/context/AuthContext'
import { Sidebar } from '#/components/layout/Sidebar'
import { LoginPage } from '#/components/auth/LoginPage'
import { PendingApproval } from '#/components/auth/PendingApproval'

export const Route = createRootRoute({
  component: RootComponent,
})

function AuthenticatedApp() {
  const { isAuthenticated, isApproved, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (!isApproved) {
    return <PendingApproval />
  }

  return (
    <CategoryProvider>
      <TodoProvider>
        <div className="flex h-screen bg-slate-900">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </TodoProvider>
    </CategoryProvider>
  )
}

function RootComponent() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}
