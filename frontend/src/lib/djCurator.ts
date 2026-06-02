import { mockSongs } from '../data/mockData'
import type { Song } from '../types'

/**
 * AI DJ Complace — real catalogue curation layer.
 *
 * Every selector here derives strictly from real catalogue fields already present
 * on the songs (genre, mood, bpm, human_verified, analytics.plays, credits).
 * NOTHING is fabricated: no invented momentum %, no placeholder statistics, no
 * simulated AI output. Modules that would require data we do not have yet
 * (real-time trends, location, adaptive learning) are surfaced honestly in the UI
 * as Pending Integration — never faked here.
 */

export function plays(song: Song): number {
  return song.analytics?.plays ?? 0
}

/** Catalogue ranked strictly by real play counts (deterministic id fallback). */
export function trending(limit = 8): Song[] {
  return [...mockSongs]
    .sort((a, b) => plays(b) - plays(a) || a.id.localeCompare(b.id))
    .slice(0, limit)
}

/** Unique genres present in the catalogue, ordered by how many tracks each has. */
export function availableGenres(): string[] {
  const count = new Map<string, number>()
  for (const s of mockSongs) count.set(s.genre, (count.get(s.genre) ?? 0) + 1)
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([g]) => g)
}

export function byGenre(genre: string): Song[] {
  return mockSongs.filter(s => s.genre === genre).sort((a, b) => plays(b) - plays(a))
}

const MOOD_LABELS: Record<string, string> = {
  romantic: 'Romantic',
  late_night: 'Late Night',
  emotional: 'Emotional',
  sad: 'Reflective',
  street: 'Street',
  energetic: 'Energetic',
  chill: 'Chill',
  happy: 'Happy',
  nostalgic: 'Nostalgic',
}

export function moodLabel(mood: string): string {
  return MOOD_LABELS[mood] ?? mood.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Unique moods present in the catalogue, ordered by frequency. */
export function availableMoods(): string[] {
  const count = new Map<string, number>()
  for (const s of mockSongs) {
    if (!s.mood) continue
    const m = String(s.mood)
    count.set(m, (count.get(m) ?? 0) + 1)
  }
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([m]) => m)
}

export function byMood(mood: string): Song[] {
  return mockSongs.filter(s => String(s.mood ?? '') === mood).sort((a, b) => plays(b) - plays(a))
}

export interface BpmRange {
  id: string
  label: string
  min: number
  max: number
}

export const BPM_RANGES: BpmRange[] = [
  { id: 'slow', label: 'Slow · <90', min: 0, max: 89 },
  { id: 'mid', label: 'Mid · 90–119', min: 90, max: 119 },
  { id: 'up', label: 'Upbeat · 120–129', min: 120, max: 129 },
  { id: 'fast', label: 'Fast · 130+', min: 130, max: 999 },
]

export function byBpmRange(min: number, max: number): Song[] {
  return mockSongs
    .filter(s => typeof s.bpm === 'number' && s.bpm >= min && s.bpm <= max)
    .sort((a, b) => (a.bpm ?? 0) - (b.bpm ?? 0))
}

export function humanVerified(limit = 12): Song[] {
  return mockSongs
    .filter(s => s.human_verified)
    .sort((a, b) => plays(b) - plays(a))
    .slice(0, limit)
}

export interface ArtistAgg {
  name: string
  tracks: number
  plays: number
  verified: boolean
}

/** Artists aggregated from the real catalogue, ranked by total plays. */
export function topArtists(limit = 8): ArtistAgg[] {
  const map = new Map<string, ArtistAgg>()
  for (const s of mockSongs) {
    const a = map.get(s.artist_name)
    if (a) {
      a.tracks += 1
      a.plays += plays(s)
      a.verified = a.verified || !!s.human_verified
    } else {
      map.set(s.artist_name, { name: s.artist_name, tracks: 1, plays: plays(s), verified: !!s.human_verified })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.plays - a.plays).slice(0, limit)
}

export interface CreditAgg {
  name: string
  tracks: number
}

function aggregateCredit(pick: (s: Song) => string | undefined): CreditAgg[] {
  const map = new Map<string, number>()
  for (const s of mockSongs) {
    const name = pick(s)?.trim()
    if (!name) continue
    map.set(name, (map.get(name) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, tracks]) => ({ name, tracks }))
    .sort((a, b) => b.tracks - a.tracks)
}

/** Composers derived from real song credits. */
export function allComposers(): CreditAgg[] {
  return aggregateCredit(s => s.credits?.composer)
}

/** Producers derived from real song credits. */
export function allProducers(): CreditAgg[] {
  return aggregateCredit(s => s.credits?.producer)
}
