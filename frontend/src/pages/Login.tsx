import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Music, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const friendlyError = (msg: string): string => {
    const m = msg.toLowerCase()
    if (m.includes('email_not_confirmed') || m.includes('not confirmed'))
      return 'Your email is not confirmed yet. Check your inbox and click the confirmation link.'
    if (m.includes('invalid_credentials') || m.includes('invalid login') || m.includes('invalid email or password'))
      return 'Email or password is incorrect.'
    if (m.includes('too many requests') || m.includes('rate limit'))
      return 'Too many attempts. Please wait a few minutes and try again.'
    if (m.includes('user not found'))
      return 'No account found with that email. Create one below.'
    if (m.includes('network') || m.includes('fetch'))
      return 'Connection error. Check your internet and try again.'
    return msg
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error, redirectTo } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(friendlyError(error.message))
    } else {
      navigate(redirectTo ?? '/home')
    }
  }

  return (
    <div className="min-h-screen bg-theme text-white flex flex-col px-6 py-10 max-w-md mx-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] rounded-full bg-violet-900/15 blur-[100px]" />
      </div>

      <div className="relative">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <Music size={16} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">MUSVORA</span>
        </div>

        <h1 className="text-4xl font-black mb-2">Welcome<br />Back.</h1>
        <p className="text-zinc-500 mb-10">Sign in to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-zinc-500 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-4 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-600 text-sm">
            No account?{' '}
            <Link to="/register" className="text-white font-semibold hover:text-zinc-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
