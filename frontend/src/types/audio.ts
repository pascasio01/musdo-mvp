/* MUSDO Audio Intelligence — type definitions for EQ + Spatial systems */

export type EQPresetId =
  | 'studio_flat' | 'bachata_warm' | 'vocal_clarity' | 'night_drive'
  | 'deep_bass' | 'acoustic_room' | 'live_stage' | 'soft_romantic'
  | 'mastering_check'

export type EQBand =
  | 'bass' | 'lowMid' | 'mid' | 'presence' | 'treble'
  | 'stereoWidth' | 'warmth' | 'vocalClarity'

/** Each band value is normalised −1..+1 (display as −12..+12 dB to user) */
export type EQGains = Record<EQBand, number>

export interface EQPreset {
  id: EQPresetId
  label: string
  /** One-line poetic description shown in the UI */
  desc: string
  gains: EQGains
}

export interface AudioTuningSettings {
  /** Currently active preset (used when smartEQ is OFF) */
  preset: EQPresetId
  /** Smart EQ chooses preset based on song genre/mood/BPM/quality */
  smartEQ: boolean
  /** User overrides applied on top of preset (additive, normalised) */
  customGains: Partial<EQGains>
  /** Mock — connected output (auto-detection comes later) */
  outputDevice: 'speakers' | 'wired' | 'bluetooth' | 'airpods'
}

/* ── Listening Profiles ───────────────────────────────────────── */

export type ListeningProfileId =
  | 'quiet_room' | 'street' | 'subway' | 'car'
  | 'gym' | 'night' | 'studio_check'

export interface ListeningProfile {
  id: ListeningProfileId
  label: string
  desc: string
  volumeLimit: number       // 0..1
  bassSafety: number        // 0..1, lower = more bass softening
  trebleSoftness: number    // 0..1
  awarenessLevel: number    // 0..1
  compression: number       // 0..1 (mock)
  fatigueProtection: number // 0..1
}

/* ── Spatial Listening ────────────────────────────────────────── */

export type SpatialModeId =
  | 'intimate' | 'wide' | 'cinematic' | 'studio' | 'live_room'

export interface SpatialMode {
  id: SpatialModeId
  label: string
  desc: string
  width: number       // 0..1 (mock)
  depth: number       // 0..1 (mock)
}

export type ListeningEnvironmentId =
  | 'quiet_room' | 'nyc_street' | 'subway' | 'car_ride' | 'airplane'
  | 'gym' | 'studio_session' | 'night_listening' | 'rainy_night'

export interface ListeningEnvironment {
  id: ListeningEnvironmentId
  label: string
  desc: string
  eqSoftness: number       // 0..1
  spatialWidth: number     // 0..1
  vocalClarity: number     // 0..1
  awarenessLevel: number   // 0..1
  bassIntensity: number    // 0..1
  compression: number      // 0..1 (mock)
}

export interface SpatialSettings {
  enabled: boolean
  mode: SpatialModeId
  environment: ListeningEnvironmentId
}

/* ── Future: motion + headphone adaptation (mock placeholders) ── */

export type MotionState = 'still' | 'walking' | 'transit' | 'unknown'

export interface DeviceInfo {
  type: 'speakers' | 'wired' | 'bluetooth' | 'airpods' | 'unknown'
  /** Display name if known (e.g. "AirPods Pro") */
  name?: string
}
