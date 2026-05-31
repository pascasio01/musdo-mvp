import { useState, useRef, useEffect } from 'react'
import type { BadgeType } from '../types'

interface BadgeConfig {
  label: string
  shortLabel: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
  iconPath: string
}

const BADGE_CONFIG: Record<BadgeType, BadgeConfig> = {
  verified_artist: {
    label: 'MUSVORA Verified Artist',
    shortLabel: 'Verified Artist',
    description: 'Confirms artist identity on MUSVORA. This account is linked to a verified artist through our identity review process.',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-400/25',
    glowColor: 'shadow-blue-500/20',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  verified_composer: {
    label: 'MUSVORA Verified Composer',
    shortLabel: 'Verified Composer',
    description: 'Confirms songwriter and composer identity. Shown on composer profiles and Song Passports where authorship is documented.',
    color: 'text-slate-200',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-300/25',
    glowColor: 'shadow-slate-400/20',
    iconPath: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  },
  human_verified: {
    label: 'Human Verified',
    shortLabel: 'Human Verified',
    description: 'This song passed MUSVORA\'s human-creation review. It was verified to be composed and performed by a human creator, not AI-generated.',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-400/25',
    glowColor: 'shadow-emerald-500/20',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  verified_rights_holder: {
    label: 'Rights Holder Verified',
    shortLabel: 'Rights Holder',
    description: 'Confirms this creator has provided proof of rights to license this music. Required to publish songs to the MUSVORA licensing marketplace.',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-400/25',
    glowColor: 'shadow-amber-500/20',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  label_verified: {
    label: 'Label Verified',
    shortLabel: 'Label Verified',
    description: 'Confirms manager, label, or publisher authorization. This account has been verified to represent an authorized music entity on MUSVORA.',
    color: 'text-violet-300',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-400/25',
    glowColor: 'shadow-violet-500/20',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
}

interface VerificationBadgeProps {
  type: BadgeType
  size?: 'xs' | 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export default function VerificationBadge({
  type,
  size = 'sm',
  showLabel = false,
  className = '',
}: VerificationBadgeProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const config = BADGE_CONFIG[type]

  const iconSize = size === 'xs' ? 11 : size === 'sm' ? 13 : 16
  const containerSize = size === 'xs' ? 'w-4 h-4' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className={`relative inline-flex items-center ${className}`}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        className={`flex items-center gap-1.5 rounded-full transition-all hover:opacity-80 active:scale-95 ${
          showLabel
            ? `px-2 py-0.5 ${config.bgColor} border ${config.borderColor} ${config.color}`
            : ''
        }`}
        aria-label={config.label}
      >
        <div className={`${containerSize} rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center shadow-sm ${config.glowColor} flex-shrink-0`}>
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={config.color}
          >
            <path d={config.iconPath} />
          </svg>
        </div>
        {showLabel && (
          <span className={`text-[10px] font-bold tracking-wide uppercase whitespace-nowrap ${config.color}`}>
            {config.shortLabel}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-7 h-7 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={config.color}>
                <path d={config.iconPath} />
              </svg>
            </div>
            <p className={`text-xs font-bold ${config.color}`}>{config.label}</p>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">{config.description}</p>
          <p className="text-zinc-600 text-[10px] mt-2 font-medium">Verified by MUSVORA</p>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 bg-zinc-900/95 border-r border-b border-white/10" />
        </div>
      )}
    </div>
  )
}

interface VerificationBadgeRowProps {
  verified_artist?: boolean
  verified_composer?: boolean
  human_verified?: boolean
  verified_rights_holder?: boolean
  label_verified?: boolean
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function VerificationBadgeRow({
  verified_artist,
  verified_composer,
  human_verified,
  verified_rights_holder,
  label_verified,
  size = 'sm',
  className = '',
}: VerificationBadgeRowProps) {
  const badges: BadgeType[] = []
  if (verified_artist) badges.push('verified_artist')
  if (verified_composer) badges.push('verified_composer')
  if (human_verified) badges.push('human_verified')
  if (verified_rights_holder) badges.push('verified_rights_holder')
  if (label_verified) badges.push('label_verified')

  if (badges.length === 0) return null

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {badges.map(b => <VerificationBadge key={b} type={b} size={size} />)}
    </div>
  )
}

export function BadgeLegend() {
  const types: BadgeType[] = [
    'verified_artist',
    'verified_composer',
    'human_verified',
    'verified_rights_holder',
    'label_verified',
  ]

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
      <p className="text-white font-bold text-sm mb-4">Badge Legend</p>
      {types.map(type => {
        const config = BADGE_CONFIG[type]
        return (
          <div key={type} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={config.color}>
                <path d={config.iconPath} />
              </svg>
            </div>
            <div>
              <p className={`text-xs font-bold ${config.color}`}>{config.label}</p>
              <p className="text-zinc-600 text-[11px] leading-relaxed mt-0.5">{config.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function VerificationStatusCard({ profile }: {
  profile: {
    verified_artist?: boolean
    verified_composer?: boolean
    human_verified?: boolean
    verified_rights_holder?: boolean
    label_verified?: boolean
    verification_status?: string
    verification_level?: number
  }
}) {
  const active = [
    profile.verified_artist && 'verified_artist',
    profile.verified_composer && 'verified_composer',
    profile.human_verified && 'human_verified',
    profile.verified_rights_holder && 'verified_rights_holder',
    profile.label_verified && 'label_verified',
  ].filter(Boolean) as BadgeType[]

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-bold text-sm">Verification Status</p>
        {profile.verification_level !== undefined && (
          <span className="text-[11px] font-bold text-zinc-500 bg-white/5 rounded-full px-2.5 py-1">
            Level {profile.verification_level}
          </span>
        )}
      </div>
      {active.length === 0 ? (
        <p className="text-zinc-600 text-xs">No badges earned yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {active.map(b => (
            <VerificationBadge key={b} type={b} size="sm" showLabel />
          ))}
        </div>
      )}
    </div>
  )
}

export { BADGE_CONFIG }
