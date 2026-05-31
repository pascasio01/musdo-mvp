import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X, Sparkles, BadgeCheck, Play, ArrowLeft, Music2 } from 'lucide-react'
import { mockSongs } from '../data/mockData'
import { moodChips, discoveryPlaceholders } from '../data/aiMockData'
import { usePlayer } from '../lib/player'
import { formatDuration } from '../utils/format'
import type { Song, LicensingStatus } from '../types'

type FilterChip = 'songs' | 'composers' | 'verified' | 'licensing' | 'mood' | 'bpm'

const FILTER_CHIPS: { id: FilterChip; label: string }[] = [
  { id: 'songs', label: 'Songs' },
  { id: 'composers', label: 'Composers' },
  { id: 'verified', label: 'Human Verified' },
  { id: 'licensing', label: 'Licensing' },
  { id: 'mood', label: 'Mood' },
  { id: 'bpm', label: 'BPM' },
]

function licensingLabel(status?: LicensingStatus): string {
  if (!status) return 'Unknown'
  const map: Record<LicensingStatus, string> = {
    available: 'Available',
    private: 'Private',
    sold: 'Licensed',
    pending: 'Pending',
    licensing_only: 'Licensing Only',
  }
  return map[status]
}

function licensingTone(status?: LicensingStatus): string {
  if (status === 'available') return 'var(--accent)'
  if (status === 'private') return 'var(--text-muted)'
  return 'var(--text-secondary)'
}

function qualityLabel(q?: Song['audio_quality']): string {
  if (!q) return ''
  const map: Record<string, string> = {
    demo_mp3: 'Demo MP3',
    demo_wav: 'Demo WAV',
    master_wav: 'Master WAV',
    lossless_flac: 'Lossless FLAC',
    streaming_aac: 'Stream AAC',
  }
  return map[q] ?? q
}

function moodLabel(m?: string): string {
  if (!m) return ''
  return m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Search() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { playSong } = usePlayer()
  const inputRef = useRef<HTMLInputElement>(null)

  const initialQuery = params.get('q') ?? ''
  const initialMood = params.get('mood') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [activeMood, setActiveMood] = useState<string | null>(initialMood || null)
  const [activeFilters, setActiveFilters] = useState<Set<FilterChip>>(new Set())
  const [focused, setFocused] = useState(false)
  const [placeholder, setPlaceholder] = useState(discoveryPlaceholders[0])
  const placeholderIdx = useRef(0)

  // Cycle the cinematic placeholder when idle
  useEffect(() => {
    if (focused || query) return
    const t = setInterval(() => {
      placeholderIdx.current = (placeholderIdx.current + 1) % discoveryPlaceholders.length
      setPlaceholder(discoveryPlaceholders[placeholderIdx.current])
    }, 3200)
    return () => clearInterval(t)
  }, [focused, query])

  // Sync URL state for deep-linking
  useEffect(() => {
    const next: Record<string, string> = {}
    if (query) next.q = query
    if (activeMood) next.mood = activeMood
    setParams(next, { replace: true })
  }, [query, activeMood, setParams])

  const toggleFilter = useCallback((id: FilterChip) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const mood = activeMood?.toLowerCase() ?? ''

    return mockSongs.filter(song => {
      // Filter chips
      if (activeFilters.has('verified') && !song.human_verified) return false
      if (activeFilters.has('licensing') && song.licensing_status !== 'available') return false

      // Mood chip filter
      if (mood) {
        const songMood = (song.mood ?? '').toLowerCase().replace(/_/g, ' ')
        const matchesMood =
          songMood.includes(mood) ||
          song.genre.toLowerCase().includes(mood) ||
          mood.includes(songMood)
        if (!matchesMood) return false
      }

      // Free-text query — match across title, creator, genre, mood, key, BPM
      if (q) {
        const haystack = [
          song.title,
          song.artist_name,
          song.genre,
          song.mood ?? '',
          song.key ?? '',
          song.bpm ? String(song.bpm) : '',
          song.credits?.composer ?? '',
        ].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }

      return true
    })
  }, [query, activeMood, activeFilters])

  const handleSelectSong = useCallback((song: Song) => {
    playSong(song, mockSongs)
    navigate(`/player/${song.id}`)
  }, [playSong, navigate])

  const handleMoodChip = useCallback((mood: string) => {
    setActiveMood(prev => (prev === mood ? null : mood))
  }, [])

  const clear = useCallback(() => {
    setQuery('')
    setActiveMood(null)
    setActiveFilters(new Set())
    inputRef.current?.focus()
  }, [])

  const hasAnyFilter = query || activeMood || activeFilters.size > 0

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Cinematic ambient layer — driven by current Aura */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse at top, var(--aura-primary, transparent) 0%, transparent 60%), radial-gradient(ellipse at bottom right, var(--aura-secondary, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 78%, transparent)' }}>
        <div className="max-w-md mx-auto px-5 pt-5 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Discover
              </p>
              <h1 className="text-xl font-bold leading-tight">Search</h1>
            </div>
          </div>

          {/* Glass search bar */}
          <div
            className="relative rounded-2xl border transition-all duration-300"
            style={{
              borderColor: focused ? 'var(--accent)' : 'var(--border)',
              background: 'var(--glass-bg-medium)',
              boxShadow: focused ? '0 0 0 4px var(--accent-soft)' : 'none',
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <SearchIcon size={16} style={{ color: 'var(--text-muted)' }} aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                aria-label="Search songs, creators, mood, BPM, or key"
                className="flex-1 bg-transparent text-sm outline-none transition-all"
                style={{ color: 'var(--text-primary)' }}
              />
              {hasAnyFilter && (
                <button
                  onClick={clear}
                  aria-label="Clear search"
                  className="transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={16} aria-hidden />
                </button>
              )}
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mt-3 -mx-1 px-1">
            {FILTER_CHIPS.map(({ id, label }) => {
              const active = activeFilters.has(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleFilter(id)}
                  aria-pressed={active}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border"
                  style={{
                    background: active ? 'var(--accent-soft)' : 'var(--glass-bg)',
                    borderColor: active ? 'var(--accent)' : 'var(--border)',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Mood chips — emotional discovery foundation */}
      <section className="max-w-md mx-auto px-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={12} style={{ color: 'var(--accent)' }} aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            MUSVORA AI Moods
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {moodChips.map(mood => {
            const active = activeMood === mood
            return (
              <button
                key={mood}
                onClick={() => handleMoodChip(mood)}
                aria-pressed={active}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border"
                style={{
                  background: active ? 'var(--text-primary)' : 'var(--glass-bg)',
                  color: active ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  borderColor: active ? 'var(--text-primary)' : 'var(--border)',
                }}
              >
                {mood}
              </button>
            )
          })}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {hasAnyFilter ? 'Matches' : 'All Songs'}
          </h2>
          <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {results.length === 0 ? (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)' }}
          >
            <Music2 size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} aria-hidden />
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              No matches
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Try a different mood, BPM, or describe the feeling.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {results.map(song => (
              <SearchResultCard key={song.id} song={song} onSelect={handleSelectSong} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */

interface SearchResultCardProps {
  song: Song
  onSelect: (song: Song) => void
}

function SearchResultCard({ song, onSelect }: SearchResultCardProps) {
  return (
    <article
      className="group rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--border)',
        boxShadow: '0 0 0 0 var(--aura-glow)',
      }}
      onClick={() => onSelect(song)}
      tabIndex={0}
      role="button"
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(song)
        }
      }}
      aria-label={`${song.title} by ${song.artist_name}`}
    >
      <div className="flex items-stretch gap-3 p-3">
        {/* Cover */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {song.artwork_url ? (
            <img
              src={song.artwork_url}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--surface))' }}
              aria-hidden
            />
          )}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'var(--overlay, rgba(0,0,0,0.4))' }}
          >
            <Play size={16} style={{ color: 'var(--text-inverse)' }} fill="currentColor" aria-hidden />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {song.title}
              </h3>
              {song.human_verified && (
                <BadgeCheck
                  size={13}
                  className="flex-shrink-0"
                  style={{ color: 'var(--accent)' }}
                  aria-label="Human verified"
                />
              )}
            </div>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {song.artist_name}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <Pill>{song.genre}</Pill>
            {song.mood && <Pill>{moodLabel(song.mood)}</Pill>}
            {song.bpm && <Pill subtle>{song.bpm} BPM</Pill>}
            {song.key && <Pill subtle>Key {song.key}</Pill>}
          </div>
        </div>

        {/* Meta column */}
        <div className="flex flex-col items-end justify-between gap-1 flex-shrink-0">
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{
              color: licensingTone(song.licensing_status),
              background: 'var(--glass-bg-medium)',
            }}
          >
            {licensingLabel(song.licensing_status)}
          </span>
          <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {song.duration ? formatDuration(song.duration) : ''}
          </span>
          {song.audio_quality && (
            <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {qualityLabel(song.audio_quality)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function Pill({ children, subtle }: { children: React.ReactNode; subtle?: boolean }) {
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded-full"
      style={{
        background: subtle ? 'transparent' : 'var(--glass-bg-medium)',
        color: subtle ? 'var(--text-muted)' : 'var(--text-secondary)',
        border: subtle ? 'none' : '1px solid var(--border-soft)',
      }}
    >
      {children}
    </span>
  )
}
