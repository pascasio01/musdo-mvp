import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronDown, Heart, Share2, MoreHorizontal, Play, Pause,
  SkipBack, SkipForward, Repeat, Shuffle, Shield, FileText,
  ChevronRight, Sparkles,
} from 'lucide-react'
import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { usePlayer } from '../lib/player'
import { mockSongs } from '../data/mockData'
import type { Song, LicensingStatus } from '../types'
import VerificationBadge, { VerificationBadgeRow } from '../components/VerificationBadge'
import LyricsPanel from '../components/LyricsPanel'
import { getLyricsForSong } from '../data/mockLyrics'
import { formatDuration } from '../utils/format'

function qualityLabel(q?: Song['audio_quality']): string {
  const map: Record<string, string> = {
    demo_mp3: 'Demo · MP3',
    demo_wav: 'Demo · WAV',
    master_wav: 'Master · WAV',
    lossless_flac: 'Lossless · FLAC',
    streaming_aac: 'Stream · AAC',
  }
  return q ? map[q] ?? q : ''
}

function licensingLabel(status?: LicensingStatus): string {
  const map: Record<LicensingStatus, string> = {
    available: 'License Available',
    private: 'Private',
    sold: 'Licensed',
    pending: 'License Pending',
    licensing_only: 'Licensing Only',
  }
  return status ? map[status] : ''
}

function moodLabel(m?: string): string {
  if (!m) return ''
  return m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    song: activeSong, playSong, isPlaying, progress, elapsed, duration,
    seek, togglePlay, skip,
  } = usePlayer()

  const [liked, setLiked] = useState(false)
  const [showCredits, setShowCredits] = useState(false)

  const song: Song | undefined = useMemo(
    () => mockSongs.find(s => s.id === id) ?? activeSong ?? mockSongs[0],
    [id, activeSong],
  )

  useEffect(() => {
    if (song && activeSong?.id !== song.id) {
      playSong(song, mockSongs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    seek(Math.max(0, Math.min(100, pct)))
  }, [seek])

  if (!song) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}
      >
        <p>Song not found</p>
      </div>
    )
  }

  const total = song.duration ?? duration ?? 0
  const elapsedSec = song.duration ? Math.floor((progress / 100) * song.duration) : Math.floor(elapsed)
  const canRequestLicense = song.licensing_status === 'available'

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {/* ── Cinematic ambient cover backdrop ──────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {song.artwork_url && (
          <img
            src={song.artwork_url}
            alt=""
            className="w-full h-full object-cover scale-110 transition-opacity duration-700"
            style={{ opacity: 0.18, filter: 'blur(40px)' }}
          />
        )}
        {/* Aura layer reacts to current song mood/genre via AuraConnector */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top, var(--aura-primary, transparent) 0%, transparent 55%), radial-gradient(ellipse at bottom, var(--aura-secondary, transparent) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg) 30%, transparent) 0%, var(--bg) 95%)' }}
        />
      </div>

      <div className="relative flex flex-col flex-1 max-w-md mx-auto w-full px-6 pt-12 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            aria-label="Close player"
            className="transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronDown size={28} aria-hidden />
          </button>
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
            Now Playing
          </p>
          <button
            aria-label="More options"
            className="transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <MoreHorizontal size={22} aria-hidden />
          </button>
        </div>

        {/* Floating cover art */}
        <div
          className="relative aspect-square w-full max-w-[300px] mx-auto rounded-3xl overflow-hidden mb-7"
          style={{
            boxShadow: '0 30px 80px -20px var(--aura-glow, var(--shadow)), 0 8px 30px var(--shadow)',
          }}
        >
          {song.artwork_url ? (
            <img
              src={song.artwork_url}
              alt={song.title}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: isPlaying ? 'scale(1.0)' : 'scale(0.96)' }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--surface), var(--bg))' }}
              aria-hidden
            />
          )}
          {song.human_verified && (
            <div className="absolute top-3 right-3">
              <VerificationBadge type="human_verified" size="sm" showLabel />
            </div>
          )}
        </div>

        {/* Title + Meta */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-2xl leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
              {song.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{song.artist_name}</p>
              <VerificationBadgeRow
                verified_artist
                verified_composer={song.verified_rights_holder}
                size="xs"
              />
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Chip>{song.genre}</Chip>
              {song.mood && <Chip>{moodLabel(song.mood)}</Chip>}
              {song.bpm && <Chip subtle>{song.bpm} BPM</Chip>}
              {song.key && <Chip subtle>Key of {song.key}</Chip>}
              {song.audio_quality && <Chip subtle>{qualityLabel(song.audio_quality)}</Chip>}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={() => setLiked(v => !v)}
              aria-label={liked ? 'Unlike' : 'Like'}
              className="transition-colors"
              style={{ color: liked ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} aria-hidden />
            </button>
            <button
              aria-label="Share"
              className="transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Share2 size={18} aria-hidden />
            </button>
          </div>
        </div>

        {/* Waveform / progress bar */}
        <div className="mb-2">
          <Waveform progress={progress} />
        </div>
        <div
          className="relative h-1 rounded-full cursor-pointer mb-2 outline-none focus-visible:ring-2"
          style={{ background: 'var(--border)' }}
          onClick={handleSeek}
          role="slider"
          tabIndex={0}
          aria-label="Playback progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); seek(Math.min(100, progress + 5)) }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(Math.max(0, progress - 5)) }
            else if (e.key === 'Home') { e.preventDefault(); seek(0) }
            else if (e.key === 'End') { e.preventDefault(); seek(100) }
          }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: 'var(--text-primary)' }}
          />
          <div
            className="absolute top-1/2 w-3.5 h-3.5 rounded-full"
            style={{
              left: `${progress}%`,
              transform: 'translate(-50%, -50%)',
              background: 'var(--text-primary)',
              boxShadow: '0 2px 6px var(--shadow)',
            }}
            aria-hidden
          />
        </div>
        <div className="flex justify-between text-[11px] tabular-nums mb-7" style={{ color: 'var(--text-muted)' }}>
          <span>{formatDuration(elapsedSec)}</span>
          <span>{formatDuration(total)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-7">
          <button aria-label="Shuffle" style={{ color: 'var(--text-muted)' }}>
            <Shuffle size={18} strokeWidth={1.5} aria-hidden />
          </button>
          <button onClick={() => skip(-1)} aria-label="Previous song" style={{ color: 'var(--text-secondary)' }}>
            <SkipBack size={26} strokeWidth={1.5} aria-hidden />
          </button>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105"
            style={{
              background: 'var(--text-primary)',
              color: 'var(--text-inverse)',
              boxShadow: '0 12px 30px var(--aura-glow, var(--shadow))',
            }}
          >
            {isPlaying
              ? <Pause size={22} strokeWidth={2.5} aria-hidden />
              : <Play size={22} strokeWidth={2.5} aria-hidden fill="currentColor" />}
          </button>
          <button onClick={() => skip(1)} aria-label="Next song" style={{ color: 'var(--text-secondary)' }}>
            <SkipForward size={26} strokeWidth={1.5} aria-hidden />
          </button>
          <button aria-label="Repeat" style={{ color: 'var(--text-muted)' }}>
            <Repeat size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        {/* Action row: Passport + License */}
        <div className="flex items-stretch gap-2 mb-3">
          <button
            onClick={() => navigate(`/passport/${song.id}`)}
            className="flex-1 py-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <Shield size={14} aria-hidden />
            Song Passport
          </button>
          {canRequestLicense ? (
            <button
              onClick={() => navigate('/market')}
              className="flex-1 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              style={{
                background: 'var(--accent)',
                color: 'var(--text-inverse)',
                boxShadow: '0 8px 24px var(--accent-soft)',
              }}
            >
              <FileText size={14} aria-hidden />
              Request License
            </button>
          ) : (
            <div
              className="flex-1 py-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {licensingLabel(song.licensing_status)}
            </div>
          )}
        </div>

        {/* Credits & Analytics expandable */}
        <CreditsPanel song={song} expanded={showCredits} onToggle={() => setShowCredits(v => !v)} />

        {/* Cinematic lyrics — expandable, time-synced via global player */}
        <LyricsPanel track={getLyricsForSong(song.id)} elapsed={elapsedSec} />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */

function Chip({ children, subtle }: { children: React.ReactNode; subtle?: boolean }) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full"
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

/**
 * Decorative waveform/equalizer mock. Single SVG element — GPU-cheap, no per-bar
 * React diffing, no per-bar transitions. Repaints once per progress tick.
 * Respects prefers-reduced-motion (no animation here).
 */
const WAVEFORM_BARS = 56
const WAVEFORM_HEIGHTS = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
  const seed = (Math.sin(i * 1.7) + 1) / 2
  return 30 + seed * 70
})

const Waveform = memo(function Waveform({ progress }: { progress: number }) {
  const filledIndex = Math.floor((progress / 100) * WAVEFORM_BARS)
  return (
    <svg
      viewBox={`0 0 ${WAVEFORM_BARS * 4} 40`}
      preserveAspectRatio="none"
      className="w-full h-10 block"
      aria-hidden
    >
      {WAVEFORM_HEIGHTS.map((h, i) => {
        const reached = i < filledIndex
        const barH = (h / 100) * 36
        const y = (40 - barH) / 2
        return (
          <rect
            key={i}
            x={i * 4}
            y={y}
            width={2}
            height={barH}
            rx={1}
            fill={reached ? 'var(--text-primary)' : 'var(--border)'}
            opacity={reached ? 0.95 : 0.55}
          />
        )
      })}
    </svg>
  )
})

interface CreditsPanelProps {
  song: Song
  expanded: boolean
  onToggle: () => void
}

function CreditsPanel({ song, expanded, onToggle }: CreditsPanelProps) {
  const c = song.credits
  const a = song.analytics
  const hasContent = !!(c || a)
  if (!hasContent) return null

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)' }}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full flex items-center gap-2 px-4 py-3 text-left transition-colors"
      >
        <Sparkles size={13} style={{ color: 'var(--accent)' }} aria-hidden />
        <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          Credits & Analytics
        </span>
        <ChevronRight
          size={16}
          aria-hidden
          style={{
            color: 'var(--text-muted)',
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 200ms ease',
          }}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 grid gap-3 text-xs" style={{ borderTop: '1px solid var(--border-soft)' }}>
          {c && (
            <Section title="Credits">
              {c.composer && <Row label="Composer" value={c.composer} />}
              {c.producer && <Row label="Producer" value={c.producer} />}
              {c.arranger && <Row label="Arranger" value={c.arranger} />}
              {c.engineer && <Row label="Engineer" value={c.engineer} />}
              {c.instruments && c.instruments.length > 0 && (
                <Row label="Instruments" value={c.instruments.join(' · ')} />
              )}
              {c.copyright_owner && <Row label="© Owner" value={c.copyright_owner} />}
            </Section>
          )}

          {song.bpm && (
            <Section title="Technical">
              <Row label="BPM" value={String(song.bpm)} />
              {song.key && <Row label="Key" value={song.key} />}
              {song.audio_quality && <Row label="Quality" value={qualityLabel(song.audio_quality)} />}
              {song.licensing_status && <Row label="Licensing" value={licensingLabel(song.licensing_status)} />}
            </Section>
          )}

          {c?.royalty_split && c.royalty_split.length > 0 && (
            <Section title="Royalty Split">
              {c.royalty_split.map(split => (
                <Row key={split.name} label={split.name} value={`${split.percent}%`} />
              ))}
            </Section>
          )}

          {a && (
            <Section title="Analytics">
              {a.plays != null && <Row label="Plays" value={a.plays.toLocaleString()} />}
              {a.emotional_engagement != null && (
                <Row label="Emotional Engagement" value={`${a.emotional_engagement}%`} />
              )}
              {a.avg_listen_time != null && (
                <Row label="Avg Listen" value={formatDuration(a.avg_listen_time)} />
              )}
            </Section>
          )}

          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Mock metadata for demo purposes. Verification does not guarantee legal copyright registration.
          </p>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {title}
      </p>
      <div className="grid gap-1">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-[11px] font-medium text-right truncate" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}
