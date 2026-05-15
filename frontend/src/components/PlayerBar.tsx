import { memo, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../lib/player'
import { formatDuration } from '../utils/format'

function PlayerBar() {
  const { song, isPlaying, progress, elapsed, duration, togglePlay, seek, skip } = usePlayer()
  const navigate = useNavigate()

  const handleExpand = useCallback(() => {
    if (song) navigate(`/player/${song.id}`)
  }, [navigate, song])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(ratio * 100)
  }, [seek])

  const handleSkipBack = useCallback(() => skip(-1), [skip])
  const handleSkipFwd = useCallback(() => skip(1), [skip])

  if (!song) return null

  return (
    <div
      className="fixed bottom-[64px] left-0 right-0 z-30 px-3 pb-1"
      role="region"
      aria-label="Music player"
    >
      <div
        className="max-w-md mx-auto rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(var(--blur, 24px))' }}
      >
        <div
          className="h-0.5 w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.85) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
          }}
          onClick={handleSeek}
          role="slider"
          aria-label="Playback progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') seek(Math.min(100, progress + 2))
            if (e.key === 'ArrowLeft') seek(Math.max(0, progress - 2))
          }}
        />
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex-shrink-0 overflow-hidden cursor-pointer"
            onClick={handleExpand}
            aria-hidden
          >
            {song.artwork_url
              ? <img src={song.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-900" />
            }
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={handleExpand}>
            <p className="text-white text-sm font-semibold truncate">{song.title}</p>
            <p className="text-zinc-400 text-xs truncate">{song.artist_name}</p>
          </div>

          <div className="flex items-center gap-1 text-zinc-500 text-[10px] tabular-nums mr-1" aria-label="Playback time">
            <span>{formatDuration(elapsed)}</span>
            <span>/</span>
            <span>{formatDuration(duration)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSkipBack}
              aria-label="Previous song"
              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <SkipBack size={16} strokeWidth={2} aria-hidden />
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {isPlaying
                ? <Pause size={16} strokeWidth={2.5} aria-hidden />
                : <Play size={16} strokeWidth={2.5} aria-hidden />
              }
            </button>

            <button
              onClick={handleSkipFwd}
              aria-label="Next song"
              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <SkipForward size={16} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <button
            onClick={handleExpand}
            aria-label="Expand player"
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-lg"
          >
            <ChevronUp size={18} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(PlayerBar)
