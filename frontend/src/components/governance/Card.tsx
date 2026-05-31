import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Elevation tier. */
  elevation?: 'flat' | 'raised' | 'floating'
  /** Inner padding. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Adds a hover affordance (for interactive cards). */
  interactive?: boolean
  /** Accent edge on the left (e.g. status indicators). */
  accent?: 'none' | 'navy' | 'gold' | 'success' | 'warning' | 'danger'
}

const paddingMap = {
  none: '0',
  sm: 'var(--gv-space-3)',
  md: 'var(--gv-space-5)',
  lg: 'var(--gv-space-6)',
}

const elevationMap = {
  flat: 'none',
  raised: 'var(--gv-shadow-sm)',
  floating: 'var(--gv-shadow-md)',
}

const accentMap = {
  none: 'transparent',
  navy: 'var(--gv-navy-500)',
  gold: 'var(--gv-gold)',
  success: 'var(--gv-success)',
  warning: 'var(--gv-warning)',
  danger: 'var(--gv-danger)',
}

/** Governance Card — the standard container surface for MUSVORA modules. */
export function Card({
  children,
  elevation = 'raised',
  padding = 'md',
  interactive = false,
  accent = 'none',
  className = '',
  style,
  ...rest
}: CardProps) {
  return (
    <div
      className={`relative ${interactive ? 'gv-focusable cursor-pointer transition-all' : ''} ${className}`}
      style={{
        background: 'var(--gv-surface)',
        border: '1px solid var(--gv-border)',
        borderRadius: 'var(--gv-radius-xl)',
        padding: paddingMap[padding],
        boxShadow: elevationMap[elevation],
        borderLeft: accent === 'none' ? undefined : `2px solid ${accentMap[accent]}`,
        transitionDuration: interactive ? 'var(--gv-dur-base)' : undefined,
        transitionTimingFunction: 'var(--gv-ease)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
