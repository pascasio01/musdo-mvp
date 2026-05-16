import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useMusicAura } from './aura'
import { useTheme } from './theme'
import { usePlayer } from './player'
import {
  curatedAuraPresets, moodToCuratedPreset, timeOfDayToCuratedPreset,
} from '../data/auraPresets'
import type {
  PersonalizationSettings, AdaptiveMode, AuraIntensity, MotionStyle,
  CuratedAuraPresetId, ListeningPersonalityId,
} from '../types/personalization'
import { listeningPersonalities } from '../data/listeningPersonalities'

/**
 * MUSDO Curated Personalization Engine.
 *
 * Sits *on top of* the existing Theme + Aura systems — never replaces them.
 *
 *  - When `adaptiveMode === 'song'` we delegate aura output to the existing
 *    `MusicAuraProvider` (genre/BPM detection in lib/aura.tsx).
 *  - For every other mode we own the `--aura-*` CSS vars: the curated effect
 *    re-fires on **every** song change (via the SongBridge tick) so we always
 *    write *after* MusicAuraProvider on the same commit. No race, no flicker.
 *  - Motion style is mapped onto the existing `theme.motionIntensity` +
 *    `cinematicMode` knobs so we never fork the design system.
 *
 * Perf: this provider does NOT subscribe to `usePlayer()` directly (which
 * ticks on every progress update). A tiny child component <SongBridge> reads
 * the player and forwards only `{id, mood}` changes via state — so the
 * provider re-renders only when the *song* changes, not on every tick.
 */

// ── Defaults ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'musdo-personalization-v1'

export const defaultPersonalization: PersonalizationSettings = {
  auraPreset: 'auto',
  auraIntensity: 'medium',
  motionStyle: 'smooth',
  playbackAtmosphere: 'studio',
  coverArtInfluence: 0.35,
  adaptiveMode: 'song',
  personality: null,
  onboardingCompleted: false,
}

// ── Context ───────────────────────────────────────────────────────────

interface Ctx {
  settings: PersonalizationSettings
  /** Patch one or more fields. Clears `personality` to null (marks Custom) */
  update: (patch: Partial<PersonalizationSettings>) => void
  /** Apply a Listening Personality bundle atomically */
  applyPersonality: (id: ListeningPersonalityId) => void
  /** Reset everything to defaults (used by onboarding restart) */
  reset: () => void
  /** Currently resolved aura preset id (if not delegating to song-aura) */
  resolvedPresetId: CuratedAuraPresetId | null
}

const PersonalizationCtx = createContext<Ctx | undefined>(undefined)

// ── Helpers ──────────────────────────────────────────────────────────

const intensityScale: Record<AuraIntensity, number> = {
  low: 0.55, medium: 1, high: 1.7, cinematic: 2.5,
}

/** Map MUSDO motion style → existing theme knobs (no design-system fork) */
const motionStyleMap: Record<MotionStyle, { motionIntensity: 'reduced' | 'normal' | 'expressive'; cinematicMode: boolean; ambientAnimation: boolean }> = {
  minimal:      { motionIntensity: 'reduced',    cinematicMode: false, ambientAnimation: false },
  smooth:       { motionIntensity: 'normal',     cinematicMode: false, ambientAnimation: true  },
  atmospheric:  { motionIntensity: 'expressive', cinematicMode: false, ambientAnimation: true  },
  immersive:    { motionIntensity: 'expressive', cinematicMode: true,  ambientAnimation: true  },
}

/** Scale an `rgba(r,g,b,a)` string's alpha channel by `factor` (clamped 0..1) */
function scaleAlpha(rgba: string, factor: number): string {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i.exec(rgba)
  if (!m) return rgba
  const [, r, g, b, a = '1'] = m
  const next = Math.max(0, Math.min(1, parseFloat(a) * factor))
  return `rgba(${r},${g},${b},${next.toFixed(3)})`
}

interface SongSnapshot { id: string | null; mood: string | null }

// ── Provider ─────────────────────────────────────────────────────────

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<PersonalizationSettings>(
    STORAGE_KEY, defaultPersonalization,
  )
  const aura = useMusicAura()
  const theme = useTheme()

  // Song state pushed in by <SongBridge> so the provider doesn't re-render
  // on every player progress tick (only when the *song itself* changes).
  const [songSnap, setSongSnap] = useState<SongSnapshot>({ id: null, mood: null })

  // ── Setters ──────────────────────────────────────────────────────────

  const update = useCallback((patch: Partial<PersonalizationSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...patch,
      // Touching anything besides `personality` itself clears the personality
      // selection so the UI shows "Custom" rather than lying.
      personality: 'personality' in patch ? patch.personality ?? null : null,
    }))
  }, [setSettings])

  const applyPersonality = useCallback((id: ListeningPersonalityId) => {
    const p = listeningPersonalities[id]
    if (!p) return
    setSettings(prev => ({
      ...prev,
      ...p.defaults,
      personality: id,
      onboardingCompleted: true,
    }))
  }, [setSettings])

  const reset = useCallback(() => setSettings(defaultPersonalization), [setSettings])

  // ── Resolve which curated preset to apply (or null = delegate) ──────

  const resolvedPresetId = useMemo<CuratedAuraPresetId | null>(() => {
    if (settings.adaptiveMode === 'song') return null
    if (settings.adaptiveMode === 'static') {
      return settings.auraPreset === 'auto' ? null : settings.auraPreset
    }
    if (settings.adaptiveMode === 'mood')  return moodToCuratedPreset(songSnap.mood)
    if (settings.adaptiveMode === 'time')  return timeOfDayToCuratedPreset()
    if (settings.adaptiveMode === 'cinematic') {
      // Cinematic blend: prefer mood when there's a song, else time of day
      return songSnap.mood ? moodToCuratedPreset(songSnap.mood) : timeOfDayToCuratedPreset()
    }
    return null
  }, [settings.adaptiveMode, settings.auraPreset, songSnap.id, songSnap.mood])

  // ── Suppress MusicAuraProvider when we own the aura output ──────────
  // Track the user's "real" aura.enabled so we can restore it when the user
  // returns to song-mode without forcing it on if they had toggled aura off.
  const userAuraEnabledRef = useRef<boolean>(aura.auraSettings.enabled)
  useEffect(() => {
    // Only mirror externally-driven changes (when WE aren't the cause)
    if (settings.adaptiveMode === 'song') {
      userAuraEnabledRef.current = aura.auraSettings.enabled
    }
  }, [aura.auraSettings.enabled, settings.adaptiveMode])

  useEffect(() => {
    const ownsAura = settings.adaptiveMode !== 'song' && resolvedPresetId !== null
    const desired = ownsAura ? false : userAuraEnabledRef.current
    if (aura.auraSettings.enabled !== desired) {
      aura.updateAuraSettings({ enabled: desired })
    }
    // We intentionally exclude `aura` to avoid a feedback loop — we react to
    // *our* mode/preset changes, never to aura's own enabled flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.adaptiveMode, resolvedPresetId])

  // ── Apply CSS vars for curated aura output ──────────────────────────
  // Re-fires on song change (via songSnap.id) AND on every preset/intensity
  // change, guaranteeing we write *after* MusicAuraProvider on the same
  // commit (depth-first effect ordering + matching dep set).
  useEffect(() => {
    if (resolvedPresetId == null) return            // delegating to song-aura
    if (!aura.auraSettings.enabled && settings.adaptiveMode === 'song') return
    const root = document.documentElement
    const preset = curatedAuraPresets[resolvedPresetId]
    const scale = intensityScale[settings.auraIntensity]
    root.style.setProperty('--aura-primary',   scaleAlpha(preset.primary,   scale))
    root.style.setProperty('--aura-secondary', scaleAlpha(preset.secondary, scale))
    root.style.setProperty('--aura-glow',      scaleAlpha(preset.glow,      scale))
    root.style.setProperty('--aura-pulse',     preset.pulseSpeed)
    root.style.setProperty('--cover-influence', settings.coverArtInfluence.toFixed(2))
  }, [resolvedPresetId, settings.auraIntensity, settings.coverArtInfluence, settings.adaptiveMode, songSnap.id, aura.auraSettings.enabled])

  // ── Sync motion style → theme provider ──────────────────────────────

  useEffect(() => {
    const m = motionStyleMap[settings.motionStyle]
    // We never flip `reduceMotion` on the user's behalf — accessibility wins.
    theme.updateSettings({
      motionIntensity:   m.motionIntensity,
      cinematicMode:     m.cinematicMode,
      ambientAnimation:  m.ambientAnimation,
    })
    // theme.updateSettings is a fresh closure each render but we only want
    // to react to motionStyle changes, not to upstream theme rerenders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.motionStyle])

  // ── Surface playback atmosphere to a CSS var (for future DSP) ───────

  useEffect(() => {
    document.documentElement.dataset.atmosphere = settings.playbackAtmosphere
  }, [settings.playbackAtmosphere])

  const value = useMemo<Ctx>(() => ({
    settings, update, applyPersonality, reset, resolvedPresetId,
  }), [settings, update, applyPersonality, reset, resolvedPresetId])

  return (
    <PersonalizationCtx.Provider value={value}>
      <SongBridge onChange={setSongSnap} />
      {children}
    </PersonalizationCtx.Provider>
  )
}

/**
 * Internal — subscribes to the player and forwards only the song id+mood.
 * Renders nothing. Lives outside the context provider's value memo so its
 * frequent re-renders (one per player tick) don't propagate to consumers.
 */
function SongBridge({ onChange }: { onChange: (s: SongSnapshot) => void }) {
  const { song } = usePlayer()
  const lastIdRef = useRef<string | null>(null)
  const lastMoodRef = useRef<string | null>(null)
  useEffect(() => {
    const id = song?.id ?? null
    const mood = (song?.mood as string | undefined) ?? null
    if (id !== lastIdRef.current || mood !== lastMoodRef.current) {
      lastIdRef.current = id
      lastMoodRef.current = mood
      onChange({ id, mood })
    }
  }, [song?.id, song?.mood, onChange])
  return null
}

export function usePersonalization(): Ctx {
  const ctx = useContext(PersonalizationCtx)
  if (!ctx) throw new Error('usePersonalization must be inside PersonalizationProvider')
  return ctx
}
