import { useNavigate } from 'react-router-dom'
import { Download, Check, Clock, AlertCircle, Loader2, Lock } from 'lucide-react'
import { useOffline } from '../lib/offline'
import { usePermissions } from '../lib/usePermissions'
import type { Song } from '../types'

/**
 * MUSVORA DownloadButton — one-tap real offline download for a song.
 * Reflects genuine state (idle / queued / downloading / done / error) from the
 * offline engine. Styled with governance tokens; use inside <GovernanceScope>.
 *
 * Offline is a Premium feature, so this gates the ACTION itself (not just the
 * /downloads route) — a non-entitled user sees a lock and is routed to pricing
 * instead of being able to trigger a real download.
 */
export function DownloadButton({ song, size = 34 }: { song: Song; size?: number }) {
  const navigate = useNavigate()
  const { statusFor, downloadSong, removeDownload } = useOffline()
  const { can, loading } = usePermissions()
  const canOffline = can('offline')
  const status = statusFor(song.id)
  const icon = Math.round(size * 0.48)

  const onClick = () => {
    if (!canOffline) { navigate('/pricing'); return }
    if (status === 'done') { void removeDownload(song.id); return }
    if (status === 'downloading' || status === 'queued') return
    void downloadSong(song)
  }

  if (!loading && !canOffline) {
    const lockLabel = `Descargas offline — disponible en Premium`
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={lockLabel}
        title={lockLabel}
        className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
        style={{ width: size, height: size, borderRadius: 'var(--gv-radius-md)', color: 'var(--gv-gold)' }}
      >
        <Lock size={icon} aria-hidden />
      </button>
    )
  }

  const label =
    status === 'done' ? `Quitar “${song.title}” de descargas`
      : status === 'downloading' ? `Descargando “${song.title}”`
        : status === 'queued' ? `“${song.title}” en cola de descarga`
          : status === 'error' ? `Reintentar descarga de “${song.title}”`
            : `Descargar “${song.title}” para offline`

  const color =
    status === 'done' ? 'var(--gv-success)'
      : status === 'error' ? 'var(--gv-danger)'
        : status === 'downloading' || status === 'queued' ? 'var(--gv-gold)'
          : 'var(--gv-text-muted)'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
      style={{ width: size, height: size, borderRadius: 'var(--gv-radius-md)', color }}
    >
      {status === 'done' && <Check size={icon} aria-hidden />}
      {status === 'downloading' && <Loader2 size={icon} className="animate-spin" aria-hidden />}
      {status === 'queued' && <Clock size={icon} aria-hidden />}
      {status === 'error' && <AlertCircle size={icon} aria-hidden />}
      {status === 'idle' && <Download size={icon} aria-hidden />}
    </button>
  )
}

export default DownloadButton
