import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('[MUSDO] VITE_SUPABASE_URL is missing or invalid')
}
if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error('[MUSDO] VITE_SUPABASE_ANON_KEY is missing or invalid')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'musdo-auth',
  },
})
