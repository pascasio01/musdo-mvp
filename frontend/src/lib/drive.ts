import { mockSongs } from '../data/mockData'
import type { Song } from '../types'

/**
 * MUSVORA Drive — the living catalogue / discovery engine.
 *
 * HONESTY CONTRACT (see replit.md AI/data rules): MUSVORA Drive only surfaces
 * REAL catalogue data. Every row is either:
 *   - `live`   → backed by the real catalogue (new releases by date, a genre
 *               that actually has tracks, or a real play-count ranking), or
 *   - `pending` → a source MUSVORA is NOT connected to yet (foreign charts,
 *               TikTok virality, geo/local trends, or a genre with no catalogue).
 *
 * Pending rows render an honest "Pending Integration" state and NEVER show
 * fabricated tracks, counts or rankings. No invented data — ever.
 */

export type DriveStatus = 'live' | 'pending'

export interface DriveSection {
  id: string
  title: string
  subtitle: string
  status: DriveStatus
  /** Real catalogue tracks — only populated when status === 'live'. */
  songs: Song[]
  /** Honest explanation shown when status === 'pending'. */
  pendingReason: string
}

/** Latin genres MUSVORA's catalogue can legitimately rank as "Latino". */
const LATINO_GENRES = [
  'bachata', 'salsa', 'merengue', 'dembow', 'reggaeton',
  'latin', 'bolero', 'regional', 'mexican', 'cumbia', 'vallenato',
]

function playsOf(s: Song): number {
  return s.analytics?.plays ?? 0
}

function releaseTime(s: Song): number {
  const t = Date.parse(s.created_at)
  return Number.isNaN(t) ? 0 : t
}

function genreHas(s: Song, needle: string): boolean {
  return typeof s.genre === 'string' && s.genre.toLowerCase().includes(needle.toLowerCase())
}

/** Newest first, by the real `created_at` release date. */
function byFreshness(list: Song[]): Song[] {
  return [...list].sort((a, b) => releaseTime(b) - releaseTime(a) || a.id.localeCompare(b.id))
}

/** Most played first, by real analytics plays. */
function byPlays(list: Song[]): Song[] {
  return [...list].sort((a, b) => playsOf(b) - playsOf(a) || a.id.localeCompare(b.id))
}

function live(id: string, title: string, subtitle: string, songs: Song[]): DriveSection {
  return { id, title, subtitle, status: 'live', songs, pendingReason: '' }
}

function pending(id: string, title: string, subtitle: string, reason: string): DriveSection {
  return { id, title, subtitle, status: 'pending', songs: [], pendingReason: reason }
}

interface GenreRow {
  id: string
  title: string
  /** Plain genre name for copy. */
  name: string
  /** Substrings that count as this genre in the real catalogue. */
  needles: string[]
}

const GENRE_ROWS: GenreRow[] = [
  { id: 'bachata-fresh',     title: 'Bachata Fresh',     name: 'Bachata',     needles: ['bachata'] },
  { id: 'salsa-fresh',       title: 'Salsa Fresh',       name: 'Salsa',       needles: ['salsa'] },
  { id: 'merengue-fresh',    title: 'Merengue Fresh',    name: 'Merengue',    needles: ['merengue'] },
  { id: 'dembow-fresh',      title: 'Dembow Fresh',      name: 'Dembow',      needles: ['dembow'] },
  { id: 'regional-mx-fresh', title: 'Regional MX Fresh', name: 'Regional MX', needles: ['regional', 'mexican'] },
]

/**
 * Build the full MUSVORA Drive feed from the live catalogue, in the canonical
 * display order. Genres / charts with no connected source are returned as
 * honest `pending` rows.
 */
export function buildDrive(catalog: Song[] = mockSongs): DriveSection[] {
  const sections: DriveSection[] = []

  // 1 · New Releases — real, ordered by release date.
  const fresh = byFreshness(catalog)
  sections.push(
    fresh.length
      ? live('new-releases', 'New Releases', 'Lo más reciente del catálogo MUSVORA', fresh)
      : pending('new-releases', 'New Releases', 'Lanzamientos recientes', 'Catálogo de lanzamientos aún no conectado'),
  )

  // 2–6 · Genre Fresh rows — live only when the catalogue actually has the genre.
  for (const g of GENRE_ROWS) {
    const matches = byFreshness(catalog.filter(s => g.needles.some(n => genreHas(s, n))))
    sections.push(
      matches.length
        ? live(g.id, g.title, `Nuevo en ${g.name}`, matches)
        : pending(g.id, g.title, `Feed de ${g.name}`, `Catálogo de ${g.name} aún no conectado`),
    )
  }

  // 7 · Top Latino — real ranking by play counts across Latin genres.
  const latino = byPlays(catalog.filter(s => LATINO_GENRES.some(n => genreHas(s, n))))
  sections.push(
    latino.length
      ? live('top-latino', 'Top Latino', 'Por reproducciones reales', latino)
      : pending('top-latino', 'Top Latino', 'Ranking latino', 'Ranking latino aún no conectado'),
  )

  // 8 · Top USA — needs licensed US chart data MUSVORA does not have.
  sections.push(pending('top-usa', 'Top USA', 'Charts de Estados Unidos', 'Datos de charts USA no conectados (requiere integración)'))

  // 9 · Viral Now — needs an external virality (TikTok) signal.
  sections.push(pending('viral-now', 'Viral Now', 'Tendencias TikTok', 'Señal de TikTok no conectada (requiere integración)'))

  // 10 · Local Trends — needs geolocation / regional listening signal.
  sections.push(pending('local-trends', 'Local Trends', 'Tendencias en tu zona', 'Señal de ubicación no conectada (requiere integración)'))

  return sections
}

export interface DriveStats {
  live: number
  pending: number
  /** Distinct real tracks surfaced across all live rows. */
  tracks: number
}

/** Honest summary of how much of Drive is really live vs awaiting integration. */
export function driveStats(sections: DriveSection[]): DriveStats {
  const ids = new Set<string>()
  let liveCount = 0
  let pendingCount = 0
  for (const s of sections) {
    if (s.status === 'live') {
      liveCount += 1
      s.songs.forEach(t => ids.add(t.id))
    } else {
      pendingCount += 1
    }
  }
  return { live: liveCount, pending: pendingCount, tracks: ids.size }
}
