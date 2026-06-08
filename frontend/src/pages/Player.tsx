import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronDown, Heart, Share2, MoreHorizontal, Play, Pause,
  SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Shield, FileText,
  Disc3, Quote, ShieldCheck, ListMusic, Dna, BookOpen,
  Lock, Headphones, Sparkles, ArrowRight,
} from 'lucide-react'
import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { usePlayer } from '../lib/player'
import { useLibrary } from '../lib/library'
import { usePermissions } from '../lib/usePermissions'
import { mockSongs } from '../data/mockData'
import type { Song, LicensingStatus } from '../types'
import VerificationBadge, { VerificationBadgeRow } from '../components/VerificationBadge'
import LyricsPanel from '../components/LyricsPanel'
import SafeListenPanel from '../components/audio/SafeListenPanel'
import AudioTuningPanel from '../components/audio/AudioTuningPanel'
import SpatialListeningPanel from '../components/audio/SpatialListeningPanel'
import IntelligenceBar from '../components/player/IntelligenceBar'
import { OwnershipPanel, LicensingPanel } from '../components/player/PlayerPanels'
import LockBadge from '../components/access/LockBadge'
import { getIntelligenceSignals } from '../data/assetIntelligence'
import { getLyricsForSong } from '../data/mockLyrics'
import { formatDuration } from '../utils/format'

type PlayerTab = 'now' | 'lyrics' | 'ownership' | 'licensing' | 'metadata'

const TABS: { id: PlayerTab; label: string; icon: typeof Disc3 }[] = [
  { id: 'now', label: 'Now Playing', icon: Disc3 },
  { id: 'lyrics', label: 'Lyrics', icon: Quote },
  { id: 'ownership', label: 'Ownership', icon: ShieldCheck },
  { id: 'licensing', label: 'Licensing', icon: FileText },
  { id: 'metadata', label: 'Metadata', icon: ListMusic },
]

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
    shuffle, repeatMode, toggleShuffle, cycleRepeat,
  } = usePlayer()

  const { isFavorite, toggleFavorite } = useLibrary()
  const perms = usePermissions()
  // Deep Listening (SafeListen · Audio Tuning · Spatial) is a Premium benefit.
  // While entitlement loads we treat it as unlocked to avoid flashing an upsell
  // at a paying member; once loaded, free users see the honest upsell instead.
  const deepListenUnlocked = perms.loading || perms.can('player.premium')
  const [tab, setTab] = useState<PlayerTab>('now')
  const [shareCopied, setShareCopied] = useState(false)

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

  const signals = useMemo(() => (song ? getIntelligenceSignals(song) : []), [song])

  const handleShare = useCallback(async () => {
    if (!song) return
    const url = `${window.location.origin}/player/${song.id}`
    const data = { title: song.title, text: `${song.title} — ${song.artist_name} · MUSVORA`, url }
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(data)
        return
      }
    } catch (err) {
      // User cancelled the native share sheet — don't fall back to clipboard.
      if (err instanceof DOMException && err.name === 'AbortError') return
      /* share failed for another reason — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 2000)
    } catch {
      /* clipboard unavailable — nothing else to do */
    }
  }, [song])

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
  const lyrics = getLyricsForSong(song.id)

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

      {shareCopied && (
        <div
          role="status"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-2 rounded-full text-xs font-semibold"
          style={{
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 24px var(--shadow)',
          }}
        >
          Link copied
        </div>
      )}

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
            {TABS.find(t => t.id === tab)?.label ?? 'Now Playing'}
          </p>
          <button
            onClick={() => navigate(`/passport/${song.id}`)}
            aria-label="Asset passport"
            className="transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <MoreHorizontal size={22} aria-hidden />
          </button>
        </div>

        {/* ── Persistent player head (visible across all tabs) ─────── */}

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
              onClick={() => song && toggleFavorite(song)}
              aria-label={song && isFavorite(song.id) ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={!!song && isFavorite(song.id)}
              className="transition-colors"
              style={{ color: song && isFavorite(song.id) ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              <Heart size={20} fill={song && isFavorite(song.id) ? 'currentColor' : 'none'} aria-hidden />
            </button>
            <button
              onClick={handleShare}
              aria-label={shareCopied ? 'Link copied' : 'Share'}
              title={shareCopied ? 'Link copied' : 'Share'}
              className="transition-colors"
              style={{ color: shareCopied ? 'var(--accent)' : 'var(--text-muted)' }}
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
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle"
            aria-pressed={shuffle}
            style={{ color: shuffle ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <Shuffle size={18} strokeWidth={shuffle ? 2.4 : 1.5} aria-hidden />
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
          <button
            onClick={cycleRepeat}
            aria-label={repeatMode === 'one' ? 'Repeat one' : repeatMode === 'all' ? 'Repeat all' : 'Repeat off'}
            aria-pressed={repeatMode !== 'off'}
            style={{ color: repeatMode !== 'off' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {repeatMode === 'one'
              ? <Repeat1 size={18} strokeWidth={2.4} aria-hidden />
              : <Repeat size={18} strokeWidth={repeatMode === 'all' ? 2.4 : 1.5} aria-hidden />}
          </button>
        </div>

        {/* MUSVORA Intelligence Bar — one discrete signal at a time */}
        <IntelligenceBar signals={signals} active={isPlaying} />

        {/* ── Segmented tab bar ───────────────────────────────────── */}
        <div
          className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide -mx-1 px-1"
          role="tablist"
          aria-label="Player sections"
        >
          {TABS.map(t => {
            const Icon = t.icon
            const selected = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 flex-shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors"
                style={{
                  background: selected ? 'var(--accent-soft)' : 'transparent',
                  color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-soft)'}`,
                }}
              >
                <Icon size={13} strokeWidth={2.2} aria-hidden />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* ── Tab content ─────────────────────────────────────────── */}

        {tab === 'now' && (
          <div className="grid gap-3">
            {/* Action row: Passport + License */}
            <div className="flex items-stretch gap-2">
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
                  <LockBadge feature="creator.marketplace" />
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

            {/* Creator insights — Music DNA + Song Story (Creator Pro) */}
            <div className="flex items-stretch gap-2">
              <button
                onClick={() => navigate(`/dna/${song.id}`)}
                className="flex-1 py-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <Dna size={14} aria-hidden />
                Music DNA
                <LockBadge feature="creator.insights" />
              </button>
              <button
                onClick={() => navigate(`/story/${song.id}`)}
                className="flex-1 py-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <BookOpen size={14} aria-hidden />
                Song Story
                <LockBadge feature="creator.insights" />
              </button>
            </div>

            {/* Audio intelligence — collapsed by default, never overloads the
                player. Deep Listening is a Premium benefit; free users get an
                honest upsell instead of locked-but-visible controls. */}
            {deepListenUnlocked ? (
              <>
                <SafeListenPanel />
                <AudioTuningPanel />
                <SpatialListeningPanel />
              </>
            ) : (
              <DeepListeningUpsell onUpgrade={() => navigate('/pricing')} />
            )}
          </div>
        )}

        {tab === 'lyrics' && (
          lyrics
            ? <LyricsPanel track={lyrics} elapsed={elapsedSec} variant="tab" />
            : <EmptyState>No lyrics on record for this asset yet.</EmptyState>
        )}

        {tab === 'ownership' && <OwnershipPanel song={song} />}

        {tab === 'licensing' && <LicensingPanel song={song} />}

        {tab === 'metadata' && <MetadataContent song={song} />}
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

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border text-center text-xs py-10 px-6"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-soft)', color: 'var(--text-muted)' }}
    >
      {children}
    </div>
  )
}

/**
 * Honest Premium upsell shown to free users in place of the Deep Listening
 * panels (SafeListen · Audio Tuning · Spatial). Styled with legacy dark-luxury
 * tokens so the cinematic player stays visually intact, and routes to the real
 * pricing page where checkout lives — no fake "coming soon".
 */
function DeepListeningUpsell({ onUpgrade }: { onUpgrade: () => void }) {
  const features = [
    { icon: ShieldCheck, label: 'SafeListen — protect your hearing' },
    { icon: ListMusic, label: 'Audio Tuning — Smart EQ & presets' },
    { icon: Headphones, label: 'Spatial Listening — width & depth' },
  ]
  return (
    <div
      className="rounded-2xl border overflow-hidden mt-3"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)' }}
    >
      <div className="px-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="grid place-items-center rounded-xl"
            style={{
              width: 34, height: 34,
              background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
              color: 'var(--accent)',
            }}
            aria-hidden
          >
            <Lock size={15} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--accent)' }}>
              Premium
            </p>
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              Deep Listening Mode
            </p>
          </div>
        </div>
        <p className="text-[12px] leading-snug mb-4" style={{ color: 'var(--text-muted)' }}>
          The cinematic premium player — SafeListen, Audio Tuning and Spatial audio — is part of MUSVORA Premium.
        </p>
        <div className="space-y-2 mb-4">
          {features.map(f => {
            const Icon = f.icon
            return (
              <div key={f.label} className="flex items-center gap-2.5">
                <Icon size={13} aria-hidden style={{ color: 'var(--text-secondary)' }} />
                <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
              </div>
            )
          })}
        </div>
        <button
          onClick={onUpgrade}
          className="w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          style={{
            background: 'var(--accent)',
            color: 'var(--text-inverse)',
            boxShadow: '0 8px 24px var(--accent-soft)',
          }}
        >
          <Sparkles size={14} aria-hidden />
          View plans
          <ArrowRight size={14} aria-hidden />
        </button>
      </div>
    </div>
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

/**
 * Metadata tab — Credits · Technical · Royalty Split · Analytics, always open.
 * (Replaces the legacy collapsible "Credits & Analytics" panel, surfaced as a tab.)
 */
function MetadataContent({ song }: { song: Song }) {
  const c = song.credits
  const a = song.analytics
  if (!c && !a && !song.bpm) {
    return <EmptyState>No metadata on record for this asset yet.</EmptyState>
  }

  return (
    <div
      className="rounded-2xl border p-4 grid gap-3 text-xs"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-soft)' }}
    >
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
