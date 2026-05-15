import { createContext, useContext, useState, ReactNode } from 'react'
import type { Song, PlayerState } from '../types'

interface PlayerContextType extends PlayerState {
  playSong: (song: Song) => void
  togglePlay: () => void
  setProgress: (p: number) => void
  setVolume: (v: number) => void
  clearPlayer: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    song: null,
    isPlaying: false,
    progress: 0,
    volume: 0.8,
  })

  const playSong = (song: Song) => {
    setState(prev => ({ ...prev, song, isPlaying: true, progress: 0 }))
  }

  const togglePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const setProgress = (progress: number) => {
    setState(prev => ({ ...prev, progress }))
  }

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume }))
  }

  const clearPlayer = () => {
    setState({ song: null, isPlaying: false, progress: 0, volume: 0.8 })
  }

  return (
    <PlayerContext.Provider value={{ ...state, playSong, togglePlay, setProgress, setVolume, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider')
  return context
}
