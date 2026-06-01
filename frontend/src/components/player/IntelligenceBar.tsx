import { memo, useEffect, useState } from 'react'
import { ShieldCheck, AlertTriangle, Sparkles, TrendingUp, Lock } from 'lucide-react'
import type { IntelligenceSignal } from '../../data/assetIntelligence'
import { toneColor, toneSoft } from '../../data/assetIntelligence'

interface IntelligenceBarProps {
  signals: IntelligenceSignal[]
  /** only cycle while audio is playing — discrete, never demands attention */
  active: boolean
}

const ICONS = {
  shield: ShieldCheck,
  alert: AlertTriangle,
  spark: Sparkles,
  trend: TrendingUp,
  lock: Lock,
} as const

/**
 * MUSVORA Intelligence Bar — a single, quiet line that surfaces one asset signal
 * at a time while the song plays. No popups, no stacking, no urgency. It rotates
 * gently through the available signals and dims when paused.
 */
function IntelligenceBarImpl({ signals, active }: IntelligenceBarProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  // Keep index in range when the signal set changes (e.g. new song).
  useEffect(() => { setIndex(0) }, [signals])

  useEffect(() => {
    if (!active || signals.length <= 1) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let fade: ReturnType<typeof setTimeout> | undefined
    const id = setInterval(() => {
      if (reduced) {
        setIndex(i => (i + 1) % signals.length)
        return
      }
      setVisible(false)
      fade = setTimeout(() => {
        setIndex(i => (i + 1) % signals.length)
        setVisible(true)
      }, 320)
    }, 4800)
    return () => {
      clearInterval(id)
      if (fade) clearTimeout(fade)
    }
  }, [active, signals.length])

  if (signals.length === 0) return null

  const signal = signals[Math.min(index, signals.length - 1)]
  const Icon = ICONS[signal.icon]

  return (
    <div
      className="flex items-center gap-2.5 rounded-full mb-6 px-3.5 py-2 transition-opacity duration-300"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-soft)',
        opacity: active ? (visible ? 1 : 0) : 0.55,
      }}
      role="status"
      aria-live="off"
    >
      <span
        className="grid place-items-center rounded-full flex-shrink-0"
        style={{ width: 22, height: 22, background: toneSoft(signal.tone), color: toneColor(signal.tone) }}
        aria-hidden
      >
        <Icon size={12} strokeWidth={2.4} />
      </span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
        {signal.label}
      </span>
      <span className="text-[8px] uppercase tracking-[0.18em] font-bold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
        MUSVORA AI
      </span>
    </div>
  )
}

export const IntelligenceBar = memo(IntelligenceBarImpl)
export default IntelligenceBar
