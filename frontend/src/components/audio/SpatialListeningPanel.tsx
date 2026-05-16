import { memo, useState } from 'react'
import { Waves, ChevronRight, MapPin, Box } from 'lucide-react'
import { useSpatialAudio } from '../../hooks/useSpatialAudio'
import { spatialModes, spatialModeOrder } from '../../data/spatialProfiles'
import { listeningEnvironments, listeningEnvironmentOrder } from '../../data/listeningEnvironment'
import type { SpatialModeId, ListeningEnvironmentId } from '../../types/audio'
import { Disclaimer, Label } from './SafeListenPanel'

interface Props { defaultOpen?: boolean }

function SpatialListeningPanelImpl({ defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const { settings, update, activeMode, activeEnvironment } = useSpatialAudio()

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
        <Waves size={13} aria-hidden style={{ color: 'var(--accent)' }} />
        <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          Spatial Listening
        </span>
        <span
          className="text-[9px] uppercase tracking-widest font-bold mr-1 truncate max-w-[7rem] text-right"
          style={{ color: settings.enabled ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {settings.enabled ? activeMode.label : 'Off'}
        </span>
        <ChevronRight
          size={16} aria-hidden
          style={{ color: 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 220ms ease' }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 space-y-5" style={{ borderTop: '1px solid var(--border-soft)' }}>
          {/* Master toggle */}
          <div className="flex items-start gap-3">
            <Waves size={14} style={{ color: 'var(--text-muted)', marginTop: 2 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Adaptive Spatial</p>
              <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Subtle width and depth shaping. Not fake 8D — quiet, premium, off by default.
              </p>
            </div>
            <button
              role="switch" aria-checked={settings.enabled}
              onClick={() => update({ enabled: !settings.enabled })}
              className="relative shrink-0 rounded-full transition-colors"
              style={{ width: 36, height: 20, background: settings.enabled ? 'var(--accent)' : 'var(--border)' }}
              aria-label="Toggle Adaptive Spatial Listening"
            >
              <span
                className="absolute top-0.5 rounded-full transition-transform"
                style={{
                  width: 16, height: 16, left: 2,
                  transform: settings.enabled ? 'translateX(16px)' : 'translateX(0)',
                  background: 'var(--text-inverse, #fff)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              />
            </button>
          </div>

          {/* Spatial Modes */}
          <div>
            <Label icon={Box}>Spatial Mode</Label>
            <div className="flex flex-wrap gap-1.5">
              {spatialModeOrder.map(id => {
                const m = spatialModes[id]
                const isActive = settings.mode === id
                return (
                  <button
                    key={id}
                    onClick={() => update({ mode: id as SpatialModeId, enabled: true })}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)',
                    }}
                    title={m.desc}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] italic mt-2" style={{ color: 'var(--text-muted)' }}>
              {activeMode.desc}
            </p>
          </div>

          {/* Listening Environments */}
          <div>
            <Label icon={MapPin}>Listening Environment</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {listeningEnvironmentOrder.map(id => {
                const e = listeningEnvironments[id]
                const isActive = settings.environment === id
                return (
                  <button
                    key={id}
                    onClick={() => update({ environment: id as ListeningEnvironmentId })}
                    className="text-left text-[11px] font-semibold px-2.5 py-2 rounded-lg transition-colors"
                    style={{
                      background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)',
                    }}
                    title={e.desc}
                  >
                    {e.label}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] italic mt-2" style={{ color: 'var(--text-muted)' }}>
              {activeEnvironment.desc}
            </p>
          </div>

          <Disclaimer>
            Spatial profiles are previewed visually. Real-time stereo and reverb shaping ships in a later release —
            we’re building the architecture now so it stays subtle and premium when it does.
          </Disclaimer>
        </div>
      )}
    </div>
  )
}

export const SpatialListeningPanel = memo(SpatialListeningPanelImpl)
export default SpatialListeningPanel
