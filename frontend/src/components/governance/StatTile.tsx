import type { ReactNode } from 'react'

interface StatTileProps {
  label: string
  value: ReactNode
  /** Optional small unit or delta shown next to the value. */
  hint?: ReactNode
  icon?: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'gold'
}

const toneColor = {
  neutral: 'var(--gv-text)',
  success: 'var(--gv-success)',
  warning: 'var(--gv-warning)',
  danger: 'var(--gv-danger)',
  gold: 'var(--gv-gold)',
}

/**
 * Governance StatTile — a Bloomberg-style metric cell.
 * Building block for Readiness scores, Ownership Confidence, etc.
 */
export function StatTile({ label, value, hint, icon, tone = 'neutral' }: StatTileProps) {
  return (
    <div
      style={{
        background: 'var(--gv-surface)',
        border: '1px solid var(--gv-border)',
        borderRadius: 'var(--gv-radius-lg)',
        padding: 'var(--gv-space-4)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        {icon && <span style={{ color: 'var(--gv-text-muted)' }}>{icon}</span>}
        <span className="gv-eyebrow">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className="gv-mono font-bold leading-none"
          style={{ fontSize: 'var(--gv-text-2xl)', color: toneColor[tone] }}
        >
          {value}
        </span>
        {hint && (
          <span className="gv-mono" style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-muted)' }}>
            {hint}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatTile
