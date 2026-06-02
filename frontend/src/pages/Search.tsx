import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search as SearchIcon,
  X,
  Play,
  User,
  Music2,
  ArrowRight,
  Clock,
  ListMusic,
  Quote,
  PenLine,
  SlidersHorizontal,
  Star,
  Trash2,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Badge } from '../components/governance'
import DiscoveryExplorer from '../components/discovery/DiscoveryExplorer'
import { usePlayer } from '../lib/player'
import { useLibrary } from '../lib/library'
import { searchAll, suggest, type SearchResults } from '../lib/search'
import type { Song } from '../types'

const RECENT_KEY = 'musdo-recent-searches'
const MAX_RECENT = 8
const DEBOUNCE_MS = 200

const LIVE_CATEGORIES = ['Songs', 'Artists', 'Playlists', 'Lyrics', 'Composers', 'Producers'] as const
const PENDING_CATEGORIES = ['Albums', 'Demos', 'Marketplace', 'Licensing'] as const

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

export default function Search() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { playSong } = usePlayer()
  const { playlists, favoriteIds, historySongs } = useLibrary()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(params.get('q') ?? '')
  const [debounced, setDebounced] = useState(query.trim())
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>(loadRecent)

  // Autofocus the search field on entry.
  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(t)
  }, [])

  // Debounce → drives the "Searching…" state and the heavy query.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setDebounced('')
      setLoading(false)
      return
    }
    setLoading(true)
    const t = window.setTimeout(() => {
      setDebounced(q)
      setLoading(false)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [query])

  // Keep ?q= in the URL for deep-linking / sharing.
  useEffect(() => {
    const q = query.trim()
    setParams(q ? { q } : {}, { replace: true })
  }, [query, setParams])

  const { results, computeError } = useMemo<{ results: SearchResults; computeError: boolean }>(() => {
    try {
      return { results: searchAll(debounced, { playlists }), computeError: false }
    } catch {
      return { results: searchAll('', { playlists }), computeError: true }
    }
  }, [debounced, playlists])

  // Instant (non-debounced) type-ahead suggestions.
  const suggestions = useMemo(() => suggest(query, { playlists }), [query, playlists])

  const pushRecent = useCallback((term: string) => {
    const t = term.trim()
    if (t.length < 2) return
    setRecent(prev => {
      const next = [t, ...prev.filter(x => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecent([])
    try { localStorage.removeItem(RECENT_KEY) } catch { /* ignore */ }
  }, [])

  const play = useCallback((song: Song, queue: Song[]) => {
    pushRecent(query)
    playSong(song, queue.length ? queue : [song])
    navigate(`/player/${song.id}`)
  }, [playSong, navigate, pushRecent, query])

  const onTopResult = useCallback(() => {
    const tr = results.topResult
    if (!tr) return
    if (tr.kind === 'song') { play(tr.song, results.songs); return }
    // Artist → play their strongest available track.
    const theirs = results.songs.filter(s => s.artist_name === tr.artist.name)
    const first = theirs[0]
    if (first) play(first, theirs)
  }, [results, play])

  const q = query.trim()
  const isIdle = q.length < 2
  const showResults = !isIdle && !loading && !computeError

  return (
    <AppShell>
      <GovernanceScope>
        <div className="px-4 pt-4">
          {/* ── Search bar ── */}
          <div
            className="flex items-center gap-2 px-3 safe-top"
            style={{
              height: 52,
              borderRadius: 'var(--gv-radius-lg)',
              background: 'var(--gv-surface)',
              border: '1px solid var(--gv-border)',
              boxShadow: 'var(--gv-shadow-md)',
            }}
          >
            <SearchIcon size={18} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar canciones, artistas, letras…"
              aria-label="Buscar en MUSVORA"
              enterKeyHint="search"
              onKeyDown={e => { if (e.key === 'Enter' && q.length >= 2) pushRecent(q) }}
              className="flex-1 min-w-0 bg-transparent outline-none"
              style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}
            />
            {q.length > 0 && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                style={{ width: 30, height: 30, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}
              >
                <X size={15} aria-hidden />
              </button>
            )}
          </div>

          {/* ── Type-ahead suggestions ── */}
          {!isIdle && suggestions.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 -mx-1 px-1">
              {suggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setQuery(s); pushRecent(s) }}
                  className="gv-focusable flex-shrink-0 flex items-center gap-1.5 active:scale-95 transition-transform"
                  style={{ padding: '6px 12px', borderRadius: 'var(--gv-radius-full, 999px)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)', fontSize: 'var(--gv-text-2xs)' }}
                >
                  <SearchIcon size={12} aria-hidden />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pt-4 pb-8" aria-live="polite">
          {/* ── Idle: recents + moods + coverage ── */}
          {isIdle && (
            <div className="flex flex-col gap-6 pt-1">
              {recent.length > 0 && (
                <section>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <p className="gv-eyebrow">Búsquedas recientes</p>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="gv-focusable flex items-center gap-1 active:opacity-70"
                      style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}
                    >
                      <Trash2 size={12} aria-hidden /> Limpiar
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {recent.map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="gv-focusable flex items-center gap-3 px-2 py-2 text-left active:scale-[0.99] transition-transform"
                        style={{ borderRadius: 'var(--gv-radius-md)' }}
                      >
                        <Clock size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                        <span className="flex-1 truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{term}</span>
                        <ArrowRight size={14} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <DiscoveryExplorer onPlay={play} favoriteIds={favoriteIds} history={historySongs} />

              <section>
                <p className="gv-eyebrow px-1 mb-2.5">Qué puedes buscar</p>
                <div className="flex flex-wrap gap-2">
                  {LIVE_CATEGORIES.map(c => (
                    <Badge key={c} tone="success" variant="soft">{c} · Live</Badge>
                  ))}
                  {PENDING_CATEGORIES.map(c => (
                    <Badge key={c} tone="warning" variant="soft">{c} · Pending Integration</Badge>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ── Loading ── */}
          {!isIdle && loading && (
            <p className="py-10 text-center gv-mono" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>Buscando…</p>
          )}

          {/* ── Error ── */}
          {!isIdle && computeError && !loading && (
            <p className="py-10 text-center" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-warning)' }}>La búsqueda no está disponible por un momento.</p>
          )}

          {/* ── Results ── */}
          {showResults && results.hasMatches && (
            <div className="flex flex-col gap-6 pt-1">
              {results.topResult && (
                <section>
                  <p className="gv-eyebrow px-1 mb-2">Top result</p>
                  <button
                    type="button"
                    onClick={onTopResult}
                    className="gv-focusable w-full flex items-center gap-3.5 text-left active:scale-[0.99] transition-transform"
                    style={{ background: 'var(--gv-surface)', border: '1px solid var(--gv-border)', borderRadius: 'var(--gv-radius-lg)', padding: 'var(--gv-space-4)' }}
                  >
                    {results.topResult.kind === 'song' ? (
                      <>
                        <Artwork song={results.topResult.song} size={56} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>{results.topResult.song.title}</span>
                          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>Canción · {results.topResult.song.artist_name}</span>
                        </span>
                        <PlayChip />
                      </>
                    ) : (
                      <>
                        <span className="grid place-items-center flex-shrink-0" style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
                          <User size={22} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate font-bold" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>{results.topResult.artist.name}</span>
                            {results.topResult.artist.verified && <Star size={13} style={{ color: 'var(--gv-gold)' }} aria-label="Human Verified" />}
                          </span>
                          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>Artista · {results.topResult.artist.tracks} {results.topResult.artist.tracks === 1 ? 'track' : 'tracks'}</span>
                        </span>
                        <PlayChip />
                      </>
                    )}
                  </button>
                </section>
              )}

              {results.artists.length > 0 && (
                <Group title="Artists">
                  {results.artists.map(a => (
                    <RowButton key={a.name} onClick={() => setQuery(a.name)} icon={<User size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />} round
                      title={a.name} subtitle={`${a.tracks} ${a.tracks === 1 ? 'track' : 'tracks'}${a.verified ? ' · Human Verified' : ''}`} trailing={<ArrowRight size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              {results.songs.length > 0 && (
                <Group title="Songs">
                  {results.songs.map(s => (
                    <RowButton key={s.id} onClick={() => play(s, results.songs)} artwork={s}
                      title={s.title} subtitle={`${s.artist_name} · ${s.genre}`} trailing={<Play size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              {results.playlists.length > 0 && (
                <Group title="Playlists">
                  {results.playlists.map(p => (
                    <RowButton key={p.id} onClick={() => navigate(`/library/playlist/${p.id}`)} icon={<ListMusic size={16} style={{ color: 'var(--gv-gold)' }} aria-hidden />}
                      title={p.title} subtitle={`${p.songIds.length} ${p.songIds.length === 1 ? 'track' : 'tracks'}`} trailing={<ArrowRight size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              {results.lyrics.length > 0 && (
                <Group title="Lyrics">
                  {results.lyrics.map(({ song, snippet }) => (
                    <RowButton key={`ly-${song.id}`} onClick={() => play(song, results.songs.length ? results.songs : [song])} icon={<Quote size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                      title={`“${snippet}”`} italic subtitle={`${song.title} · ${song.artist_name}`} trailing={<Play size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              {results.composers.length > 0 && (
                <Group title="Composers">
                  {results.composers.map(c => (
                    <RowButton key={`cp-${c.name}`} onClick={() => setQuery(c.name)} round icon={<PenLine size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                      title={c.name} subtitle={`Composer · ${c.tracks} ${c.tracks === 1 ? 'credit' : 'credits'}`} trailing={<ArrowRight size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              {results.producers.length > 0 && (
                <Group title="Producers">
                  {results.producers.map(c => (
                    <RowButton key={`pr-${c.name}`} onClick={() => setQuery(c.name)} round icon={<SlidersHorizontal size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                      title={c.name} subtitle={`Producer · ${c.tracks} ${c.tracks === 1 ? 'credit' : 'credits'}`} trailing={<ArrowRight size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              {results.similar.length > 0 && (
                <Group title="Similar Music">
                  {results.similar.map(s => (
                    <RowButton key={`sm-${s.id}`} onClick={() => play(s, results.similar)} artwork={s}
                      title={s.title} subtitle={`${s.artist_name} · ${s.genre}`} trailing={<Play size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              <PendingNote />
            </div>
          )}

          {/* ── No match → honest Not Yet Available + recommendations ── */}
          {showResults && !results.hasMatches && (
            <div className="flex flex-col gap-6 pt-1">
              <section>
                <p className="gv-eyebrow px-1 mb-2">Not yet available</p>
                <div style={{ background: 'var(--gv-surface)', border: '1px solid var(--gv-border)', borderRadius: 'var(--gv-radius-lg)', padding: 'var(--gv-space-5)' }}>
                  <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)', fontWeight: 600 }}>
                    “{q}” no está disponible para reproducción todavía
                  </p>
                  <p className="mt-1.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 'var(--gv-leading-normal)' }}>
                    MUSVORA solo reproduce música cargada o licenciada legalmente en la plataforma. Aún no hay coincidencias reales en el catálogo para esa búsqueda.
                  </p>
                </div>
              </section>

              {results.availableInMusvora.length > 0 && (
                <Group title="Available in MUSVORA">
                  {results.availableInMusvora.map(s => (
                    <RowButton key={`av-${s.id}`} onClick={() => play(s, results.availableInMusvora)} artwork={s}
                      title={s.title} subtitle={`${s.artist_name} · ${s.genre}`} trailing={<Play size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
                  ))}
                </Group>
              )}

              <PendingNote />
            </div>
          )}
        </div>
      </GovernanceScope>
    </AppShell>
  )
}

/* ── presentational helpers ──────────────────────────────────── */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="gv-eyebrow px-1 mb-2">{title}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  )
}

function Artwork({ song, size }: { song: Song; size: number }) {
  return (
    <span className="grid place-items-center flex-shrink-0 overflow-hidden" style={{ width: size, height: size, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
      {song.artwork_url
        ? <img src={song.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
        : <Music2 size={Math.round(size * 0.42)} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
    </span>
  )
}

function PlayChip() {
  return (
    <span className="grid place-items-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gv-gold)', color: 'var(--gv-navy)' }} aria-hidden>
      <Play size={16} fill="currentColor" style={{ marginLeft: 1 }} />
    </span>
  )
}

interface RowButtonProps {
  onClick: () => void
  title: string
  subtitle: string
  trailing: React.ReactNode
  icon?: React.ReactNode
  artwork?: Song
  round?: boolean
  italic?: boolean
}

function RowButton({ onClick, title, subtitle, trailing, icon, artwork, round, italic }: RowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gv-focusable flex items-center gap-3 px-2 py-2 text-left active:scale-[0.99] transition-transform"
      style={{ borderRadius: 'var(--gv-radius-md)' }}
    >
      {artwork
        ? <Artwork song={artwork} size={36} />
        : (
          <span className="grid place-items-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: round ? '50%' : 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
            {icon}
          </span>
        )}
      <span className="min-w-0 flex-1">
        <span className="block truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)', fontWeight: italic ? 400 : 600, fontStyle: italic ? 'italic' : 'normal' }}>{title}</span>
        <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{subtitle}</span>
      </span>
      {trailing}
    </button>
  )
}

function PendingNote() {
  return (
    <section>
      <p className="gv-eyebrow px-1 mb-2">Albums</p>
      <div style={{ background: 'var(--gv-surface)', border: '1px dashed var(--gv-border)', borderRadius: 'var(--gv-radius-lg)', padding: 'var(--gv-space-4)' }}>
        <Badge tone="warning" variant="soft">Pending Integration</Badge>
        <p className="mt-2" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 'var(--gv-leading-normal)' }}>
          Los álbumes aún no tienen modelo de datos en MUSVORA, así que no se inventan resultados.
        </p>
      </div>
    </section>
  )
}
