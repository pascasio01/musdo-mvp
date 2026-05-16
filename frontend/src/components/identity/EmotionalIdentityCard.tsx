import { memo } from 'react'
import { Fingerprint, Clock, Layers } from 'lucide-react'
import type { EmotionalSignature } from '../../types/identity'

interface Props {
  signature: EmotionalSignature
}

const primeHourLabel: Record<EmotionalSignature['primeHour'], string> = {
  morning: 'Morning sessions',
  afternoon: 'Afternoon flow',
  evening: 'Evening rituals',
  late_night: 'Late-night creation',
}

const textureLabel: Record<EmotionalSignature['texture'], string> = {
  minimal: 'Minimal',
  organic: 'Organic',
  layered: 'Layered',
  cinematic: 'Cinematic',
  raw: 'Raw',
}

function EmotionalIdentityCardImpl({ signature }: Props) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background:
          'linear-gradient(180deg, var(--glass-bg-medium), var(--glass-bg))',
        borderColor: 'var(--border-soft)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px var(--shadow)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent-soft)' }}
          aria-hidden
        >
          <Fingerprint size={14} className="text-primary" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
            Emotional Identity
          </p>
          <p className="text-primary text-sm font-bold leading-tight mt-0.5">
            Musical signature
          </p>
        </div>
      </div>

      {/* Tagline — quoted, italic, the centerpiece */}
      <blockquote className="border-l-2 pl-4 mb-5"
                  style={{ borderColor: 'var(--accent)' }}>
        <p className="text-secondary text-[15px] leading-relaxed italic">
          &ldquo;{signature.tagline}&rdquo;
        </p>
      </blockquote>

      {/* Dominant moods */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">
          Dominant moods
        </p>
        <div className="flex flex-wrap gap-1.5">
          {signature.dominantMoods.map((mood, i) => (
            <span
              key={mood}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: i === 0 ? 'var(--accent-soft)' : 'var(--glass-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-soft)',
              }}
            >
              {mood}
            </span>
          ))}
        </div>
      </div>

      {/* Two-up: prime hour + texture */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3"
             style={{ background: 'var(--glass-subtle)', border: '1px solid var(--border-soft)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={11} className="text-muted" strokeWidth={2} aria-hidden />
            <p className="text-[9px] uppercase tracking-wider text-muted font-bold">
              Prime hour
            </p>
          </div>
          <p className="text-primary text-xs font-semibold leading-tight">
            {primeHourLabel[signature.primeHour]}
          </p>
        </div>
        <div className="rounded-xl p-3"
             style={{ background: 'var(--glass-subtle)', border: '1px solid var(--border-soft)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Layers size={11} className="text-muted" strokeWidth={2} aria-hidden />
            <p className="text-[9px] uppercase tracking-wider text-muted font-bold">
              Texture
            </p>
          </div>
          <p className="text-primary text-xs font-semibold leading-tight">
            {textureLabel[signature.texture]}
          </p>
        </div>
      </div>
    </div>
  )
}

export const EmotionalIdentityCard = memo(EmotionalIdentityCardImpl)
export default EmotionalIdentityCard
