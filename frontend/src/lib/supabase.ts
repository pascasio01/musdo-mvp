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
