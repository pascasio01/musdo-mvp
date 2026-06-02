import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Play, Heart, Trash2, Plus, Check, PenLine, ListMusic, Search as SearchIcon, X,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge } from '../components/governance'
import { useLibrary } from '../lib/library'
import { usePlayer } from '../lib/player'
import { mockSongs } from '../data/mockData'
import type { Song } from '../types'

/**
 * MUSVORA Playlist Detail — view, play, curate a real personal playlist.
 * All data is the user's own persistent library (see `lib/library.ts`).
 */
export default function PlaylistDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { playSong } = usePlayer()
  const {
    getPlaylist, resolveSongs, isFavorite, toggleFavorite,
    renamePlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist,
  } = useLibrary()

  const playlist = getPlaylist(id)
  const [renaming, setRenaming] = useState(false)
  const [titleDraft, setTitleDraft] = useState(playlist?.title ?? '')
  const [adding, setAdding] = useState(false)
  const [query, setQuery] = useState('')

  const songs = useMemo(() => (playlist ? resolveSongs(playlist.songIds) : []), [playlist, resolveSongs])

  const addCandidates = useMemo(() => {
    if (!playlist) return [] as Song[]
    const q = query.trim().toLowerCase()
    const inPlaylist = new Set(playlist.songIds)
    return mockSongs
      .filter(s => !inPlaylist.has(s.id))
      .filter(s => !q || `${s.title} ${s.artist_name} ${s.genre}`.toLowerCase().includes(q))
      .slice(0, 8)
  }, [playlist, query])

  if (!playlist) {
    return (
      <AppShell>
        <GovernanceScope className="min-h-screen">
          <div className="px-5 pt-16 flex flex-col items-center gap-4 text-center">
            <ListMusic size={32} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
            <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>Playlist no encontrada.</p>
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="gv-focusable inline-flex items-center gap-1.5 font-semibold"
              style={{ height: 40, padding: '0 16px', borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text)', fontSize: 'var(--gv-text-sm)' }}
            >
              <ArrowLeft size={15} aria-hidden /> Volver a Library
            </button>
          </div>
        </GovernanceScope>
      </AppShell>
    )
  }

  const playAll = () => {
    if (songs.length === 0) return
    playSong(songs[0], songs)
    navigate(`/player/${songs[0].id}`)
  }

  const saveRename = () => {
    renamePlaylist(playlist.id, titleDraft)
    setRenaming(false)
  }

  const handleDelete = () => {
    deletePlaylist(playlist.id)
    navigate('/library')
  }

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
            <button
              type="button"
              aria-label="Back to Library"
              onClick={() => navigate('/library')}
              className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
              style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <p className="gv-eyebrow flex-1 text-center truncate">Personal Playlist</p>
            <button
              type="button"
              aria-label="Delete playlist"
              onClick={handleDelete}
              className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
              style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-danger)' }}
            >
              <Trash2 size={17} aria-hidden />
            </button>
          </div>
        </header>

        <div className="px-5 pt-6 pb-4 flex flex-col gap-6">
          {/* Title block */}
          <div className="flex items-center gap-4">
            <span
              className="grid place-items-center flex-shrink-0"
              style={{ width: 72, height: 72, borderRadius: 'var(--gv-radius-lg)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-gold)' }}
            >
              <ListMusic size={30} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              {renaming ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={titleDraft}
                    onChange={e => setTitleDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveRename() }}
                    aria-label="Nombre de la playlist"
                    className="min-w-0 flex-1 bg-transparent outline-none font-bold"
                    style={{ fontSize: 'var(--gv-text-lg)', color: 'var(--gv-text)', borderBottom: '1px solid var(--gv-border)' }}
                  />
                  <button type="button" onClick={saveRename} aria-label="Guardar nombre" className="gv-focusable grid place-items-center" style={{ width: 32, height: 32, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-gold)', color: 'var(--gv-navy)' }}>
                    <Check size={15} aria-hidden />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setTitleDraft(playlist.title); setRenaming(true) }}
                  className="gv-focusable flex items-center gap-2 text-left max-w-full"
                >
                  <h1 className="font-bold truncate" style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-xl)', color: 'var(--gv-text)' }}>
                    {playlist.title}
                  </h1>
                  <PenLine size={14} style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
                </button>
              )}
              <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playAll}
              disabled={songs.length === 0}
              className="gv-focusable inline-flex items-center gap-1.5 font-semibold active:scale-[0.99] transition-transform disabled:opacity-40"
              style={{ height: 44, padding: '0 20px', borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-gold)', color: 'var(--gv-navy)', fontSize: 'var(--gv-text-sm)' }}
            >
              <Play size={16} fill="currentColor" aria-hidden /> Play all
            </button>
            <button
              type="button"
              onClick={() => setAdding(v => !v)}
              aria-expanded={adding}
              className="gv-focusable inline-flex items-center gap-1.5 font-semibold active:scale-[0.99] transition-transform"
              style={{ height: 44, padding: '0 16px', borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text)', fontSize: 'var(--gv-text-sm)' }}
            >
              {adding ? <X size={15} aria-hidden /> : <Plus size={15} aria-hidden />} {adding ? 'Cerrar' : 'Agregar'}
            </button>
          </div>

          {/* Add songs panel */}
          {adding && (
            <Card padding="md">
              <div
                className="flex items-center gap-2 px-2 mb-2"
                style={{ height: 42, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}
              >
                <SearchIcon size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar en tu catálogo…"
                  aria-label="Buscar canciones para agregar"
                  className="flex-1 min-w-0 bg-transparent outline-none"
                  style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}
                />
              </div>
              {addCandidates.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {addCandidates.map(s => (
                    <div key={s.id} className="flex items-center gap-3" style={{ padding: '6px 2px' }}>
                      <span className="grid place-items-center flex-shrink-0 overflow-hidden" style={{ width: 38, height: 38, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
                        {s.artwork_url ? <img src={s.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" /> : <ListMusic size={15} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{s.title}</span>
                        <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{s.artist_name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => addToPlaylist(playlist.id, s.id)}
                        aria-label={`Agregar ${s.title}`}
                        className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
                        style={{ width: 34, height: 34, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-gold)', color: 'var(--gv-navy)' }}
                      >
                        <Plus size={15} aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-1 py-3 text-center" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>No results found.</p>
              )}
            </Card>
          )}

          {/* Track list */}
          {songs.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {songs.map(s => {
                const fav = isFavorite(s.id)
                return (
                  <div key={s.id} className="flex items-center gap-3" style={{ padding: '8px 6px', borderRadius: 'var(--gv-radius-md)' }}>
                    <button
                      type="button"
                      onClick={() => { playSong(s, songs); navigate(`/player/${s.id}`) }}
                      aria-label={`Play ${s.title}`}
                      className="gv-focusable flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-70 transition-opacity"
                    >
                      <span className="grid place-items-center flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}>
                        {s.artwork_url ? <img src={s.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" /> : <Play size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{s.title}</span>
                        <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{s.artist_name} · {s.genre}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(s)}
                      aria-label={fav ? `Remove ${s.title} from favorites` : `Add ${s.title} to favorites`}
                      aria-pressed={fav}
                      className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
                      style={{ width: 34, height: 34, borderRadius: 'var(--gv-radius-md)', color: fav ? 'var(--gv-gold)' : 'var(--gv-text-muted)' }}
                    >
                      <Heart size={16} fill={fav ? 'currentColor' : 'none'} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromPlaylist(playlist.id, s.id)}
                      aria-label={`Remove ${s.title} from playlist`}
                      className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
                      style={{ width: 34, height: 34, borderRadius: 'var(--gv-radius-md)', color: 'var(--gv-text-muted)' }}
                    >
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card padding="md">
              <div className="flex items-center gap-3" style={{ color: 'var(--gv-text-muted)' }}>
                <Badge tone="navy" variant="soft">Empty</Badge>
                <p style={{ fontSize: 'var(--gv-text-2xs)', lineHeight: 1.5 }}>Esta playlist está vacía. Usa “Agregar” para buscar y añadir canciones.</p>
              </div>
            </Card>
          )}
        </div>
      </GovernanceScope>
    </AppShell>
  )
}
