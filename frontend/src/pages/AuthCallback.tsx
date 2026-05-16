import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * Handles Supabase email-confirmation deep links and password recovery.
 *
 * Supabase v2 hydrates the session asynchronously from the URL hash/query.
 * To avoid a race, we subscribe to onAuthStateChange and act on the first
 * meaningful event (PASSWORD_RECOVERY, SIGNED_IN, or initial getSession).
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let done = false

    // Recovery intent is signalled in the URL hash by Supabase (`type=recovery`).
    // We persist it through navigation state so /reset-password can verify it.
    const hashStr = typeof window !== 'undefined' ? window.location.hash : ''
    const hashParams = new URLSearchParams(hashStr.startsWith('#') ? hashStr.slice(1) : hashStr)
    const isRecovery = hashParams.get('type') === 'recovery'

    const finish = (path: string, state?: Record<string, unknown>) => {
      if (done) return
      done = true
      navigate(path, { replace: true, state })
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (done) return
      if (event === 'PASSWORD_RECOVERY') return finish('/reset-password', { recovery: true })
      if (event === 'SIGNED_IN' && session) {
        return finish(isRecovery ? '/reset-password' : '/home', isRecovery ? { recovery: true } : undefined)
      }
    })

    // Fallback: if no event arrives within 4s, inspect existing session.
    const timer = setTimeout(async () => {
      if (done) return
      const { data, error: err } = await supabase.auth.getSession()
      if (err) {
        setError(err.message)
        return
      }
      if (isRecovery) {
        finish('/reset-password', { recovery: true })
      } else {
        finish(data.session ? '/home' : '/login')
      }
    }, 4000)

    return () => {
      sub.subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [navigate])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg)' }}
    >
      <div className="relative w-10 h-10 mb-4" role="status" aria-label="Verifying">
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-0 rounded-full border-2 border-t-white/40 border-l-white/15 border-transparent animate-spin" />
      </div>
      <p className="text-secondary text-sm">
        {error ? `Verification failed: ${error}` : 'Verifying your session…'}
      </p>
    </div>
  )
}
