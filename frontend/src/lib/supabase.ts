import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (import.meta.env.DEV) {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.error('[MUSDO] VITE_SUPABASE_URL is missing or invalid')
  }
  if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    console.error('[MUSDO] VITE_SUPABASE_ANON_KEY is missing or invalid')
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'musdo-auth',
  },
  global: {
    headers: {
      'x-client': 'musdo-web',
      'x-client-version': '1.0.0',
    },
  },
})

export type SupabaseClient = typeof supabase

/* ── OAuth provider availability ──────────────────────────────────────
 * `signInWithOAuth` performs a full-page redirect to Supabase BEFORE any
 * error can surface in JS, so a disabled provider would dump the user on a
 * raw JSON error page. To avoid that we probe the public GoTrue settings
 * endpoint first and only redirect when the provider is actually enabled.
 * When a provider is later enabled in the Supabase dashboard, the buttons
 * start working automatically — no UI changes required.
 */
export type ProviderAvailability = 'enabled' | 'disabled' | 'unknown'

let providerCache: { at: number; external: Record<string, boolean> } | null = null
const PROVIDER_TTL_MS = 30_000

export async function getOAuthProviderAvailability(
  provider: string,
): Promise<ProviderAvailability> {
  try {
    const now = Date.now()
    if (!providerCache || now - providerCache.at > PROVIDER_TTL_MS) {
      const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: supabaseAnonKey },
      })
      if (!res.ok) throw new Error(`settings ${res.status}`)
      const json = (await res.json()) as { external?: Record<string, boolean> }
      providerCache = { at: now, external: json.external ?? {} }
    }
    return providerCache.external[provider] === true ? 'enabled' : 'disabled'
  } catch {
    // Network/parse failure — we can't confirm, so we treat it as unknown and
    // never risk redirecting the user to a raw error page.
    return 'unknown'
  }
}
