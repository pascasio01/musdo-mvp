import { useNavigate } from 'react-router-dom'
import { Shield, Music, Zap, BadgeCheck, ArrowRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px]" />
      </div>

      <div className="relative flex-1 flex flex-col px-6 max-w-md mx-auto w-full">
        <div className="pt-16 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
              <Music size={16} className="text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">MUSDO</span>
          </div>
          <h1 className="text-5xl font-black leading-[1.05] mt-6 mb-4">
            The Human<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Music
            </span>
            <br />Infrastructure.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Where songs are protected, discovered and licensed. Built for composers who create for humans.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: Shield, label: 'Song Passport', desc: 'Proof of ownership' },
            { icon: Zap, label: 'Licensing', desc: 'Marketplace' },
            { icon: BadgeCheck, label: 'Verified', desc: 'Human music only' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon size={18} className="text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{label}</p>
                <p className="text-zinc-600 text-[10px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pb-10">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 text-zinc-600 text-sm hover:text-zinc-400 transition-colors"
          >
            Explore without account →
          </button>
        </div>

        <div className="pb-8 text-center">
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">
            Created by Pascasio Emmanuel Reynoso Reyes
          </p>
        </div>
      </div>
    </div>
  )
}
