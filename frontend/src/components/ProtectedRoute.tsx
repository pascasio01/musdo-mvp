import { ReactNode, memo } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { AppRole } from '../types'
import type { Permission } from '../types/permissions'
import { hasPermission, hasAnyPermission } from '../types/permissions'

interface ProtectedRouteProps {
  children: ReactNode
  requireOwner?: boolean
  requireRole?: AppRole | AppRole[]
  requirePermission?: Permission | Permission[]
  requireAll?: boolean
  redirectTo?: string
}

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL as string | undefined

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg, #000)' }}
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="relative w-10 h-10" role="status">
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-0 rounded-full border-2 border-t-white/50 border-l-white/20 border-transparent animate-spin" />
        <span className="sr-only">Loading…</span>
      </div>
      <p className="text-zinc-700 text-[10px] uppercase tracking-widest font-medium">MUSDO</p>
    </div>
  )
}

function ProtectedRoute({
  children,
  requireOwner = false,
  requireRole,
  requirePermission,
  requireAll = false,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
  }

  if (requireOwner) {
    const isOwner = !!OWNER_EMAIL && user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
    if (!isOwner) return <Navigate to="/home" replace />
  }

  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole]
    if (!profile?.role || !roles.includes(profile.role)) {
      return <Navigate to="/home" replace />
    }
  }

  if (requirePermission && profile?.role) {
    const permissions = Array.isArray(requirePermission) ? requirePermission : [requirePermission]
    const hasAccess = requireAll
      ? permissions.every(p => hasPermission(profile.role, p))
      : permissions.some(p => hasPermission(profile.role, p))

    if (!hasAccess) return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

export default memo(ProtectedRoute)
