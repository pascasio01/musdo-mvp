import { mockSongs } from '../data/mockData'
import { mockLyrics } from '../data/mockLyrics'
import { allComposers, allProducers } from './djCurator'
import type { Song } from '../types'
import type { LibraryPlaylist } from './library'

/**
 * MUSVORA Unified Search — the real, indexed catalogue engine.
 *
 * HONESTY CONTRACT (see replit.md): this only ever searches data that genuinely
 * exists in the app — Songs, Artists (derived from songs), Playlists (the user's
 * own), Lyrics, Composers & Producers (from real credits). It NEVER fabricates a
 * catalogue entry. If a query (e.g. a global artist not licensed in MUSVORA) has
 * no real match, `hasMatches` is false and the UI must say "Not available for
 * playback yet" while offering real `availableInMusvora` recommendations.
 *
 * Albums are intentionally empty — there is no album data model yet, so albums
 * stay "Pending Integration" rather than being invented.
 */

const MIN_QUERY = 2

/* ── text utilities ──────────────────────────────────────────── */

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function isSubsequence(q: string, t: string): boolean {
  let i = 0
  for (let j = 0; j < t.length && i < q.length; j++) {
    if (t[j] === q[i]) i++
  }
  return i === q.length
}

/** Bounded Levenshtein — returns a large number when clearly far apart. */
function editDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (Math.abs(m - n) > 3) return 99
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]
    dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = Math.min(dp[i] + 1, dp[i - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[m]
}

/**
 * Fuzzy relevance score in [0..1]. 0 means "no meaningful match".
 * Exact > prefix > substring > token-prefix > subsequence > small typo.
 */
export function fuzzyScore(rawQuery: string, rawTarget: string): number {
  const q = norm(rawQuery)
  const t = norm(rawTarget)
  if (!q || !t) return 0
  if (t === q) return 1
  if (t.startsWith(q)) return 0.92
  if (t.includes(q)) return 0.8
  const tokens = t.split(/\s+/).filter(Boolean)
  if (tokens.some(tok => tok.startsWith(q))) return 0.7
  if (isSubsequence(q, t)) return 0.5
  const best = tokens.length ? Math.min(...tokens.map(tok => editDistance(q, tok))) : 99
  if (q.length >= 4 && best <= 2) return 0.42
  if (q.length >= 3 && best <= 1) return 0.46
  return 0
}

/** Best score across several fields of an entity. */
function multiFieldScore(query: string, fields: (string | undefined)[]): number {
  let best = 0
  for (const f of fields) {
    if (!f) continue
    const s = fuzzyScore(query, f)
    if (s > best) best = s
  }
  return best
}

/* ── result shapes ───────────────────────────────────────────── */

export interface ScoredSong {
  song: Song
  score: number
}
export interface ArtistResult {
  name: string
  tracks: number
  verified: boolean
  score: number
}
export interface LyricResult {
  song: Song
  snippet: string
  score: number
}
export interface CreditResult {
  name: string
  tracks: number
  score: number
}

export type TopResult =
  | { kind: 'artist'; artist: ArtistResult }
  | { kind: 'song'; song: Song }

export interface SearchResults {
  query: string
  topResult: TopResult | null
  artists: ArtistResult[]
  songs: Song[]
  /** Always empty in V1 — no album data model exists yet (Pending Integration). */
  albums: never[]
  playlists: LibraryPlaylist[]
  lyrics: LyricResult[]
  composers: CreditResult[]
  producers: CreditResult[]
  similar: Song[]
  hasMatches: boolean
  /** Real recommendations (top catalogue tracks by plays) for the no-match case. */
  availableInMusvora: Song[]
}

function plays(s: Song): number {
  return s.analytics?.plays ?? 0
}

/** Top real catalogue tracks by play count — honest recommendations. */
export function topAvailable(limit = 6): Song[] {
  return [...mockSongs].sort((a, b) => plays(b) - plays(a)).slice(0, limit)
}

function emptyResults(query: string): SearchResults {
  return {
    query,
    topResult: null,
    artists: [],
    songs: [],
    albums: [],
    playlists: [],
    lyrics: [],
    composers: [],
    producers: [],
    similar: [],
    hasMatches: false,
    availableInMusvora: topAvailable(),
  }
}

/* ── main query ──────────────────────────────────────────────── */

export function searchAll(rawQuery: string, opts: { playlists?: LibraryPlaylist[] } = {}): SearchResults {
  const query = rawQuery.trim()
  if (query.length < MIN_QUERY) return emptyResults(query)

  // Songs
  const scoredSongs: ScoredSong[] = mockSongs
    .map(song => ({
      song,
      score: multiFieldScore(query, [
        song.title,
        song.artist_name,
        song.genre,
        typeof song.mood === 'string' ? song.mood : '',
        song.key,
        song.bpm ? String(song.bpm) : '',
        song.credits?.composer,
        song.credits?.producer,
      ]),
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)

  // Artists (aggregated from songs)
  const artistMap = new Map<string, ArtistResult>()
  for (const s of mockSongs) {
    const score = fuzzyScore(query, s.artist_name)
    if (score <= 0) continue
    const existing = artistMap.get(s.artist_name)
    if (existing) {
      existing.tracks += 1
      existing.verified = existing.verified || !!s.human_verified
      existing.score = Math.max(existing.score, score)
    } else {
      artistMap.set(s.artist_name, { name: s.artist_name, tracks: 1, verified: !!s.human_verified, score })
    }
  }
  const artists = Array.from(artistMap.values()).sort((a, b) => b.score - a.score)

  // Playlists (user's real playlists)
  const playlists = (opts.playlists ?? [])
    .map(p => ({ p, score: fuzzyScore(query, p.title) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.p)
    .slice(0, 6)

  // Lyrics (real, from mockLyrics)
  const lyrics: LyricResult[] = []
  for (const lt of Object.values(mockLyrics)) {
    const nq = norm(query)
    const plain = norm(lt.plain ?? '')
    const syncedLine = lt.synced?.find(l => norm(l.text).includes(nq))
    const matches = plain.includes(nq) || !!syncedLine
    if (!matches) continue
    const song = mockSongs.find(s => s.id === lt.song_id)
    if (!song) continue
    const snippet =
      syncedLine?.text ??
      (lt.plain ?? '').split('\n').find(l => norm(l).includes(nq)) ??
      (lt.plain ?? '').split('\n')[0] ??
      ''
    lyrics.push({ song, snippet, score: 0.8 })
  }

  // Composers & producers (real credits)
  const composers: CreditResult[] = allComposers()
    .map(c => ({ name: c.name, tracks: c.tracks, score: fuzzyScore(query, c.name) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
  const producers: CreditResult[] = allProducers()
    .map(c => ({ name: c.name, tracks: c.tracks, score: fuzzyScore(query, c.name) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  const songs = scoredSongs.map(r => r.song).slice(0, 8)

  // Top result — strongest of best artist vs best song.
  const bestArtist = artists[0]
  const bestSong = scoredSongs[0]
  let topResult: TopResult | null = null
  if (bestArtist && (!bestSong || bestArtist.score >= bestSong.score)) {
    topResult = { kind: 'artist', artist: bestArtist }
  } else if (bestSong) {
    topResult = { kind: 'song', song: bestSong.song }
  }

  // Similar music — same genre as the top match, excluding ones already shown.
  let similar: Song[] = []
  const anchorGenre =
    topResult?.kind === 'song'
      ? topResult.song.genre
      : bestSong?.song.genre ?? (bestArtist ? mockSongs.find(s => s.artist_name === bestArtist.name)?.genre : undefined)
  if (anchorGenre) {
    const shownIds = new Set(songs.map(s => s.id))
    similar = mockSongs
      .filter(s => s.genre === anchorGenre && !shownIds.has(s.id))
      .sort((a, b) => plays(b) - plays(a))
      .slice(0, 4)
  }

  const hasMatches =
    songs.length > 0 ||
    artists.length > 0 ||
    playlists.length > 0 ||
    lyrics.length > 0 ||
    composers.length > 0 ||
    producers.length > 0

  return {
    query,
    topResult,
    artists: artists.slice(0, 6),
    songs,
    albums: [],
    playlists,
    lyrics: lyrics.slice(0, 5),
    composers,
    producers,
    similar,
    hasMatches,
    availableInMusvora: hasMatches ? [] : topAvailable(),
  }
}

/** Lightweight type-ahead suggestions (entity names) for the search bar. */
export function suggest(rawQuery: string, opts: { playlists?: LibraryPlaylist[] } = {}, limit = 6): string[] {
  const query = rawQuery.trim()
  if (query.length < MIN_QUERY) return []
  const pool = new Map<string, number>()
  const add = (name: string | undefined) => {
    if (!name) return
    const score = fuzzyScore(query, name)
    if (score > 0) pool.set(name, Math.max(pool.get(name) ?? 0, score))
  }
  for (const s of mockSongs) {
    add(s.title)
    add(s.artist_name)
  }
  for (const c of allComposers()) add(c.name)
  for (const p of opts.playlists ?? []) add(p.title)
  return Array.from(pool.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name)
}

export { MIN_QUERY }
