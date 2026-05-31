import { ArrowLeft, ChevronRight, FileText, Shield, AlertTriangle, RefreshCw, Scale, Bot, Users, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'

const legalLinks = [
  { to: '/terms', icon: FileText, label: 'Terms of Service', desc: 'Platform rules and user agreement' },
  { to: '/privacy', icon: Shield, label: 'Privacy Policy', desc: 'How we handle your data' },
  { to: '/dmca', icon: AlertTriangle, label: 'DMCA Policy', desc: 'Copyright infringement reporting' },
  { to: '/creator-agreement', icon: Scale, label: 'Creator Agreement', desc: 'Rights, royalties, and licensing terms' },
  { to: '/licensing-disclaimer', icon: FileText, label: 'Licensing Disclaimer', desc: 'What MUSVORA licenses cover' },
  { to: '/ai-disclaimer', icon: Bot, label: 'AI Disclaimer', desc: 'How AI tools are used on MUSVORA' },
  { to: '/community-rules', icon: Users, label: 'Community Rules', desc: 'Content standards and conduct' },
  { to: '/refund-policy', icon: RefreshCw, label: 'Refund Policy', desc: 'Subscription and purchase refunds' },
  { to: '/risk-disclaimer', icon: AlertCircle, label: 'Risk Disclaimer', desc: 'Platform limitations and liability' },
]

export default function Legal() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">MUSVORA</p>
          <h1 className="text-white font-black text-3xl mb-2">Legal &<br />Policies</h1>
          <p className="text-zinc-500 text-sm">Documents governing the use of the MUSVORA platform.</p>
        </div>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4 mb-6">
          <p className="text-amber-400 text-xs font-semibold mb-1">Legal Notice</p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            These documents represent the current MVP version. Policies should be reviewed by a qualified attorney before public launch. This is not legal advice.
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {legalLinks.map(({ to, icon: Icon, label, desc }, i) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${i < legalLinks.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-zinc-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-zinc-700" />
            </button>
          ))}
        </div>

        <p className="text-center text-zinc-700 text-[10px] mt-8 font-mono">
          © 2026 MUSVORA. All rights reserved.
        </p>
      </div>
    </AppShell>
  )
}
