import type { AppRole } from './index'

export type Permission =
  | 'music.stream'
  | 'music.discover'
  | 'upload.demo'
  | 'upload.lyrics'
  | 'vault.read'
  | 'vault.write'
  | 'market.browse'
  | 'market.buy'
  | 'market.list'
  | 'profile.edit'
  | 'profile.verify_apply'
  | 'talent.browse'
  | 'talent.register'
  | 'talent.request'
  | 'dashboard.composer'
  | 'admin.verify'
  | 'admin.suspend'
  | 'admin.content'
  | 'owner.all'

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  listener: [
    'music.stream', 'music.discover',
    'market.browse', 'market.buy',
    'profile.edit',
    'talent.browse', 'talent.request',
  ],
  composer: [
    'music.stream', 'music.discover',
    'upload.demo', 'upload.lyrics',
    'vault.read', 'vault.write',
    'market.browse', 'market.buy', 'market.list',
    'profile.edit', 'profile.verify_apply',
    'talent.browse', 'talent.request',
    'dashboard.composer',
  ],
  producer: [
    'music.stream', 'music.discover',
    'upload.demo',
    'vault.read', 'vault.write',
    'market.browse', 'market.buy', 'market.list',
    'profile.edit', 'profile.verify_apply',
    'talent.browse', 'talent.register', 'talent.request',
    'dashboard.composer',
  ],
  admin: [
    'music.stream', 'music.discover',
    'upload.demo', 'upload.lyrics',
    'vault.read', 'vault.write',
    'market.browse', 'market.buy', 'market.list',
    'profile.edit', 'profile.verify_apply',
    'talent.browse', 'talent.register', 'talent.request',
    'dashboard.composer',
    'admin.verify', 'admin.suspend', 'admin.content',
  ],
  supreme_owner: [
    'music.stream', 'music.discover',
    'upload.demo', 'upload.lyrics',
    'vault.read', 'vault.write',
    'market.browse', 'market.buy', 'market.list',
    'profile.edit', 'profile.verify_apply',
    'talent.browse', 'talent.register', 'talent.request',
    'dashboard.composer',
    'admin.verify', 'admin.suspend', 'admin.content',
    'owner.all',
  ],
}

export function hasPermission(role: AppRole | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: AppRole | undefined, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p))
}

export function hasAllPermissions(role: AppRole | undefined, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p))
}

export function getRolePermissions(role: AppRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export const ROLE_LABELS: Record<AppRole, string> = {
  listener: 'Listener',
  composer: 'Composer',
  producer: 'Producer',
  admin: 'Administrator',
  supreme_owner: 'Platform Architect',
}

export const ROLE_COLORS: Record<AppRole, string> = {
  listener: 'text-zinc-400',
  composer: 'text-violet-400',
  producer: 'text-blue-400',
  admin: 'text-amber-400',
  supreme_owner: 'text-rose-400',
}
