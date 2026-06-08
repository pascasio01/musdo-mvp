import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Heart, Play, History, Disc3, Users, PenLine,
  ListMusic, Users2, Download, Plus, Trash2, Clock, ChevronRight, Lock,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge, SectionHeader } from '../components/governance'
import GlobalSearch from '../components/home/GlobalSearch'
import { useLibrary } from '../lib/library'
import { usePlayer } from '../lib/player'
import { useAuth } from '../lib/auth'
import { usePermissions } from '../lib/usePermissions'
import { useOffline, formatBytes } from '../lib/offline'
import DownloadButton from '../components/DownloadButton'
import LockBadge from '../components/access/LockBadge'
import type { Song, AppRole } from '../types'
import type { LibraryPlaylist } from '../lib/library'
import { MDLS } from '../lib/mdls'

/**
 * MUSVORA Library — the creator's real music library.
 *
 * Favorites, history, artists and personal playlists are real, per-user data
 * (see `lib/library.ts`). Categories with no real source yet (Albums,
 * Composers, Collaborative Playlists, Downloaded Library) are shown honestly as
 * "Pending Integration / Pending Verification / Internal Preview" — never faked.
 *
 * Institutional Dark Luxury (Governance DS): low visual noise, clear hierarchy.
 */

const MODE_LABEL: Record<AppRole, string> = {
  listener: 'Listener',
  composer: 'Composer',
  producer: 'Artist',
  admin: 'Owner',
  supreme_owner: 'Owner',
}

function SongRow({
  song, context, onFav, isFav,
}: {
  song: Song
  context: Song[]
  onFav: (s: Song) => void
  isFav: boolean
}) {
  const navigate = useNavigate()
  const { playSong } = usePlayer()
  const play = () => {
    playSong(song, context)
    navigate(`/player/${song.id}`)
  }
  return (
    <div
      className="flex items-center gap-3"
      style={{ padding: '8px 6px', borderRadius: 'var(--gv-radius-md)' }}
    >
      <button
        type="button"
        onClick={play}
        aria-label={`Play ${song.title}`}
        className="gv-focusable flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-70 transition-opacity"
      >
        <span
          className="relative grid place-items-center flex-shrink-0 overflow-hidden"
          style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}
        >
          {song.artwork_url
            ? <img src={song.artwork_url} alt="" loading="lazy" className="w-full h-full object-cover" />
            : <Play size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
            {song.title}
          </span>
          <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
            {song.artist_name} · {song.genre}
          </span>
        </span>
      </button>
      <DownloadButton song={song} size={36} />
      <button
        type="button"
        onClick={() => onFav(song)}
        aria-label={isFav ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
        aria-pressed={isFav}
        className="gv-focusable grid place-items-center flex-shrink-0 active:scale-90 transition-transform"
        style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', color: isFav ? 'var(--gv-gold)' : 'var(--gv-text-muted)' }}
      >
        <Heart size={17} fill={isFav ? 'currentColor' : 'none'} aria-hidden />
      </button>
    </div>
  )
}

function PendingCard({
  icon, title, status, note,
}: {
  icon: React.ReactNode
  title: string
  status: 'Pending Integration' | 'Pending Verification' | 'Internal Preview'
  note: string
}) {
  return (
    <Card padding="md">
      <div className="flex items-start gap-3">
        <span
          className="grid place-items-center flex-shrink-0"
          style={{ width: 38, height: 38, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)' }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{title}</span>
            <Badge tone={status === 'Internal Preview' ? 'navy' : 'warning'} variant="soft">{status}</Badge>
          </div>
          <p className="mt-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 1.5 }}>{note}</p>
        </div>
      </div>
    </Card>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Card padding="md">
      <div className="flex items-center gap-3" style={{ color: 'var(--gv-text-muted)' }}>
        <span className="flex-shrink-0" aria-hidden>{icon}</span>
        <p style={{ fontSize: 'var(--gv-text-2xs)', lineHeight: 1.5 }}>{text}</p>
      </div>
    </Card>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const {
    favoriteSongs, historySongs, libraryArtists, playlists,
    isFavorite, toggleFavorite, clearHistory, createPlaylist,
  } = useLibrary()
  const { downloads, storage } = useOffline()
  const { can: canFeature } = usePermissions()
  const canPlaylists = canFeature('playlists.premium')
  const downloadCount = downloads.length
  const storageUsage = storage.usage

  const [searchOpen, setSearchOpen] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState('')

  const mode = MODE_LABEL[(profile?.role as AppRole) ?? 'listener'] ?? 'Listener'

  const onFav = (s: Song) => toggleFavorite(s)

  const handleCreate = () => {
    if (!canPlaylists) { navigate('/pricing'); return }
    const title = newPlaylist.trim()
    if (!title) return
    const id = createPlaylist(title)
    setNewPlaylist('')
    navigate(`/library/playlist/${id}`)
  }

  const openArtist = (name: string) => navigate(`/search?q=${encodeURIComponent(name)}`)

  return (
    <AppShell>
      <GovernanceScope className="min-h-screen">
        {/* ── Header ── */}
        <header
          className="sticky top-0 z-30 safe-top"
          style={{
            background: 'color-mix(in srgb, var(--gv-bg) 88%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--gv-border-faint)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5" style={{ height: 64 }}>
            <div className="min-w-0">
              <p className="gv-eyebrow">{MDLS.library.eyebrow}</p>
              <h1
                className="font-bold leading-none truncate"
                style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-lg)', color: 'var(--gv-text)' }}
              >
                {MDLS.library.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge tone="navy" variant="soft">Mode · {mode}</Badge>
              <button
                type="button"
                aria-label="Search music, artists and assets"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(true)}
                className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                style={{
                  width: 40, height: 40, borderRadius: 'var(--gv-radius-md)',
                  background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-text-secondary)',
                }}
              >
                <Search size={18} strokeWidth={1.8} aria-hidden />
              </button>
            </div>
          </div>
        </header>

        <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="px-5 pt-6 pb-4 flex flex-col gap-8">
          {/* 1 — Favoritos */}
          <section>
            <SectionHeader eyebrow="Saved" title={MDLS.library.loved} actions={<Heart size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            {favoriteSongs.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {favoriteSongs.slice(0, 12).map(s => (
                  <SongRow key={s.id} song={s} context={favoriteSongs} onFav={onFav} isFav={isFavorite(s.id)} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<Heart size={16} />} text="Aún no tienes favoritos. Toca el corazón en cualquier canción para guardarla aquí." />
            )}
          </section>

          {/* 2 — Historial */}
          <section>
            <SectionHeader
              eyebrow="Recent"
              title={MDLS.library.echoes}
              actions={
                historySongs.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="gv-focusable inline-flex items-center gap-1 active:opacity-70 transition-opacity"
                    style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}
                  >
                    <Clock size={13} aria-hidden /> Clear
                  </button>
                ) : <History size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
              }
            />
            {historySongs.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {historySongs.slice(0, 12).map(s => (
                  <SongRow key={s.id} song={s} context={historySongs} onFav={onFav} isFav={isFavorite(s.id)} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<History size={16} />} text="Tu historial aparecerá aquí cuando reproduzcas música." />
            )}
          </section>

          {/* 3 — Álbumes */}
          <section>
            <SectionHeader eyebrow="Catalogue" title="Álbumes" />
            <PendingCard
              icon={<Disc3 size={18} />}
              title="Albums"
              status="Pending Integration"
              note="Los álbumes se activarán cuando el catálogo incluya metadata de álbum (release, tracklist, UPC)."
            />
          </section>

          {/* 4 — Artistas */}
          <section>
            <SectionHeader eyebrow="People" title="Artistas" actions={<Users size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            {libraryArtists.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {libraryArtists.slice(0, 10).map(a => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => openArtist(a.name)}
                    className="gv-focusable flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                    style={{ padding: '8px 6px', borderRadius: 'var(--gv-radius-md)' }}
                  >
                    <span
                      className="grid place-items-center flex-shrink-0"
                      style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)' }}
                    >
                      <Users size={16} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{a.name}</span>
                      <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                        {a.count} {a.count === 1 ? 'track' : 'tracks'}{a.verified ? ' · Human Verified' : ''}
                      </span>
                    </span>
                    <ChevronRight size={16} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState icon={<Users size={16} />} text="Los artistas que escuches o guardes aparecerán aquí automáticamente." />
            )}
          </section>

          {/* 5 — Compositores */}
          <section>
            <SectionHeader eyebrow="People" title="Compositores" />
            <PendingCard
              icon={<PenLine size={18} />}
              title="Composers"
              status="Pending Verification"
              note="El directorio de compositores requiere split sheets y créditos verificados antes de mostrarse."
            />
          </section>

          {/* 6 — Playlists personales */}
          <section>
            <SectionHeader eyebrow="Yours" title={MDLS.library.yourCollections} actions={<ListMusic size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            {canPlaylists ? (
              <div
                className="flex items-center gap-2 mb-2.5 px-2"
                style={{ height: 46, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface)', border: '1px solid var(--gv-border)' }}
              >
                <ListMusic size={16} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                <input
                  value={newPlaylist}
                  onChange={e => setNewPlaylist(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
                  placeholder="Nueva colección…"
                  aria-label="Nombre de la nueva colección"
                  className="flex-1 min-w-0 bg-transparent outline-none"
                  style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!newPlaylist.trim()}
                  aria-label="Crear colección"
                  className="gv-focusable inline-flex items-center gap-1 font-semibold active:scale-95 transition-transform disabled:opacity-40"
                  style={{
                    height: 32, padding: '0 12px', borderRadius: 'var(--gv-radius-sm)',
                    background: 'var(--gv-gold)', color: 'var(--gv-navy)', fontSize: 'var(--gv-text-2xs)',
                  }}
                >
                  <Plus size={14} aria-hidden /> Crear
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="gv-focusable w-full flex items-center gap-2.5 mb-2.5 px-3 text-left active:scale-[0.99] transition-transform"
                style={{ height: 46, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface)', border: '1px solid color-mix(in srgb, var(--gv-gold) 30%, var(--gv-border))' }}
                aria-label="Crear colecciones con Premium"
              >
                <span className="grid place-items-center" style={{ width: 24, height: 24, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-surface-2)', color: 'var(--gv-gold)' }} aria-hidden>
                  <Lock size={13} strokeWidth={2.2} />
                </span>
                <span className="flex-1 min-w-0 font-medium" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>Crea colecciones con Premium</span>
                <span className="font-semibold" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-gold)' }}>Ver planes</span>
              </button>
            )}
            {playlists.length > 0 ? (
              <div className="flex flex-col gap-2">
                {playlists.map((p: LibraryPlaylist) => (
                  <Card key={p.id} padding="none">
                    <button
                      type="button"
                      onClick={() => navigate(`/library/playlist/${p.id}`)}
                      className="w-full flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                      style={{ padding: 'var(--gv-space-3)' }}
                    >
                      <span
                        className="grid place-items-center flex-shrink-0"
                        style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-gold)' }}
                      >
                        <ListMusic size={18} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{p.title}</span>
                        <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                          {p.songIds.length} {p.songIds.length === 1 ? 'track' : 'tracks'}
                        </span>
                      </span>
                      <ChevronRight size={16} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
                    </button>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState icon={<ListMusic size={16} />} text="Crea tu primera colección arriba. Podrás agregar canciones de tu catálogo." />
            )}
          </section>

          {/* 7 — Playlists colaborativas */}
          <section>
            <SectionHeader eyebrow="Shared" title={MDLS.library.sharedCollections} actions={<Users2 size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <PendingCard
              icon={<Users2 size={18} />}
              title="Shared Collections"
              status="Pending Integration"
              note="La colaboración en tiempo real requiere backend multiusuario. Llegará en un sprint dedicado."
            />
          </section>

          {/* 8 — Biblioteca descargada */}
          <section>
            <SectionHeader eyebrow="Offline" title={MDLS.library.onYourDevice} actions={<Download size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />} />
            <Card padding="none">
              <button
                type="button"
                onClick={() => navigate('/downloads')}
                className="w-full flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                style={{ padding: 'var(--gv-space-3)' }}
              >
                <span
                  className="grid place-items-center flex-shrink-0"
                  style={{ width: 44, height: 44, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', border: '1px solid var(--gv-border)', color: 'var(--gv-gold)' }}
                >
                  <Download size={18} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                      Offline Mode
                    </span>
                    <LockBadge feature="offline" />
                  </span>
                  <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                    {downloadCount > 0
                      ? `${downloadCount} ${downloadCount === 1 ? 'descarga' : 'descargas'} · ${formatBytes(storageUsage)} usados`
                      : 'Descarga canciones y colecciones para escuchar sin conexión'}
                  </span>
                </span>
                <ChevronRight size={16} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />
              </button>
            </Card>
          </section>
        </div>
      </GovernanceScope>
    </AppShell>
  )
}
