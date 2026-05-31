import { memo, useState } from 'react'
import { Wind, Sparkles, Activity, Music2, Sliders, Heart, RotateCcw } from 'lucide-react'
import { usePersonalization } from '../../lib/personalization'
import { curatedAuraPresets, curatedAuraPresetOrder } from '../../data/auraPresets'
import { playbackAtmospheres, playbackAtmosphereOrder } from '../../data/playbackAtmospheres'
import { listeningPersonalities, listeningPersonalityOrder } from '../../data/listeningPersonalities'
import type {
  AdaptiveMode, AuraIntensity, MotionStyle, PlaybackAtmosphereId,
  CuratedAuraPresetId, ListeningPersonalityId,
} from '../../types/personalization'

const AURA_INTENSITY: { id: AuraIntensity; label: string }[] = [
  { id: 'low',       label: 'Low'       },
  { id: 'medium',    label: 'Medium'    },
  { id: 'high',      label: 'High'      },
  { id: 'cinematic', label: 'Cinematic' },
]

const MOTION_STYLES: { id: MotionStyle; label: string }[] = [
  { id: 'minimal',     label: 'Minimal'     },
  { id: 'smooth',      label: 'Smooth'      },
  { id: 'atmospheric', label: 'Atmospheric' },
  { id: 'immersive',   label: 'Immersive'   },
]

const ADAPTIVE_MODES: { id: AdaptiveMode; label: string; desc: string }[] = [
  { id: 'static',    label: 'Static Theme',    desc: 'Lock the aura you picked. Never changes.' },
  { id: 'song',      label: 'Adaptive by Song', desc: 'React to genre and tempo.' },
  { id: 'mood',      label: 'Adaptive by Mood', desc: 'Follow the song\u2019s emotional tag.' },
  { id: 'time',      label: 'Adaptive by Time', desc: 'Shifts with the hour of the day.' },
  { id: 'cinematic', label: 'Full Cinematic',   desc: 'Immersive blend of song, mood and time.' },
]

interface Props { onLaunchOnboarding?: () => void }

function ListeningAtmospherePanelImpl({ onLaunchOnboarding }: Props) {
  const { settings, update, applyPersonality, reset, resolvedPresetId } = usePersonalization()
  const [section, setSection] = useState<'all' | 'identity' | 'aura' | 'motion' | 'atmosphere' | 'adaptive'>('all')
  void section // reserved for future filter chips

  const activePresetId: CuratedAuraPresetId | null =
    resolvedPresetId ?? (settings.auraPreset === 'auto' ? null : settings.auraPreset)

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div>
          <Label icon={Wind}>Listening Atmosphere</Label>
          <p className="text-[12px] mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>
            Curated personalization. MUSVORA stays cinematic — you choose the temperature.
          </p>
        </div>
        {onLaunchOnboarding && (
          <button
            onClick={onLaunchOnboarding}
            className="shrink-0 text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-lg transition-colors"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--border-soft)',
            }}
          >
            Calibrate
          </button>
        )}
      </div>

      <div className="px-5 pb-5 space-y-6" style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1.25rem' }}>

        {/* ── Listening Personality ────────────────────────────── */}
        <Section icon={Heart} label="Listening Personality">
          <div className="grid grid-cols-1 gap-1.5">
            {listeningPersonalityOrder.map(id => {
              const p = listeningPersonalities[id]
              const isActive = settings.personality === id
              return (
                <button
                  key={id}
                  onClick={() => applyPersonality(id as ListeningPersonalityId)}
                  className="text-left px-3 py-2.5 rounded-lg transition-colors"
                  style={{
                    background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                    color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <p className="text-[12px] font-semibold leading-tight">{p.label}</p>
                  <p
                    className="text-[10.5px] leading-snug mt-0.5"
                    style={{ color: isActive ? 'var(--text-inverse)' : 'var(--text-muted)', opacity: isActive ? 0.75 : 1 }}
                  >{p.desc}</p>
                </button>
              )
            })}
          </div>
          {settings.personality === null && (
            <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>Currently: <span style={{ color: 'var(--text-secondary)' }}>Custom</span></p>
          )}
        </Section>

        {/* ── Adaptive Mode ────────────────────────────────────── */}
        <Section icon={Sparkles} label="Adaptive Mode">
          <div className="grid grid-cols-1 gap-1.5">
            {ADAPTIVE_MODES.map(m => {
              const isActive = settings.adaptiveMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => update({ adaptiveMode: m.id })}
                  className="text-left px-3 py-2 rounded-lg transition-colors"
                  style={{
                    background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                    color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <p className="text-[12px] font-semibold">{m.label}</p>
                  <p
                    className="text-[10.5px] leading-snug mt-0.5"
                    style={{ color: isActive ? 'var(--text-inverse)' : 'var(--text-muted)', opacity: isActive ? 0.7 : 1 }}
                  >{m.desc}</p>
                </button>
              )
            })}
          </div>
        </Section>

        {/* ── Aura Preset (only meaningful when not 'song') ───── */}
        {settings.adaptiveMode !== 'song' && (
          <Section icon={Wind} label="Aura Preset">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => update({ auraPreset: 'auto' })}
                className="text-left p-3 rounded-xl transition-colors"
                style={{
                  background: settings.auraPreset === 'auto' ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                  color: settings.auraPreset === 'auto' ? 'var(--text-inverse)' : 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <p className="text-[11px] font-bold">Auto</p>
                <p className="text-[10px] mt-0.5" style={{ opacity: 0.7 }}>Let the song decide.</p>
              </button>
              {curatedAuraPresetOrder.map(id => {
                const p = curatedAuraPresets[id]
                const isActive = activePresetId === id
                return (
                  <button
                    key={id}
                    onClick={() => update({ auraPreset: id })}
                    className="text-left p-3 rounded-xl transition-colors relative overflow-hidden"
                    style={{
                      background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                      border: '1px solid var(--border-soft)',
                    }}
                    title={p.desc}
                  >
                    <div className="flex gap-1 mb-2">
                      {p.preview.map((c, i) => (
                        <span key={i} className="w-3 h-3 rounded-full" style={{ background: c, border: '1px solid rgba(255,255,255,0.08)' }} />
                      ))}
                    </div>
                    <p className="text-[11px] font-bold leading-tight">{p.label}</p>
                  </button>
                )
              })}
            </div>
          </Section>
        )}

        {/* ── Aura Intensity ──────────────────────────────────── */}
        <Section icon={Sliders} label="Aura Intensity">
          <SegmentedRow
            items={AURA_INTENSITY.map(i => ({ id: i.id, label: i.label }))}
            active={settings.auraIntensity}
            onSelect={(id) => update({ auraIntensity: id as AuraIntensity })}
          />
        </Section>

        {/* ── Motion Style ────────────────────────────────────── */}
        <Section icon={Activity} label="Motion Style">
          <SegmentedRow
            items={MOTION_STYLES.map(m => ({ id: m.id, label: m.label }))}
            active={settings.motionStyle}
            onSelect={(id) => update({ motionStyle: id as MotionStyle })}
          />
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
            Motion adapts the global UI cadence — accessibility &ldquo;Reduce Motion&rdquo; always wins.
          </p>
        </Section>

        {/* ── Playback Atmosphere ─────────────────────────────── */}
        <Section icon={Music2} label="Playback Atmosphere">
          <div className="grid grid-cols-2 gap-1.5">
            {playbackAtmosphereOrder.map(id => {
              const a = playbackAtmospheres[id]
              const isActive = settings.playbackAtmosphere === id
              return (
                <button
                  key={id}
                  onClick={() => update({ playbackAtmosphere: id as PlaybackAtmosphereId })}
                  className="text-left px-3 py-2 rounded-lg transition-colors"
                  style={{
                    background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                    color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: '1px solid var(--border-soft)',
                  }}
                  title={a.desc}
                >
                  <p className="text-[11px] font-bold">{a.label}</p>
                </button>
              )
            })}
          </div>
          <p className="text-[10.5px] italic mt-2" style={{ color: 'var(--text-muted)' }}>
            {playbackAtmospheres[settings.playbackAtmosphere].desc}
          </p>
        </Section>

        {/* ── Cover Art Influence ─────────────────────────────── */}
        <Section icon={Sparkles} label="Cover Art Influence">
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={1} step={0.05}
              value={settings.coverArtInfluence}
              onChange={e => update({ coverArtInfluence: parseFloat(e.target.value) })}
              className="flex-1 appearance-none h-1 rounded-full"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${settings.coverArtInfluence * 100}%, var(--border) ${settings.coverArtInfluence * 100}%, var(--border) 100%)`,
                accentColor: 'var(--accent)',
              }}
              aria-label="Cover art influence"
            />
            <span className="text-[11px] tabular-nums w-10 text-right" style={{ color: 'var(--text-primary)' }}>
              {Math.round(settings.coverArtInfluence * 100)}%
            </span>
          </div>
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
            How strongly album artwork colours bias the aura. Subtle by default to keep the cinematic identity.
          </p>
        </Section>

        {/* ── Reset ──────────────────────────────────────────── */}
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold transition-colors mx-auto"
          style={{ color: 'var(--text-muted)' }}
        >
          <RotateCcw size={11} /> Reset to defaults
        </button>
      </div>
    </div>
  )
}

export const ListeningAtmospherePanel = memo(ListeningAtmospherePanelImpl)
export default ListeningAtmospherePanel

/* ── Local primitives ────────────────────────────────────────── */

type AnyIcon = React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>

function Label({ icon: Icon, children }: { icon: AnyIcon; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
      <Icon size={11} style={{ color: 'var(--text-muted)' }} />
      {children}
    </p>
  )
}

function Section({ icon, label, children }: { icon: AnyIcon; label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label icon={icon}>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function SegmentedRow({ items, active, onSelect }: { items: { id: string; label: string }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <div
      className="flex flex-wrap gap-1.5 p-1 rounded-xl"
      style={{ background: 'var(--glass-bg-medium, rgba(255,255,255,0.03))', border: '1px solid var(--border-soft)' }}
    >
      {items.map(it => {
        const isActive = it.id === active
        return (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className="flex-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
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
