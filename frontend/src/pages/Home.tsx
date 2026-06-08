import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Search,
  Play,
  Radio,
  Library as LibraryIcon,
  ChevronRight,
  ArrowRight,
  Compass,
  ShieldCheck,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge, Button, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import GlobalSearch from '../components/home/GlobalSearch'
import { useAuth } from '../lib/auth'
import { useLibrary } from '../lib/library'
import { MDLS } from '../lib/mdls'
import { usePlayer } from '../lib/player'
import { mockSongs } from '../data/mockData'
import type { Song } from '../types'
import { STATUS_META, scoreStatus } from '../data/readiness'
import { ASSET_INTELLIGENCE } from '../data/dashboard'
import { readinessScore } from '../data/assetIntelligence'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  if (h < 22) return 'Good evening'
  return 'Late-night session'
}

/** A square artwork tile used in the horizontal listening rows. */
function ArtworkTile({ song, onPlay }: { song: Song; onPlay: (s: Song) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(song)}
      className="group flex-shrink-0 text-left active:opacity-80 transition-opacity"
      style={{ width: 144 }}
    >
      <div
        className="relative w-full overflow-hidden mb-2"
        style={{
          aspectRatio: '1 / 1',
          borderRadius: 'var(--gv-radius-lg)',
          background: 'var(--gv-surface-2)',
          border: '1px solid var(--gv-border)',
        }}
      >
        {song.artwork_url && <img src={song.artwork_url} alt="" className="w-full h-full object-cover" />}
        <span
          className="absolute bottom-2 right-2 grid place-items-center rounded-full"
          style={{ width: 32, height: 32, background: 'var(--gv-gold)', color: 'var(--gv-navy)', boxShadow: 'var(--gv-shadow-md)' }}
          aria-hidden
        >
          <Play size={15} fill="currentColor" style={{ marginLeft: 1 }} />
        </span>
      </div>
      <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
        {song.title}
      </p>
      <p className="truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
        {song.artist_name}
      </p>
    </button>
  )
}

function HRow({ songs, onPlay }: { songs: Song[]; onPlay: (s: Song) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
      {songs.map(song => (
        <ArtworkTile key={song.id} song={song} onPlay={onPlay} />
      ))}
    </div>
  )
}

/** A large, single-tap navigation card — one of the Home primary areas. */
function AreaCard({
  icon,
  eyebrow,
  title,
  description,
  meta,
  accent,
  onClick,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  description: string
  meta?: React.ReactNode
  accent?: 'gold' | 'navy'
  onClick: () => void
}) {
  const ring =
    accent === 'gold'
      ? 'var(--gv-gold)'
      : accent === 'navy'
      ? 'var(--gv-text-link)'
      : 'var(--gv-text-secondary)'
  return (
    <Card padding="none" accent={accent}>
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-4 text-left active:opacity-70 transition-opacity"
        style={{ padding: 'var(--gv-space-5)' }}
      >
        <span
          className="grid place-items-center flex-shrink-0"
          style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--gv-radius-md)',
            background: 'var(--gv-surface-2)',
            border: '1px solid var(--gv-border)',
            color: ring,
          }}
          aria-hidden
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="gv-eyebrow mb-0.5">{eyebrow}</p>
          <h3 className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>
            {title}
          </h3>
          <p
            className="mt-0.5"
            style={{
              fontSize: 'var(--gv-text-xs)',
              color: 'var(--gv-text-secondary)',
              lineHeight: 'var(--gv-leading-normal)',
            }}
          >
            {description}
          </p>
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        <ChevronRight size={18} strokeWidth={2} style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
      </button>
    </Card>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const { profile } = useAuth()
  const { playSong } = usePlayer()
  const { historySongs, favoriteSongs, playlists } = useLibrary()
  const displayName = profile?.username ?? 'Emmanuel'

  const onPlay = (song: Song) => {
    playSong(song, mockSongs)
    navigate(`/player/${song.id}`)
  }

  // Continue Listening — real, per-user play history (honest empty state below).
  const continueListening = historySongs.slice(0, 8)

  // Discover — browsable catalogue, surfaced by readiness (highest first).
  const discover = [...mockSongs].sort((a, b) => readinessScore(b) - readinessScore(a)).slice(0, 8)

  // My Music — catalogue health, consolidated. Full detail lives at /readiness.
  const ai = ASSET_INTELLIGENCE
  const readinessStatus = scoreStatus(ai.readinessScore)
  const readinessMeta = STATUS_META[readinessStatus]

  return (
    <AppShell>
      <GovernanceScope className="min-h-screen">
        {/* ── Sticky header — search always visible ── */}
        <header
          className="sticky top-0 z-30 safe-top"
          style={{
            background: 'color-mix(in srgb, var(--gv-bg) 88%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--gv-border-faint)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5" style={{ height: 64 }}>
            <div className="min-w-0">
              <p className="gv-eyebrow">MUSVORA</p>
              <h1
                className="font-bold leading-none truncate"
                style={{
                  fontFamily: 'var(--gv-font-display)',
                  fontSize: 'var(--gv-text-lg)',
                  color: 'var(--gv-text)',
                }}
              >
                {greeting()}, {displayName}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                aria-label="Search music, artists and assets"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(true)}
                className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--gv-radius-md)',
                  background: 'var(--gv-surface-2)',
                  border: '1px solid var(--gv-border)',
                  color: 'var(--gv-text-secondary)',
                }}
              >
                <Search size={18} strokeWidth={1.8} aria-hidden />
              </button>
              <button
                type="button"
                aria-label={MDLS.signals.title}
                className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--gv-radius-md)',
                  background: 'var(--gv-surface-2)',
                  border: '1px solid var(--gv-border)',
                  color: 'var(--gv-text-secondary)',
                  position: 'relative',
                }}
              >
                <Bell size={18} strokeWidth={1.8} aria-hidden />
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 9,
                    right: 9,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--gv-gold)',
                  }}
                />
              </button>
            </div>
          </div>
        </header>

        <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="px-5 pt-6">
          {/* ── 1 · Continue Listening ── */}
          <section>
            <SectionHeader eyebrow="Resume" title={MDLS.discovery.continueListening} />
            {continueListening.length > 0 ? (
              <HRow songs={continueListening} onPlay={onPlay} />
            ) : (
              <Card padding="lg">
                <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                  Aún no has reproducido nada. Tu música reciente aparecerá aquí.
                </p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => discover[0] && onPlay(discover[0])}
                    leadingIcon={<Play size={15} fill="currentColor" />}
                  >
                    Empezar a escuchar
                  </Button>
                </div>
              </Card>
            )}
          </section>

          {/* ── 2 · Discover ── */}
          <section className="mt-8">
            <SectionHeader
              eyebrow={MDLS.curatedForYou}
              title={MDLS.discovery.explore}
              description="Catálogo de muestra de MUSVORA, ordenado por preparación."
              actions={
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="gv-focusable inline-flex items-center gap-1 font-semibold active:scale-95 transition-transform"
                  style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-link)' }}
                >
                  Buscar <Search size={13} strokeWidth={2.4} />
                </button>
              }
            />
            <HRow songs={discover} onPlay={onPlay} />
          </section>

          {/* ── 3 · AI Music Director ── */}
          <section className="mt-8">
            <AreaCard
              accent="gold"
              icon={<Radio size={20} strokeWidth={1.9} />}
              eyebrow="Your Music Director"
              title="MUSVORA AI"
              description="Recomendado para ti según lo que escuchas — sesiones, moods y tendencias reales de tu catálogo."
              onClick={() => navigate('/music-director')}
            />
          </section>

          {/* ── 4 · Library ── */}
          <section className="mt-3">
            <AreaCard
              accent="navy"
              icon={<LibraryIcon size={20} strokeWidth={1.9} />}
              eyebrow="Saved"
              title={MDLS.library.title}
              description="Favoritos, historial y tus colecciones, en un solo lugar."
              meta={
                <div className="flex items-center gap-2">
                  <Badge tone="neutral" variant="soft">{favoriteSongs.length} favoritos</Badge>
                  <Badge tone="neutral" variant="soft">{playlists.length} colecciones</Badge>
                </div>
              }
              onClick={() => navigate('/library')}
            />
          </section>

          {/* ── 5 · My Music — catalogue health, consolidated ── */}
          <section className="mt-8">
            <SectionHeader
              eyebrow="My Music"
              title="Tu catálogo"
              actions={
                <button
                  type="button"
                  onClick={() => navigate('/readiness')}
                  className="gv-focusable inline-flex items-center gap-1 font-semibold active:scale-95 transition-transform"
                  style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-link)' }}
                >
                  Ver detalle <ArrowRight size={13} strokeWidth={2.4} />
                </button>
              }
            />
            <Card padding="lg" accent={readinessMeta.tone === 'danger' ? 'danger' : readinessMeta.tone === 'warning' ? 'warning' : 'success'}>
              <button
                type="button"
                onClick={() => navigate('/readiness')}
                className="w-full flex items-center gap-5 text-left active:opacity-70 transition-opacity"
              >
                <ReadinessRing
                  value={ai.readinessScore}
                  color={readinessMeta.color}
                  size={92}
                  ariaLabel={`Overall readiness score ${ai.readinessScore} out of 100 — ${readinessMeta.label}`}
                >
                  <span className="gv-mono font-extrabold leading-none" style={{ fontSize: 'var(--gv-text-2xl)', color: 'var(--gv-text)' }}>
                    {ai.readinessScore}
                  </span>
                  <span className="gv-eyebrow mt-0.5">/ 100</span>
                </ReadinessRing>
                <div className="min-w-0 flex-1">
                  <div className="mb-2">
                    <Badge tone={readinessMeta.tone} variant="outline">{readinessMeta.label}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1" style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-secondary)' }}>
                    <span><span className="gv-mono font-bold" style={{ color: 'var(--gv-text)' }}>{ai.catalogAssets}</span> activos</span>
                    <span><span className="gv-mono font-bold" style={{ color: 'var(--gv-danger)' }}>{ai.worksAtRisk}</span> en riesgo</span>
                    <span><span className="gv-mono font-bold" style={{ color: 'var(--gv-gold)' }}>{ai.revenueOpportunities}</span> oportunidades</span>
                  </div>
                </div>
                <ChevronRight size={18} strokeWidth={2} style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
              </button>
            </Card>
            <p
              className="mt-2"
              style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-faint)', lineHeight: 'var(--gv-leading-normal)' }}
            >
              Inteligencia ilustrativa con datos internos. No es asesoría financiera ni ingresos garantizados.
            </p>
          </section>
        </div>
      </GovernanceScope>
    </AppShell>
  )
}
