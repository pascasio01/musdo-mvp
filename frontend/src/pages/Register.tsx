import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Music, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { GoogleButton, googleAuthErrorMessage } from '../components/auth/GoogleButton'

const roles = [
  { value: 'listener', label: 'Listener', desc: 'Discover & playlist' },
  { value: 'composer', label: 'Composer', desc: 'Create & protect songs' },
  { value: 'producer', label: 'Producer', desc: 'License & collaborate' },
]

export default function Register() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('composer')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error, requiresConfirmation } = await signUp(email, password, username, role)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else if (requiresConfirmation) {
      setConfirming(true)
    } else {
      if (role === 'composer' || role === 'producer') {
        navigate('/vault')
      } else {
        navigate('/home')
      }
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(googleAuthErrorMessage(error.message))
      setGoogleLoading(false)
      return
    }
    // Success triggers a full-page redirect to Google; this component unmounts.
    // If the redirect never happens, fail safe instead of leaving the button stuck.
    setTimeout(() => {
      setError(googleAuthErrorMessage('redirect failed'))
      setGoogleLoading(false)
    }, 6000)
  }

  if (confirming) {
    return (
      <div className="min-h-screen bg-theme text-white flex flex-col px-6 py-10 max-w-md mx-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px]" />
        </div>
        <div className="relative flex flex-col items-center justify-center flex-1 text-center py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black mb-3">Check Your<br />Email.</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-2">
            We sent a confirmation link to
          </p>
          <p className="text-white font-semibold mb-6">{email}</p>
          <p className="text-zinc-600 text-xs leading-relaxed mb-10">
            Click the link in that email to activate your account, then come back to sign in.
          </p>
          <Link
            to="/login"
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base text-center hover:opacity-90 transition-opacity"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme text-white flex flex-col px-6 py-10 max-w-md mx-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px]" />
      </div>

      <div className="relative">
        <button onClick={() => step === 1 ? navigate('/') : setStep(1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <Music size={16} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">MUSVORA</span>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/15'}`} />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-4xl font-black mb-2">Who<br />Are You?</h1>
            <p className="text-zinc-500 mb-8">Choose your role on the platform.</p>
            <div className="space-y-3">
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all ${
                    role === r.value
                      ? 'bg-white/10 border-white/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold">{r.label}</p>
                      <p className="text-zinc-500 text-sm mt-0.5">{r.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      role === r.value ? 'border-white' : 'border-zinc-600'
                    }`}>
                      {role === r.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 mt-8 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-black mb-2">Create<br />Account.</h1>
            <p className="text-zinc-500 mb-8">Set up your MUSVORA profile.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="yourname"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                    className="w-full p-4 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
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
                disabled={loading || googleLoading}
                className="w-full py-4 mt-2 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Join MUSVORA'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6" aria-hidden="true">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-zinc-600 uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <GoogleButton label="Continue with Google" loading={googleLoading} disabled={loading} onClick={handleGoogle} />

            <div className="mt-6 text-center">
              <p className="text-zinc-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-semibold">Sign In</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
