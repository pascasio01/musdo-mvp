/**
 * MUSDO Auth Service — platform-agnostic authentication contract.
 *
 * Web implementation lives in `lib/auth.tsx` (Supabase). React components
 * use `useAuth()` directly.  This file is the *contract* for non-React
 * modules and the stable surface a React Native build will satisfy via
 * Supabase-JS + secure-store (or a different IDP entirely).
 *
 * Auth state is intentionally NOT mirrored here — the React provider
 * remains the single source of truth. Modules that need the current user
 * should subscribe via the provider; this service exposes only the
 * *imperative* operations that don't depend on rendered UI.
 */

export interface AuthUser {
  id: string
  email: string | null
  fullName?: string | null
  /** Provider-specific metadata we don't need to type strictly here */
  metadata?: Record<string, unknown>
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAtMs: number
  user: AuthUser
}

export interface AuthCredentials { email: string; password: string }

export interface AuthService {
  signIn(creds: AuthCredentials): Promise<{ session: AuthSession | null; error: Error | null }>
  signUp(creds: AuthCredentials & { fullName?: string }): Promise<{ user: AuthUser | null; error: Error | null }>
  signOut(): Promise<void>
  resetPassword(email: string): Promise<{ error: Error | null }>
  /** Returns the currently cached session (sync read).  May be stale — */
  /** subscribe to the React provider for live updates. */
  getSession(): AuthSession | null
}

/**
 * Bridge published by AuthProvider on mount.  Stays null until then so any
 * call from non-React code surfaces a clear error if wiring is missing.
 */
type Bridge = AuthService | null
let bridge: Bridge = null

export function setAuthBridge(impl: Bridge): void { bridge = impl }

function requireBridge(): AuthService {
  if (!bridge) {
    throw new Error('[MUSDO/Auth] AuthService not initialised — AuthProvider must call setAuthBridge() on mount.')
  }
  return bridge
}

export const Auth: AuthService = {
  signIn(c)         { return requireBridge().signIn(c) },
  signUp(c)         { return requireBridge().signUp(c) },
  signOut()         { return requireBridge().signOut() },
  resetPassword(e)  { return requireBridge().resetPassword(e) },
  getSession()      { return requireBridge().getSession() },
}
