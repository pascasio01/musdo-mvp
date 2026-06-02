import { ReactNode } from 'react'
import { usePermissions } from '../../lib/usePermissions'
import { type Feature, type Plan, requiredPlanFor } from '../../lib/access'
import Paywall from './Paywall'

interface RequirePlanProps {
  children: ReactNode
  /** Gate by named feature (preferred). */
  feature?: Feature
  /** Or gate by raw plan tier. */
  plan?: Plan
}

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg, #000)' }}
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="relative w-10 h-10" role="status">
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-0 rounded-full border-2 border-t-white/50 border-l-white/20 border-transparent animate-spin" />
        <span className="sr-only">Loading…</span>
      </div>
      <p className="text-zinc-700 text-[10px] uppercase tracking-widest font-medium">MUSVORA</p>
    </div>
  )
}

/**
 * Route-level plan guard. Compose INSIDE `ProtectedRoute` (auth first, then
 * plan). On insufficient entitlement it renders the upsell rather than silently
 * redirecting, so the user understands why and can upgrade.
 */
export default function RequirePlan({ children, feature, plan }: RequirePlanProps) {
  const perms = usePermissions()
  const required: Plan = feature ? requiredPlanFor(feature) : plan ?? 'premium'

  if (perms.loading) return <LoadingScreen />

  const allowed = feature ? perms.can(feature) : perms.atLeast(required)
  if (!allowed) {
    return <Paywall feature={feature} requiredPlan={required} currentPlan={perms.plan} variant="screen" />
  }

  return <>{children}</>
}
