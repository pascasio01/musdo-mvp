import { memo } from 'react'
import type { ReactNode } from 'react'

interface ReadinessRingProps {
  /** 0–100 */
  value: number
  size?: number
  stroke?: number
  /** Progress color (governance token or hex). */
  color: string
  /** Center content (e.g. the score number). */
  children?: ReactNode
  /** Accessible description of what the gauge represents. */
  ariaLabel?: string
}

/**
 * Circular readiness gauge rendered in SVG.
 * Governance-scoped: colors are passed in from governance tokens.
 */
function ReadinessRingImpl({ value, size = 168, stroke = 12, color, children, ariaLabel }: ReadinessRingProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gv-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms var(--gv-ease)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export const ReadinessRing = memo(ReadinessRingImpl)
export default ReadinessRing
