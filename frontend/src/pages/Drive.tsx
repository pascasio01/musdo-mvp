import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Radio, Plug, TrendingUp, Sparkles } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge, SectionHeader } from '../components/governance'
import { usePlayer } from '../lib/player'
import { buildDrive, driveStats, type DriveSection } from '../lib/drive'
import type { Song } from '../types'

/**
 * MUSVORA Drive — the living catalogue.
 *
 * A real, user-facing discovery surface. Live rows are built strictly from the
 * catalogue (new releases by date, genres that exist, real play rankings).
 * Sources MUSVORA is not connected to yet render an honest "Pending Integration"
 * state — never fabricated tracks. See lib/drive.ts for the data contract.
 */
export default function Drive() {
  const navigate = useNavigate()
  const { playSong } = usePlayer()

  const sections = useMemo(() => buildDrive(), [])
  const stats = useMemo(() => driveStats(sections), [sections])

  const onPlay = (song: Song, queue: Song[]) => {
    playSong(song, queue)
    navigate(`/player/${song.id}`)
  }

  return (
    <AppShell>
      <GovernanceScope>
        <div className="px-5 pt-6 pb-10">
          {/* Header */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="gv-focusable inline-flex items-center gap-2 mb-5 active:opacity-70 transition-opacity"
            style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}
          >
            <ArrowLeft size={18} strokeWidth={2} aria-hidden />
            Volver
          </button>

          <div className="flex items-start gap-3 mb-5">
            <span
              className="grid place-items-center flex-shrink-0"
              style={{ width: 48, height: 48, borderRadius: 'var(--gv-radius-lg)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-gold)' }}
              aria-hidden
            >
              <Radio size={22} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <p className="gv-eyebrow">Catálogo vivo</p>
              <h1 className="font-bold" style={{ fontSize: 'var(--gv-text-xl)', color: 'var(--gv-text)', lineHeight: 'var(--gv-leading-tight)' }}>
                MUSVORA Drive
              </h1>
              <p className="mt-1" style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                Lanzamientos y tendencias en tiempo real. Las fuentes aún no conectadas se marcan como Pending Integration — sin datos inventados.
              </p>
            </div>
          </div>

          {/* Honest status summary */}
          <div className="flex flex-wrap items-center gap-2 mb-7">
            <Badge tone="success" variant="soft" icon={<Sparkles size={11} strokeWidth={2.2} />}>
              {stats.live} en vivo
            </Badge>
            <Badge tone="warning" variant="soft" icon={<Plug size={11} strokeWidth={2.2} />}>
              {stats.pending} Pending Integration
            </Badge>
            <Badge tone="neutral" variant="soft" icon={<TrendingUp size={11} strokeWidth={2.2} />}>
              {stats.tracks} pistas reales
            </Badge>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map(section => (
              <DriveRow key={section.id} section={section} onPlay={onPlay} />
            ))}
          </div>
        </div>
      </GovernanceScope>
    </AppShell>
  )
}

function DriveRow({ section, onPlay }: { section: DriveSection; onPlay: (song: Song, queue: Song[]) => void }) {
  return (
    <section>
      <SectionHeader
        eyebrow={section.status === 'live' ? 'En vivo' : 'Pending Integration'}
        title={section.title}
        description={section.subtitle}
      />
      {section.status === 'live' ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
          {section.songs.map((song, i) => (
            <DriveTile key={song.id} song={song} rank={i + 1} onPlay={() => onPlay(song, section.songs)} />
          ))}
        </div>
      ) : (
        <PendingCard reason={section.pendingReason} />
      )}
    </section>
  )
}

function DriveTile({ song, rank, onPlay }: { song: Song; rank: number; onPlay: () => void }) {
  const plays = song.analytics?.plays
  return (
    <button
      type="button"
      onClick={onPlay}
      className="gv-focusable flex-shrink-0 text-left active:scale-95 transition-transform"
      style={{ width: 148 }}
    >
      <span
        className="relative block overflow-hidden"
        style={{ width: 148, height: 148, borderRadius: 'var(--gv-radius-lg)', border: '1px solid var(--gv-glass-border)', background: 'var(--gv-surface-2)' }}
      >
        {song.artwork_url ? (
          <img src={song.artwork_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : null}
        <span
          className="absolute grid place-items-center"
          style={{ bottom: 8, right: 8, width: 34, height: 34, borderRadius: '999px', background: 'color-mix(in srgb, var(--gv-bg) 70%, transparent)', backdropFilter: 'blur(8px)', color: 'var(--gv-gold)', border: '1px solid var(--gv-glass-border)' }}
          aria-hidden
        >
          <Play size={15} fill="currentColor" style={{ marginLeft: 1 }} />
        </span>
        <span
          className="absolute font-bold"
          style={{ top: 8, left: 8, fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text)', background: 'color-mix(in srgb, var(--gv-bg) 60%, transparent)', backdropFilter: 'blur(8px)', padding: '2px 7px', borderRadius: '999px' }}
        >
          #{rank}
        </span>
      </span>
      <p className="mt-2 font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
        {song.title}
      </p>
      <p className="truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
        {song.artist_name}
      </p>
      <p className="mt-0.5 truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-faint)' }}>
        {song.genre}{typeof plays === 'number' ? ` · ${plays.toLocaleString()} listens` : ''}
      </p>
    </button>
  )
}

function PendingCard({ reason }: { reason: string }) {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-3">
        <span
          className="grid place-items-center flex-shrink-0"
          style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-warning-soft)', color: 'var(--gv-warning)' }}
          aria-hidden
        >
          <Plug size={18} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <div className="mb-1">
            <Badge tone="warning" variant="soft">Pending Integration</Badge>
          </div>
          <p style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
            {reason}
          </p>
        </div>
      </div>
    </Card>
  )
}
