import { memo } from 'react'
import { Lock, Eye, Users, EyeOff, Globe, Music2 } from 'lucide-react'
import type { Playlist, PlaylistVisibility } from '../../types/identity'

interface Props {
  playlist: Playlist
  onClick?: (id: string) => void
}

const visibilityMeta: Record<
  PlaylistVisibility,
  { Icon: typeof Lock; label: string }
> = {
  public: { Icon: Globe, label: 'Public' },
  unlisted: { Icon: Eye, label: 'Unlisted' },
  followers_only: { Icon: Users, label: 'Followers' },
  private: { Icon: Lock, label: 'Private' },
  creator_only: { Icon: EyeOff, label: 'Creator only' },
}

function PlaylistCardImpl({ playlist, onClick }: Props) {
  const { Icon, label } = visibilityMeta[playlist.visibility]
  const accent = playlist.accentColor ?? 'var(--accent)'

  return (
    <button
      type="button"
      onClick={() => onClick?.(playlist.id)}
      className="group relative w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.99]"
      style={{
        background:
          'linear-gradient(180deg, var(--card-elevated), var(--card))',
        border: '1px solid var(--border-soft)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -14px var(--shadow)',
      }}
    >
      {/* Animated hover-glow halo using accent */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 0%, ${accent}22, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative p-4 flex gap-4">
        {/* Cover (image or generated gradient) */}
        <div
          className="relative w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
          style={{
            background: playlist.coverUrl
              ? undefined
              : `linear-gradient(135deg, ${accent}aa, var(--card))`,
          }}
          aria-hidden
        >
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Music2 size={22} className="text-white/80" strokeWidth={1.5} />
          )}
          {/* Inner highlight */}
          <div className="absolute inset-0 rounded-xl"
               style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }} />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-primary font-bold text-[15px] leading-tight truncate">
                {playlist.title}
              </p>
              {playlist.subtitle && (
                <p className="text-muted text-[11.5px] italic mt-0.5 truncate">
                  {playlist.subtitle}
                </p>
              )}
            </div>
            <span
              className="flex items-center gap-1 text-[9.5px] uppercase tracking-wider font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <Icon size={10} strokeWidth={2.5} aria-hidden />
              {label}
            </span>
          </div>

          {/* Atmosphere + mood row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {playlist.atmosphere && (
              <span
                className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${accent}22`,
                  color: 'var(--text-primary)',
                  border: `1px solid ${accent}33`,
                }}
              >
                {playlist.atmosphere}
              </span>
            )}
            {playlist.moodSignature.slice(0, 2).map(mood => (
              <span
                key={mood}
                className="text-[10px] text-muted font-medium"
              >
                · {mood}
              </span>
            ))}
            <span className="text-[10px] text-muted font-medium ml-auto">
              {playlist.trackCount} tracks
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export const PlaylistCard = memo(PlaylistCardImpl)
export default PlaylistCard
