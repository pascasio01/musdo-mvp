import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [recoveryIntent, setRecoveryIntent] = useState(false)

  // Validate that the user actually arrived here via a recovery flow:
  //   1. AuthCallback set location.state.recovery, OR
  //   2. URL hash contains type=recovery (direct deep link), OR
  //   3. Supabase emits PASSWORD_RECOVERY before our timeout.
  useEffect(() => {
    let cancelled = false

    const stateFlag = (location.state as { recovery?: boolean } | null)?.recovery === true
    const hashStr = typeof window !== 'undefined' ? window.location.hash : ''
    const hashParams = new URLSearchParams(hashStr.startsWith('#') ? hashStr.slice(1) : hashStr)
    const hashFlag = hashParams.get('type') === 'recovery'
    if (stateFlag || hashFlag) setRecoveryIntent(true)

    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      setHasSession(!!data.session)
      setVerifying(false)
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      if (cancelled) return
      if (evt === 'PASSWORD_RECOVERY') setRecoveryIntent(true)
      setHasSession(!!session)
      setVerifying(false)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [location.state])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setDone(true)
    toast.success('Password updated')
    setTimeout(() => navigate('/login', { replace: true }), 1500)
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>
        <div className="relative w-10 h-10 mb-4" role="status">
          <div className="absolute inset-0 rounded-full border-2 border-white/8" />
          <div className="absolute inset-0 rounded-full border-2 border-t-white/40 border-l-white/15 border-transparent animate-spin" />
        </div>
        <p className="text-secondary text-sm">Verifying recovery link…</p>
      </div>
    )
  }

  if (!hasSession || !recoveryIntent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>
        <h2 className="text-primary text-2xl font-black mb-2">Link expired</h2>
        <p className="text-muted text-sm mb-6 max-w-xs">
          {!hasSession
            ? 'This recovery link is no longer valid. Request a new password reset email.'
            : 'Open this page from the recovery email link to reset your password.'}
        </p>
        <button
          onClick={() => navigate('/forgot-password', { replace: true })}
          className="py-3 px-6 rounded-2xl font-semibold"
          style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
        >
          Request new link
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
          <Check size={28} className="text-emerald-400" aria-hidden />
        </div>
        <h2 className="text-primary text-2xl font-black mb-2">Password Updated</h2>
        <p className="text-muted text-sm">Redirecting to sign in…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl border border-theme flex items-center justify-center mb-6 mx-auto" style={{ background: 'var(--glass-bg)' }}>
          <Lock size={22} className="text-primary" aria-hidden />
        </div>
        <h1 className="text-primary text-2xl font-black mb-2 text-center">Reset Password</h1>
        <p className="text-muted text-sm mb-8 text-center">Enter a new password for your account.</p>

        <label className="text-xs text-muted uppercase tracking-wider font-medium block mb-2">New password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
          className="w-full p-4 rounded-2xl border border-theme text-primary placeholder-zinc-600 outline-none mb-4 text-sm"
          style={{ background: 'var(--glass-bg)' }}
          placeholder="At least 8 characters"
        />

        <label className="text-xs text-muted uppercase tracking-wider font-medium block mb-2">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full p-4 rounded-2xl border border-theme text-primary placeholder-zinc-600 outline-none mb-6 text-sm"
          style={{ background: 'var(--glass-bg)' }}
          placeholder="Repeat password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
        >
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
