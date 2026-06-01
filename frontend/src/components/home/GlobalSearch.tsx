import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, X, Play, User, Music2, ArrowRight, Clock } from 'lucide-react'
import { mockSongs } from '../../data/mockData'
import { usePlayer } from '../../lib/player'
import { Badge } from '../governance'
import type { Song } from '../../types'

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

/**
 * MUSVORA Global Search — overlay launched from the Home header.
 *
 * Searches the live catalogue (Songs + Artists) the rest of the app already
 * uses. Categories that are not yet indexed (Composers, Lyrics, Demos, Vault
 * Assets, Marketplace, Licensing) are surfaced honestly as "Pending
 * Integration" — never fabricated as real results.
 *
 * The overlay stops above the mini player + bottom nav so playback stays
 * visible and usable. Closes via X, backdrop tap, or Escape.
 */

const PENDING_CATEGORIES = [
  'Composers', 'Lyrics', 'Demos', 'Vault Assets', 'Marketplace', 'Licensing',
] as const

interface ArtistHit {
  name: string
  count: number
  verified: boolean
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate()
  const { song: nowPlaying, playSong } = usePlayer()
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Focus the input as soon as the overlay opens; reset + restore focus on close.
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null
      const t = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
    setQuery('')
    setDebounced('')
    setError(false)
    setLoading(false)
    restoreFocusRef.current?.focus?.()
    restoreFocusRef.current = null
  }, [open])

  // Escape closes (desktop), Tab traps focus within the dialog, scroll locked.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const root = rootRef.current
      if (!root) return
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(el => el.offsetParent !== null || el === document.activeElement)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement
      if (!root.contains(active)) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  // Debounce the query → drives the "Searching…" state.
  useEffect(() => {
    if (!query.trim()) { setDebounced(''); setLoading(false); return }
    setLoading(true)
    setError(false)
    const t = window.setTimeout(() => {
      setDebounced(query.trim().toLowerCase())
      setLoading(false)
    }, 240)
    return () => window.clearTimeout(t)
  }, [query])

  const { songs, artists } = useMemo(() => {
    if (!debounced) return { songs: [] as Song[], artists: [] as ArtistHit[] }
    try {
      const songHits = mockSongs.filter(s => {
        const hay = [s.title, s.artist_name, s.genre, String(s.mood ?? ''), s.key ?? '']
          .join(' ')
          .toLowerCase()
        return hay.includes(debounced)
      })
      const artistMap = new Map<string, ArtistHit>()
      for (const s of mockSongs) {
        if (!s.artist_name.toLowerCase().includes(debounced)) continue
        const existing = artistMap.get(s.artist_name)
        if (existing) existing.count += 1
        else artistMap.set(s.artist_name, { name: s.artist_name, count: 1, verified: !!s.human_verified })
      }
      return { songs: songHits.slice(0, 6), artists: Array.from(artistMap.values()).slice(0, 4) }
    } catch {
      return { songs: [] as Song[], artists: [] as ArtistHit[] }
    }
  }, [debounced])

  if (!open) return null

  const hasQuery = debounced.length > 0
  const noResults = hasQuery && !loading && !error && songs.length === 0 && artists.length === 0
  const bottomGap = nowPlaying ? 156 : 88

  const openSong = (s: Song) => {
    playSong(s)
    navigate(`/player/${s.id}`)
    onClose()
  }
  const seeAll = () => {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }
  const openArtist = (name: string) => {
    navigate(`/search?q=${encodeURIComponent(name)}`)
    onClose()
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-x-0 top-0 z-50 flex flex-col"
      style={{ bottom: bottomGap }}
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      {/* Backdrop — tap to close */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'color-mix(in srgb, var(--gv-bg) 78%, transparent)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        tabIndex={-1}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md mx-auto px-4 pt-4 flex flex-col min-h-0 flex-1">
        {/* Search input row */}
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
            placeholder="Search music, artists, lyrics, demos..."
            aria-label="Search music, artists, lyrics, demos"
            enterKeyHint="search"
            onKeyDown={e => { if (e.key === 'Enter' && query.trim()) seeAll() }}
            className="flex-1 min-w-0 bg-transparent outline-none"
            style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
            style={{
              width: 30, height: 30,
              borderRadius: 'var(--gv-radius-md)',
              background: 'var(--gv-surface-2)',
              border: '1px solid var(--gv-border)',
              color: 'var(--gv-text-secondary)',
            }}
          >
            <X size={15} aria-hidden />
          </button>
        </div>

        {/* Results / states */}
        <div className="mt-3 overflow-y-auto scrollbar-hide pb-6" aria-live="polite">
          {/* Loading */}
          {loading && (
            <p className="px-1 py-6 text-center gv-mono" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>
              Searching…
            </p>
          )}

          {/* Error */}
          {error && !loading && (
            <p className="px-1 py-6 text-center" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-warning)' }}>
              Search is temporarily unavailable.
            </p>
          )}

          {/* Empty */}
          {noResults && (
            <p className="px-1 py-6 text-center" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>
              No results found.
            </p>
          )}

          {/* Idle hint (no query yet) */}
          {!hasQuery && !loading && (
            <div className="px-1 pt-2">
              <p className="gv-eyebrow" style={{ marginBottom: 10 }}>Search across MUSVORA</p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="success" variant="soft">Songs · Live</Badge>
                <Badge tone="success" variant="soft">Artists · Live</Badge>
                {PENDING_CATEGORIES.map(c => (
                  <Badge key={c} tone="warning" variant="soft">{c} · Pending Integration</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Live results */}
          {hasQuery && !loading && !error && (songs.length > 0 || artists.length > 0) && (
            <div className="flex flex-col gap-5">
              {artists.length > 0 && (
                <section>
                  <p className="gv-eyebrow px-1" style={{ marginBottom: 8 }}>Artists</p>
                  <div className="flex flex-col gap-1.5">
                    {artists.map(a => (
                      <button
                        key={a.name}
                        onClick={() => openArtist(a.name)}
                        className="gv-focusable flex items-center gap-3 px-2 py-2 text-left active:scale-[0.99] transition-transform"
                        style={{ borderRadius: 'var(--gv-radius-md)' }}
                      >
                        <span
                          className="grid place-items-center flex-shrink-0"
                          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}
                        >
                          <User size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                            {a.name}
                          </span>
                          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                            {a.count} {a.count === 1 ? 'track' : 'tracks'}{a.verified ? ' · Human Verified' : ''}
                          </span>
                        </span>
                        <ArrowRight size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {songs.length > 0 && (
                <section>
                  <p className="gv-eyebrow px-1" style={{ marginBottom: 8 }}>Songs</p>
                  <div className="flex flex-col gap-1.5">
                    {songs.map(s => (
                      <button
                        key={s.id}
                        onClick={() => openSong(s)}
                        className="gv-focusable flex items-center gap-3 px-2 py-2 text-left active:scale-[0.99] transition-transform"
                        style={{ borderRadius: 'var(--gv-radius-md)' }}
                      >
                        <span
                          className="grid place-items-center flex-shrink-0 overflow-hidden"
                          style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}
                        >
                          {s.artwork_url
                            ? <img src={s.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                            : <Music2 size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                            {s.title}
                          </span>
                          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                            {s.artist_name} · {s.genre}
                          </span>
                        </span>
                        <Play size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* See all in full search */}
              <button
                onClick={seeAll}
                className="gv-focusable inline-flex items-center justify-center gap-1.5 font-semibold mx-1 active:scale-[0.99] transition-transform"
                style={{
                  height: 40,
                  borderRadius: 'var(--gv-radius-md)',
                  background: 'var(--gv-surface-2)',
                  border: '1px solid var(--gv-border)',
                  color: 'var(--gv-text-link)',
                  fontSize: 'var(--gv-text-sm)',
                }}
              >
                See all results for “{query.trim()}”
                <ArrowRight size={14} aria-hidden />
              </button>

              {/* Honest pending categories */}
              <div
                className="mx-1 px-3 py-3"
                style={{ borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface)', border: '1px dashed var(--gv-border)' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock size={13} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                  <span className="gv-eyebrow">Not yet searchable</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PENDING_CATEGORIES.map(c => (
                    <Badge key={c} tone="warning" variant="soft">{c} · Pending Integration</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
