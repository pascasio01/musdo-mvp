import { useMemo } from 'react'
import { useAuth } from '../lib/auth'
import type { AppRole } from '../types'
import type { Permission } from '../types/permissions'
import { hasPermission, hasAnyPermission, hasAllPermissions, ROLE_LABELS, ROLE_COLORS } from '../types/permissions'

export interface RoleContext {
  role: AppRole
  label: string
  color: string
  isOwner: boolean
  isAdmin: boolean
  isElevated: boolean
  isComposer: boolean
  isProducer: boolean
  isCreator: boolean
  can: (permission: Permission) => boolean
  canAny: (permissions: Permission[]) => boolean
  canAll: (permissions: Permission[]) => boolean
}

export function useRole(): RoleContext {
  const { profile } = useAuth()
  const role = profile?.role ?? 'listener'

  return useMemo(() => ({
    role,
    label: ROLE_LABELS[role],
    color: ROLE_COLORS[role],
    isOwner: role === 'supreme_owner',
    isAdmin: role === 'admin' || role === 'supreme_owner',
    isElevated: role === 'admin' || role === 'supreme_owner',
    isComposer: role === 'composer',
    isProducer: role === 'producer',
    isCreator: role === 'composer' || role === 'producer',
    can: (permission: Permission) => hasPermission(role, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(role, permissions),
  }), [role])
}
