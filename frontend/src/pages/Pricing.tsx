import { Check, Zap, Headphones, Mic2, Building2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

const listenerPlans = [
  {
    name: 'Free Listener',
    price: '$0',
    period: '/month',
    icon: Headphones,
    color: 'text-zinc-400',
    border: 'border-white/10',
    features: [
      'Basic listening',
      'Create playlists',
      'Follow artists',
      'Basic lyrics',
      'Limited personalization',
    ],
    cta: 'Start Free',
    ctaStyle: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
  },
  {
    name: 'Premium Listener',
    price: '$7.99',
    period: '/month',
    icon: Zap,
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    badge: 'Most Popular',
    features: [
      'Ad-free experience',
      'Cinematic premium player',
      'Adaptive emotional UI',
      'Smart Lyric Focus',
      'Deep Listening Mode',
      'Night Drive Mode',
      'Advanced themes',
      'Hi-Res / Lossless (future)',
      'Offline mode (future)',
      'Advanced personalization',
    ],
    cta: 'Upgrade to Premium',
    ctaStyle: 'bg-violet-600 text-white hover:bg-violet-500',
  },
]

const creatorPlans = [
  {
    name: 'Creator Basic',
    price: '$4.99',
    period: '/month',
    icon: Mic2,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    features: [
      'Composer Vault',
      'Upload lyrics & demos',
      'Private song storage',
      'Basic Song Passport',
      'Creator profile',
      'Limited marketplace visibility',
      'Basic analytics',
    ],
    cta: 'Start Creating',
    ctaStyle: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
  },
  {
    name: 'Creator Pro',
    price: '$14.99',
    period: '/month',
    icon: Zap,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'Best for Pros',
    features: [
      'Full licensing marketplace',
      'Human Verified eligibility',
      'Advanced analytics',
      'Creator Dashboard',
      'Revenue tracking',
      'Studio View',
      'Music DNA & Song Story',
      'Higher storage',
      'Public creator portfolio',
    ],
    cta: 'Go Pro',
    ctaStyle: 'bg-amber-600 text-white hover:bg-amber-500',
  },
  {
    name: 'Label / Studio',
    price: '$49.99',
    period: '/month',
    icon: Building2,
    color: 'text-green-400',
    border: 'border-green-500/20',
    features: [
      'Multiple artist management',
      'Team roles',
      'Split management',
      'Organization dashboard',
      'Advanced analytics',
      'Priority verification queue',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">MUSVORA</p>
          <h1 className="text-white font-black text-4xl mb-3">Plans &<br />Pricing</h1>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">Choose your path. Listener or creator, we have a plan for every stage.</p>
        </div>

        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">For Listeners</p>
          <div className="space-y-4">
            {listenerPlans.map(plan => {
              const Icon = plan.icon
              return (
                <div key={plan.name} className={`rounded-3xl bg-white/5 border ${plan.border} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} className={plan.color} />
                        <span className="text-white font-bold">{plan.name}</span>
                        {plan.badge && (
                          <span className={`text-[10px] font-bold ${plan.color} bg-white/5 border border-white/10 rounded-full px-2 py-0.5`}>
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-black text-2xl">{plan.price}</span>
                      <span className="text-zinc-600 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Check size={13} className="text-zinc-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${plan.ctaStyle}`}>
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">For Creators</p>
          <div className="space-y-4">
            {creatorPlans.map(plan => {
              const Icon = plan.icon
              return (
                <div key={plan.name} className={`rounded-3xl bg-white/5 border ${plan.border} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} className={plan.color} />
                        <span className="text-white font-bold">{plan.name}</span>
                        {plan.badge && (
                          <span className={`text-[10px] font-bold ${plan.color} bg-white/5 border border-white/10 rounded-full px-2 py-0.5`}>
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-black text-2xl">{plan.price}</span>
                      <span className="text-zinc-600 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Check size={13} className="text-zinc-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${plan.ctaStyle}`}>
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">One-Time Fees</p>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="text-white text-sm font-semibold">Verification Review</p>
              <p className="text-zinc-600 text-xs mt-0.5">Review fee only — does not guarantee approval</p>
            </div>
            <span className="text-white font-bold">$9.99</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white text-sm font-semibold">Marketplace Commission</p>
              <p className="text-zinc-600 text-xs mt-0.5">MUSVORA 10% · Creator 90%</p>
            </div>
            <span className="text-white font-bold">10%</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4">
          <p className="text-amber-400 text-xs font-semibold mb-1">Billing Note</p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Payments are not live in this version. This pricing is prepared for future Stripe integration. No charges are made.
          </p>
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/legal')} className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors">
            View Terms · Privacy · Refund Policy
          </button>
        </div>
      </div>
    </AppShell>
  )
}
