import { mockSongs } from '../data/mockData'
import type { Song } from '../types'

/**
 * MUSVORA AI — the catalogue intelligence behind the single central entry point.
 *
 * HONESTY CONTRACT (see replit.md): MUSVORA AI may organize, surface and curate —
 * it never generates songs, never fabricates metrics, and never invents data.
 * Every session here is built ONLY from real catalogue fields that exist on the
 * songs: `bpm` and `genre` (present on every track) plus `mood` (a bonus when
 * present) and the user's real `favorites` / play `history`. Sessions expose
 * their true track count and real BPM range so nothing is overstated.
 */

export type SessionId =
  | 'focus'
  | 'study'
  | 'sleep'
  | 'restaurant'
  | 'driving'
  | 'gym'
  | 'event'

type Order = 'asc' | 'desc' | 'arc'

interface SessionConfig {
  id: SessionId
  label: string
  tagline: string
  /** Target tempo centre (BPM) the session curates around. */
  center: number
  /** How sharply tempo distance is penalised (higher = tighter band). */
  tightness: number
  /** Moods that earn a relevance bonus when present on a track. */
  moods: string[]
  /** Playback ordering of the final queue. */
  order: Order
  size: number
}

/** Ordered for display in the panel: calm → energetic. */
export const SESSIONS: SessionConfig[] = [
  { id: 'sleep',      label: 'Sleep',      tagline: 'Lo más suave de tu catálogo',      center: 90,  tightness: 1.2, moods: ['acoustic', 'emotional', 'sad', 'romantic', 'nostalgic'], order: 'asc',  size: 10 },
  { id: 'study',      label: 'Study',      tagline: 'Tempo bajo para concentrarte',     center: 100, tightness: 1.0, moods: ['acoustic', 'emotional', 'nostalgic', 'cinematic'],         order: 'asc',  size: 12 },
  { id: 'focus',      label: 'Focus',      tagline: 'Flujo constante, sin distracción',  center: 105, tightness: 1.0, moods: ['acoustic', 'cinematic', 'emotional'],                     order: 'asc',  size: 12 },
  { id: 'restaurant', label: 'Restaurant', tagline: 'Ambiente elegante y romántico',     center: 112, tightness: 0.9, moods: ['romantic', 'late_night', 'acoustic', 'nostalgic'],        order: 'asc',  size: 14 },
  { id: 'driving',    label: 'Driving',    tagline: 'Ritmo medio para la carretera',     center: 122, tightness: 0.9, moods: ['late_night', 'energetic', 'street', 'romantic'],         order: 'asc',  size: 14 },
  { id: 'gym',        label: 'Gym',        tagline: 'Lo más enérgico, primero',          center: 132, tightness: 1.1, moods: ['energetic', 'street'],                                    order: 'desc', size: 12 },
  { id: 'event',      label: 'Event',      tagline: 'Sube al pico y baja suave',          center: 115, tightness: 0.5, moods: [],                                                         order: 'arc',  size: 16 },
]

export interface BuiltSession {
  id: SessionId
  label: string
  tagline: string
  tracks: Song[]
  /** Real min/max BPM across the queue, or null when no track has a BPM. */
  bpmRange: [number, number] | null
  /** Honest one-line description of how the queue was built. */
  note: string
}

export interface AIContext {
  favoriteIds?: Set<string>
  historyIds?: Set<string>
}

function bpmOf(song: Song): number {
  return typeof song.bpm === 'number' ? song.bpm : 110
}

function scoreFor(song: Song, cfg: SessionConfig, ctx: AIContext): number {
  let s = 100 - Math.min(100, Math.abs(bpmOf(song) - cfg.center) * cfg.tightness)
  if (song.mood && cfg.moods.includes(String(song.mood))) s += 30
  if (ctx.favoriteIds?.has(song.id)) s += 12
  if (ctx.historyIds?.has(song.id)) s += 6
  if (song.human_verified) s += 3
  return s
}

function orderQueue(tracks: Song[], order: Order): Song[] {
  const asc = [...tracks].sort((a, b) => bpmOf(a) - bpmOf(b))
  if (order === 'asc') return asc
  if (order === 'desc') return asc.reverse()
  // arc: climb to the peak, then ease back down (warm-up → peak → wind-down)
  const rise = asc.filter((_, i) => i % 2 === 0)
  const fall = asc.filter((_, i) => i % 2 === 1).reverse()
  return [...rise, ...fall]
}

function bpmRangeOf(tracks: Song[]): [number, number] | null {
  const bpms = tracks.map(t => t.bpm).filter((b): b is number => typeof b === 'number')
  if (!bpms.length) return null
  return [Math.min(...bpms), Math.max(...bpms)]
}

/** Build a context session from the live catalogue. Always real, never padded with noise. */
export function buildSession(id: SessionId, ctx: AIContext = {}, catalog: Song[] = mockSongs): BuiltSession {
  const cfg = SESSIONS.find(s => s.id === id) ?? SESSIONS[0]
  const ranked = [...catalog]
    .map(song => ({ song, score: scoreFor(song, cfg, ctx) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, cfg.size)
    .map(r => r.song)

  const tracks = orderQueue(ranked, cfg.order)
  const bpmRange = bpmRangeOf(tracks)
  const note = bpmRange
    ? `${tracks.length} pistas · ${bpmRange[0]}–${bpmRange[1]} BPM · curado por tempo y mood`
    : `${tracks.length} pistas · curado por tempo y mood`

  return { id: cfg.id, label: cfg.label, tagline: cfg.tagline, tracks, bpmRange, note }
}

/** A genuine shuffle of the catalogue, lightly de-prioritising the last few plays. */
export function surpriseMe(ctx: AIContext = {}, catalog: Song[] = mockSongs): Song[] {
  const pool = [...catalog]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  if (ctx.historyIds && ctx.historyIds.size > 0) {
    pool.sort((a, b) => Number(ctx.historyIds!.has(a.id)) - Number(ctx.historyIds!.has(b.id)))
  }
  return pool
}

export interface MoodOption {
  mood: string
  label: string
  count: number
}

const MOOD_LABELS: Record<string, string> = {
  romantic: 'Romántico',
  amargue: 'Amargue',
  late_night: 'Late night',
  emotional: 'Emocional',
  sad: 'Triste',
  nostalgic: 'Nostálgico',
  street: 'Urbano',
  energetic: 'Enérgico',
  acoustic: 'Acústico',
  cinematic: 'Cinemático',
}

function moodLabel(mood: string): string {
  return MOOD_LABELS[mood] ?? mood.charAt(0).toUpperCase() + mood.slice(1)
}

/** Only moods that ACTUALLY exist in the catalogue, with real counts. */
export function availableMoods(catalog: Song[] = mockSongs): MoodOption[] {
  const counts = new Map<string, number>()
  for (const s of catalog) {
    if (!s.mood) continue
    const m = String(s.mood)
    counts.set(m, (counts.get(m) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([mood, count]) => ({ mood, label: moodLabel(mood), count }))
    .sort((a, b) => b.count - a.count)
}

export function songsByMood(mood: string, catalog: Song[] = mockSongs): Song[] {
  return catalog.filter(s => String(s.mood) === mood)
}

export { moodLabel }
