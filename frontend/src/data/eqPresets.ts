import type { EQPreset, EQPresetId, EQGains } from '../types/audio'

const z: EQGains = { bass: 0, lowMid: 0, mid: 0, presence: 0, treble: 0, stereoWidth: 0, warmth: 0, vocalClarity: 0 }

export const eqPresets: Record<EQPresetId, EQPreset> = {
  studio_flat: {
    id: 'studio_flat', label: 'Studio Flat',
    desc: 'Reference response. The track as the engineer left it.',
    gains: { ...z },
  },
  bachata_warm: {
    id: 'bachata_warm', label: 'Bachata Warm',
    desc: 'Honeyed lows, intimate vocals, silky guitars.',
    gains: { ...z, bass: 0.25, lowMid: 0.18, presence: 0.12, warmth: 0.4, vocalClarity: 0.2 },
  },
  vocal_clarity: {
    id: 'vocal_clarity', label: 'Vocal Clarity',
    desc: 'Push the singer forward without losing the room.',
    gains: { ...z, mid: 0.18, presence: 0.32, vocalClarity: 0.5, treble: 0.1 },
  },
  night_drive: {
    id: 'night_drive', label: 'Night Drive',
    desc: 'Cinematic late-night listening. Soft top-end, deep floor.',
    gains: { ...z, bass: 0.35, lowMid: 0.1, treble: -0.15, warmth: 0.3 },
  },
  deep_bass: {
    id: 'deep_bass', label: 'Deep Bass',
    desc: 'Sub-heavy. For urban, trap, and reggaeton bachata.',
    gains: { ...z, bass: 0.55, lowMid: 0.25, treble: -0.05 },
  },
  acoustic_room: {
    id: 'acoustic_room', label: 'Acoustic Room',
    desc: 'Wood, air, and breath. Folk and bossa territory.',
    gains: { ...z, mid: 0.15, presence: 0.2, treble: 0.18, warmth: 0.25, stereoWidth: 0.2 },
  },
  live_stage: {
    id: 'live_stage', label: 'Live Stage',
    desc: 'Energy and crowd width. For high-BPM moments.',
    gains: { ...z, bass: 0.3, presence: 0.25, treble: 0.15, stereoWidth: 0.45 },
  },
  soft_romantic: {
    id: 'soft_romantic', label: 'Soft Romantic',
    desc: 'Tender, hushed, late-night intimacy.',
    gains: { ...z, lowMid: 0.15, presence: 0.18, warmth: 0.45, vocalClarity: 0.3, treble: -0.1 },
  },
  mastering_check: {
    id: 'mastering_check', label: 'Mastering Check',
    desc: 'Slightly hot top-end to expose harshness and de-essing issues.',
    gains: { ...z, presence: 0.2, treble: 0.25, vocalClarity: 0.15 },
  },
}

export const eqPresetOrder: EQPresetId[] = [
  'studio_flat', 'bachata_warm', 'soft_romantic', 'vocal_clarity',
  'night_drive', 'deep_bass', 'acoustic_room', 'live_stage', 'mastering_check',
]
