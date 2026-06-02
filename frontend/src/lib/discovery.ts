import { mockSongs } from '../data/mockData'
import type { Song } from '../types'
import { surpriseMe, trendingSongs, moodLabel } from './musvoraAI'

/**
 * MUSVORA Discovery Engine — emotional, contextual and AI-powered lenses over
 * the REAL catalogue.
 *
 * HONESTY CONTRACT (see replit.md AI rules): every lens is built ONLY from real
 * song fields that exist on the catalogue — `bpm` and `genre` (on every track),
 * `mood` (a bonus when present), real `analytics.emotional_engagement` /
 * `analytics.plays`, and the user's real favorites + play history. Lenses never
 * fabricate tracks or counts: a lens that resolves to zero real tracks is hidden,
 * and each lens exposes its true track count and real BPM range. Discovery
 * re-ranks and re-frames the catalogue — it never invents a larger library than
 * what actually exists.
 */

export type DiscoveryGroup = 'ai' | 'emotion' | 'context'

export interface DiscoveryContext {
  /** Real favorited song ids. */
  favoriteIds?: Set<string>
  /** Real play history, most-recent first. */
  history?: Song[]
}

export interface BuiltLens {
  id: string
  group: DiscoveryGroup
  label: string
  /** Honest one-line description of the lens. */
  blurb: string
  /** Lucide icon key resolved by the UI. */
  icon: string
  tracks: Song[]
  count: number
  /** Real min/max BPM across the queue, or null when no track has a BPM. */
  bpmRange: [number, number] | null
  /** Human label of the most common mood in the queue, when any track has one. */
  topMood?: string
  /** AI Picks only: false when there is not enough history to personalise. */
  personalized?: boolean
}

type Order = 'asc' | 'desc' | 'arc' | 'relevance'

interface LensConfig {
  id: string
  group: DiscoveryGroup
  label: string
  blurb: string
  icon: string
  /** Moods that earn a relevance bonus and qualify a track for the lens. */
  moods: string[]
  /** Tempo centre (BPM) the lens curates around. */
  center: number
  /** Half-width of the tempo band that qualifies a track (BPM). */
  band: number
  order: Order
  size: number
}

function bpmOf(song: Song): number {
  return typeof song.bpm === 'number' ? song.bpm : 110
}

function engagementOf(song: Song): number {
  return song.analytics?.emotional_engagement ?? 0
}

/** A track qualifies for a lens when its mood matches OR its tempo sits in band. */
function qualifies(song: Song, cfg: LensConfig): boolean {
  if (song.mood && cfg.moods.includes(String(song.mood))) return true
  return Math.abs(bpmOf(song) - cfg.center) <= cfg.band
}

/** Recency-weighted map of the user's real play history (most-recent first). */
function historyWeights(history: Song[] = []): Map<string, number> {
  const m = new Map<string, number>()
  history.slice(0, HISTORY_WINDOW).forEach((s, i) => {
    if (!m.has(s.id)) m.set(s.id, Math.max(2, 8 - i))
  })
  return m
}

function scoreFor(song: Song, cfg: LensConfig, ctx: DiscoveryContext, histW: Map<string, number>): number {
  const tempo = 100 - Math.min(100, (Math.abs(bpmOf(song) - cfg.center) / cfg.band) * 60)
  let s = tempo
  if (song.mood && cfg.moods.includes(String(song.mood))) s += 35
  if (ctx.favoriteIds?.has(song.id)) s += 12
  s += histW.get(song.id) ?? 0
  s += engagementOf(song) * 0.1
  if (song.human_verified) s += 3
  return s
}

function orderQueue(tracks: Song[], order: Order): Song[] {
  if (order === 'relevance') return tracks
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

function topMoodOf(tracks: Song[]): string | undefined {
  const counts = new Map<string, number>()
  for (const t of tracks) {
    if (!t.mood) continue
    const m = String(t.mood)
    counts.set(m, (counts.get(m) ?? 0) + 1)
  }
  let best: string | undefined
  let bestN = 0
  for (const [m, n] of counts) {
    if (n > bestN) { best = m; bestN = n }
  }
  return best ? moodLabel(best) : undefined
}

function pack(cfg: Pick<LensConfig, 'id' | 'group' | 'label' | 'blurb' | 'icon'>, tracks: Song[], personalized?: boolean): BuiltLens {
  return {
    id: cfg.id,
    group: cfg.group,
    label: cfg.label,
    blurb: cfg.blurb,
    icon: cfg.icon,
    tracks,
    count: tracks.length,
    bpmRange: bpmRangeOf(tracks),
    topMood: topMoodOf(tracks),
    personalized,
  }
}

/* ── Emotional + contextual lens definitions ─────────────────────────────────
 * Centres/bands/moods are deliberate curation rules over the REAL fields; they
 * are not metadata claims about the tracks. A lens only ever surfaces tracks
 * that genuinely qualify (see `qualifies`). */

const EMOTION_LENSES: LensConfig[] = [
  { id: 'heartbroken', group: 'emotion', label: 'Heartbroken', blurb: 'Lo más roto y honesto de tu catálogo', icon: 'HeartCrack', moods: ['sad', 'emotional'],              center: 96,  band: 16, order: 'asc',       size: 8 },
  { id: 'midnight',    group: 'emotion', label: 'Midnight',    blurb: 'Para las horas más oscuras',           icon: 'Moon',      moods: ['late_night'],                  center: 126, band: 8,  order: 'relevance', size: 8 },
  { id: 'nostalgia',   group: 'emotion', label: 'Nostalgia',   blurb: 'Lo que te lleva atrás',                icon: 'Hourglass', moods: ['nostalgic', 'sad', 'romantic'], center: 108, band: 20, order: 'asc',       size: 8 },
  { id: 'motivation',  group: 'emotion', label: 'Motivation',  blurb: 'Tempo alto para empujarte',            icon: 'Flame',     moods: ['energetic', 'street'],          center: 130, band: 10, order: 'desc',      size: 8 },
  { id: 'focus',       group: 'emotion', label: 'Focus',       blurb: 'Flujo constante, sin distracción',     icon: 'Target',    moods: ['acoustic', 'emotional'],        center: 100, band: 12, order: 'asc',       size: 8 },
  { id: 'relax',       group: 'emotion', label: 'Relax',       blurb: 'Lo más suave, primero',                icon: 'Waves',     moods: ['acoustic', 'romantic'],         center: 90,  band: 12, order: 'asc',       size: 8 },
  { id: 'romance',     group: 'emotion', label: 'Romance',     blurb: 'Romántico, de cerca',                  icon: 'Heart',     moods: ['romantic'],                     center: 112, band: 10, order: 'relevance', size: 8 },
  { id: 'energy',      group: 'emotion', label: 'Energy',      blurb: 'Lo más enérgico de tu catálogo',       icon: 'Zap',       moods: ['energetic', 'street'],          center: 132, band: 8,  order: 'desc',      size: 8 },
]

const CONTEXT_LENSES: LensConfig[] = [
  { id: 'driving-night',  group: 'context', label: 'Driving At Night', blurb: 'Ritmo medio para la carretera de noche', icon: 'Car',        moods: ['late_night'],            center: 124, band: 8,  order: 'relevance', size: 8 },
  { id: 'after-work',     group: 'context', label: 'After Work',       blurb: 'Para bajar revoluciones',                icon: 'Sunset',     moods: ['romantic', 'acoustic'],  center: 100, band: 14, order: 'asc',       size: 8 },
  { id: 'cooking',        group: 'context', label: 'Cooking',          blurb: 'Buen ambiente en la cocina',             icon: 'CookingPot', moods: ['romantic', 'street'],    center: 118, band: 14, order: 'relevance', size: 8 },
  { id: 'cleaning',       group: 'context', label: 'Cleaning',         blurb: 'Energía para moverte',                   icon: 'Sparkles',   moods: ['energetic', 'street'],   center: 128, band: 10, order: 'desc',      size: 8 },
  { id: 'studying',       group: 'context', label: 'Studying',         blurb: 'Tempo bajo para concentrarte',           icon: 'BookOpen',   moods: ['acoustic', 'emotional'], center: 98,  band: 12, order: 'asc',       size: 8 },
  { id: 'sunday-morning', group: 'context', label: 'Sunday Morning',   blurb: 'Suave para empezar el día',              icon: 'Coffee',     moods: ['romantic', 'acoustic'],  center: 90,  band: 12, order: 'asc',       size: 8 },
  { id: 'rain-coffee',    group: 'context', label: 'Rain And Coffee',  blurb: 'Lluvia, taza y emoción',                 icon: 'CloudRain',  moods: ['sad', 'emotional'],      center: 94,  band: 14, order: 'asc',       size: 8 },
  { id: 'long-trip',      group: 'context', label: 'Long Trip',        blurb: 'Sube al pico y baja suave',              icon: 'Map',        moods: [],                        center: 112, band: 40, order: 'arc',       size: 12 },
]

function buildLens(cfg: LensConfig, ctx: DiscoveryContext, histW: Map<string, number>, catalog: Song[]): BuiltLens | null {
  const matched = catalog.filter(s => qualifies(s, cfg))
  if (!matched.length) return null
  const ranked = matched
    .map(song => ({ song, score: scoreFor(song, cfg, ctx, histW) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, cfg.size)
    .map(r => r.song)
  return pack(cfg, orderQueue(ranked, cfg.order))
}

/* ── AI Picks ────────────────────────────────────────────────────────────── */

const HISTORY_WINDOW = 12

function centroid(songs: Song[]): { bpm: number; moods: Set<string> } {
  const bpms = songs.map(bpmOf)
  const bpm = bpms.length ? bpms.reduce((a, b) => a + b, 0) / bpms.length : 110
  const moods = new Set<string>()
  for (const s of songs) if (s.mood) moods.add(String(s.mood))
  return { bpm, moods }
}

function aiSurpriseMe(ctx: DiscoveryContext, catalog: Song[]): BuiltLens {
  const historyIds = new Set((ctx.history ?? []).map(s => s.id))
  const tracks = surpriseMe({ historyIds }, catalog)
  return pack(
    { id: 'surprise-me', group: 'ai', label: 'Surprise Me', blurb: 'Una mezcla nueva de todo tu catálogo', icon: 'Shuffle' },
    tracks,
    true,
  )
}

function aiNextObsession(ctx: DiscoveryContext, catalog: Song[]): BuiltLens {
  const historyIds = new Set((ctx.history ?? []).map(s => s.id))
  const fresh = catalog.filter(s => !historyIds.has(s.id))
  const pool = fresh.length ? fresh : catalog
  const tracks = [...pool].sort(
    (a, b) => engagementOf(b) - engagementOf(a) || (b.analytics?.plays ?? 0) - (a.analytics?.plays ?? 0),
  )
  return pack(
    { id: 'next-obsession', group: 'ai', label: 'Your Next Obsession', blurb: 'Lo de mayor enganche que aún no escuchas', icon: 'Sparkle' },
    tracks,
    fresh.length > 0,
  )
}

function aiBasedOnYourWeek(ctx: DiscoveryContext, catalog: Song[]): BuiltLens {
  const recent = (ctx.history ?? []).slice(0, HISTORY_WINDOW)
  if (!recent.length) {
    return pack(
      { id: 'based-on-week', group: 'ai', label: 'Based On Your Week', blurb: 'Aún sin historial — lo más escuchado de tu catálogo', icon: 'CalendarDays' },
      trendingSongs(catalog),
      false,
    )
  }
  const c = centroid(recent)
  const tracks = [...catalog]
    .map(song => {
      const tempo = 100 - Math.min(100, Math.abs(bpmOf(song) - c.bpm) * 0.8)
      const moodBonus = song.mood && c.moods.has(String(song.mood)) ? 30 : 0
      return { song, score: tempo + moodBonus + engagementOf(song) * 0.1 }
    })
    .sort((a, b) => b.score - a.score)
    .map(r => r.song)
  return pack(
    { id: 'based-on-week', group: 'ai', label: 'Based On Your Week', blurb: 'Afinado a lo que escuchaste últimamente', icon: 'CalendarDays' },
    tracks,
    true,
  )
}

function aiSomethingDifferent(ctx: DiscoveryContext, catalog: Song[]): BuiltLens {
  const recent = (ctx.history ?? []).slice(0, HISTORY_WINDOW)
  const anchor = recent.length ? centroid(recent) : centroid(trendingSongs(catalog).slice(0, 1))
  const tracks = [...catalog]
    .map(song => {
      const distance = Math.abs(bpmOf(song) - anchor.bpm)
      const moodAway = song.mood && anchor.moods.has(String(song.mood)) ? 0 : 25
      return { song, score: distance + moodAway }
    })
    .sort((a, b) => b.score - a.score)
    .map(r => r.song)
  return pack(
    { id: 'something-different', group: 'ai', label: 'Something Different', blurb: 'Lo más lejano a tu costumbre', icon: 'Compass' },
    tracks,
    recent.length > 0,
  )
}

export interface Discovery {
  ai: BuiltLens[]
  emotion: BuiltLens[]
  context: BuiltLens[]
}

/** Build the full discovery surface from the live catalogue + real user context. */
export function buildDiscovery(ctx: DiscoveryContext = {}, catalog: Song[] = mockSongs): Discovery {
  const histW = historyWeights(ctx.history)

  const ai = [
    aiSurpriseMe(ctx, catalog),
    aiNextObsession(ctx, catalog),
    aiBasedOnYourWeek(ctx, catalog),
    aiSomethingDifferent(ctx, catalog),
  ].filter(l => l.count > 0)

  const emotion = EMOTION_LENSES.map(c => buildLens(c, ctx, histW, catalog)).filter((l): l is BuiltLens => l !== null)
  const context = CONTEXT_LENSES.map(c => buildLens(c, ctx, histW, catalog)).filter((l): l is BuiltLens => l !== null)

  return { ai, emotion, context }
}
