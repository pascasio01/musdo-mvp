import { Play, Pause, BadgeCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../lib/player'
import type { Song } from '../types'

interface MusicCardProps {
  song: Song
  variant?: 'default' | 'compact' | 'featured'
}

export default function MusicCard({ song, variant = 'default' }: MusicCardProps) {
  const navigate = useNavigate()
  const { playSong, song: currentSong, isPlaying, togglePlay } = usePlayer()

  const isActive = currentSong?.id === song.id
  const isCurrentPlaying = isActive && isPlaying

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isActive) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group
          ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
        onClick={() => navigate(`/player/${song.id}`)}
      >
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          {song.artwork_url
            ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800" />
          }
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play size={14} className="text-white" fill="white" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-100'}`}>{song.title}</p>
            {song.human_verified && <BadgeCheck size={13} className="text-blue-400 flex-shrink-0" />}
          </div>
          <p className="text-xs text-zinc-500 truncate">{song.artist_name} · {song.genre}</p>
        </div>
        {isActive && (
          <div className="flex gap-0.5 items-end h-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-0.5 bg-white rounded-full ${isCurrentPlaying ? 'animate-pulse' : ''}`}
                style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div
        className="relative rounded-3xl overflow-hidden cursor-pointer group min-w-[260px] h-64"
        onClick={() => navigate(`/player/${song.id}`)}
      >
        <div className="absolute inset-0">
          {song.artwork_url
            ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-900 via-zinc-900 to-black" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            {song.human_verified && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-400/15 border border-blue-400/30 rounded-full px-2 py-0.5">
                <BadgeCheck size={10} /> VERIFIED
              </span>
            )}
            <span className="text-[10px] text-zinc-400 bg-white/10 rounded-full px-2 py-0.5">{song.genre}</span>
          </div>
          <h3 className="text-white font-bold text-xl leading-tight">{song.title}</h3>
          <p className="text-zinc-400 text-sm mt-0.5">{song.artist_name}</p>
        </div>
        <button
          onClick={handlePlay}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
        >
          {isCurrentPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" fill="white" />}
        </button>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer group transition-all duration-200 hover:bg-white/8 hover:border-white/20`}
      onClick={() => navigate(`/player/${song.id}`)}
    >
      <div className="relative aspect-square overflow-hidden">
        {song.artwork_url
          ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-gradient-to-br from-violet-900 via-zinc-800 to-zinc-900" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
        >
          {isCurrentPlaying ? <Pause size={16} strokeWidth={2.5} /> : <Play size={16} strokeWidth={2.5} fill="black" />}
        </button>
        {song.human_verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-black/50 backdrop-blur-sm border border-blue-400/30 rounded-full px-2 py-0.5">
            <BadgeCheck size={10} /> VERIFIED
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{song.title}</h3>
        <p className="text-zinc-500 text-sm truncate">{song.artist_name}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-zinc-600 bg-white/5 rounded-full px-2 py-0.5">{song.genre}</span>
          {song.bpm && <span className="text-[10px] text-zinc-600">{song.bpm} BPM</span>}
          {song.key && <span className="text-[10px] text-zinc-600">Key of {song.key}</span>}
        </div>
      </div>
    </div>
  )
}
