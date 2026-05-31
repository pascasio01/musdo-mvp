import type { ReactNode, ElementType } from 'react'

interface GovernanceScopeProps {
  children: ReactNode
  /** Render as a different element (default div). */
  as?: ElementType
  className?: string
  /** Apply the matte-black governance background. Default true. */
  fillBackground?: boolean
  style?: React.CSSProperties
}

/**
 * Opt-in wrapper that activates the MUSVORA Governance Design System tokens.
 *
 * Everything inside inherits the institutional dark theme (Inter, navy + gold,
 * enterprise hierarchy) via the [data-ds="governance"] CSS scope. Existing
 * dark-luxury screens that do NOT use this wrapper are unaffected.
 *
 * Future modules (Vault, Readiness, Ownership Confidence, Recovery, Passport,
 * AI Auditor, AI DJ) should wrap their root in this component.
 */
export function GovernanceScope({
  children,
  as,
  className = '',
  fillBackground = true,
  style,
}: GovernanceScopeProps) {
  const Tag = as ?? 'div'
  return (
    <Tag
      data-ds="governance"
      className={className}
      style={{
        background: fillBackground ? 'var(--gv-bg)' : undefined,
        color: 'var(--gv-text)',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

export default GovernanceScope
