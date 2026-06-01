import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, History, Heart, Sparkles } from 'lucide-react'
import { Card, Badge, SectionHeader } from '../governance'
import { usePlayer } from '../../lib/player'
import { mockSongs } from '../../data/mockData'
import type { Song } from '../../types'
import { readinessScore, scoreTone } from '../../data/assetIntelligence'

/**
 * MUSVORA Home — music-forward asset rows.
 *
 * Additive section group beneath the catalogue intelligence cards. Surfaces the
 * catalogue as playable assets (Continue Listening · Recent · Favorites ·
 * Recommended) without removing any existing metrics. Governance Design System.
 */

const READINESS_TONE_LABEL: Record<'good' | 'warn' | 'risk', { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  good: { label: 'Ready', tone: 'success' },
  warn: { label: 'In progress', tone: 'warning' },
  risk: { label: 'At risk', tone: 'danger' },
}

function readinessBadge(song: Song) {
  return READINESS_TONE_LABEL[scoreTone(readinessScore(song)) as 'good' | 'warn' | 'risk']
}

function HScrollRow({ songs, onPlay }: { songs: Song[]; onPlay: (s: Song) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
      {songs.map(song => (
        <button
          key={song.id}
          type="button"
          onClick={() => onPlay(song)}
          className="group flex-shrink-0 text-left active:opacity-80 transition-opacity"
          style={{ width: 140 }}
        >
          <div
            className="relative w-full overflow-hidden mb-2"
            style={{
              aspectRatio: '1 / 1',
              borderRadius: 'var(--gv-radius-lg)',
              background: 'var(--gv-surface-2)',
              border: '1px solid var(--gv-border)',
            }}
          >
            {song.artwork_url && (
              <img src={song.artwork_url} alt="" className="w-full h-full object-cover" />
            )}
            <span
              className="absolute bottom-2 right-2 grid place-items-center rounded-full"
              style={{ width: 30, height: 30, background: 'var(--gv-gold)', color: 'var(--gv-navy)', boxShadow: 'var(--gv-shadow-md)' }}
              aria-hidden
            >
              <Play size={14} fill="currentColor" style={{ marginLeft: 1 }} />
            </span>
          </div>
          <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
            {song.title}
          </p>
          <p className="truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
            {song.artist_name}
          </p>
        </button>
      ))}
    </div>
  )
}

function AssetSectionsImpl() {
  const navigate = useNavigate()
  const { playSong } = usePlayer()

  const onPlay = (song: Song) => {
    playSong(song, mockSongs)
    navigate(`/player/${song.id}`)
  }

  const continueListening = mockSongs.slice(0, 5)
  const recent = mockSongs.slice(1, 6)
  const favorites = mockSongs.filter(s => s.human_verified).slice(0, 5)
  const recommended = [...mockSongs]
    .sort((a, b) => readinessScore(b) - readinessScore(a))
    .slice(0, 4)

  return (
    <>
      {/* ── Continue Listening ── */}
      <div className="mt-8">
        <SectionHeader eyebrow="Resume" title="Continue Listening" />
        <HScrollRow songs={continueListening} onPlay={onPlay} />
      </div>

      {/* ── Recientes ── */}
      <div className="mt-8">
        <SectionHeader
          eyebrow="Recent"
          title="Recientes"
          actions={<History size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />}
        />
        <HScrollRow songs={recent} onPlay={onPlay} />
      </div>

      {/* ── Favoritos ── */}
      {favorites.length > 0 && (
        <div className="mt-8">
          <SectionHeader
            eyebrow="Saved"
            title="Favoritos"
            actions={<Heart size={15} style={{ color: 'var(--gv-text-muted)' }} aria-hidden />}
          />
          <HScrollRow songs={favorites} onPlay={onPlay} />
        </div>
      )}

      {/* ── Recommended Assets ── */}
      <div className="mt-8">
        <SectionHeader
          eyebrow="For you"
          title="Recommended Assets"
          description="Catalogue assets surfaced by readiness. Tap to open in the player."
          actions={<Sparkles size={15} style={{ color: 'var(--gv-gold)' }} aria-hidden />}
        />
        <div className="grid gap-2.5">
          {recommended.map(song => {
            const badge = readinessBadge(song)
            return (
              <Card key={song.id} padding="none">
                <button
                  type="button"
                  onClick={() => onPlay(song)}
                  className="w-full flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                  style={{ padding: 'var(--gv-space-3)' }}
                >
                  <span
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: 48, height: 48, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-surface-2)' }}
                  >
                    {song.artwork_url && <img src={song.artwork_url} alt="" className="w-full h-full object-cover" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                      {song.title}
                    </p>
                    <p className="truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                      {song.genre}
                    </p>
                  </div>
                  <Badge tone={badge.tone}>{badge.label}</Badge>
                  <span
                    className="grid place-items-center rounded-full flex-shrink-0"
                    style={{ width: 30, height: 30, background: 'var(--gv-surface-2)', color: 'var(--gv-text-secondary)' }}
                    aria-hidden
                  >
                    <Play size={13} fill="currentColor" style={{ marginLeft: 1 }} />
                  </span>
                </button>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}

export const AssetSections = memo(AssetSectionsImpl)
export default AssetSections
