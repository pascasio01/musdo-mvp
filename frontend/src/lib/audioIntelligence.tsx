import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, ReactNode,
} from 'react'
import type {
  AudioTuningSettings, EQPresetId, ListeningEnvironmentId, SpatialModeId,
} from '../types/audio'
import type {
  SafeListenSettings, AwarenessSettings, AwarenessProfile, MaxVolumeCap,
} from '../types/audioSafety'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePlayer } from './player'
import { useToast } from './toast'
import type { Song } from '../types'

/**
 * MUSDO Audio Intelligence — single source of truth for SafeListen, EQ, and
 * Spatial settings. Sits inside <PlayerProvider> so the embedded enforcer can
 * read/write the canonical volume from the global player without forking
 * audio state.
 *
 * IMPORTANT — MVP boundaries:
 *  - No AudioContext is created. EQ / spatial values are persisted and
 *    surfaced for future DSP wiring; they do NOT alter playback today.
 *  - The only thing actually applied to playback is the volume cap from
 *    SafeListen (delegated to PlayerProvider.setVolume).
 *  - No microphone, no motion sensors, no GPS — all such features are mock
 *    toggles whose values exist purely for UI + future enablement.
 */

// ── Defaults ──────────────────────────────────────────────────────────

export const defaultSafeListen: SafeListenSettings = {
  enabled: true,
  maxVolume: 0.85 as MaxVolumeCap, // close to 0.9 in default — gentle, not nanny
  nightListening: false,
  reduceHarshHighs: false,
  antiFatigue: true,
  normalizeVolume: true,
  preventSuddenLoudness: true,
  smoothTransitions: true,
}
// SafeListen's typed cap can only be one of {0.6, 0.7, 0.8, 0.9}; clamp default to 0.9
defaultSafeListen.maxVolume = 0.9

export const defaultTuning: AudioTuningSettings = {
  preset: 'studio_flat',
  smartEQ: true,
  customGains: {},
  outputDevice: 'speakers',
}

export const defaultSpatial = {
  enabled: false,
  mode: 'studio' as SpatialModeId,
  environment: 'quiet_room' as ListeningEnvironmentId,
}

export const defaultAwareness: AwarenessSettings = { profile: 'off' }

// ── Smart EQ heuristic ────────────────────────────────────────────────

export function detectSmartPreset(song: Song | null | undefined): EQPresetId {
  if (!song) return 'studio_flat'
  const g = (song.genre ?? '').toLowerCase()
  const m = (song.mood ?? '').toLowerCase()
  const bpm = song.bpm ?? 100
  const q = song.audio_quality

  if (q === 'master_wav' || q === 'lossless_flac') return 'mastering_check'
  if (m.includes('sad') || m.includes('nostalgic') || m.includes('amargue') || m.includes('romantic')) return 'soft_romantic'
  if (g.includes('bachata') && bpm < 120) return 'bachata_warm'
  if (g.includes('urban') || g.includes('trap') || g.includes('reggaeton')) return 'deep_bass'
  if (g.includes('acoustic') || g.includes('folk') || g.includes('bossa')) return 'acoustic_room'
  if (m.includes('cinematic')) return 'studio_flat'
  if (bpm > 130) return 'live_stage'
  return 'bachata_warm'
}

// ── Context ───────────────────────────────────────────────────────────

interface Ctx {
  safe: SafeListenSettings
  setSafe: (p: Partial<SafeListenSettings>) => void
  tuning: AudioTuningSettings
  setTuning: (p: Partial<AudioTuningSettings>) => void
  spatial: typeof defaultSpatial
  setSpatial: (p: Partial<typeof defaultSpatial>) => void
  awareness: AwarenessSettings
  setAwareness: (p: Partial<AwarenessSettings>) => void
}

const AudioCtx = createContext<Ctx | undefined>(undefined)

export function AudioIntelligenceProvider({ children }: { children: ReactNode }) {
  const [safe, setSafeRaw] = useLocalStorage<SafeListenSettings>('musdo-safelisten-v1', defaultSafeListen)
  const [tuning, setTuningRaw] = useLocalStorage<AudioTuningSettings>('musdo-tuning-v1', defaultTuning)
  const [spatial, setSpatialRaw] = useLocalStorage('musdo-spatial-v1', defaultSpatial)
  const [awareness, setAwarenessRaw] = useLocalStorage<AwarenessSettings>('musdo-awareness-v1', defaultAwareness)

  const setSafe      = useCallback((p: Partial<SafeListenSettings>)      => setSafeRaw(prev => ({ ...prev, ...p })), [setSafeRaw])
  const setTuning    = useCallback((p: Partial<AudioTuningSettings>)    => setTuningRaw(prev => ({ ...prev, ...p })), [setTuningRaw])
  const setSpatial   = useCallback((p: Partial<typeof defaultSpatial>)  => setSpatialRaw(prev => ({ ...prev, ...p })), [setSpatialRaw])
  const setAwareness = useCallback((p: Partial<AwarenessSettings>)      => setAwarenessRaw(prev => ({ ...prev, ...p })), [setAwarenessRaw])

  const value = useMemo<Ctx>(() => ({
    safe, setSafe, tuning, setTuning, spatial, setSpatial, awareness, setAwareness,
  }), [safe, setSafe, tuning, setTuning, spatial, setSpatial, awareness, setAwareness])

  return (
    <AudioCtx.Provider value={value}>
      <SafeListenEnforcer />
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudioIntelligence(): Ctx {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudioIntelligence must be inside AudioIntelligenceProvider')
  return ctx
}

// ── SafeListen enforcer — the only piece that actually touches playback ──

const FATIGUE_THRESHOLD_S = 45 * 60     // 45 min of loud listening
const LOUD_VOLUME_GATE    = 0.7
const TOAST_COOLDOWN_MS   = 30_000      // don't spam volume-cap toast

function SafeListenEnforcer() {
  const { safe } = useAudioIntelligence()
  const { volume, isPlaying, setVolume, song } = usePlayer()
  const toast = useToast()

  const lastToastAt = useRef(0)
  const loudSeconds = useRef(0)
  const fatigueWarned = useRef(false)
  const lastSongIdRef = useRef<string | null>(null)
  const lastVolumeRef = useRef(volume)

  // 1) Volume-cap enforcement.  Triggered any time volume rises above the cap.
  useEffect(() => {
    if (!safe.enabled) return
    const cap = safe.nightListening ? Math.min(safe.maxVolume, 0.7) : safe.maxVolume
    if (volume > cap + 0.001) {
      setVolume(cap)
      const now = Date.now()
      if (now - lastToastAt.current > TOAST_COOLDOWN_MS) {
        lastToastAt.current = now
        toast.info('Volume softened for safer listening.')
      }
    }
  }, [volume, safe.enabled, safe.maxVolume, safe.nightListening, setVolume, toast])

  // 2) Prevent sudden loudness jumps on track change (mock — clamp delta).
  useEffect(() => {
    if (!safe.preventSuddenLoudness || !safe.enabled) return
    const prevId = lastSongIdRef.current
    const newId = song?.id ?? null
    if (prevId !== newId) {
      lastSongIdRef.current = newId
      // If volume was raised abruptly between songs, soften it.
      const prevVol = lastVolumeRef.current
      if (volume - prevVol > 0.3) {
        setVolume(Math.min(volume, prevVol + 0.15))
      }
    }
    lastVolumeRef.current = volume
  }, [song?.id, volume, safe.preventSuddenLoudness, safe.enabled, setVolume])

  // 3) Anti-fatigue: track loud-listening seconds, warn once at threshold.
  useEffect(() => {
    if (!safe.enabled || !safe.antiFatigue) return
    if (!isPlaying || volume < LOUD_VOLUME_GATE) return
    const id = window.setInterval(() => {
      loudSeconds.current += 1
      if (!fatigueWarned.current && loudSeconds.current >= FATIGUE_THRESHOLD_S) {
        fatigueWarned.current = true
        toast.info('Your ears may need a short rest.')
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [isPlaying, volume, safe.enabled, safe.antiFatigue, toast])

  // 4) Reset fatigue counter when SafeListen toggled or anti-fatigue cycled.
  useEffect(() => {
    loudSeconds.current = 0
    fatigueWarned.current = false
  }, [safe.enabled, safe.antiFatigue])

  return null
}

// Re-export the awareness profile type for consumers
export type { AwarenessProfile }
