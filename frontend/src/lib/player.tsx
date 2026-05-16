import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react'
import type { Song } from '../types'

export interface PlayerState {
  song: Song | null
  queue: Song[]
  queueIndex: number
  isPlaying: boolean
  progress: number
  elapsed: number
  duration: number
  volume: number
  isMuted: boolean
  isLoading: boolean
  hasError: boolean
}

export interface PlayerContextType extends PlayerState {
  playSong: (song: Song, queue?: Song[]) => void
  togglePlay: () => void
  seek: (progress: number) => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  mute: () => void
  skip: (direction: 1 | -1) => void
  clearPlayer: () => void
}

const initialState: PlayerState = {
  song: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  progress: 0,
  elapsed: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isLoading: false,
  hasError: false,
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

const SIMULATION_TICK_MS = 250

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef<PlayerState>(initialState)

  const [state, setStateRaw] = useState<PlayerState>(initialState)

  const setState = useCallback((updater: Partial<PlayerState> | ((prev: PlayerState) => Partial<PlayerState>)) => {
    setStateRaw(prev => {
      const updates = typeof updater === 'function' ? updater(prev) : updater
      const next = { ...prev, ...updates }
      stateRef.current = next
      return next
    })
  }, [])

  const cancelAnimations = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (simRef.current !== null) {
      clearInterval(simRef.current)
      simRef.current = null
    }
  }, [])

  const startRAF = useCallback((audio: HTMLAudioElement) => {
    cancelAnimations()
    const tick = () => {
      const elapsed = audio.currentTime
      const duration = isFinite(audio.duration) ? audio.duration : stateRef.current.duration
      const progress = duration > 0 ? (elapsed / duration) * 100 : 0
      setState({ progress, elapsed, duration })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [cancelAnimations, setState])

  const startSimulation = useCallback((duration: number, startElapsed = 0) => {
    cancelAnimations()
    let elapsed = startElapsed
    simRef.current = setInterval(() => {
      elapsed += SIMULATION_TICK_MS / 1000
      if (elapsed >= duration) {
        elapsed = duration
        clearInterval(simRef.current!)
        simRef.current = null
        setState({ isPlaying: false, progress: 100, elapsed })
        return
      }
      const progress = (elapsed / duration) * 100
      setState({ progress, elapsed })
    }, SIMULATION_TICK_MS)
  }, [cancelAnimations, setState])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = initialState.volume

    audio.addEventListener('loadedmetadata', () => {
      if (!isFinite(audio.duration)) return
      setState({ duration: audio.duration, isLoading: false })
    })

    audio.addEventListener('ended', () => {
      cancelAnimations()
      const { queue, queueIndex } = stateRef.current
      const next = queueIndex + 1
      if (next < queue.length) {
        setState({ queueIndex: next })
      } else {
        setState({ isPlaying: false, progress: 100, elapsed: stateRef.current.duration })
      }
    })

    audio.addEventListener('error', () => {
      cancelAnimations()
      const { song } = stateRef.current
      const mediaError = audio.error
      if (import.meta.env.DEV) {
        console.warn('[MUSDO Player] audio error', {
          songId: song?.id,
          title: song?.title,
          src: audio.src,
          code: mediaError?.code,
          message: mediaError?.message,
        })
      }
      if (song) {
        const duration = song.duration ?? 180
        setState({ isLoading: false, hasError: true, duration })
        startSimulation(duration)
      }
    })

    audio.addEventListener('stalled', () => {
      if (import.meta.env.DEV) {
        console.warn('[MUSDO Player] audio stalled', {
          songId: stateRef.current.song?.id,
          src: audio.src,
        })
      }
    })

    audio.addEventListener('waiting', () => setState({ isLoading: true }))
    audio.addEventListener('playing', () => setState({ isLoading: false }))

    audioRef.current = audio

    return () => {
      cancelAnimations()
      audio.pause()
      audio.src = ''
    }
  }, [cancelAnimations, setState, startSimulation])

  useEffect(() => {
    const { queue, queueIndex } = state
    if (queueIndex >= 0 && queueIndex < queue.length) {
      const nextSong = queue[queueIndex]
      if (nextSong.id !== state.song?.id) {
        playSong(nextSong, queue)
      }
    }
  }, [state.queueIndex])

  const playSong = useCallback((song: Song, queue: Song[] = []) => {
    cancelAnimations()
    const audio = audioRef.current
    if (!audio) return

    const duration = song.duration ?? 180
    const queueIndex = queue.findIndex(s => s.id === song.id)

    setState({
      song,
      queue,
      queueIndex: Math.max(0, queueIndex),
      isPlaying: false,
      progress: 0,
      elapsed: 0,
      duration,
      isLoading: true,
      hasError: false,
    })

    if (song.audio_url) {
      try {
        audio.src = song.audio_url
        audio.volume = stateRef.current.isMuted ? 0 : stateRef.current.volume
        audio.load()
        audio.play()
          .then(() => {
            setState({ isPlaying: true, isLoading: false, hasError: false })
            startRAF(audio)
          })
          .catch((err: unknown) => {
            if (import.meta.env.DEV) {
              const name = err instanceof Error ? err.name : 'Unknown'
              const message = err instanceof Error ? err.message : String(err)
              console.warn('[MUSDO Player] audio.play() rejected — falling back to simulation', {
                songId: song.id,
                title: song.title,
                src: song.audio_url,
                errorName: name,
                errorMessage: message,
              })
            }
            setState({ isPlaying: true, isLoading: false, hasError: false })
            startSimulation(duration)
          })
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[MUSDO Player] failed to assign audio src', {
            songId: song.id,
            title: song.title,
            src: song.audio_url,
            err,
          })
        }
        setState({ isPlaying: true, isLoading: false, hasError: false })
        startSimulation(duration)
      }
    } else {
      if (import.meta.env.DEV) {
        console.info('[MUSDO Player] no audio_url — simulating playback', {
          songId: song.id,
          title: song.title,
        })
      }
      setState({ isPlaying: true, isLoading: false })
      startSimulation(duration)
    }
  }, [cancelAnimations, setState, startRAF, startSimulation])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    const { isPlaying, song, elapsed, duration } = stateRef.current
    if (!song) return

    if (isPlaying) {
      if (audio?.src) {
        audio.pause()
        cancelAnimations()
      } else {
        cancelAnimations()
      }
      setState({ isPlaying: false })
    } else {
      if (audio?.src) {
        audio.play()
          .then(() => {
            setState({ isPlaying: true })
            startRAF(audio)
          })
          .catch((err: unknown) => {
            if (import.meta.env.DEV) {
              const message = err instanceof Error ? err.message : String(err)
              console.warn('[MUSDO Player] resume play() rejected', { songId: song.id, message })
            }
            setState({ isPlaying: true })
            startSimulation(duration, elapsed)
          })
      } else {
        setState({ isPlaying: true })
        startSimulation(duration, elapsed)
      }
    }
  }, [cancelAnimations, setState, startRAF, startSimulation])

  const seek = useCallback((progress: number) => {
    const audio = audioRef.current
    const { duration, isPlaying } = stateRef.current
    const clamped = Math.max(0, Math.min(100, progress))
    const targetElapsed = (clamped / 100) * duration

    if (audio?.src && isFinite(audio.duration)) {
      audio.currentTime = targetElapsed
      setState({ progress: clamped, elapsed: targetElapsed })
    } else {
      cancelAnimations()
      setState({ progress: clamped, elapsed: targetElapsed })
      if (isPlaying) startSimulation(duration, targetElapsed)
    }
  }, [cancelAnimations, setState, startSimulation])

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume))
    const audio = audioRef.current
    if (audio) audio.volume = clamped
    setState({ volume: clamped, isMuted: clamped === 0 })
  }, [setState])

  const mute = useCallback(() => {
    const audio = audioRef.current
    const { isMuted, volume } = stateRef.current
    if (isMuted) {
      if (audio) audio.volume = volume
      setState({ isMuted: false })
    } else {
      if (audio) audio.volume = 0
      setState({ isMuted: true })
    }
  }, [setState])

  const skip = useCallback((direction: 1 | -1) => {
    const { queue, queueIndex } = stateRef.current
    const next = queueIndex + direction
    if (next >= 0 && next < queue.length) {
      setState({ queueIndex: next })
    }
  }, [setState])

  const clearPlayer = useCallback(() => {
    cancelAnimations()
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = ''
    }
    setState(initialState)
  }, [cancelAnimations, setState])

  const contextValue = useMemo<PlayerContextType>(() => ({
    ...state,
    playSong,
    togglePlay,
    seek,
    setProgress: seek,
    setVolume,
    mute,
    skip,
    clearPlayer,
  }), [state, playSong, togglePlay, seek, setVolume, mute, skip, clearPlayer])

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerContextType {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}
