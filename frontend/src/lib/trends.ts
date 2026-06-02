import { mockSongs } from '../data/mockData'
import { plays } from './djCurator'
import type { Song } from '../types'

/**
 * MUSVORA Trend Intelligence — personal, behaviour-derived layer (Module 21).
 *
 * HONESTY CONTRACT (see replit.md): this engine never fabricates trends. It
 * derives ONLY from data that genuinely exists — real catalogue fields and the
 * signed-in user's real, resolved play history (distinct songs, most-recent
 * first). MUSVORA does NOT store repeat-play counts, so "on repeat" is not
 * computed here. Facets that need data we do not have — cross-user worldwide
 * aggregation, geography, language, growth-over-time, save/skip/completion
 * rates, scheduled refresh — are declared in PENDING_TREND_FACETS and surfaced
 * honestly in the UI, never faked.
 */

const releaseTs = (s: Song): number => {
  const t = Date.parse(s.created_at ?? '')
  return Number.isNaN(t) ? 0 : t
}

/**
 * Tracks the user has not played yet — the discovery surface that keeps the
 * experience fresh. Ranked by newest release, then real plays. With no history
 * this is simply the newest catalogue (still true: it is not in your history).
 */
export function freshForYou(history: Song[], limit = 8): Song[] {
  const played = new Set(history.map(s => s.id))
  return mockSongs
    .filter(s => !played.has(s.id))
    .sort((a, b) => releaseTs(b) - releaseTs(a) || plays(b) - plays(a) || a.id.localeCompare(b.id))
    .slice(0, limit)
}

export interface FacetCount {
  value: string
  count: number
}

function countBy(history: Song[], pick: (s: Song) => string | undefined): FacetCount[] {
  const map = new Map<string, number>()
  for (const s of history) {
    const v = pick(s)?.trim()
    if (!v) continue
    map.set(v, (map.get(v) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

/** The user's genre leanings, from songs they have actually played. */
export function yourGenres(history: Song[]): FacetCount[] {
  return countBy(history, s => s.genre)
}

/** The user's mood leanings, from songs they have actually played. */
export function yourMoods(history: Song[]): FacetCount[] {
  return countBy(history, s => (s.mood ? String(s.mood) : undefined))
}

/** Unplayed catalogue tracks in a genre the user already gravitates to. */
export function moreLikeGenre(history: Song[], genre: string, limit = 6): Song[] {
  const played = new Set(history.map(s => s.id))
  return mockSongs
    .filter(s => s.genre === genre && !played.has(s.id))
    .sort((a, b) => plays(b) - plays(a) || a.id.localeCompare(b.id))
    .slice(0, limit)
}

export interface PendingFacet {
  title: string
  note: string
}

/**
 * Trend facets from Module 21 that require infrastructure MUSVORA does not have
 * yet. Surfaced honestly so the roadmap is visible without faking any numbers.
 */
export const PENDING_TREND_FACETS: PendingFacet[] = [
  { title: 'Trending Worldwide & Near Me', note: 'Cross-user and regional ranking need a backend events table with location.' },
  { title: 'By Country / By Language', note: 'Tracks carry no country or language field yet — these would be fabricated today.' },
  { title: 'Fastest Growing', note: 'Growth needs play counts sampled over time, not a single static snapshot.' },
  { title: 'Save / Skip / Completion Rates', note: 'Requires server-side engagement events the app does not record yet.' },
  { title: 'Smart Refresh (hourly · daily · weekly)', note: 'Scheduled recompute needs live data and a backend job.' },
]
