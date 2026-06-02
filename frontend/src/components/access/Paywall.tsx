import { useNavigate } from 'react-router-dom'
import { Lock, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react'
import { GovernanceScope, Button } from '../governance'
import {
  type Feature,
  type Plan,
  FEATURE_LABEL,
  PLAN_LABEL,
} from '../../lib/access'

interface PaywallProps {
  /** Feature being gated (preferred) — drives the headline + required plan. */
  feature?: Feature
  /** Required plan, when gating a whole surface rather than a named feature. */
  requiredPlan: Plan
  /** The user's current effective plan, for honest "you have X" copy. */
  currentPlan: Plan
  /** Render full-screen (route guard) vs. inline card (feature lock). */
  variant?: 'screen' | 'inline'
}

/**
 * Honest upsell surface. It never claims the user is missing out on something
 * fake — it states the feature, the plan that unlocks it, and routes to the
 * real pricing page where the Stripe checkout lives.
 */
export default function Paywall({
  feature,
  requiredPlan,
  currentPlan,
  variant = 'screen',
}: PaywallProps) {
  const navigate = useNavigate()
  const title = feature ? FEATURE_LABEL[feature] : `${PLAN_LABEL[requiredPlan]} access`

  const body = (
    <div
      className="w-full max-w-sm mx-auto text-center flex flex-col items-center"
      style={{ gap: 'var(--gv-space-5)' }}
    >
      <span
        className="grid place-items-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: 'var(--gv-radius-xl)',
          background: 'color-mix(in srgb, var(--gv-gold) 14%, var(--gv-surface))',
          border: '1px solid color-mix(in srgb, var(--gv-gold) 40%, var(--gv-border))',
          color: 'var(--gv-gold)',
        }}
        aria-hidden
      >
        <Lock size={26} strokeWidth={1.8} />
      </span>

      <div style={{ display: 'grid', gap: 'var(--gv-space-2)' }}>
        <p className="gv-eyebrow">{PLAN_LABEL[requiredPlan]}</p>
        <h2 className="font-bold" style={{ fontSize: 'var(--gv-text-xl)', color: 'var(--gv-text)' }}>
          {title}
        </h2>
        <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
          Esta función está incluida en <strong style={{ color: 'var(--gv-text)' }}>{PLAN_LABEL[requiredPlan]}</strong>.
          Tu plan actual es <strong style={{ color: 'var(--gv-text)' }}>{PLAN_LABEL[currentPlan]}</strong>.
        </p>
      </div>

      <div className="w-full" style={{ display: 'grid', gap: 'var(--gv-space-2)' }}>
        <Button onClick={() => navigate('/pricing')} variant="primary" block
          leadingIcon={<Sparkles size={16} strokeWidth={2} aria-hidden />}
          trailingIcon={<ArrowRight size={16} strokeWidth={2} aria-hidden />}
        >
          Ver planes
        </Button>
        {variant === 'screen' && (
          <Button onClick={() => navigate(-1)} variant="ghost" block
            leadingIcon={<ChevronLeft size={16} strokeWidth={2} aria-hidden />}
          >
            Volver
          </Button>
        )}
      </div>
    </div>
  )

  if (variant === 'inline') {
    return (
      <div
        style={{
          background: 'var(--gv-surface)',
          border: '1px solid var(--gv-border)',
          borderRadius: 'var(--gv-radius-lg)',
          padding: 'var(--gv-space-6) var(--gv-space-4)',
        }}
      >
        {body}
      </div>
    )
  }

  return (
    <GovernanceScope>
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{ background: 'var(--gv-bg)' }}
      >
        {body}
      </div>
    </GovernanceScope>
  )
}
