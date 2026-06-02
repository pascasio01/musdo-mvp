import { ReactNode } from 'react'
import { usePermissions } from '../../lib/usePermissions'
import { type Feature, requiredPlanFor } from '../../lib/access'
import Paywall from './Paywall'

interface FeatureLockProps {
  feature: Feature
  children: ReactNode
  /**
   * What to render when locked:
   *  - 'upsell' (default): inline Paywall card prompting upgrade.
   *  - 'hide': render nothing.
   *  - or a custom fallback node.
   */
  fallback?: 'upsell' | 'hide' | ReactNode
}

/**
 * Inline feature gate for premium actions embedded inside an otherwise-free
 * surface (e.g. AI advanced sessions, playlist creation). Reuses the same
 * centralized permission logic as routes — no duplicated plan checks.
 */
export default function FeatureLock({ feature, children, fallback = 'upsell' }: FeatureLockProps) {
  const perms = usePermissions()

  // While entitlement is loading, render nothing to avoid flashing locked
  // content to a paying member.
  if (perms.loading) return null

  if (perms.can(feature)) return <>{children}</>

  if (fallback === 'hide') return null
  if (fallback === 'upsell') {
    return (
      <Paywall
        feature={feature}
        requiredPlan={requiredPlanFor(feature)}
        currentPlan={perms.plan}
        variant="inline"
      />
    )
  }
  return <>{fallback}</>
}
