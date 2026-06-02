import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  X,
  Search,
  Shuffle,
  ListPlus,
  Moon,
  BookOpen,
  Target,
  UtensilsCrossed,
  Car,
  Dumbbell,
  CalendarClock,
  ChevronLeft,
  Play,
  TrendingUp,
  BadgeCheck,
  Compass,
  Gauge,
  Heart,
} from 'lucide-react'
import { GovernanceScope, Badge } from '../governance'
import { usePlayer } from '../../lib/player'
import { useLibrary } from '../../lib/library'
import { useToast } from '../../lib/toast'
import {
  SESSIONS,
  buildSession,
  surpriseMe,
  availableMoods,
  songsByMood,
  trendingSongs,
  humanVerifiedSongs,
  freshSongs,
  type SessionId,
  type BuiltSession,
} from '../../lib/musvoraAI'
import type { Song } from '../../types'

const SESSION_ICON: Record<SessionId, React.ReactNode> = {
  sleep: <Moon size={20} strokeWidth={1.8} />,
  study: <BookOpen size={20} strokeWidth={1.8} />,
  focus: <Target size={20} strokeWidth={1.8} />,
  restaurant: <UtensilsCrossed size={20} strokeWidth={1.8} />,
  driving: <Car size={20} strokeWidth={1.8} />,
  gym: <Dumbbell size={20} strokeWidth={1.8} />,
  event: <CalendarClock size={20} strokeWidth={1.8} />,
}

export default function MusvoraAIButton() {
  const navigate = useNavigate()
  const { song, playSong } = usePlayer()
  const { favoriteIds, historySongs, createPlaylist, addToPlaylist } = useLibrary()
  const toast = useToast()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'home' | 'mood'>('home')
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  const ctx = useMemo(
    () => ({ favoriteIds, historyIds: new Set(historySongs.map(s => s.id)) }),
    [favoriteIds, historySongs],
  )

  // Pre-build every session so each card can show its REAL track count + BPM range.
  const sessionMeta = useMemo(() => {
    const m = {} as Record<SessionId, BuiltSession>
    for (const s of SESSIONS) m[s.id] = buildSession(s.id, ctx)
    return m
  }, [ctx])

  const close = () => {
    setOpen(false)
    setView('home')
    fabRef.current?.focus()
  }

  // Lock scroll + focus trap + Escape while the panel is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const root = panelRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const playQueue = (tracks: Song[], label: string) => {
    const first = tracks[0]
    if (!first) {
      toast.info('No hay pistas para esta sesión todavía')
      return
    }
    playSong(first, tracks)
    close()
    navigate(`/player/${first.id}`)
    toast.success(label)
  }

  const onSession = (id: SessionId) => {
    const built = sessionMeta[id]
    playQueue(built.tracks, `${built.label} Session · ${built.tracks.length} pistas`)
  }

  const onSurprise = () => {
    const list = surpriseMe(ctx)
    playQueue(list, `Surprise Me · ${list.length} pistas`)
  }

  const onFindMusic = () => {
    setOpen(false)
    setView('home')
    navigate('/search')
  }

  const onMood = (mood: string, label: string) => {
    const songs = songsByMood(mood)
    if (!songs.length) {
      toast.info('No hay canciones con este mood todavía')
      return
    }
    const plId = createPlaylist(`MUSVORA · ${label}`)
    songs.forEach(s => addToPlaylist(plId, s.id))
    close()
    toast.success(`Playlist creada · ${label} (${songs.length})`)
    navigate(`/library/playlist/${plId}`)
  }

  const onTrending = () => {
    const list = trendingSongs()
    if (!list.length) { toast.info('Aún no hay catálogo'); return }
    playQueue(list, `Top Trending · por reproducciones reales`)
  }

  const onVerified = () => {
    const list = humanVerifiedSongs()
    if (!list.length) { toast.info('Aún no hay música human-verified'); return }
    playQueue(list, `Human Verified · ${list.length} pistas`)
  }

  const onDiscover = () => {
    const list = freshSongs(ctx)
    if (!list.length) { toast.info('Aún no hay catálogo'); return }
    playQueue(list, `Descubrir · ${list.length} pistas nuevas para ti`)
  }

  const onByBpm = () => {
    setOpen(false)
    setView('home')
    navigate('/music-director')
  }

  const moods = availableMoods()
  const fabBottom = song ? 158 : 92

  return (
    <>
      {/* ── Floating MUSVORA AI button (centered above the bottom nav) ── */}
      <div className="fixed inset-x-0 z-40 pointer-events-none max-w-md mx-auto" style={{ bottom: 0 }}>
        <button
          ref={fabRef}
          type="button"
          aria-label="Open MUSVORA AI"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="gv-ai-fab gv-focusable pointer-events-auto absolute left-1/2 grid place-items-center"
          style={{
            bottom: fabBottom,
            transform: 'translateX(-50%)',
            width: 66,
            height: 66,
            borderRadius: '50%',
            background:
              'linear-gradient(155deg, color-mix(in srgb, var(--gv-gold) 24%, rgba(12,12,14,0.74)), rgba(10,10,12,0.7))',
            border: '1px solid color-mix(in srgb, var(--gv-gold) 50%, transparent)',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          }}
        >
          <AILogoMark size={34} />
        </button>
      </div>

      {/* ── Unified AI panel (bottom sheet) ── */}
      {open && (
        <GovernanceScope>
          <div
            className="fixed inset-0 z-50 flex items-stretch justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="MUSVORA AI"
          >
            <button
              type="button"
              aria-label="Close"
              tabIndex={-1}
              onClick={close}
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            />
            <div
              ref={panelRef}
              className="relative w-full max-w-md safe-bottom"
              style={{
                background: 'var(--gv-bg)',
                boxShadow: '0 0 60px rgba(0,0,0,0.6)',
                height: '100dvh',
                maxHeight: '100dvh',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div
                className="sticky top-0 flex items-center justify-between gap-3 px-5"
                style={{
                  height: 60,
                  background: 'color-mix(in srgb, var(--gv-bg) 92%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderBottom: '1px solid var(--gv-border-faint)',
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {view === 'mood' && (
                    <button
                      type="button"
                      aria-label="Back"
                      onClick={() => setView('home')}
                      className="gv-focusable grid place-items-center active:scale-95 transition-transform"
                      style={{ width: 32, height: 32, borderRadius: 'var(--gv-radius-md)', color: 'var(--gv-text-secondary)' }}
                    >
                      <ChevronLeft size={20} strokeWidth={2} aria-hidden />
                    </button>
                  )}
                  <Sparkles size={18} strokeWidth={2} style={{ color: 'var(--gv-gold)' }} aria-hidden />
                  <div className="min-w-0">
                    <p className="gv-eyebrow">MUSVORA AI</p>
                    <p className="font-bold leading-none truncate" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>
                      {view === 'mood' ? 'Crear playlist por mood' : '¿Qué quieres escuchar?'}
                    </p>
                  </div>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close MUSVORA AI"
                  onClick={close}
                  className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--gv-radius-md)',
                    background: 'var(--gv-surface-2)',
                    border: '1px solid var(--gv-border)',
                    color: 'var(--gv-text-secondary)',
                  }}
                >
                  <X size={18} strokeWidth={2} aria-hidden />
                </button>
              </div>

              <div className="px-5 py-5">
                {view === 'home' ? (
                  <>
                    {/* Quick actions */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <QuickAction icon={<Search size={20} strokeWidth={1.8} />} label="Find Music" onClick={onFindMusic} />
                      <QuickAction icon={<Shuffle size={20} strokeWidth={1.8} />} label="Surprise Me" onClick={onSurprise} accent />
                      <QuickAction icon={<ListPlus size={20} strokeWidth={1.8} />} label="Crear playlist" onClick={() => setView('mood')} />
                    </div>

                    {/* Sessions */}
                    <p className="gv-eyebrow mt-6 mb-3">Sesiones · curadas de tu catálogo</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SESSIONS.map(s => {
                        const meta = sessionMeta[s.id]
                        const range = meta.bpmRange
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => onSession(s.id)}
                            className="gv-focusable text-left active:opacity-70 transition-opacity"
                            style={{
                              background: 'var(--gv-surface)',
                              border: '1px solid var(--gv-border)',
                              borderRadius: 'var(--gv-radius-lg)',
                              padding: 'var(--gv-space-4)',
                            }}
                          >
                            <span className="grid place-items-center mb-2.5" style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', color: 'var(--gv-gold)' }} aria-hidden>
                              {SESSION_ICON[s.id]}
                            </span>
                            <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{s.label}</p>
                            <p className="mt-0.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 'var(--gv-leading-normal)' }}>{s.tagline}</p>
                            <p className="mt-1.5 font-medium" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-faint)' }}>
                              {meta.tracks.length} pistas{range ? ` · ${range[0]}–${range[1]} BPM` : ''}
                            </p>
                          </button>
                        )
                      })}
                    </div>

                    {/* Advanced — real catalogue actions only */}
                    <p className="gv-eyebrow mt-7 mb-3">Avanzado</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <AdvAction icon={<TrendingUp size={18} strokeWidth={1.9} />} label="Top Trending" sub="Por reproducciones" onClick={onTrending} />
                      <AdvAction icon={<BadgeCheck size={18} strokeWidth={1.9} />} label="Human Verified" sub="Solo verificadas" onClick={onVerified} />
                      <AdvAction icon={<Compass size={18} strokeWidth={1.9} />} label="Descubrir" sub="Nuevo para ti" onClick={onDiscover} />
                      <AdvAction icon={<Gauge size={18} strokeWidth={1.9} />} label="By BPM" sub="Por tempo" onClick={onByBpm} />
                      <AdvAction icon={<Heart size={18} strokeWidth={1.9} />} label="By Emotion" sub="Por mood real" onClick={() => setView('mood')} />
                    </div>

                    {/* Honestly pending — needs data MUSVORA does not collect yet */}
                    <p className="gv-eyebrow mt-7 mb-3">Pronto · requiere más datos</p>
                    <div className="flex flex-wrap gap-2">
                      <PendingChip label="Music Twin" />
                      <PendingChip label="Around Me" />
                      <PendingChip label="By Language" />
                    </div>

                    <p className="mt-5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-faint)', lineHeight: 'var(--gv-leading-normal)' }}>
                      Las sesiones se construyen solo con tu catálogo real (tempo y mood). MUSVORA AI organiza música — no la genera. Music Twin, Around Me y By Language llegarán cuando exista la señal real que necesitan.
                    </p>
                  </>
                ) : (
                  <>
                    {moods.length > 0 ? (
                      <div className="grid gap-2.5">
                        {moods.map(m => (
                          <button
                            key={m.mood}
                            type="button"
                            onClick={() => onMood(m.mood, m.label)}
                            className="gv-focusable w-full flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                            style={{
                              background: 'var(--gv-surface)',
                              border: '1px solid var(--gv-border)',
                              borderRadius: 'var(--gv-radius-lg)',
                              padding: 'var(--gv-space-4)',
                            }}
                          >
                            <span className="grid place-items-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', color: 'var(--gv-gold)' }} aria-hidden>
                              <Play size={16} fill="currentColor" style={{ marginLeft: 1 }} />
                            </span>
                            <span className="flex-1 font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{m.label}</span>
                            <Badge tone="neutral" variant="soft">{m.count}</Badge>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                        Aún no hay moods etiquetados en el catálogo.
                      </p>
                    )}
                    <p className="mt-4" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-faint)', lineHeight: 'var(--gv-leading-normal)' }}>
                      Solo se muestran los moods que existen realmente en el catálogo.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </GovernanceScope>
      )}
    </>
  )
}

function QuickAction({ icon, label, onClick, accent }: { icon: React.ReactNode; label: string; onClick: () => void; accent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gv-focusable flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
      style={{
        background: accent ? 'color-mix(in srgb, var(--gv-gold) 12%, var(--gv-surface))' : 'var(--gv-surface)',
        border: `1px solid ${accent ? 'color-mix(in srgb, var(--gv-gold) 40%, var(--gv-border))' : 'var(--gv-border)'}`,
        borderRadius: 'var(--gv-radius-lg)',
        padding: 'var(--gv-space-4) var(--gv-space-2)',
        minHeight: 84,
        color: accent ? 'var(--gv-gold)' : 'var(--gv-text-secondary)',
      }}
    >
      {icon}
      <span className="font-semibold text-center" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text)' }}>{label}</span>
    </button>
  )
}

function AdvAction({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gv-focusable flex items-center gap-3 text-left active:opacity-70 transition-opacity"
      style={{
        background: 'var(--gv-surface)',
        border: '1px solid var(--gv-border)',
        borderRadius: 'var(--gv-radius-lg)',
        padding: 'var(--gv-space-3)',
      }}
    >
      <span
        className="grid place-items-center flex-shrink-0"
        style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)', color: 'var(--gv-gold)' }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{label}</span>
        <span className="block truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{sub}</span>
      </span>
    </button>
  )
}

function PendingChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        background: 'var(--gv-surface)',
        border: '1px dashed var(--gv-border)',
        borderRadius: '999px',
        padding: '6px 12px',
        fontSize: 'var(--gv-text-2xs)',
        color: 'var(--gv-text-muted)',
      }}
    >
      {label}
      <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gv-text-faint)' }}>Pronto</span>
    </span>
  )
}

function AILogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="flex-shrink-0"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
    >
      <path
        d="M14 45 V19 L23 19 L32 33 L41 19 L50 19 V45 H43.5 V30 L34 44 H30 L20.5 30 V45 Z"
        fill="#fff"
      />
      <rect x="14" y="49.5" width="36" height="3" rx="1.5" fill="var(--gv-gold, #D4AF37)" />
    </svg>
  )
}
