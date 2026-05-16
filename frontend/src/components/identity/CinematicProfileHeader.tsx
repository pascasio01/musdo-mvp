import { memo } from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { VerificationBadgeRow } from '../VerificationBadge'
import type { PublicIdentity, EmotionalStatus } from '../../types/identity'

interface Props {
  identity: PublicIdentity
  /** When true, renders the header at full immersive height. */
  immersive?: boolean
}

const auraGradients: Record<PublicIdentity['aura'], string> = {
  velvet_violet: 'from-violet-900/40 via-violet-700/15 to-transparent',
  midnight_blue: 'from-indigo-900/40 via-blue-800/15 to-transparent',
  amber_warmth: 'from-amber-900/40 via-orange-700/15 to-transparent',
  crimson_dusk: 'from-rose-900/40 via-red-700/15 to-transparent',
  forest_dawn: 'from-emerald-900/35 via-teal-700/12 to-transparent',
  pearl_neutral: 'from-zinc-700/30 via-zinc-600/10 to-transparent',
}

const statusLabels: Record<NonNullable<EmotionalStatus>, string> = {
  in_the_studio: 'In the studio',
  late_night_writing: 'Late-night writing',
  feeling_nostalgic: 'Feeling nostalgic',
  between_albums: 'Between albums',
  on_tour: 'On tour',
  open_to_collab: 'Open to collab',
  listening_only: 'Listening only',
}

function CinematicProfileHeaderImpl({ identity, immersive = false }: Props) {
  const aura = auraGradients[identity.aura] ?? auraGradients.velvet_violet
  const initial = identity.alias[0]?.toUpperCase() ?? '?'

  return (
    <div className="relative">
      {/* Adaptive aura background — three layered lobes for depth */}
      <div
        className={`absolute inset-x-0 top-0 ${immersive ? 'h-80' : 'h-56'} pointer-events-none overflow-hidden`}
        aria-hidden
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${aura}`} />
        <div className="absolute -top-20 left-[20%] w-[420px] h-[420px] rounded-full opacity-30 blur-[120px]"
             style={{ background: identity.accentColor ?? 'rgba(124,58,237,0.4)' }} />
        <div className="absolute top-10 right-[10%] w-[300px] h-[300px] rounded-full opacity-20 blur-[100px]"
             style={{ background: identity.accentColor ?? 'rgba(124,58,237,0.3)' }} />
      </div>

      <div className="relative px-5 pt-16 pb-2">
        {/* Avatar — large, with soft halo */}
        <div className="flex items-end gap-5 mb-5">
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-40"
              style={{ background: identity.accentColor ?? '#7c3aed' }}
              aria-hidden
            />
            <div
              className="relative w-28 h-28 rounded-3xl flex items-center justify-center border"
              style={{
                background: `linear-gradient(135deg, ${identity.accentColor ?? '#7c3aed'}cc, var(--card-elevated))`,
                borderColor: 'var(--border-soft)',
              }}
              aria-hidden
            >
              {identity.avatarUrl ? (
                <img src={identity.avatarUrl} alt="" className="w-full h-full rounded-3xl object-cover" />
              ) : (
                <span className="text-white text-4xl font-black tracking-tight">{initial}</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 pb-1">
            {/* Emotional status pill — only when set */}
            {identity.emotionalStatus && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 backdrop-blur-sm"
                   style={{
                     background: 'var(--glass-bg-medium)',
                     border: '1px solid var(--border-soft)',
                   }}>
                <Sparkles size={11} className="text-secondary" strokeWidth={2} aria-hidden />
                <span className="text-[10.5px] font-semibold tracking-wide text-secondary">
                  {statusLabels[identity.emotionalStatus]}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-primary font-black text-[26px] leading-none tracking-tight truncate">
                {identity.alias}
              </h1>
              <VerificationBadgeRow
                verified_artist={identity.verifiedArtist}
                human_verified={identity.verifiedHuman}
                size="sm"
              />
            </div>

            {identity.handle && (
              <p className="text-muted text-xs mt-1.5 font-mono tracking-tight">{identity.handle}</p>
            )}
          </div>
        </div>

        {/* Tagline / bio */}
        {identity.bio && (
          <p className="text-secondary text-[14px] leading-relaxed max-w-[34rem] mb-4">
            {identity.bio}
          </p>
        )}

        {/* Emotional tags — soft chips */}
        {identity.emotionalTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {identity.emotionalTags.map(tag => (
              <span
                key={tag}
                className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Verified-human marker — small, dignified */}
        {identity.verifiedHuman && (
          <div className="inline-flex items-center gap-1.5 mt-1 text-[10px] uppercase tracking-[0.18em] text-muted font-semibold">
            <ShieldCheck size={11} strokeWidth={2} aria-hidden />
            Human-verified identity
          </div>
        )}
      </div>
    </div>
  )
}

export const CinematicProfileHeader = memo(CinematicProfileHeaderImpl)
export default CinematicProfileHeader
