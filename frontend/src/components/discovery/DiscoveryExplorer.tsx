import { useMemo } from 'react'
import {
  Play,
  Shuffle,
  Sparkle,
  CalendarDays,
  Compass,
  HeartCrack,
  Moon,
  Hourglass,
  Flame,
  Target,
  Waves,
  Heart,
  Zap,
  Car,
  Sunset,
  CookingPot,
  Sparkles,
  BookOpen,
  Coffee,
  CloudRain,
  Map as MapIcon,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeader } from '../governance'
import { buildDiscovery, type BuiltLens } from '../../lib/discovery'
import type { Song } from '../../types'

const ICONS: Record<string, LucideIcon> = {
  Shuffle, Sparkle, CalendarDays, Compass,
  HeartCrack, Moon, Hourglass, Flame, Target, Waves, Heart, Zap,
  Car, Sunset, CookingPot, Sparkles, BookOpen, Coffee, CloudRain, Map: MapIcon,
}

interface DiscoveryExplorerProps {
  onPlay: (song: Song, queue: Song[]) => void
  favoriteIds?: Set<string>
  history?: Song[]
}

/** Honest one-line meta for a lens: real track count + real BPM range or top mood. */
function metaOf(lens: BuiltLens): string {
  const tracks = `${lens.count} ${lens.count === 1 ? 'pista' : 'pistas'}`
  if (lens.bpmRange) {
    const [lo, hi] = lens.bpmRange
    return lo === hi ? `${tracks} · ${lo} BPM` : `${tracks} · ${lo}–${hi} BPM`
  }
  if (lens.topMood) return `${tracks} · ${lens.topMood}`
  return tracks
}

function LensCard({ lens, onPlay }: { lens: BuiltLens; onPlay: (song: Song, queue: Song[]) => void }) {
  const Icon = ICONS[lens.icon] ?? Compass
  return (
    <button
      type="button"
      onClick={() => lens.tracks[0] && onPlay(lens.tracks[0], lens.tracks)}
      className="gv-focusable group relative overflow-hidden text-left active:scale-[0.98] transition-transform"
      style={{
        background: 'var(--gv-surface)',
        border: '1px solid var(--gv-border)',
        borderRadius: 'var(--gv-radius-lg)',
        padding: 'var(--gv-space-4)',
        boxShadow: 'var(--gv-shadow-sm)',
        minHeight: 124,
      }}
      aria-label={`${lens.label} — ${metaOf(lens)}. ${lens.blurb}`}
    >
      {/* soft glass sheen, governance-token only */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: 1, background: 'var(--gv-border-faint)' }}
      />
      <div className="flex items-start justify-between gap-2">
        <span
          className="grid place-items-center flex-shrink-0"
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--gv-radius-md)',
            background: 'var(--gv-surface-2)',
            border: '1px solid var(--gv-border)',
            color: 'var(--gv-gold)',
          }}
          aria-hidden
        >
          <Icon size={18} strokeWidth={1.9} />
        </span>
        <span
          className="grid place-items-center flex-shrink-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
          style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gv-gold)', color: 'var(--gv-navy)' }}
          aria-hidden
        >
          <Play size={14} fill="currentColor" style={{ marginLeft: 1 }} />
        </span>
      </div>
      <h3
        className="font-semibold leading-tight mt-3 truncate"
        style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}
      >
        {lens.label}
      </h3>
      <p
        className="mt-1 line-clamp-2"
        style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}
      >
        {lens.blurb}
      </p>
      <p className="gv-mono mt-2 truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
        {metaOf(lens)}
      </p>
    </button>
  )
}

function LensGrid({ lenses, onPlay }: { lenses: BuiltLens[]; onPlay: (song: Song, queue: Song[]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {lenses.map(lens => (
        <LensCard key={lens.id} lens={lens} onPlay={onPlay} />
      ))}
    </div>
  )
}

/**
 * MUSVORA Discovery — emotional, contextual and AI-powered lenses over the real
 * catalogue. Replaces generic genre-first browsing. Every lens plays a real,
 * distinctly-ranked queue; lenses that resolve to zero real tracks never render.
 */
export default function DiscoveryExplorer({ onPlay, favoriteIds, history }: DiscoveryExplorerProps) {
  const discovery = useMemo(
    () => buildDiscovery({ favoriteIds, history }),
    [favoriteIds, history],
  )

  return (
    <div className="flex flex-col gap-7">
      {discovery.ai.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="MUSVORA AI"
            title="AI Picks"
            description="Curado en vivo desde tu catálogo y lo que escuchas — sin invención."
          />
          <LensGrid lenses={discovery.ai} onPlay={onPlay} />
        </section>
      )}

      {discovery.emotion.length > 0 && (
        <section>
          <SectionHeader eyebrow="Cómo te sientes" title="Emotional Discovery" />
          <LensGrid lenses={discovery.emotion} onPlay={onPlay} />
        </section>
      )}

      {discovery.context.length > 0 && (
        <section>
          <SectionHeader eyebrow="Para tu momento" title="Context Discovery" />
          <LensGrid lenses={discovery.context} onPlay={onPlay} />
        </section>
      )}
    </div>
  )
}
