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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requireOwner) {
    const isOwner = !!OWNER_EMAIL && user.email === OWNER_EMAIL
    if (!isOwner) return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
