/* MUSDO SafeListen™ — type definitions */

export type MaxVolumeCap = 0.6 | 0.7 | 0.8 | 0.9

export interface SafeListenSettings {
  /** Master switch for SafeListen */
  enabled: boolean
  /** Volume cap enforced when `enabled` is true */
  maxVolume: MaxVolumeCap
  /** Reduce harsh treble + cap volume more aggressively at night */
  nightListening: boolean
  /** EQ mock — soften 4kHz–8kHz harshness */
  reduceHarshHighs: boolean
  /** Periodic ear-rest reminders + softer dynamics */
  antiFatigue: boolean
  /** Mock loudness normalization across tracks */
  normalizeVolume: boolean
  /** Block sudden volume jumps on track change / user input */
  preventSuddenLoudness: boolean
  /** Soft cinematic crossfade between tracks (mock) */
  smoothTransitions: boolean
}

export type AwarenessProfile =
  | 'street' | 'conversation' | 'transit' | 'gym' | 'walk' | 'off'

export interface AwarenessSettings {
  /** Currently selected awareness profile (mock — no mic in MVP) */
  profile: AwarenessProfile
}
