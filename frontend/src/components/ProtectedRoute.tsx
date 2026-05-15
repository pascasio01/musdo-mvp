import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requireOwner?: boolean
}

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL as string | undefined

export default function ProtectedRoute({ children, requireOwner = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg, #000)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <p className="text-zinc-700 text-xs tracking-widest uppercase font-medium">Loading</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requireOwner) {
    const isOwner = !!OWNER_EMAIL && user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
    if (!isOwner) return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
