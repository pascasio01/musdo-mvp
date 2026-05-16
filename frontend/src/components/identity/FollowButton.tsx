import { memo, useCallback } from 'react'
import { UserPlus, Check } from 'lucide-react'
import { useIdentity, formatCount, formatResonanceTier } from '../../lib/identity'
import type { ResonanceSummary } from '../../types/identity'

interface Props {
  userId: string
  resonance?: ResonanceSummary
  /** Compact variant for grids; default is full button. */
  variant?: 'default' | 'compact'
}

function FollowButtonImpl({ userId, resonance, variant = 'default' }: Props) {
  const { isFollowing, follow, unfollow } = useIdentity()
  const followed = isFollowing(userId)

  const onClick = useCallback(() => {
    if (followed) unfollow(userId)
    else follow(userId)
  }, [followed, follow, unfollow, userId])

  const label = followed ? 'Resonating' : 'Follow'
  const Icon = followed ? Check : UserPlus

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        aria-pressed={followed}
        className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5"
        style={
          followed
            ? {
                background: 'var(--glass-bg)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-soft)',
              }
            : {
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
              }
        }
      >
        <Icon size={11} strokeWidth={2.5} aria-hidden />
        {label}
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        aria-pressed={followed}
        className="w-full py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        style={
          followed
            ? {
                background: 'var(--glass-bg-medium)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-soft)',
              }
            : {
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
                boxShadow: '0 8px 24px -10px var(--shadow)',
              }
        }
      >
        <Icon size={16} strokeWidth={2.5} aria-hidden />
        {label}
      </button>

      {resonance && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted">
              <span className="text-primary font-bold">{formatCount(resonance.followers)}</span>
              <span className="ml-1">resonating</span>
            </span>
            <span className="text-[11px] text-muted">
              <span className="text-primary font-bold">{formatCount(resonance.following)}</span>
              <span className="ml-1">following</span>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold"
                style={{ color: 'var(--accent)' }}>
            {formatResonanceTier(resonance.tier)}
          </span>
        </div>
      )}

      {resonance?.descriptor && (
        <p className="text-muted text-[11px] italic px-1">{resonance.descriptor}</p>
      )}
    </div>
  )
}

export const FollowButton = memo(FollowButtonImpl)
export default FollowButton
