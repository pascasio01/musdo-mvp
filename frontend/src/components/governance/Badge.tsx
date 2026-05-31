import type { ReactNode } from 'react'

type Tone = 'neutral' | 'navy' | 'gold' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  /** Solid filled vs soft tinted. Default soft. */
  variant?: 'soft' | 'outline'
  icon?: ReactNode
  className?: string
}

function toneStyle(tone: Tone, variant: 'soft' | 'outline'): React.CSSProperties {
  const map: Record<Tone, { fg: string; soft: string }> = {
    neutral: { fg: 'var(--gv-text-secondary)', soft: 'var(--gv-surface-2)' },
    navy: { fg: 'var(--gv-text-link)', soft: 'var(--gv-info-soft)' },
    gold: { fg: 'var(--gv-gold)', soft: 'var(--gv-gold-soft)' },
    success: { fg: 'var(--gv-success)', soft: 'var(--gv-success-soft)' },
    warning: { fg: 'var(--gv-warning)', soft: 'var(--gv-warning-soft)' },
    danger: { fg: 'var(--gv-danger)', soft: 'var(--gv-danger-soft)' },
  }
  const t = map[tone]
  if (variant === 'outline') {
    return {
      color: t.fg,
      background: 'transparent',
      border: `1px solid color-mix(in srgb, ${t.fg} 35%, transparent)`,
    }
  }
  return { color: t.fg, background: t.soft, border: '1px solid transparent' }
}

/** Governance Badge — status / category chip for MUSVORA modules. */
export function Badge({ children, tone = 'neutral', variant = 'soft', icon, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold ${className}`}
      style={{
        ...toneStyle(tone, variant),
        fontSize: 'var(--gv-text-2xs)',
        letterSpacing: '0.02em',
        padding: '2px 8px',
        borderRadius: 'var(--gv-radius-pill)',
      }}
    >
      {icon}
      {children}
    </span>
  )
}

export default Badge
