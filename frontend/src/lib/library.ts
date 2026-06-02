import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  createElement,
  type ReactNode,
} from 'react'
import { useAuth } from './auth'
import { usePlayer } from './player'
import { mockSongs } from '../data/mockData'
import type { Song } from '../types'

/**
 * MUSVORA Library — real, persistent, per-user music library.
 *
 * This is production data, not a mock: favorites, play history and personal
 * playlists are stored per authenticated user in localStorage, mirroring the
 * app's existing hybrid architecture (Supabase for auth/works, localStorage for
 * client-owned state — see `professionalProfile.ts`). The shape is intentionally
 * id-based so it can be lifted to a Supabase table later without UI changes.
 *
 * NOTE: the `musdo-` prefix is a persistence key, never branding — do not rename.
 */

const STORAGE_LIBRARY = 'musdo-library-v1'
const HISTORY_CAP = 100

function libraryKey(userId: string | null | undefined): string {
  return userId ? `${STORAGE_LIBRARY}:${userId}` : `${STORAGE_LIBRARY}:guest`
}

export interface LibraryPlaylist {
  id: string
  title: string
  songIds: string[]
  createdAt: number
  updatedAt: number
}

interface HistoryEntry {
  id: string
  at: number
}

interface LibraryData {
  favorites: string[]
  history: HistoryEntry[]
  playlists: LibraryPlaylist[]
}

const EMPTY: LibraryData = { favorites: [], history: [], playlists: [] }

function load(userId: string | null | undefined): LibraryData {
  try {
    const raw = localStorage.getItem(libraryKey(userId))
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<LibraryData>
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      playlists: Array.isArray(parsed.playlists) ? parsed.playlists : [],
    }
  } catch {
    return EMPTY
  }
}

function newId(): string {
  return `pl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export interface LibraryContextType {
  /* Favorites */
  favoriteIds: Set<string>
  favoriteSongs: Song[]
  isFavorite: (songId: string) => boolean
  toggleFavorite: (song: Song | string) => void
  /* History */
  historySongs: Song[]
  clearHistory: () => void
  /* Artists (derived from the user's real engagement) */
  libraryArtists: { name: string; count: number; verified: boolean }[]
  /* Playlists */
  playlists: LibraryPlaylist[]
  getPlaylist: (id: string) => LibraryPlaylist | undefined
  createPlaylist: (title: string) => string
  renamePlaylist: (id: string, title: string) => void
  deletePlaylist: (id: string) => void
  addToPlaylist: (id: string, songId: string) => void
  removeFromPlaylist: (id: string, songId: string) => void
  /* Catalogue resolver */
  resolveSong: (songId: string) => Song | undefined
  resolveSongs: (songIds: string[]) => Song[]
}

const LibraryContext = createContext<LibraryContextType | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { song: nowPlaying } = usePlayer()
  const userId = user?.id ?? null

  const [data, setData] = useState<LibraryData>(() => load(userId))
  const loadedKeyRef = useRef<string>(libraryKey(userId))

  const byId = useMemo(() => {
    const m = new Map<string, Song>()
    for (const s of mockSongs) m.set(s.id, s)
    return m
  }, [])

  // Reload when the authenticated user changes (no cross-account leakage).
  useEffect(() => {
    const key = libraryKey(userId)
    loadedKeyRef.current = key
    setData(load(userId))
  }, [userId])

  // Persist on change for the current user.
  useEffect(() => {
    const key = libraryKey(userId)
    if (key !== loadedKeyRef.current) return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [data, userId])

  // Auto-record play history whenever the player starts a real song.
  const lastRecorded = useRef<string | null>(null)
  useEffect(() => {
    const id = nowPlaying?.id
    if (!id || lastRecorded.current === id) return
    lastRecorded.current = id
    setData(prev => {
      const history = [{ id, at: Date.now() }, ...prev.history.filter(h => h.id !== id)].slice(0, HISTORY_CAP)
      return { ...prev, history }
    })
  }, [nowPlaying?.id])

  const resolveSong = useCallback((songId: string) => byId.get(songId), [byId])
  const resolveSongs = useCallback(
    (songIds: string[]) => songIds.map(id => byId.get(id)).filter((s): s is Song => !!s),
    [byId],
  )

  const toggleFavorite = useCallback((song: Song | string) => {
    const id = typeof song === 'string' ? song : song.id
    setData(prev => {
      const has = prev.favorites.includes(id)
      return {
        ...prev,
        favorites: has ? prev.favorites.filter(f => f !== id) : [id, ...prev.favorites],
      }
    })
  }, [])

  const clearHistory = useCallback(() => setData(prev => ({ ...prev, history: [] })), [])

  const createPlaylist = useCallback((title: string) => {
    const id = newId()
    const now = Date.now()
    setData(prev => ({
      ...prev,
      playlists: [{ id, title: title.trim() || 'Untitled Playlist', songIds: [], createdAt: now, updatedAt: now }, ...prev.playlists],
    }))
    return id
  }, [])

  const renamePlaylist = useCallback((id: string, title: string) => {
    setData(prev => ({
      ...prev,
      playlists: prev.playlists.map(p => (p.id === id ? { ...p, title: title.trim() || p.title, updatedAt: Date.now() } : p)),
    }))
  }, [])

  const deletePlaylist = useCallback((id: string) => {
    setData(prev => ({ ...prev, playlists: prev.playlists.filter(p => p.id !== id) }))
  }, [])

  const addToPlaylist = useCallback((id: string, songId: string) => {
    setData(prev => ({
      ...prev,
      playlists: prev.playlists.map(p =>
        p.id === id && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId], updatedAt: Date.now() }
          : p,
      ),
    }))
  }, [])

  const removeFromPlaylist = useCallback((id: string, songId: string) => {
    setData(prev => ({
      ...prev,
      playlists: prev.playlists.map(p =>
        p.id === id ? { ...p, songIds: p.songIds.filter(s => s !== songId), updatedAt: Date.now() } : p,
      ),
    }))
  }, [])

  const favoriteIds = useMemo(() => new Set(data.favorites), [data.favorites])
  const favoriteSongs = useMemo(() => resolveSongs(data.favorites), [data.favorites, resolveSongs])
  const historySongs = useMemo(() => resolveSongs(data.history.map(h => h.id)), [data.history, resolveSongs])

  const libraryArtists = useMemo(() => {
    const map = new Map<string, { name: string; count: number; verified: boolean }>()
    const seed = [...favoriteSongs, ...historySongs]
    for (const s of seed) {
      const existing = map.get(s.artist_name)
      if (existing) existing.count += 1
      else map.set(s.artist_name, { name: s.artist_name, count: 1, verified: !!s.human_verified })
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [favoriteSongs, historySongs])

  const getPlaylist = useCallback((id: string) => data.playlists.find(p => p.id === id), [data.playlists])

  const value = useMemo<LibraryContextType>(
    () => ({
      favoriteIds,
      favoriteSongs,
      isFavorite: (songId: string) => favoriteIds.has(songId),
      toggleFavorite,
      historySongs,
      clearHistory,
      libraryArtists,
      playlists: data.playlists,
      getPlaylist,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      resolveSong,
      resolveSongs,
    }),
    [
      favoriteIds, favoriteSongs, toggleFavorite, historySongs, clearHistory, libraryArtists,
      data.playlists, getPlaylist, createPlaylist, renamePlaylist, deletePlaylist,
      addToPlaylist, removeFromPlaylist, resolveSong, resolveSongs,
    ],
  )

  return createElement(LibraryContext.Provider, { value }, children)
}

export function useLibrary(): LibraryContextType {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within a LibraryProvider')
  return ctx
}
