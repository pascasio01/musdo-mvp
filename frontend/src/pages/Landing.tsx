import { useNavigate } from 'react-router-dom'
import { Shield, Music, Zap, BadgeCheck, ArrowRight } from 'lucide-react'

const features = [
  { icon: Shield, label: 'Protect', desc: 'Vault custody' },
  { icon: BadgeCheck, label: 'Verify', desc: 'Ownership proof' },
  { icon: Zap, label: 'Monetize', desc: 'License assets' },
] as const

const PILLARS = ['Create', 'Protect', 'Verify', 'License', 'Monetize'] as const

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-theme text-white flex flex-col relative overflow-hidden">
      {/* Soft ambient aura — three lobes, lower opacity, longer blur for editorial feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-25%] left-[-15%] w-[560px] h-[560px] rounded-full bg-violet-900/15 blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[460px] h-[460px] rounded-full bg-blue-900/10 blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[380px] h-[380px] rounded-full bg-indigo-900/8 blur-[180px]" />
      </div>

      <div className="relative flex-1 flex flex-col px-6 max-w-md mx-auto w-full">
        {/* Brand mark */}
        <div className="pt-16 pb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(255,255,255,0.25)]">
              <Music size={16} className="text-black" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold tracking-[0.22em] text-zinc-400 uppercase">MUSVORA · Music Asset OS</span>
          </div>

          {/* Headline — tighter leading, refined three-stop gradient on Music Assets */}
          <h1 className="text-[3.25rem] font-black leading-[1.02] mt-7 mb-5 tracking-tight">
            The Operating<br />
            System for<br />
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
              Music Assets
            </span>.
          </h1>
          <p className="text-zinc-400 text-[15px] leading-relaxed max-w-[22rem]">
            Turn songs, masters, lyrics and rights into verifiable, protected and
            monetizable assets.
            <br className="hidden sm:block" />
            Not a player. Not a social network — infrastructure for music ownership.
          </p>

          {/* Asset lifecycle pillars — reinforced on every entry point */}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {PILLARS.map((pillar, i) => (
              <div key={pillar} className="flex items-center gap-2">
                {i > 0 && <span className="text-zinc-700" aria-hidden>·</span>}
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">
                  {pillar}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium feature cards — layered glass with inner glow halo behind icon */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-4 flex flex-col items-center text-center gap-3 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]"
            >
              {/* Icon container with halo */}
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-violet-400/10 blur-md" aria-hidden />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white/[0.10] to-white/[0.04] border border-white/15 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]">
                  <Icon size={18} className="text-zinc-100" strokeWidth={1.75} />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-white text-[12px] font-semibold tracking-tight leading-tight">{label}</p>
                <p className="text-zinc-500 text-[10.5px] leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs — softer, more elegant shadows */}
        <div className="space-y-3 pb-10">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_8px_32px_-8px_rgba(255,255,255,0.25),0_2px_8px_-2px_rgba(255,255,255,0.15)] active:scale-[0.99]"
          >
            Get Started
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white font-semibold text-base hover:bg-white/[0.08] transition-colors backdrop-blur-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
          >
            Explore without account →
          </button>
        </div>

        {/* Footer — public branding only, no legal identity */}
        <div className="pb-8 text-center">
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mb-4">
            <button onClick={() => navigate('/privacy')} className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">Terms</button>
            <button onClick={() => navigate('/security-policy')} className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">Security</button>
            <button onClick={() => navigate('/legal')} className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">Legal &amp; Policies</button>
          </div>
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.2em]">
            MUSVORA Labs · Music Asset Operating System
          </p>
        </div>
      </div>
    </div>
  )
}
