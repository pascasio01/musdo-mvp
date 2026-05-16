import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Quote, Languages } from 'lucide-react'
import type { LyricsTrack, SyncedLyric } from '../types'
import { useLyricsSync } from '../hooks/useLyricsSync'

interface LyricsPanelProps {
  track: LyricsTrack | null
  /** elapsed seconds from the global player */
  elapsed: number
}

/**
 * MUSDO Cinematic Lyrics — a quiet, breathable companion to the StudioView.
 *
 * Design intent (NOT karaoke, NOT Spotify):
 *  - The player remains the hero. Lyrics live in a collapsed glass panel by
 *    default and only open when the listener asks for them.
 *  - Active line breathes with a soft glow. Adjacent lines stay readable but
 *    faded; distant lines dissolve into the background.
 *  - Auto-scroll is gentle, centred, and respects prefers-reduced-motion.
 *  - Aura sync is *very* subtle: only a local box-shadow softness on the panel
 *    itself, scaled by the active line's `intensity`. No global flashes.
 */
function LyricsPanelImpl({ track, elapsed }: LyricsPanelProps) {
  const [open, setOpen] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const { activeIndex, activeLine, hasSynced } = useLyricsSync(track, elapsed)

  if (!track) return null

  return (
    <div
      className="rounded-2xl border overflow-hidden mt-3 transition-shadow duration-700"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--border)',
        // Subtle aura coupling: the panel exhales slightly on emotional peaks.
        boxShadow: open && activeLine
          ? `0 ${10 + (activeLine.intensity ?? 0.4) * 14}px ${30 + (activeLine.intensity ?? 0.4) * 30}px -18px var(--aura-glow, var(--shadow))`
          : '0 4px 18px var(--shadow)',
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close lyrics' : 'Open lyrics'}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
      >
        <Quote size={13} aria-hidden style={{ color: 'var(--accent)' }} />
        <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          Lyrics
        </span>
        {hasSynced && (
          <span
            className="text-[9px] uppercase tracking-widest font-bold mr-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Synced
          </span>
        )}
        <ChevronRight
          size={16}
          aria-hidden
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform 220ms ease',
          }}
        />
      </button>

      {open && (
        <div
          className="px-5 pb-5 pt-1"
          style={{ borderTop: '1px solid var(--border-soft)' }}
        >
          {/* Header strip: tags + translation toggle */}
          <div className="flex items-center justify-between gap-3 mt-3 mb-4">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              {track.emotional_tags?.slice(0, 3).map(t => (
                <span
                  key={t}
                  className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                  style={{
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-soft)',
                    background: 'transparent',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            {track.translations && track.translations.length > 0 && (
              <button
                onClick={() => setShowTranslation(v => !v)}
                aria-pressed={showTranslation}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold transition-colors"
                style={{
                  color: showTranslation ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                <Languages size={11} aria-hidden />
                {showTranslation ? track.translations[0].language.toUpperCase() : 'Original'}
              </button>
            )}
          </div>

          {hasSynced
            ? (
              <SyncedLyricsView
                lines={track.synced!}
                activeIndex={activeIndex}
                translation={
                  showTranslation && track.translations?.[0]
                    ? track.translations[0]
                    : null
                }
              />
            )
            : (
              <PlainLyricsView text={track.plain} />
            )}

          {track.writer_notes && (
            <div
              className="mt-5 pt-4 text-[11px] leading-relaxed italic"
              style={{
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-soft)',
              }}
            >
              <span
                className="not-italic font-bold uppercase tracking-widest text-[9px] mr-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Writer’s note —
              </span>
              {track.writer_notes}
            </div>
          )}

          <p
            className="text-[10px] mt-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Lyrics provided by the verified composer. Mock data shown in this preview.
          </p>
        </div>
      )}
    </div>
  )
}

export const LyricsPanel = memo(LyricsPanelImpl)
export default LyricsPanel

/* ────────────────────────────────────────────────────────────── */

interface SyncedLyricsViewProps {
  lines: SyncedLyric[]
  activeIndex: number
  translation: { language: string; lines: { time: number; text: string }[] } | null
}

const SyncedLyricsView = memo(function SyncedLyricsView({
  lines, activeIndex, translation,
}: SyncedLyricsViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLParagraphElement>(null)

  // Build a quick lookup from line time → translated text
  const translationMap = useMemo(() => {
    if (!translation) return null
    const m = new Map<number, string>()
    for (const l of translation.lines) m.set(l.time, l.text)
    return m
  }, [translation])

  // Gentle auto-scroll: only when active line changes, only if user hasn't
  // disabled motion. We scroll the active <p> to the vertical centre of its
  // own scroll container — never the whole window.
  useEffect(() => {
    if (activeIndex < 0) return
    const el = activeRef.current
    const scroller = containerRef.current
    if (!el || !scroller) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = el.offsetTop - scroller.clientHeight / 2 + el.clientHeight / 2

    scroller.scrollTo({
      top: Math.max(0, top),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [activeIndex])

  return (
    <div
      ref={containerRef}
      className="relative max-h-[44vh] overflow-y-auto pr-1"
      style={{
        // Soft fade at top & bottom so lines dissolve into the cinematic frame.
        maskImage:
          'linear-gradient(180deg, transparent 0, #000 12%, #000 88%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(180deg, transparent 0, #000 12%, #000 88%, transparent 100%)',
      }}
    >
      <div className="py-[18vh] space-y-4">
        {lines.map((line, i) => {
          const isActive = i === activeIndex
          const distance = Math.abs(i - activeIndex)
          const isSection = !!line.section
          // Distance-based opacity falloff — quieter the further from the focus.
          const opacity = isActive
            ? 1
            : distance === 1 ? 0.55
            : distance === 2 ? 0.32
            : distance <= 4 ? 0.18
            : 0.08

          if (isSection) {
            return (
              <p
                key={i}
                ref={isActive ? activeRef : undefined}
                className="text-[10px] uppercase tracking-[0.25em] font-bold text-center select-none"
                style={{
                  color: 'var(--text-muted)',
                  opacity: Math.max(0.25, opacity * 0.7),
                  transition: 'opacity 600ms ease',
                }}
              >
                {line.text}
              </p>
            )
          }

          const intensity = line.intensity ?? 0.4
          const translated = translationMap?.get(line.time)

          return (
            <p
              key={i}
              ref={isActive ? activeRef : undefined}
              className="text-center font-serif leading-snug select-text"
              style={{
                color: 'var(--text-primary)',
                fontSize: isActive ? '1.45rem' : '1.05rem',
                fontWeight: isActive ? 500 : 400,
                opacity,
                letterSpacing: isActive ? '-0.01em' : '0',
                textShadow: isActive
                  ? `0 0 ${14 + intensity * 22}px color-mix(in srgb, var(--aura-glow, var(--text-primary)) ${30 + intensity * 40}%, transparent)`
                  : 'none',
                transition:
                  'opacity 700ms ease, font-size 500ms ease, font-weight 500ms ease, text-shadow 700ms ease, letter-spacing 500ms ease',
              }}
            >
              {line.text}
              {translated && (
                <span
                  className="block mt-1 text-[0.78rem] italic font-sans"
                  style={{
                    color: 'var(--text-secondary)',
                    opacity: isActive ? 0.7 : 0.45,
                    transition: 'opacity 700ms ease',
                  }}
                >
                  {translated}
                </span>
              )}
            </p>
          )
        })}
      </div>
    </div>
  )
})

const PlainLyricsView = memo(function PlainLyricsView({ text }: { text: string }) {
  const lines = useMemo(() => text.split('\n'), [text])
  return (
    <div className="space-y-2">
      {lines.map((l, i) => (
        <p
          key={i}
          className="text-center font-serif text-[1.05rem] leading-snug"
          style={{ color: 'var(--text-primary)', opacity: l.trim() ? 0.85 : 0.4 }}
        >
          {l || '\u00A0'}
        </p>
      ))}
      <p
        className="text-[10px] text-center mt-3 uppercase tracking-widest"
        style={{ color: 'var(--text-muted)' }}
      >
        Time-synced version coming soon
      </p>
    </div>
  )
})
