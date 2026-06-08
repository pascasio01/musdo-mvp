import { Lock } from 'lucide-react'
import { usePermissions } from '../../lib/usePermissions'
import { type Feature, requiredPlanFor } from '../../lib/access'

interface LockBadgeProps {
  /** The gated feature this entry point leads to. */
  feature: Feature
  /**
   * `pill` — inline gold chip with the plan label (default, for buttons/links).
   * `dot`  — tiny circular lock chip meant to be absolutely positioned by the
   *          caller (e.g. overlaid on a nav icon).
   */
  variant?: 'pill' | 'dot'
  className?: string
}

/**
 * Pre-tap signal that a destination is locked behind a paid plan. Reads the same
 * entitlement the route gate (`RequirePlan`) uses via `usePermissions().can`, so
 * the badge and the wall never disagree. Renders nothing while entitlement is
 * loading or once the user can access the feature — honest, never a false lock.
 *
 * This is purely the visual hint; it does NOT change gate behavior.
 */
export default function LockBadge({ feature, variant = 'pill', className = '' }: LockBadgeProps) {
  const perms = usePermissions()
  if (perms.loading || perms.can(feature)) return null

  const label = requiredPlanFor(feature) === 'creator_pro' ? 'Pro' : 'Premium'

  if (variant === 'dot') {
    return (
      <span
        role="img"
        aria-label={`${label} feature — locked`}
        className={`grid place-items-center rounded-full ${className}`}
        style={{
          width: 15,
          height: 15,
          background: 'var(--gv-gold, #D4AF37)',
          color: '#0A0A0A',
          boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
        }}
      >
        <Lock size={9} strokeWidth={2.5} aria-hidden />
      </span>
    )
  }

  return (
    <span
      role="img"
      aria-label={`${label} feature — locked`}
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide leading-none ${className}`}
      style={{
        background: 'color-mix(in srgb, var(--gv-gold, #D4AF37) 16%, transparent)',
        color: 'var(--gv-gold, #D4AF37)',
        border: '1px solid color-mix(in srgb, var(--gv-gold, #D4AF37) 38%, transparent)',
      }}
    >
      <Lock size={9} strokeWidth={2.5} aria-hidden />
      {label}
    </span>
  )
}
