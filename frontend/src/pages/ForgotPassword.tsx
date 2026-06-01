import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Music, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  // Surface a readable, actionable message for connectivity failures while keeping
  // the raw error text in parentheses for debugging. Does not change any flow.
  const friendlyError = (msg: string): string => {
    const m = msg.toLowerCase()
    if (m.includes('load failed') || m.includes('failed to fetch') || m.includes('network') || m.includes('fetch'))
      return `Couldn't reach the authentication server. Check your connection and try again. (${msg})`
    if (m.includes('too many requests') || m.includes('rate limit'))
      return 'Too many attempts. Please wait a few minutes and try again.'
    return msg
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError(friendlyError(error.message))
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-theme text-white flex flex-col px-6 py-10 max-w-md mx-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-violet-900/12 blur-[120px]" />
      </div>

      <div className="relative">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to login</span>
        </button>

        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <Music size={16} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">MUSVORA</span>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={28} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black mb-3">Check Your<br />Email.</h1>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              If an account exists for <span className="text-white font-semibold">{email}</span>, we sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-4 rounded-2xl bg-white text-black font-bold text-base text-center hover:opacity-90 transition-opacity"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-black mb-2">Reset<br />Password.</h1>
            <p className="text-zinc-500 mb-10 text-sm leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 focus:bg-white/8 transition-all"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-zinc-600 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-white font-semibold hover:text-zinc-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
