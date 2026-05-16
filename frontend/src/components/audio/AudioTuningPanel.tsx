import { memo, useState } from 'react'
import { Sliders, ChevronRight, Sparkles, RotateCcw } from 'lucide-react'
import { useAudioTuning } from '../../hooks/useAudioTuning'
import { eqPresets, eqPresetOrder } from '../../data/eqPresets'
import type { EQBand, EQPresetId } from '../../types/audio'
import { Disclaimer, Label } from './SafeListenPanel'

const BANDS: { id: EQBand; label: string }[] = [
  { id: 'bass',          label: 'Bass'          },
  { id: 'lowMid',        label: 'Low Mid'       },
  { id: 'mid',           label: 'Mid'           },
  { id: 'presence',      label: 'Presence'      },
  { id: 'treble',        label: 'Treble'        },
  { id: 'stereoWidth',   label: 'Stereo Width'  },
  { id: 'warmth',        label: 'Warmth'        },
  { id: 'vocalClarity',  label: 'Vocal Clarity' },
]

interface Props { defaultOpen?: boolean }

function AudioTuningPanelImpl({ defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const { settings, update, smartPreset, activePreset, effectiveGains, setBand, resetCustomGains } = useAudioTuning()

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
        <Sliders size={13} aria-hidden style={{ color: 'var(--accent)' }} />
        <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          Audio Tuning
        </span>
        <span
          className="text-[9px] uppercase tracking-widest font-bold mr-1 truncate max-w-[7rem] text-right"
          style={{ color: 'var(--text-muted)' }}
        >
          {settings.smartEQ ? 'Smart' : activePreset.label}
        </span>
        <ChevronRight
          size={16} aria-hidden
          style={{ color: 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 220ms ease' }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 space-y-5" style={{ borderTop: '1px solid var(--border-soft)' }}>
          {/* Smart EQ */}
          <div className="flex items-start gap-3">
            <Sparkles size={14} style={{ color: 'var(--accent)', marginTop: 2 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Smart EQ</p>
              <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Picks a preset based on the song. Currently suggesting{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{smartPreset.label}</span>.
              </p>
            </div>
            <button
              role="switch" aria-checked={settings.smartEQ}
              onClick={() => update({ smartEQ: !settings.smartEQ })}
              className="relative shrink-0 rounded-full transition-colors"
              style={{ width: 36, height: 20, background: settings.smartEQ ? 'var(--accent)' : 'var(--border)' }}
              aria-label="Toggle Smart EQ"
            >
              <span
                className="absolute top-0.5 rounded-full transition-transform"
                style={{
                  width: 16, height: 16, left: 2,
                  transform: settings.smartEQ ? 'translateX(16px)' : 'translateX(0)',
                  background: 'var(--text-inverse, #fff)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              />
            </button>
          </div>

          {/* Preset chips */}
          <div>
            <Label>Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {eqPresetOrder.map(id => {
                const p = eqPresets[id]
                const isActive = !settings.smartEQ && settings.preset === id
                return (
                  <button
                    key={id}
                    onClick={() => update({ preset: id as EQPresetId, smartEQ: false })}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: isActive ? 'var(--text-primary)' : 'var(--glass-bg-medium, rgba(255,255,255,0.03))',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)',
                    }}
                    title={p.desc}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] italic mt-2" style={{ color: 'var(--text-muted)' }}>
              {activePreset.desc}
            </p>
          </div>

          {/* Bands */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Bands</Label>
              <button
                onClick={resetCustomGains}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>
            <div className="space-y-2.5">
              {BANDS.map(b => (
                <BandSlider
                  key={b.id}
                  label={b.label}
                  value={effectiveGains[b.id] ?? 0}
                  onChange={(v) => setBand(b.id, v - (eqPresets[activePreset.id].gains[b.id] ?? 0))}
                />
              ))}
            </div>
          </div>

          <Disclaimer>
            Audio tuning changes playback color but does not replace professional mastering.
            EQ and stereo controls are previewed visually in this build; real-time DSP is wired in a later release.
          </Disclaimer>
        </div>
      )}
    </div>
  )
}

export const AudioTuningPanel = memo(AudioTuningPanelImpl)
export default AudioTuningPanel

function BandSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  // value is normalised −1..+1; display as −12..+12 dB
  const db = Math.round(value * 12 * 10) / 10
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium w-[5.5rem] shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <input
        type="range"
        min={-1} max={1} step={0.02} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 appearance-none h-1 rounded-full"
        style={{
          background: `linear-gradient(to right, var(--border) 0%, var(--border) 50%, var(--accent) 50%, var(--accent) ${50 + value * 50}%, var(--border) ${50 + value * 50}%, var(--border) 100%)`,
          accentColor: 'var(--accent)',
        }}
        aria-label={`${label} ${db > 0 ? '+' : ''}${db} dB`}
      />
      <span
        className="text-[10px] tabular-nums w-10 text-right"
        style={{ color: db === 0 ? 'var(--text-muted)' : 'var(--text-primary)' }}
      >
        {db > 0 ? '+' : ''}{db.toFixed(1)} dB
      </span>
    </div>
  )
}
