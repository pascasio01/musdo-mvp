import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { db } from '../services/_db'
import type { Profile, AppRole } from '../types'
import type { DbProfile } from '../types/database.types'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL as string | undefined

function getRedirectPath(role: AppRole): string {
  if (role === 'supreme_owner') return '/owner'
  if (role === 'composer' || role === 'producer') return '/vault'
  return '/home'
}

async function syncProfile(user: User): Promise<Profile | null> {
  try {
    const isOwner = !!OWNER_EMAIL && user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
    const role: AppRole = isOwner ? 'supreme_owner' : (user.user_metadata?.role as AppRole) ?? 'listener'

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return buildLocalProfile(user, role)
    }

    if (!data) {
      const newProfile = {
        id: user.id,
        username: user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'user',
        email: user.email ?? '',
        role,
      }
      const { data: created, error: insertErr } = await db('profiles')
        .insert(newProfile)
        .select()
        .single()

      if (insertErr) return buildLocalProfile(user, role)
      return created as Profile
    }

    const row = data as DbProfile
    if (isOwner && row.role !== 'supreme_owner') {
      await db('profiles').update({ role: 'supreme_owner' }).eq('id', user.id)
      return { ...row, role: 'supreme_owner' } as Profile
    }

    return row as Profile
  } catch {
    const isOwner = !!OWNER_EMAIL && user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
    return buildLocalProfile(user, isOwner ? 'supreme_owner' : 'listener')
  }
}

function buildLocalProfile(user: User, role: AppRole): Profile {
  return {
    id: user.id,
    username: user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'user',
    email: user.email ?? '',
    role,
  }
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null; redirectTo?: string }>
  signUp: (email: string, password: string, username: string, role?: string) => Promise<{ error: Error | null; requiresConfirmation: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) { setProfile(null); return }
    const p = await syncProfile(u)
    setProfile(p)
  }, [])

  useEffect(() => {
    // Defensive boot guard: guarantee the loading flag is always cleared so the
    // splash can never hang if getSession() rejects or the profile lookup stalls.
    // This only flips `loading` — it does NOT change session, profile, role, or
    // permission state, nor the login/logout flow.
    let settled = false
    const clearLoading = () => {
      if (settled) return
      settled = true
      setLoading(false)
    }
    const safetyTimer = setTimeout(clearLoading, 8000)

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        loadProfile(session?.user ?? null).finally(clearLoading)
      })
      .catch(clearLoading)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      await loadProfile(session?.user ?? null)
    })

    return () => {
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error, redirectTo: undefined }
    const p = await syncProfile(data.user)
    setProfile(p)
    return { error: null, redirectTo: getRedirectPath(p?.role ?? 'listener') }
  }, [])

  const signUp = useCallback(async (email: string, password: string, username: string, role = 'listener') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, role } },
    })
    const requiresConfirmation = !error && !data.session
    return { error, requiresConfirmation }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    return { error }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await syncProfile(user)
      setProfile(p)
    }
  }, [user])

  const value = useMemo<AuthContextType>(() => ({
    user, session, profile, loading,
    signIn, signUp, signOut, resetPassword, refreshProfile,
  }), [user, session, profile, loading, signIn, signUp, signOut, resetPassword, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
