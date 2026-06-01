import type { ReactNode } from 'react'
import { ArrowLeft, BadgeCheck, Clock, Crown, MapPin, Pencil, ShieldCheck } from 'lucide-react'
import { Badge, Button, Wordmark } from '../governance'
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

        {/* Brand lockup — fills the otherwise-empty hero when no custom cover */}
        {!coverImageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 8,
              padding: '0 var(--gv-space-5)',
              pointerEvents: 'none',
            }}
          >
            <Wordmark size="lg" />
            <span
              style={{
                fontSize: 'var(--gv-text-xs)',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--gv-gold)',
              }}
            >
              Music Asset Operating System
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.62)',
              }}
            >
              Create • Protect • Verify • License • Monetize
            </span>
          </div>
        )}

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
            {!avatarUrl &&
              (isOwner ? (
                // Founder may use a profile photo OR the MUSVORA brand mark.
                <div style={{ transform: 'scale(1.45)' }}>
                  <Wordmark size="lg" showText={false} />
                </div>
              ) : (
                <span style={{ fontSize: 'var(--gv-text-2xl)', fontWeight: 700, color: 'var(--gv-text-muted)' }}>
                  {initials}
                </span>
              ))}
          </div>
        </div>

        <div style={{ marginTop: 'var(--gv-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gv-space-2)', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'var(--gv-text-2xl)', fontWeight: 700, color: 'var(--gv-text)', lineHeight: 1.1 }}>
              {displayName}
            </h1>
            {isOwner ? (
              <Badge tone="gold" icon={<ShieldCheck size={12} />}>Founder Account</Badge>
            ) : verification.state === 'verified' ? (
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
              <Badge tone="gold" icon={<Crown size={12} />}>Platform Owner</Badge>
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
            <div
              style={{
                marginTop: 'var(--gv-space-4)',
                padding: 'var(--gv-space-4)',
                borderRadius: 'var(--gv-radius-lg)',
                border: '1px solid var(--gv-gold-soft)',
                background:
                  'linear-gradient(135deg, var(--gv-gold-soft) 0%, var(--gv-navy-soft) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--gv-space-3)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 'var(--gv-text-sm)', fontWeight: 700, color: 'var(--gv-text)' }}>
                  Founder Console
                </span>
                <span style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-secondary)' }}>
                  Manage the MUSVORA platform, governance &amp; oversight.
                </span>
              </div>
              <Button variant="gold" leadingIcon={<ShieldCheck size={15} />} onClick={onFounderConsole}>
                Open Console
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
