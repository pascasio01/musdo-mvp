import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Play, Heart, Flame, Disc3, Sparkles, Activity, ShieldCheck,
  Users, Radio, Building2, Download, MapPin, Compass, TrendingUp,
  Heart as HeartIcon, Utensils, Hotel, Dumbbell, Car, Cake, PartyPopper,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge, SectionHeader } from '../components/governance'
import GlobalSearch from '../components/home/GlobalSearch'
import { useLibrary } from '../lib/library'
import { usePlayer } from '../lib/player'
import { useAuth } from '../lib/auth'
import {
  trending, availableGenres, byGenre, availableMoods, byMood, moodLabel,
  BPM_RANGES, byBpmRange, humanVerified, topArtists, plays,
} from '../lib/djCurator'
import { freshForYou, yourGenres, moreLikeGenre, PENDING_TREND_FACETS } from '../lib/trends'
import type { Song, AppRole } from '../types'

/**
 * AI DJ Complace — your personal Music Director (Phase 1).
 *
 * Real modules are driven strictly by the live catalogue + the user's own
 * library: Trending (real play counts), Best by Genre / Mood / BPM, Human
 * Verified Music, Best Independent Artists. Experience Modes and the advanced
 * intelligence/business modules are shown honestly as Coming Soon / Pending
 * Integration — no fabricated sessions, momentum, or statistics.
 */

const MODE_LABEL: Record<AppRole, string> = {
  listener: 'Listener',
  composer: 'Composer',
  producer: 'Artist',
  admin: 'Owner',
  supreme_owner: 'Owner',
}

const EXPERIENCE_MODES = [
  { icon: HeartIcon, title: 'Wedding Mode', note: 'Reception → dinner → dance floor energy curve.' },
  { icon: Utensils, title: 'Restaurant Mode', note: 'All-day ambiance scheduled by service hours.' },
  { icon: Hotel, title: 'Hotel Mode', note: 'Lobby · pool · sunset · dinner · night lounge.' },
  { icon: Dumbbell, title: 'Gym Mode', note: 'Warm up → workout → peak → cooldown.' },
  { icon: Car, title: 'Road Trip Mode', note: 'Continuous energy for the drive.' },
  { icon: Cake, title: 'Birthday Mode', note: 'Build the celebration moment by moment.' },
]

const ADVANCED_MODULES: { icon: typeof Activity; title: string; status: 'Pending Integration' | 'Internal Preview'; note: string }[] = [
  { icon: Sparkles, title: 'Smart Mixing Engine', status: 'Pending Integration', note: 'BPM/energy transitions & crossfades need audio analysis.' },
  { icon: Activity, title: 'Adaptive Intelligence', status: 'Pending Integration', note: 'Learns from skips/likes/saves once enough signal is collected.' },
  { icon: Building2, title: 'Business Mode', status: 'Pending Integration', note: 'All-day automated sessions for venues & retail.' },
  { icon: Download, title: 'Offline Intelligence', status: 'Pending Integration', note: 'Downloaded sessions & events for offline playback.' },
  { icon: MapPin, title: 'Best by Location', status: 'Pending Integration', note: 'Geographic trends require regional analytics.' },
]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="gv-focusable flex-shrink-0 font-semibold active:scale-95 transition-all"
      style={{
        height: 34, padding: '0 14px', borderRadius: 999, fontSize: 'var(--gv-text-2xs)',
        background: active ? 'var(--gv-gold)' : 'var(--gv-surface-2)',
        color: active ? 'var(--gv-navy)' : 'var(--gv-text-secondary)',
        border: `1px solid ${active ? 'var(--gv-gold)' : 'var(--gv-border)'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function TrackRow({ song, context, rank, showPlays }: { song: Song; context: Song[]; rank?: number; showPlays?: boolean }) {
  const navigate = useNavigate()
  const { playSong } = usePlayer()
  const { isFavorite, toggleFavorite } = useLibrary()
  const fav = isFavorite(song.id)
  return (
    <div className="flex items-center gap-3" style={{ padding: '8px 6px', borderRadius: 'var(--gv-radius-md)' }}>
      <button
        type="button"
        onClick={() => { playSong(song, context); navigate(`/player/${song.id}`) }}
        aria-label={`Play ${song.title}`}
        className="gv-focusable flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-70 transition-opacity"
      >
        {typeof rank === 'number' && (
          <span className="gv-mono flex-shrink-0 text-center" style={{ width: 18, fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>{rank}</span>
        )}
        <span
          className="grid place-items-center flex-shrink-0 overflow-hidden"
          style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}
        >
          {song.artwork_url
            ? <img src={song.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
            : <Play size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{song.title}</span>
          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
            {song.artist_name}{showPlays && plays(song) > 0 ? ` · ${plays(song).toLocaleString()} plays` : ` · ${song.genre}`}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(song)}
        aria-label={fav ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
        aria-pressed={fav}
        className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
        style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', color: fav ? 'var(--gv-gold)' : 'var(--gv-text-muted)' }}
      >
        <Heart size={17} fill={fav ? 'currentColor' : 'none'} aria-hidden />
      </button>
    </div>
  )
}

export default function AIDJComplace() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { historySongs } = useLibrary()
  const [searchOpen, setSearchOpen] = useState(false)

  const mode = MODE_LABEL[(profile?.role as AppRole) ?? 'listener'] ?? 'Listener'

  const genres = useMemo(() => availableGenres(), [])
  const moods = useMemo(() => availableMoods(), [])
  const trendingSongs = useMemo(() => trending(6), [])
  const verified = useMemo(() => humanVerified(8), [])
  const artists = useMemo(() => topArtists(8), [])

  // Personal trend layer — derived strictly from the user's REAL play history.
  const fresh = useMemo(() => freshForYou(historySongs, 6), [historySongs])
  const leanGenres = useMemo(() => yourGenres(historySongs), [historySongs])
  const topGenrePick = leanGenres[0]?.value
  const moreLike = useMemo(
    () => (topGenrePick ? moreLikeGenre(historySongs, topGenrePick, 6) : []),
    [historySongs, topGenrePick],
  )
  const hasHistory = historySongs.length > 0

  const [genre, setGenre] = useState(genres[0] ?? '')
  const [mood, setMood] = useState(moods[0] ?? '')
  const [bpmId, setBpmId] = useState(BPM_RANGES[2].id)

  const genreSongs = useMemo(() => (genre ? byGenre(genre).slice(0, 6) : []), [genre])
  const moodSongs = useMemo(() => (mood ? byMood(mood).slice(0, 6) : []), [mood])
  const bpmRange = BPM_RANGES.find(r => r.id === bpmId) ?? BPM_RANGES[0]
  const bpmSongs = useMemo(() => byBpmRange(bpmRange.min, bpmRange.max).slice(0, 6), [bpmRange.min, bpmRange.max])

  return (
    <AppShell>
      <GovernanceScope className="min-h-screen">
        {/* ── Header ── */}
        <header
          className="sticky top-0 z-30 safe-top"
          style={{
            background: 'color-mix(in srgb, var(--gv-bg) 88%, transparent)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--gv-border-faint)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5" style={{ height: 64 }}>
            <div className="min-w-0">
              <p className="gv-eyebrow">MUSVORA · AI DJ Complace</p>
              <h1
                className="font-bold leading-none truncate"
                style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-lg)', color: 'var(--gv-text)' }}
              >
                Music Director
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge tone="navy" variant="soft">Mode · {mode}</Badge>
              <button
                type="button"
                aria-label="Search music, artists and assets"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(true)}
                className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}
              >
                <Search size={18} strokeWidth={1.8} aria-hidden />
              </button>
            </div>
          </div>
        </header>

        <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="px-5 pt-5 pb-4 flex flex-col gap-8">
          {/* Intro */}
          <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 1.55 }}>
            No es un generador de playlists. Diseña experiencias musicales completas a partir de tu catálogo real.
          </p>

          {/* For You — adapts to the user's REAL play history (no fabrication) */}
          <section>
            <SectionHeader
              eyebrow="Adapts to your real listening"
              title="For You"
              actions={<Compass size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />}
            />

            {hasHistory && moreLike.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', fontWeight: 600 }}>
                  Because you've been into {topGenrePick}
                </p>
                <div className="flex flex-col gap-0.5">
                  {moreLike.map(s => <TrackRow key={s.id} song={s} context={moreLike} />)}
                </div>
              </div>
            )}

            <div>
              <p className="mb-1.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', fontWeight: 600 }}>
                Fresh for you · not in your history
              </p>
              {fresh.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {fresh.map(s => <TrackRow key={s.id} song={s} context={fresh} />)}
                </div>
              ) : (
                <Card padding="md">
                  <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                    You've played everything in the catalogue — new arrivals will surface here as they're added.
                  </p>
                </Card>
              )}
            </div>

            {!hasHistory && (
              <p className="mt-2" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>
                Play a few tracks and this section adapts to your taste — surfacing more of what you gravitate to.
              </p>
            )}
          </section>

          {/* Trending Now (real plays) */}
          <section>
            <SectionHeader
              eyebrow="Ranked by catalogue plays · Internal Preview"
              title="Trending Now"
              actions={<Flame size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />}
            />
            <div className="flex flex-col gap-0.5">
              {trendingSongs.map((s, i) => (
                <TrackRow key={s.id} song={s} context={trendingSongs} rank={i + 1} showPlays />
              ))}
            </div>
          </section>

          {/* Best by Genre */}
          <section>
            <SectionHeader eyebrow="Catalogue" title="Best by Genre" actions={<Disc3 size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-1.5">
              {genres.map(g => <Chip key={g} active={g === genre} onClick={() => setGenre(g)}>{g}</Chip>)}
            </div>
            <div className="flex flex-col gap-0.5">
              {genreSongs.map(s => <TrackRow key={s.id} song={s} context={genreSongs} />)}
            </div>
          </section>

          {/* Best by Mood */}
          <section>
            <SectionHeader eyebrow="Experience" title="Best by Mood" actions={<Sparkles size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-1.5">
              {moods.map(m => <Chip key={m} active={m === mood} onClick={() => setMood(m)}>{moodLabel(m)}</Chip>)}
            </div>
            <div className="flex flex-col gap-0.5">
              {moodSongs.map(s => <TrackRow key={s.id} song={s} context={moodSongs} />)}
            </div>
          </section>

          {/* Best by BPM */}
          <section>
            <SectionHeader eyebrow="Energy" title="Best by BPM" actions={<Activity size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-1.5">
              {BPM_RANGES.map(r => <Chip key={r.id} active={r.id === bpmId} onClick={() => setBpmId(r.id)}>{r.label}</Chip>)}
            </div>
            {bpmSongs.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {bpmSongs.map(s => <TrackRow key={s.id} song={s} context={bpmSongs} />)}
              </div>
            ) : (
              <Card padding="md">
                <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>No hay canciones en este rango de BPM todavía.</p>
              </Card>
            )}
          </section>

          {/* Human Verified Music */}
          <section>
            <SectionHeader eyebrow="MUSVORA Exclusive" title="Human Verified Music" actions={<ShieldCheck size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            {verified.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {verified.map(s => <TrackRow key={s.id} song={s} context={verified} />)}
              </div>
            ) : (
              <Card padding="md">
                <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>Aún no hay canciones Human Verified en el catálogo.</p>
              </Card>
            )}
          </section>

          {/* Top Artists by Plays */}
          <section>
            <SectionHeader eyebrow="People" title="Top Artists by Plays" actions={<Users size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="flex flex-col gap-0.5">
              {artists.map(a => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(a.name)}`)}
                  className="gv-focusable flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                  style={{ padding: '8px 6px', borderRadius: 'var(--gv-radius-md)' }}
                >
                  <span className="grid place-items-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
                    <Radio size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{a.name}</span>
                    <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                      {a.tracks} {a.tracks === 1 ? 'track' : 'tracks'}{a.plays > 0 ? ` · ${a.plays.toLocaleString()} plays` : ''}{a.verified ? ' · Human Verified' : ''}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Trend facets that need live cross-user data — honest roadmap, never faked */}
          <section>
            <SectionHeader eyebrow="Roadmap · needs live data" title="More Trending Soon" />
            <div className="flex flex-col gap-2">
              {PENDING_TREND_FACETS.map(({ title, note }) => (
                <Card key={title} padding="md">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}>
                      <TrendingUp size={17} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{title}</span>
                        <Badge tone="warning" variant="soft">Pending Integration</Badge>
                      </div>
                      <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>{note}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Experience Modes — architecture prepared, no fictional results */}
          <section>
            <SectionHeader eyebrow="Smart Event Planner" title="Experience Modes" actions={<PartyPopper size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="grid grid-cols-2 gap-2.5">
              {EXPERIENCE_MODES.map(({ icon: Icon, title, note }) => (
                <Card key={title} padding="md">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="grid place-items-center" style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}>
                        <Icon size={17} aria-hidden />
                      </span>
                      <Badge tone="navy" variant="soft">Coming Soon</Badge>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{title}</p>
                      <p className="mt-0.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.45 }}>{note}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Advanced intelligence & business — honest pending */}
          <section>
            <SectionHeader eyebrow="Roadmap" title="Intelligence & Business" />
            <div className="flex flex-col gap-2">
              {ADVANCED_MODULES.map(({ icon: Icon, title, status, note }) => (
                <Card key={title} padding="md">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}>
                      <Icon size={17} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{title}</span>
                        <Badge tone={status === 'Internal Preview' ? 'navy' : 'warning'} variant="soft">{status}</Badge>
                      </div>
                      <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>{note}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </GovernanceScope>
    </AppShell>
  )
}
