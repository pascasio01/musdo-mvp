import { memo, useCallback } from 'react'
import { Play, Pause, BadgeCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../lib/player'
import type { Song } from '../types'

interface MusicCardProps {
  song: Song
  variant?: 'default' | 'compact' | 'featured'
}

function MusicCard({ song, variant = 'default' }: MusicCardProps) {
  const navigate = useNavigate()
  const { playSong, song: currentSong, isPlaying, togglePlay } = usePlayer()

  const isActive = currentSong?.id === song.id
  const isCurrentPlaying = isActive && isPlaying

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isActive) togglePlay()
    else playSong(song)
  }, [isActive, togglePlay, playSong, song])

  const handleNavigate = useCallback(() => navigate(`/player/${song.id}`), [navigate, song.id])

  /* ── Compact Row ─────────────────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group"
        style={{ background: isActive ? 'var(--glass-bg-medium)' : 'transparent' }}
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
        aria-label={`${song.title} by ${song.artist_name}`}
        onKeyDown={e => e.key === 'Enter' && handleNavigate()}
      >
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          {song.artwork_url
            ? <img src={song.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800" aria-hidden />
          }
          <button
            onClick={handlePlay}
            aria-label={isCurrentPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
            className="absolute inset-0 flex items-center justify-center bg-theme/50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          >
            {isCurrentPlaying
              ? <Pause size={14} className="text-white" aria-hidden />
              : <Play size={14} className="text-white" fill="white" aria-hidden />
            }
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-primary text-sm font-medium truncate">
              {song.title}
            </p>
            {song.human_verified && (
              <BadgeCheck size={13} className="text-blue-400 flex-shrink-0" aria-label="Human verified" />
            )}
          </div>
          <p className="text-muted text-xs truncate">{song.artist_name} · {song.genre}</p>
        </div>

        {isActive && (
          <div className="flex gap-0.5 items-end h-4" aria-label="Now playing">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-0.5 rounded-full ${isCurrentPlaying ? 'animate-pulse' : ''}`}
                style={{
                  height: `${6 + i * 3}px`,
                  background: 'var(--text-primary)',
                  opacity: isCurrentPlaying ? 1 : 0.4,
                  animationDelay: `${i * 0.15}s`,
                }}
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Featured Card ────────────────────────────────────────────── */
  if (variant === 'featured') {
    return (
      <article
        className="relative rounded-3xl overflow-hidden cursor-pointer group min-w-[260px] h-64 will-change-transform"
        onClick={handleNavigate}
        tabIndex={0}
        role="button"
        aria-label={`${song.title} by ${song.artist_name} — tap to open`}
        onKeyDown={e => e.key === 'Enter' && handleNavigate()}
      >
        <div className="absolute inset-0">
          {song.artwork_url
            ? <img src={song.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-900 via-zinc-900 to-black" aria-hidden />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" aria-hidden />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            {song.human_verified && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-400/15 border border-blue-400/30 rounded-full px-2 py-0.5">
                <BadgeCheck size={10} aria-hidden /> VERIFIED
              </span>
            )}
            <span className="text-[10px] text-white/70 bg-white/15 rounded-full px-2 py-0.5">{song.genre}</span>
          </div>
          <h3 className="text-white font-bold text-xl leading-tight">{song.title}</h3>
          <p className="text-white/60 text-sm mt-0.5">{song.artist_name}</p>
        </div>

        <button
          onClick={handlePlay}
          aria-label={isCurrentPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 focus:opacity-100"
        >
          {isCurrentPlaying
            ? <Pause size={16} className="text-white" aria-hidden />
            : <Play size={16} className="text-white" fill="white" aria-hidden />
          }
        </button>
      </article>
    )
  }

  /* ── Default Card ─────────────────────────────────────────────── */
  return (
    <article
      className="rounded-2xl border border-theme overflow-hidden cursor-pointer group transition-all duration-200 hover:border-glass will-change-transform"
      style={{ background: 'var(--glass-bg)' }}
      onClick={handleNavigate}
      tabIndex={0}
      role="button"
      aria-label={`${song.title} by ${song.artist_name}`}
      onKeyDown={e => e.key === 'Enter' && handleNavigate()}
    >
      <div className="relative aspect-square overflow-hidden">
        {song.artwork_url
          ? <img
              src={song.artwork_url}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
            />
          : <div className="w-full h-full bg-gradient-to-br from-violet-900 via-zinc-800 to-zinc-900" aria-hidden />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />

        <button
          onClick={handlePlay}
          aria-label={isCurrentPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-105 focus:opacity-100 focus:scale-105"
          style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
        >
          {isCurrentPlaying
            ? <Pause size={16} strokeWidth={2.5} aria-hidden />
            : <Play size={16} strokeWidth={2.5} aria-hidden />
          }
        </button>

        {song.human_verified && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-theme/50 backdrop-blur-sm border border-blue-400/30 rounded-full px-2 py-0.5"
            aria-label="Human verified"
          >
            <BadgeCheck size={10} aria-hidden /> VERIFIED
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-primary font-semibold truncate">{song.title}</h3>
        <p className="text-muted text-sm truncate">{song.artist_name}</p>
        <div className="flex items-center gap-2 mt-2" aria-label="Song metadata">
          <span className="text-[10px] text-muted bg-glass rounded-full px-2 py-0.5">{song.genre}</span>
          {song.bpm && <span className="text-[10px] text-muted">{song.bpm} BPM</span>}
          {song.key && <span className="text-[10px] text-muted">Key of {song.key}</span>}
        </div>
      </div>
    </article>
  )
}

export default memo(MusicCard)
