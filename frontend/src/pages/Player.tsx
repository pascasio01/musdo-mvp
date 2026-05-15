import { useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, Share2, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, BadgeCheck, Shield } from 'lucide-react'
import { usePlayer } from '../lib/player'
import { mockSongs } from '../data/mockData'
import { useEffect, useState } from 'react'
import type { Song } from '../types'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { song: activeSong, playSong, isPlaying, progress, setProgress, togglePlay } = usePlayer()
  const [liked, setLiked] = useState(false)
  const [localProgress, setLocalProgress] = useState(0)

  const song: Song | undefined = mockSongs.find(s => s.id === id) ?? activeSong ?? mockSongs[0]

  useEffect(() => {
    if (song && activeSong?.id !== song.id) {
      playSong(song)
    }
  }, [id])

  useEffect(() => {
    setLocalProgress(progress)
  }, [progress])

  const elapsed = Math.floor((localProgress / 100) * (song?.duration ?? 0))
  const total = song?.duration ?? 0

  if (!song) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-500">Song not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {song.artwork_url && (
          <img src={song.artwork_url} alt="" className="w-full h-full object-cover opacity-10 blur-2xl scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
      </div>

      <div className="relative flex flex-col flex-1 max-w-md mx-auto w-full px-6 pt-14 pb-8">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white transition-colors">
            <ChevronDown size={28} />
          </button>
          <div className="text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Now Playing</p>
          </div>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="relative aspect-square w-full max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-2xl mb-8">
            {song.artwork_url
              ? <img src={song.artwork_url} alt={song.title} className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-100' : 'scale-95'}`} />
              : <div className="w-full h-full bg-gradient-to-br from-violet-900 via-zinc-800 to-black" />
            }
            {song.human_verified && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-black/60 backdrop-blur-sm border border-blue-400/30 rounded-full px-3 py-1.5">
                <BadgeCheck size={13} />
                Human Verified
              </div>
            )}
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-black text-3xl leading-tight truncate">{song.title}</h1>
              <p className="text-zinc-400 mt-1">{song.artist_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-zinc-600 bg-white/5 rounded-full px-2.5 py-0.5 border border-white/10">{song.genre}</span>
                {song.bpm && <span className="text-[11px] text-zinc-600">{song.bpm} BPM</span>}
                {song.key && <span className="text-[11px] text-zinc-600">Key of {song.key}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button onClick={() => setLiked(!liked)} className={`transition-colors ${liked ? 'text-red-400' : 'text-zinc-500 hover:text-white'}`}>
                <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div
              className="relative h-1 bg-white/15 rounded-full cursor-pointer mb-2"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pct = ((e.clientX - rect.left) / rect.width) * 100
                setProgress(Math.max(0, Math.min(100, pct)))
                setLocalProgress(Math.max(0, Math.min(100, pct)))
              }}
            >
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${localProgress}%` }} />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg"
                style={{ left: `${localProgress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(total)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Shuffle size={20} strokeWidth={1.5} />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <SkipBack size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-2xl"
            >
              {isPlaying ? <Pause size={24} strokeWidth={2.5} /> : <Play size={24} strokeWidth={2.5} fill="black" />}
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <SkipForward size={28} strokeWidth={1.5} />
            </button>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Repeat size={20} strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={() => navigate(`/passport/${song.id}`)}
            className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Shield size={16} />
            View Song Passport
          </button>
        </div>
      </div>
    </div>
  )
}
