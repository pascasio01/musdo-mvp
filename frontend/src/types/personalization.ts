/* MUSDO Curated Personalization — type definitions */

export type CuratedAuraPresetId =
  | 'bachata_amber' | 'midnight_noir' | 'rainy_nyc' | 'studio_gold'
  | 'deep_crimson' | 'blue_violet'   | 'dominican_nights'

export interface CuratedAuraPreset {
  id: CuratedAuraPresetId
  label: string
  /** One-line emotional descriptor — never marketing copy */
  desc: string
  /** Mirrors AuraConfig from lib/aura.tsx so we can write the same CSS vars */
  primary: string
  secondary: string
  glow: string
  pulseSpeed: string
  /** Three-swatch preview chip (used by the picker UI) */
  preview: [string, string, string]
}

/** Aura intensity now includes a fourth tier: Cinematic */
export type AuraIntensity = 'low' | 'medium' | 'high' | 'cinematic'

/** Motion style — premium MUSDO labels mapped onto theme.motionIntensity */
export type MotionStyle = 'minimal' | 'smooth' | 'atmospheric' | 'immersive'

/** Playback atmosphere — premium spatial vibe (mock — display + future DSP) */
export type PlaybackAtmosphereId =
  | 'intimate' | 'studio' | 'wide' | 'cinematic' | 'night_drive'

export interface PlaybackAtmosphere {
  id: PlaybackAtmosphereId
  label: string
  desc: string
  /** Mock spatial width (0..1) — surfaced for future DSP wiring */
  width: number
  /** Mock spatial depth (0..1) */
  depth: number
}

/** How the UI's emotional layer reacts (or doesn't) to the music */
export type AdaptiveMode =
  | 'static'    // hand-picked aura, never changes
  | 'song'     // delegate to genre/BPM detection (existing behaviour)
  | 'mood'      // react to song.mood specifically
  | 'time'      // react to time of day
  | 'cinematic' // full cinematic blend (song + time + cover, immersive motion)

/** Listening Personality — a curated *bundle* of personalization choices */
export type ListeningPersonalityId =
  | 'warm_listener' | 'studio_listener' | 'night_listener'
  | 'cinematic_listener' | 'dominican_nights'

export interface ListeningPersonality {
  id: ListeningPersonalityId
  label: string
  /** Two-line description shown in the picker */
  desc: string
  /** What gets applied when the user picks this personality */
  defaults: {
    auraPreset: CuratedAuraPresetId
    auraIntensity: AuraIntensity
    motionStyle: MotionStyle
    playbackAtmosphere: PlaybackAtmosphereId
    adaptiveMode: AdaptiveMode
    coverArtInfluence: number // 0..1
  }
}

export interface PersonalizationSettings {
  /** Either 'auto' (let song-detection decide) or a curated id */
  auraPreset: 'auto' | CuratedAuraPresetId
  auraIntensity: AuraIntensity
  motionStyle: MotionStyle
  playbackAtmosphere: PlaybackAtmosphereId
  /** 0..1 — how strongly album cover hues bias the aura */
  coverArtInfluence: number
  adaptiveMode: AdaptiveMode
  /** Currently selected personality (or null if user has customised) */
  personality: ListeningPersonalityId | null
  /** Has the user completed the emotional onboarding once? */
  onboardingCompleted: boolean
}
