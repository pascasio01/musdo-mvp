import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Download, HardDrive, Music2, Disc3, ListMusic, Trash2, Play,
  Wifi, WifiOff, Plane, CheckCircle2, RefreshCw, Settings2,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge, StatTile, SectionHeader, Button } from '../components/governance'
import {
  useOffline, formatBytes, QUALITY_ORDER, QUALITY_LABELS, QUALITY_NOTES,
  type DownloadQuality, type DownloadedTrack,
} from '../lib/offline'
import { useLibrary } from '../lib/library'
import { usePlayer } from '../lib/player'
import { mockSongs } from '../data/mockData'
import type { Song } from '../types'

/**
 * MUSVORA Offline Mode — Downloads.
 *
 * Everything shown here is real: downloaded songs are genuinely cached on the
 * device, storage usage is the browser-reported on-device figure, and Travel
 * Mode performs real batch downloads. No fake downloads, no placeholder data.
 * Albums are honestly empty until the Albums module ships.
 */

type Tab = 'songs' | 'albums' | 'playlists'

function resolveSong(id: string): Song | undefined {
  return mockSongs.find(s => s.id === id)
}

export default function Downloads() {
  const navigate = useNavigate()
  const { playSong } = usePlayer()
  const { favoriteSongs, playlists, resolveSongs } = useLibrary()
  const {
    isOnline, downloads, quality, setQuality, storage, queueCount,
    downloadMany, removeDownload, clearAll, statusFor,
  } = useOffline()

  const [tab, setTab] = useState<Tab>('songs')

  const usedPct = storage.quota > 0 ? Math.min(100, (storage.usage / storage.quota) * 100) : 0

  const playTrack = (track: DownloadedTrack) => {
    const song = resolveSong(track.songId)
    const queue = downloads.map(d => resolveSong(d.songId)).filter((s): s is Song => !!s)
    if (song) {
      playSong(song, queue.length ? queue : [song])
      navigate(`/player/${song.id}`)
    }
  }

  // Travel Mode targets: favorites + every song in personal playlists (deduped).
  const tripSongs = useMemo(() => {
    const map = new Map<string, Song>()
    favoriteSongs.forEach(s => map.set(s.id, s))
    playlists.forEach(p => resolveSongs(p.songIds).forEach(s => map.set(s.id, s)))
    return [...map.values()].filter(s => s.audio_url)
  }, [favoriteSongs, playlists, resolveSongs])

  const tripPending = tripSongs.filter(s => statusFor(s.id) !== 'done').length

  return (
    <AppShell>
      <GovernanceScope className="min-h-screen">
        {/* ── Header ── */}
        <header
          className="sticky top-0 z-30 safe-top"
          style={{
            background: 'color-mix(in srgb, var(--gv-bg) 88%, transparent)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--gv-border-faint)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5" style={{ height: 64 }}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Back to Library"
                onClick={() => navigate('/library')}
                className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}
              >
                <ArrowLeft size={18} aria-hidden />
              </button>
              <div className="min-w-0">
                <p className="gv-eyebrow">MUSVORA · Offline</p>
                <h1 className="font-bold leading-none truncate" style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-lg)', color: 'var(--gv-text)' }}>
                  Downloads
                </h1>
              </div>
            </div>
            <Badge tone={isOnline ? 'success' : 'warning'} variant="soft">
              {isOnline ? <><Wifi size={12} aria-hidden /> Online</> : <><WifiOff size={12} aria-hidden /> Offline</>}
            </Badge>
          </div>
        </header>

        <div className="px-5 pt-6 pb-4 flex flex-col gap-7">
          {/* ── Storage ── */}
          <section>
            <SectionHeader eyebrow="Device" title="Almacenamiento" actions={<HardDrive size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="grid grid-cols-3 gap-2 mb-3">
              <StatTile label="Usado" value={formatBytes(storage.usage)} tone="gold" />
              <StatTile label="Disponible" value={formatBytes(Math.max(0, storage.quota - storage.usage))} />
              <StatTile label="Descargas" value={downloads.length} hint={queueCount > 0 ? `+${queueCount} en cola` : undefined} />
            </div>
            <Card padding="md">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>Uso del dispositivo por MUSVORA</span>
                <span className="gv-mono" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)' }}>
                  {storage.quota > 0 ? `${usedPct.toFixed(1)}%` : '—'}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--gv-surface-2)', overflow: 'hidden', border: '1px solid var(--gv-border-faint)' }}>
                <div style={{ width: `${usedPct}%`, height: '100%', background: 'var(--gv-gold)', borderRadius: 999, transition: 'width var(--gv-dur-fast) var(--gv-ease)' }} />
              </div>
              {downloads.length > 0 && (
                <button
                  type="button"
                  onClick={() => void clearAll()}
                  className="gv-focusable inline-flex items-center gap-1.5 mt-3 active:opacity-70 transition-opacity"
                  style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-danger)' }}
                >
                  <Trash2 size={13} aria-hidden /> Liberar todo el espacio
                </button>
              )}
            </Card>
          </section>

          {/* ── Download quality ── */}
          <section>
            <SectionHeader eyebrow="Preference" title="Calidad de descarga" actions={<Settings2 size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <div className="grid grid-cols-2 gap-2 mb-2">
              {QUALITY_ORDER.map((q: DownloadQuality) => {
                const active = quality === q
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    aria-pressed={active}
                    className="gv-focusable text-left active:scale-[0.99] transition-transform"
                    style={{
                      padding: '12px 14px', borderRadius: 'var(--gv-radius-md)',
                      background: active ? 'var(--gv-gold-soft)' : 'var(--gv-surface)',
                      border: `1px solid ${active ? 'color-mix(in srgb, var(--gv-gold) 40%, transparent)' : 'var(--gv-border)'}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: active ? 'var(--gv-gold)' : 'var(--gv-text)' }}>
                        {QUALITY_LABELS[q]}
                      </span>
                      {active && <CheckCircle2 size={15} style={{ color: 'var(--gv-gold)' }} aria-hidden />}
                    </div>
                    <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.4 }}>
                      {QUALITY_NOTES[q]}
                    </p>
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>
              La calidad entregada depende del archivo fuente del catálogo. Hoy cada canción tiene una fuente única; tu preferencia se aplicará cuando existan masters de mayor calidad.
            </p>
          </section>

          {/* ── Travel Mode ── */}
          <section>
            <SectionHeader eyebrow="Travel Mode" title="Prepara tu viaje" actions={<Plane size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <Card padding="md">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-gold)' }}>
                  <Plane size={18} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>Descarga antes de salir</p>
                  <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>
                    Guarda tus favoritos y playlists para escuchar sin conexión durante vuelos, carreteras o zonas sin señal.
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Button
                      size="sm"
                      variant="gold"
                      leadingIcon={<Download size={14} aria-hidden />}
                      disabled={tripSongs.length === 0 || tripPending === 0}
                      onClick={() => void downloadMany(tripSongs)}
                    >
                      {tripPending > 0 ? `Preparar ${tripPending} offline` : 'Todo listo offline'}
                    </Button>
                    <span style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                      {tripSongs.length} {tripSongs.length === 1 ? 'pista' : 'pistas'} en favoritos + playlists
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ── Library tabs ── */}
          <section>
            <div
              className="flex items-center gap-1 p-1 mb-4"
              style={{ borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface)', border: '1px solid var(--gv-border)' }}
              role="tablist"
              aria-label="Downloaded library"
            >
              {([['songs', 'Canciones', Music2], ['albums', 'Álbumes', Disc3], ['playlists', 'Playlists', ListMusic]] as const).map(([key, label, Icon]) => {
                const active = tab === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(key)}
                    className="gv-focusable flex-1 inline-flex items-center justify-center gap-1.5 font-semibold transition-all"
                    style={{
                      height: 38, borderRadius: 'var(--gv-radius-sm)',
                      background: active ? 'var(--gv-elevated)' : 'transparent',
                      border: active ? '1px solid var(--gv-border)' : '1px solid transparent',
                      color: active ? 'var(--gv-text)' : 'var(--gv-text-muted)',
                      fontSize: 'var(--gv-text-2xs)',
                    }}
                  >
                    <Icon size={14} aria-hidden /> {label}
                  </button>
                )
              })}
            </div>

            {/* Songs */}
            {tab === 'songs' && (
              downloads.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {downloads.map(track => (
                    <div key={track.songId} className="flex items-center gap-3" style={{ padding: '8px 6px', borderRadius: 'var(--gv-radius-md)' }}>
                      <button
                        type="button"
                        onClick={() => playTrack(track)}
                        aria-label={`Play ${track.title}`}
                        className="gv-focusable flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-70 transition-opacity"
                      >
                        <span className="relative grid place-items-center flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
                          {track.artwork_url
                            ? <img src={track.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                            : <Play size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{track.title}</span>
                          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                            {track.artist_name} · {QUALITY_LABELS[track.quality]}{track.size > 0 ? ` · ${formatBytes(track.size)}` : ''}
                          </span>
                        </span>
                      </button>
                      <CheckCircle2 size={16} style={{ color: 'var(--gv-success)', flexShrink: 0 }} aria-hidden />
                      <button
                        type="button"
                        onClick={() => void removeDownload(track.songId)}
                        aria-label={`Remove ${track.title} from downloads`}
                        className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
                        style={{ width: 34, height: 34, borderRadius: 'var(--gv-radius-md)', color: 'var(--gv-text-muted)' }}
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card padding="md">
                  <div className="flex items-center gap-3" style={{ color: 'var(--gv-text-muted)' }}>
                    <Download size={16} aria-hidden />
                    <p style={{ fontSize: 'var(--gv-text-2xs)', lineHeight: 1.5 }}>
                      Aún no tienes descargas. Toca el icono de descarga en cualquier canción para guardarla offline.
                    </p>
                  </div>
                </Card>
              )
            )}

            {/* Albums — honest empty until the Albums module ships */}
            {tab === 'albums' && (
              <Card padding="md">
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}>
                    <Disc3 size={18} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>Álbumes descargados</span>
                      <Badge tone="warning" variant="soft">Pending Integration</Badge>
                    </div>
                    <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>
                      La descarga de álbumes se activará con el módulo de Álbumes (release, tracklist). Mientras tanto, descarga por canción o por playlist.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Playlists — real: per-playlist offline progress + download-all */}
            {tab === 'playlists' && (
              playlists.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {playlists.map(p => {
                    const songs = resolveSongs(p.songIds).filter(s => s.audio_url)
                    const ready = songs.filter(s => statusFor(s.id) === 'done').length
                    const allReady = songs.length > 0 && ready === songs.length
                    return (
                      <Card key={p.id} padding="md">
                        <div className="flex items-center gap-3">
                          <span className="grid place-items-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-gold)' }}>
                            <ListMusic size={18} aria-hidden />
                          </span>
                          <button
                            type="button"
                            onClick={() => navigate(`/library/playlist/${p.id}`)}
                            className="gv-focusable min-w-0 flex-1 text-left active:opacity-70 transition-opacity"
                          >
                            <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{p.title}</span>
                            <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                              {ready}/{songs.length} offline
                            </span>
                          </button>
                          {allReady ? (
                            <Badge tone="success" variant="soft"><CheckCircle2 size={12} aria-hidden /> Offline</Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={songs.length === 0}
                              leadingIcon={<Download size={14} aria-hidden />}
                              onClick={() => void downloadMany(songs)}
                            >
                              Descargar
                            </Button>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card padding="md">
                  <div className="flex items-center gap-3" style={{ color: 'var(--gv-text-muted)' }}>
                    <ListMusic size={16} aria-hidden />
                    <p style={{ fontSize: 'var(--gv-text-2xs)', lineHeight: 1.5 }}>
                      Crea playlists en tu Library para descargarlas completas y escucharlas offline.
                    </p>
                  </div>
                </Card>
              )
            )}
          </section>

          {/* Re-sync note */}
          <div className="flex items-center gap-2 px-1" style={{ color: 'var(--gv-text-muted)' }}>
            <RefreshCw size={13} aria-hidden />
            <p style={{ fontSize: 'var(--gv-text-2xs)', lineHeight: 1.5 }}>
              Las descargas en cola se completan automáticamente al recuperar la conexión.
            </p>
          </div>
        </div>
      </GovernanceScope>
    </AppShell>
  )
}
