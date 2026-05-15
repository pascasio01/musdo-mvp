import { usePlayer } from '../lib/player'
import { Play, Pause, SkipForward, SkipBack, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerBar() {
  const { song, isPlaying, progress, togglePlay } = usePlayer()
  const navigate = useNavigate()

  if (!song) return null

  const elapsed = Math.floor((progress / 100) * (song.duration ?? 0))
  const total = song.duration ?? 0

  return (
    <div className="fixed bottom-[64px] left-0 right-0 z-30 px-3 pb-1">
      <div className="max-w-md mx-auto rounded-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div
          className="h-0.5 bg-white/20 w-full"
          style={{ background: `linear-gradient(to right, rgba(255,255,255,0.9) ${progress}%, rgba(255,255,255,0.15) ${progress}%)` }}
        />
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex-shrink-0 overflow-hidden cursor-pointer"
            onClick={() => navigate(`/player/${song.id}`)}
          >
            {song.artwork_url ? (
              <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-900" />
            )}
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/player/${song.id}`)}>
            <p className="text-white text-sm font-semibold truncate">{song.title}</p>
            <p className="text-zinc-400 text-xs truncate">{song.artist_name}</p>
          </div>

          <div className="flex items-center gap-1 text-zinc-500 text-[10px] mr-2">
            <span>{formatTime(elapsed)}</span>
            <span>/</span>
            <span>{formatTime(total)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-zinc-500 hover:text-white transition-colors">
              <SkipBack size={16} strokeWidth={2} />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={16} strokeWidth={2.5} /> : <Play size={16} strokeWidth={2.5} />}
            </button>

            <button className="text-zinc-500 hover:text-white transition-colors">
              <SkipForward size={16} strokeWidth={2} />
            </button>
          </div>

          <button
            className="text-zinc-500 hover:text-white transition-colors"
            onClick={() => navigate(`/player/${song.id}`)}
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
