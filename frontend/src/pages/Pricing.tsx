import { useState } from 'react'
import { Check, Zap, Headphones, Mic2, ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { useSubscription, type PaidPlan } from '../lib/useSubscription'
import { startCheckout, openCustomerPortal } from '../lib/billing'
import type { SubscriptionPlan } from '../types/database.types'

type PlanId = SubscriptionPlan

interface PlanCard {
  id: PlanId
  name: string
  price: string
  period: string
  icon: typeof Headphones
  color: string
  border: string
  badge?: string
  ctaStyle: string
  features: string[]
}

const plans: PlanCard[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    icon: Headphones,
    color: 'text-zinc-400',
    border: 'border-white/10',
    ctaStyle: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    features: [
      'Listen to human-verified music',
      'Create playlists',
      'Follow artists',
      'Basic lyrics',
      'Basic personalization',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$7.99',
    period: '/month',
    icon: Zap,
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    badge: 'Most Popular',
    ctaStyle: 'bg-violet-600 text-white hover:bg-violet-500',
    features: [
      'Ad-free experience',
      'Cinematic premium player',
      'Adaptive emotional UI',
      'Smart Lyric Focus',
      'Deep Listening Mode',
      'Advanced themes',
      'Offline mode',
      'Advanced personalization',
    ],
  },
  {
    id: 'creator_pro',
    name: 'Creator Pro',
    price: '$14.99',
    period: '/month',
    icon: Mic2,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'For Creators',
    ctaStyle: 'bg-amber-600 text-white hover:bg-amber-500',
    features: [
      'Everything in Premium',
      'Composer Vault & uploads',
      'Full licensing marketplace',
      'Human Verified eligibility',
      'Creator Dashboard & analytics',
      'Revenue tracking',
      'Music DNA & Song Story',
      'Public creator portfolio',
    ],
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const sub = useSubscription()
  const [busy, setBusy] = useState<PlanId | null>(null)

  const trialAvailable = !sub.subscription?.trial_used

  const handlePaid = async (plan: PaidPlan) => {
    if (!user) { navigate('/login'); return }
    setBusy(plan)
    // If the user already holds a paid plan, route plan changes through the
    // Stripe Customer Portal (upgrade / downgrade keep one subscription).
    const res = sub.isPaid ? await openCustomerPortal() : await startCheckout(plan)
    if (!res.ok) {
      // Server enforces a single live subscription — fall back to the portal.
      if (res.error === 'already_subscribed') {
        const portal = await openCustomerPortal()
        if (!portal.ok) { toast.error('Could not open billing. Please try again.'); setBusy(null) }
        return
      }
      toast.error(
        res.error === 'no_customer'
          ? 'No active billing account yet. Start a plan first.'
          : 'Could not open checkout. Please try again in a moment.',
      )
      setBusy(null)
    }
    // On success the browser is redirected to Stripe; no state reset needed.
  }

  const handleFree = async () => {
    if (!user) { navigate('/register'); return }
    if (sub.isPaid) {
      // Downgrade to Free = cancel the paid plan via the portal.
      setBusy('free')
      const res = await openCustomerPortal()
      if (!res.ok) { toast.error('Could not open billing. Please try again.'); setBusy(null) }
      return
    }
    navigate('/home')
  }

  const renderCta = (plan: PlanCard) => {
    const isCurrent = sub.plan === plan.id && (plan.id === 'free' || sub.isPaid)
    const loading = busy === plan.id

    if (plan.id === 'free') {
      return (
        <button
          onClick={handleFree}
          disabled={loading || (isCurrent && !sub.isPaid)}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 ${plan.ctaStyle}`}
        >
          {loading ? <Loader2 size={16} className="animate-spin mx-auto" />
            : isCurrent ? 'Your plan'
            : sub.isPaid ? 'Switch to Free'
            : 'Start Free'}
        </button>
      )
    }

    let label: string
    if (isCurrent) label = 'Manage plan'
    else if (sub.isPaid) label = 'Switch plan'
    else if (trialAvailable) label = 'Start 15-day trial'
    else label = 'Subscribe'

    return (
      <button
        onClick={() => handlePaid(plan.id as PaidPlan)}
        disabled={loading}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 ${plan.ctaStyle}`}
      >
        {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : label}
      </button>
    )
  }

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

        <div className="space-y-4">
          {plans.map(plan => {
            const Icon = plan.icon
            const isCurrent = sub.plan === plan.id && (plan.id === 'free' || sub.isPaid)
            return (
              <div key={plan.id} className={`rounded-3xl bg-white/5 border ${isCurrent ? 'border-white/40' : plan.border} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Icon size={18} className={plan.color} />
                      <span className="text-white font-bold">{plan.name}</span>
                      {plan.badge && (
                        <span className={`text-[10px] font-bold ${plan.color} bg-white/5 border border-white/10 rounded-full px-2 py-0.5`}>
                          {plan.badge}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-white bg-white/15 border border-white/20 rounded-full px-2 py-0.5">
                          Current
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
                {renderCta(plan)}
              </div>
            )
          })}
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

        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-zinc-400 text-xs font-semibold mb-1">Secure checkout by Stripe</p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Paid plans include a 15-day free trial (one per account). Cancel anytime — you keep
            your benefits until the end of the paid period. No card details are stored by MUSVORA.
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
