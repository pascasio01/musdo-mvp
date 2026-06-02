import {
  createContext, useContext, useEffect, useState, useCallback, useRef, useMemo, ReactNode,
} from 'react'
import { useToast } from './toast'
import type { Song } from '../types'

/**
 * MUSVORA Offline Mode — real downloads, real offline playback.
 *
 * Audio bytes are genuinely cached on the device through the Cache Storage API
 * (namespace "musdo-offline-v1"); the Service Worker serves them back so
 * downloaded songs play with no network (see public/sw.js). Storage usage is the
 * REAL on-device figure from navigator.storage.estimate() — nothing is faked or
 * simulated. Per-item footprint is measured as the storage delta a download adds
 * (0 = browser did not report a delta, shown honestly as "—").
 *
 * The catalogue currently ships a single source file per song, so the quality
 * selector records the user's chosen preference and is applied as higher-quality
 * masters become available — the delivered file is always the catalogue source.
 *
 * "musdo-*" keys are persistence identifiers — never rename them.
 */

export type DownloadQuality = 'standard' | 'high' | 'very_high' | 'lossless'

export const QUALITY_ORDER: DownloadQuality[] = ['standard', 'high', 'very_high', 'lossless']

export const QUALITY_LABELS: Record<DownloadQuality, string> = {
  standard: 'Standard',
  high: 'High',
  very_high: 'Very High',
  lossless: 'Lossless Ready',
}

export const QUALITY_NOTES: Record<DownloadQuality, string> = {
  standard: 'Menor uso de datos y almacenamiento.',
  high: 'Equilibrio entre calidad y tamaño.',
  very_high: 'Máxima fidelidad del archivo fuente.',
  lossless: 'Listo para masters lossless cuando el catálogo los incluya.',
}

/** A genuinely downloaded track (metadata snapshot; bytes live in Cache Storage). */
export interface DownloadedTrack {
  songId: string
  url: string
  quality: DownloadQuality
  /** Measured on-device footprint in bytes. 0 = not reported by the browser. */
  size: number
  downloadedAt: number
  title: string
  artist_name: string
  artwork_url?: string
  genre?: string
  duration?: number
}

type Snapshot = Omit<DownloadedTrack, 'size' | 'downloadedAt'>

export type DownloadStatus = 'idle' | 'queued' | 'downloading' | 'done' | 'error'

const AUDIO_CACHE = 'musdo-offline-v1'
const META_KEY = 'musdo-downloads-v1'
const QUEUE_KEY = 'musdo-offline-queue-v1'
const PREFS_KEY = 'musdo-offline-prefs-v1'

/* ── storage helpers ─────────────────────────────────────────────────── */

function cacheSupported(): boolean {
  return typeof caches !== 'undefined' && typeof window !== 'undefined' && window.isSecureContext !== false
}

export async function estimateStorage(): Promise<{ usage: number; quota: number }> {
  try {
    if (navigator.storage?.estimate) {
      const e = await navigator.storage.estimate()
      return { usage: e.usage ?? 0, quota: e.quota ?? 0 }
    }
  } catch { /* ignore */ }
  return { usage: 0, quota: 0 }
}

/** Cache the audio file for real offline playback; returns measured footprint. */
async function cacheAudio(url: string): Promise<number> {
  if (!cacheSupported()) throw new Error('offline-unsupported')
  const cache = await caches.open(AUDIO_CACHE)
  const existing = await cache.match(url, { ignoreVary: true })
  if (existing) return 0
  const before = (await estimateStorage()).usage
  // Cross-origin catalogue audio has no CORS headers; an opaque (no-cors)
  // response is still genuinely stored and playable by <audio> offline.
  const res = await fetch(new Request(url, { mode: 'no-cors' }))
  await cache.put(url, res)
  const after = (await estimateStorage()).usage
  return Math.max(0, after - before)
}

async function uncacheAudio(url: string): Promise<void> {
  if (!cacheSupported()) return
  const cache = await caches.open(AUDIO_CACHE)
  await cache.delete(url, { ignoreVary: true })
}

async function hasCachedAudio(url: string): Promise<boolean> {
  if (!cacheSupported()) return false
  const cache = await caches.open(AUDIO_CACHE)
  return !!(await cache.match(url, { ignoreVary: true }))
}

/* ── persistence helpers ─────────────────────────────────────────────── */

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

function writeJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore quota */ }
}

function toSnapshot(song: Song, quality: DownloadQuality): Snapshot {
  return {
    songId: song.id,
    url: song.audio_url as string,
    quality,
    title: song.title,
    artist_name: song.artist_name,
    artwork_url: song.artwork_url,
    genre: song.genre,
    duration: song.duration,
  }
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const val = bytes / Math.pow(1024, i)
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/* ── context ─────────────────────────────────────────────────────────── */

interface OfflineContextType {
  supported: boolean
  isOnline: boolean
  downloads: DownloadedTrack[]
  quality: DownloadQuality
  setQuality: (q: DownloadQuality) => void
  storage: { usage: number; quota: number }
  refreshStorage: () => void
  queueCount: number
  isDownloaded: (songId: string) => boolean
  statusFor: (songId: string) => DownloadStatus
  downloadSong: (song: Song) => Promise<void>
  downloadMany: (songs: Song[]) => Promise<void>
  removeDownload: (songId: string) => Promise<void>
  clearAll: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const supported = cacheSupported()

  const [downloads, setDownloads] = useState<DownloadedTrack[]>(() => readJSON<DownloadedTrack[]>(META_KEY, []))
  const [progress, setProgress] = useState<Record<string, DownloadStatus>>({})
  const [queue, setQueue] = useState<Snapshot[]>(() => readJSON<Snapshot[]>(QUEUE_KEY, []))
  const [quality, setQualityState] = useState<DownloadQuality>(() => readJSON<{ quality?: DownloadQuality }>(PREFS_KEY, {}).quality ?? 'high')
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true))
  const [storage, setStorage] = useState<{ usage: number; quota: number }>({ usage: 0, quota: 0 })

  const downloadsRef = useRef(downloads)
  const progressRef = useRef(progress)
  const queueRef = useRef(queue)
  const qualityRef = useRef(quality)
  downloadsRef.current = downloads
  progressRef.current = progress
  queueRef.current = queue
  qualityRef.current = quality

  useEffect(() => { writeJSON(META_KEY, downloads) }, [downloads])
  useEffect(() => { writeJSON(QUEUE_KEY, queue) }, [queue])
  useEffect(() => { writeJSON(PREFS_KEY, { quality }) }, [quality])

  const refreshStorage = useCallback(() => {
    estimateStorage().then(setStorage)
  }, [])

  const setStatus = useCallback((songId: string, status: DownloadStatus) => {
    setProgress(prev => {
      if (status === 'idle' || status === 'done') {
        const { [songId]: _drop, ...rest } = prev
        return rest
      }
      return { ...prev, [songId]: status }
    })
  }, [])

  const addDownload = useCallback((track: DownloadedTrack) => {
    setDownloads(prev => [track, ...prev.filter(d => d.songId !== track.songId)])
  }, [])

  /** Perform the actual cache write for one snapshot. */
  const runDownload = useCallback(async (snap: Snapshot): Promise<boolean> => {
    if (downloadsRef.current.some(d => d.songId === snap.songId)) return true
    setStatus(snap.songId, 'downloading')
    try {
      const size = await cacheAudio(snap.url)
      addDownload({ ...snap, size, downloadedAt: Date.now() })
      setStatus(snap.songId, 'done')
      refreshStorage()
      return true
    } catch {
      setStatus(snap.songId, 'error')
      return false
    }
  }, [addDownload, refreshStorage, setStatus])

  const enqueue = useCallback((snap: Snapshot) => {
    setQueue(prev => (prev.some(s => s.songId === snap.songId) ? prev : [...prev, snap]))
    setStatus(snap.songId, 'queued')
  }, [setStatus])

  const downloadSong = useCallback(async (song: Song) => {
    if (!supported) {
      toast.error('Tu navegador no permite descargas offline en este contexto.')
      return
    }
    if (!song?.audio_url) {
      toast.error('Esta canción no tiene archivo de audio disponible para descargar.')
      return
    }
    if (downloadsRef.current.some(d => d.songId === song.id)) return
    if (progressRef.current[song.id] === 'downloading') return

    const snap = toSnapshot(song, qualityRef.current)
    if (!navigator.onLine) {
      enqueue(snap)
      toast.info('Sin conexión — se descargará automáticamente al reconectar.')
      return
    }
    const ok = await runDownload(snap)
    if (!ok) toast.error(`No se pudo descargar “${song.title}”. Reintenta con mejor conexión.`)
  }, [supported, enqueue, runDownload, toast])

  const downloadMany = useCallback(async (songs: Song[]) => {
    const targets = songs.filter(s => s.audio_url && !downloadsRef.current.some(d => d.songId === s.id))
    if (targets.length === 0) {
      toast.info('Todo ya está disponible offline.')
      return
    }
    if (!navigator.onLine) {
      targets.forEach(s => enqueue(toSnapshot(s, qualityRef.current)))
      toast.info(`${targets.length} ${targets.length === 1 ? 'canción' : 'canciones'} en cola — se descargarán al reconectar.`)
      return
    }
    let failed = 0
    for (const s of targets) {
      const ok = await runDownload(toSnapshot(s, qualityRef.current))
      if (!ok) failed++
    }
    if (failed === 0) toast.success(`${targets.length} ${targets.length === 1 ? 'canción descargada' : 'canciones descargadas'} para offline.`)
    else toast.error(`${failed} de ${targets.length} no se pudieron descargar. Reintenta más tarde.`)
  }, [enqueue, runDownload, toast])

  const removeDownload = useCallback(async (songId: string) => {
    const track = downloadsRef.current.find(d => d.songId === songId)
    if (track) await uncacheAudio(track.url)
    setDownloads(prev => prev.filter(d => d.songId !== songId))
    setQueue(prev => prev.filter(s => s.songId !== songId))
    setStatus(songId, 'idle')
    refreshStorage()
  }, [refreshStorage, setStatus])

  const clearAll = useCallback(async () => {
    if (cacheSupported()) {
      try { await caches.delete(AUDIO_CACHE) } catch { /* ignore */ }
    }
    setDownloads([])
    setQueue([])
    setProgress({})
    refreshStorage()
    toast.success('Descargas eliminadas. Espacio liberado.')
  }, [refreshStorage, toast])

  /** Process the offline queue and re-cache any missing downloads (re-sync). */
  const reconcile = useCallback(async () => {
    if (!supported || !navigator.onLine) return

    // 1 — Drain queued (offline-requested) downloads.
    const pending = [...queueRef.current]
    if (pending.length > 0) {
      for (const snap of pending) {
        const ok = await runDownload(snap)
        if (ok) setQueue(prev => prev.filter(s => s.songId !== snap.songId))
      }
    }

    // 2 — Heal: re-download any tracked item whose bytes are missing from cache.
    for (const track of downloadsRef.current) {
      const present = await hasCachedAudio(track.url)
      if (!present) await cacheAudio(track.url).catch(() => undefined)
    }
    refreshStorage()
  }, [supported, runDownload, refreshStorage])

  // Mount: measure storage, reconcile once if online.
  useEffect(() => {
    refreshStorage()
    reconcile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Online/offline lifecycle → auto re-sync.
  useEffect(() => {
    const onOnline = () => { setIsOnline(true); reconcile() }
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [reconcile])

  const setQuality = useCallback((q: DownloadQuality) => setQualityState(q), [])

  const isDownloaded = useCallback((songId: string) => downloadsRef.current.some(d => d.songId === songId), [downloads])
  const statusFor = useCallback((songId: string): DownloadStatus => {
    if (downloads.some(d => d.songId === songId)) return 'done'
    return progress[songId] ?? 'idle'
  }, [downloads, progress])

  const value = useMemo<OfflineContextType>(() => ({
    supported,
    isOnline,
    downloads,
    quality,
    setQuality,
    storage,
    refreshStorage,
    queueCount: queue.length,
    isDownloaded,
    statusFor,
    downloadSong,
    downloadMany,
    removeDownload,
    clearAll,
  }), [supported, isOnline, downloads, quality, setQuality, storage, refreshStorage, queue.length, isDownloaded, statusFor, downloadSong, downloadMany, removeDownload, clearAll])

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}

export function useOffline(): OfflineContextType {
  const ctx = useContext(OfflineContext)
  if (!ctx) throw new Error('useOffline must be used inside OfflineProvider')
  return ctx
}
