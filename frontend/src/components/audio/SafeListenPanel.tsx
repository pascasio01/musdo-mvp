import { memo, useState, ComponentType } from 'react'
import { ShieldCheck, ChevronRight, Moon, Volume2, Ear, Activity } from 'lucide-react'

type AnyIcon = ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>
import { useSafeListen } from '../../hooks/useSafeListen'
import type { MaxVolumeCap, AwarenessProfile } from '../../types/audioSafety'

const VOLUME_CAPS: { v: MaxVolumeCap; label: string }[] = [
  { v: 0.6, label: '60%' },
  { v: 0.7, label: '70%' },
  { v: 0.8, label: '80%' },
  { v: 0.9, label: '90%' },
]

const AWARENESS_PROFILES: { id: AwarenessProfile; label: string }[] = [
  { id: 'off',          label: 'Off'      },
  { id: 'street',       label: 'Street'   },
  { id: 'conversation', label: 'Talk'     },
  { id: 'transit',      label: 'Transit'  },
  { id: 'walk',         label: 'Walk'     },
  { id: 'gym',          label: 'Gym'      },
]

interface Props { defaultOpen?: boolean }

function SafeListenPanelImpl({ defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const { settings, update, awareness, updateAwareness } = useSafeListen()

  return (
    <div
      className="rounded-2xl border overflow-hidden mt-3"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
      >
        <ShieldCheck size={13} aria-hidden style={{ color: 'var(--accent)' }} />
        <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          SafeListen
        </span>
        <span
          className="text-[9px] uppercase tracking-widest font-bold mr-1"
          style={{ color: settings.enabled ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {settings.enabled ? 'On' : 'Off'}
        </span>
        <ChevronRight
          size={16} aria-hidden
          style={{ color: 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 220ms ease' }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 space-y-5" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <Row
            icon={ShieldCheck} title="Safe Volume" desc="Cap loudness to a safer ceiling."
            value={settings.enabled} onChange={v => update({ enabled: v })}
          />

          {settings.enabled && (
            <div className="pl-7">
              <Label icon={Volume2}>Max Volume</Label>
              <SegmentedRow
                items={VOLUME_CAPS.map(c => ({ id: String(c.v), label: c.label }))}
                active={String(settings.maxVolume)}
                onSelect={(id) => update({ maxVolume: Number(id) as MaxVolumeCap })}
              />
            </div>
          )}

          <Row icon={Moon}    title="Night Listening"     desc="Softer ceiling and gentler highs after dark." value={settings.nightListening}     onChange={v => update({ nightListening: v })} />
          <Row icon={Ear}     title="Reduce Harsh Highs"  desc="Tames the 4–8 kHz region (mock)."             value={settings.reduceHarshHighs}   onChange={v => update({ reduceHarshHighs: v })} />
          <Row icon={Activity}title="Anti-Fatigue Mode"   desc="Reminds you to rest after long sessions."     value={settings.antiFatigue}        onChange={v => update({ antiFatigue: v })} />
          <Row icon={Volume2} title="Normalize Volume"    desc="Even loudness across tracks (mock)."          value={settings.normalizeVolume}    onChange={v => update({ normalizeVolume: v })} />
          <Row icon={Volume2} title="Prevent Sudden Loud" desc="Block jarring volume jumps between songs."    value={settings.preventSuddenLoudness} onChange={v => update({ preventSuddenLoudness: v })} />
          <Row icon={Volume2} title="Smooth Transitions"  desc="Cinematic crossfade between tracks (mock)."   value={settings.smoothTransitions}  onChange={v => update({ smoothTransitions: v })} />

          <div className="pt-1">
            <Label icon={Ear}>Ambient Awareness</Label>
            <SegmentedRow
              items={AWARENESS_PROFILES.map(p => ({ id: p.id, label: p.label }))}
              active={awareness.profile}
              onSelect={(id) => updateAwareness({ profile: id as AwarenessProfile })}
            />
            <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
              Awareness profiles are previews. Microphone-based detection arrives in a later release —
              MUSDO will never listen without explicit permission.
            </p>
          </div>

          <Disclaimer>
            MUSDO SafeListen helps manage listening comfort but does not replace medical advice or
            device-level hearing protection.
          </Disclaimer>
        </div>
      )}
    </div>
  )
}

export const SafeListenPanel = memo(SafeListenPanelImpl)
export default SafeListenPanel

/* ── Shared row primitives ────────────────────────────────────── */

interface RowProps {
  icon: AnyIcon
  title: string; desc: string
  value: boolean; onChange: (v: boolean) => void
}

function Row({ icon: Icon, title, desc, value, onChange }: RowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={14} style={{ color: 'var(--text-muted)', marginTop: 2 }} />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
      <SwitchToggle value={value} onChange={onChange} ariaLabel={title} />
    </div>
  )
}

function SwitchToggle({ value, onChange, ariaLabel }: { value: boolean; onChange: (v: boolean) => void; ariaLabel: string }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      onClick={() => onChange(!value)}
      className="relative shrink-0 rounded-full transition-colors"
      style={{
        width: 36, height: 20,
        background: value ? 'var(--accent)' : 'var(--border)',
      }}
    >
      <span
        className="absolute top-0.5 rounded-full transition-transform"
        style={{
          width: 16, height: 16,
          left: 2,
          transform: value ? 'translateX(16px)' : 'translateX(0)',
          background: 'var(--text-inverse, #fff)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

export function Label({ icon: Icon, children }: { icon?: AnyIcon; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
      {Icon && <Icon size={11} style={{ color: 'var(--text-muted)' }} />}
      {children}
    </p>
  )
}

export function SegmentedRow({ items, active, onSelect }: { items: { id: string; label: string }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <div
      className="flex flex-wrap gap-1.5 p-1 rounded-xl"
      style={{ background: 'var(--glass-bg-medium, rgba(255,255,255,0.03))', border: '1px solid var(--border-soft)' }}
      role="tablist"
    >
      {items.map(it => {
        const isActive = it.id === active
        return (
          <button
            key={it.id}
            role="tab" aria-selected={isActive}
            onClick={() => onSelect(it.id)}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
            style={{
              background: isActive ? 'var(--text-primary)' : 'transparent',
              color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
            }}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] leading-relaxed pt-3"
      style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-soft)' }}
    >
      {children}
    </p>
  )
}
