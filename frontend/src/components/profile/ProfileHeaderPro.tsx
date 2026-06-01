import type { ReactNode } from 'react'
import { ArrowLeft, BadgeCheck, Clock, MapPin, Pencil, ShieldCheck } from 'lucide-react'
import { Badge, Button } from '../governance'
import type { ProfileVerificationState } from '../../types/profile'

interface ProfileHeaderProProps {
  displayName: string
  handle: string
  roleLabel: string
  country: string | null
  languages: string[]
  genres: string[]
  avatarUrl: string | null
  coverImageUrl: string | null
  verification: { state: ProfileVerificationState; label: string }
  isOwner: boolean
  isSelf: boolean
  onBack: () => void
  onEdit: () => void
  onFounderConsole: () => void
}

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 'var(--gv-text-xs)',
        color: 'var(--gv-text-secondary)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {children}
    </span>
  )
}

export default function ProfileHeaderPro({
  displayName,
  handle,
  roleLabel,
  country,
  languages,
  genres,
  avatarUrl,
  coverImageUrl,
  verification,
  isOwner,
  isSelf,
  onBack,
  onEdit,
  onFounderConsole,
}: ProfileHeaderProProps) {
  const initials = displayName.trim().slice(0, 2).toUpperCase() || 'MV'

  return (
    <header>
      {/* Cover */}
      <div
        style={{
          position: 'relative',
          height: 180,
          background: coverImageUrl
            ? `center / cover no-repeat url(${coverImageUrl})`
            : 'linear-gradient(135deg, var(--gv-navy) 0%, var(--gv-surface-2) 100%)',
          borderBottom: '1px solid var(--gv-border)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.45) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: 'var(--gv-space-4)',
          }}
        >
          <Button variant="secondary" size="sm" leadingIcon={<ArrowLeft size={15} />} onClick={onBack}>
            Back
          </Button>
          {isSelf && (
            <Button variant="gold" size="sm" leadingIcon={<Pencil size={14} />} onClick={onEdit}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Identity block */}
      <div style={{ padding: '0 var(--gv-space-5) var(--gv-space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--gv-space-4)', marginTop: -44 }}>
          {/* Avatar */}
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 'var(--gv-radius-lg)',
              border: '3px solid var(--gv-bg)',
              background: avatarUrl
                ? `center / cover no-repeat url(${avatarUrl})`
                : 'var(--gv-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--gv-shadow-md)',
              overflow: 'hidden',
            }}
          >
            {!avatarUrl && (
              <span style={{ fontSize: 'var(--gv-text-2xl)', fontWeight: 700, color: 'var(--gv-text-muted)' }}>
                {initials}
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'var(--gv-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gv-space-2)', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'var(--gv-text-2xl)', fontWeight: 700, color: 'var(--gv-text)', lineHeight: 1.1 }}>
              {displayName}
            </h1>
            {verification.state === 'verified' ? (
              <Badge tone="success" icon={<BadgeCheck size={12} />}>{verification.label}</Badge>
            ) : (
              <Badge tone="warning" icon={<Clock size={12} />}>{verification.label}</Badge>
            )}
          </div>

          <span style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }} className="gv-mono">
            @{handle}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gv-space-2)', flexWrap: 'wrap', marginTop: 2 }}>
            <Badge tone="navy" variant="outline">{roleLabel}</Badge>
            {isOwner && (
              <Badge tone="gold" icon={<ShieldCheck size={12} />}>Founder &amp; Creator</Badge>
            )}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--gv-space-4)', marginTop: 'var(--gv-space-2)' }}>
            {country && (
              <MetaChip>
                <MapPin size={13} /> {country}
              </MetaChip>
            )}
            {languages.length > 0 && <MetaChip>{languages.join(' · ')}</MetaChip>}
            {genres.length > 0 && (
              <MetaChip>
                {genres.slice(0, 3).join(' · ')}
                {genres.length > 3 ? ` +${genres.length - 3}` : ''}
              </MetaChip>
            )}
          </div>

          {isOwner && isSelf && (
            <div style={{ marginTop: 'var(--gv-space-3)' }}>
              <Button variant="secondary" size="sm" leadingIcon={<ShieldCheck size={14} />} onClick={onFounderConsole}>
                Founder Console
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
