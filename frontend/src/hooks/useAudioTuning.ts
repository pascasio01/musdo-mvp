import { useMemo } from 'react'
import { detectSmartPreset, useAudioIntelligence } from '../lib/audioIntelligence'
import { eqPresets } from '../data/eqPresets'
import { usePlayer } from '../lib/player'
import type {
  AudioTuningSettings, EQGains, EQBand, EQPreset, EQPresetId,
} from '../types/audio'

/**
 * Audio-tuning facade. Combines the persisted preset/Smart-EQ flag with the
 * currently playing track to surface the *effective* preset + merged gains.
 *
 * No DSP runs in MVP — these values are surfaced for the UI and future
 * AudioContext wiring.
 */
export function useAudioTuning(): {
  settings: AudioTuningSettings
  update: (patch: Partial<AudioTuningSettings>) => void
  /** Smart EQ's recommendation for the active song */
  smartPreset: EQPreset
  /** What's actually "active": Smart pick when smartEQ is on, else manual preset */
  activePreset: EQPreset
  /** Preset gains merged with user customGains, clamped to −1..+1 */
  effectiveGains: EQGains
  setBand: (band: EQBand, value: number) => void
  resetCustomGains: () => void
} {
  const { tuning, setTuning } = useAudioIntelligence()
  const { song } = usePlayer()

  const smartPreset = useMemo(() => eqPresets[detectSmartPreset(song)], [song?.id, song?.genre, song?.mood, song?.bpm, song?.audio_quality])
  const activePreset = tuning.smartEQ ? smartPreset : eqPresets[tuning.preset]

  const effectiveGains = useMemo<EQGains>(() => {
    const base = activePreset.gains
    const out = { ...base }
    for (const k of Object.keys(out) as EQBand[]) {
      const custom = tuning.customGains[k]
      if (typeof custom === 'number') {
        out[k] = Math.max(-1, Math.min(1, base[k] + custom))
      }
    }
    return out
  }, [activePreset, tuning.customGains])

  const setBand = (band: EQBand, value: number) => {
    setTuning({
      customGains: { ...tuning.customGains, [band]: Math.max(-1, Math.min(1, value)) },
      // Touching a band turns Smart EQ off so user gets predictable manual control.
      smartEQ: false,
      preset: tuning.smartEQ ? activePreset.id as EQPresetId : tuning.preset,
    })
  }

  const resetCustomGains = () => setTuning({ customGains: {} })

  return {
    settings: tuning, update: setTuning,
    smartPreset, activePreset, effectiveGains,
    setBand, resetCustomGains,
  }
}
