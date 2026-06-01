import { Card, StatTile, SectionHeader, Button, Badge } from '../governance'
import { ExternalLink, FolderOpen, Globe, Plus } from 'lucide-react'
import type { ProfileTabKey, ProfessionalProfileData, ProfessionalRole } from '../../types/profile'
import { getRoleStats, getSocialLinks, professionalRoleLabels } from '../../lib/professionalProfile'

const TABS: { key: ProfileTabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'catalog', label: 'Catalog' },
  { key: 'licensing', label: 'Licensing' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'about', label: 'About' },
]

export function ProfileTabNav({
  active,
  onChange,
}: {
  active: ProfileTabKey
  onChange: (key: ProfileTabKey) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      style={{
        display: 'flex',
        gap: 'var(--gv-space-1)',
        overflowX: 'auto',
        padding: '0 var(--gv-space-5)',
        borderBottom: '1px solid var(--gv-border)',
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background: 'var(--gv-bg)',
      }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className="gv-focusable"
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 10px',
              fontSize: 'var(--gv-text-sm)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--gv-text)' : 'var(--gv-text-muted)',
              borderBottom: `2px solid ${isActive ? 'var(--gv-gold)' : 'transparent'}`,
              whiteSpace: 'nowrap',
              transition: 'color .15s ease',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <Card elevation="flat" padding="lg">
      <div style={{ textAlign: 'center', padding: 'var(--gv-space-4) 0' }}>
        <div
          style={{
            width: 44,
            height: 44,
            margin: '0 auto var(--gv-space-3)',
            borderRadius: 'var(--gv-radius-md)',
            background: 'var(--gv-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gv-text-muted)',
          }}
        >
          <FolderOpen size={20} />
        </div>
        <p style={{ fontWeight: 600, color: 'var(--gv-text)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)', maxWidth: 320, margin: '0 auto' }}>
          {body}
        </p>
        {action && <div style={{ marginTop: 'var(--gv-space-4)' }}>{action}</div>}
      </div>
    </Card>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span className="gv-eyebrow">{label}</span>
      <span style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{value}</span>
    </div>
  )
}

interface PanelProps {
  data: ProfessionalProfileData
  role: ProfessionalRole
  isSelf: boolean
  memberSince: string | null
  onUpload: () => void
  onEdit: () => void
}

export function ProfilePanel({ active, ...props }: PanelProps & { active: ProfileTabKey }) {
  const { data, role, isSelf, memberSince, onUpload, onEdit } = props

  if (active === 'overview') {
    const stats = getRoleStats(role, data)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-5)' }}>
        <div>
          <SectionHeader
            eyebrow={professionalRoleLabels[role]}
            title="Professional Overview"
            description="Key indicators for this catalogue. Metrics marked “Pending” populate as assets and verification advance."
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--gv-space-3)',
              marginTop: 'var(--gv-space-4)',
            }}
          >
            {stats.map(stat => (
              <StatTile key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} />
            ))}
          </div>
        </div>
        {data.bio && (
          <Card padding="lg">
            <span className="gv-eyebrow">Biography</span>
            <p style={{ marginTop: 8, fontSize: 'var(--gv-text-sm)', lineHeight: 1.6, color: 'var(--gv-text-secondary)' }}>
              {data.bio}
            </p>
          </Card>
        )}
      </div>
    )
  }

  if (active === 'catalog') {
    return (
      <EmptyState
        title="No public works yet"
        body="Published works, demos and lyrics appear here once added to the Vault and marked public."
        action={isSelf ? <Button variant="gold" size="sm" leadingIcon={<Plus size={14} />} onClick={onUpload}>Add Work</Button> : undefined}
      />
    )
  }

  if (active === 'licensing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-4)' }}>
        <SectionHeader eyebrow="Monetization" title="Licensing" description="Availability and opportunities for this catalogue." />
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--gv-space-3)' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--gv-text)' }}>Licensing Availability</p>
              <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)', marginTop: 2 }}>
                Becomes active once works reach licensing readiness.
              </p>
            </div>
            <Badge tone="warning">Pending</Badge>
          </div>
        </Card>
      </div>
    )
  }

  if (active === 'ownership') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-4)' }}>
        <SectionHeader eyebrow="Confidence" title="Ownership" description="Verified contributors, splits and rights confidence." />
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--gv-space-3)' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--gv-text)' }}>Ownership Confidence</p>
              <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)', marginTop: 2 }}>
                Requires confirmation — not a legal determination.
              </p>
            </div>
            <Badge tone="warning">Pending</Badge>
          </div>
        </Card>
      </div>
    )
  }

  // about
  const socials = getSocialLinks(data)
  const facts: { label: string; value: string }[] = []
  if (data.country) facts.push({ label: 'Country', value: data.country })
  if (data.city) facts.push({ label: 'City', value: data.city })
  if (data.languages.length) facts.push({ label: 'Languages', value: data.languages.join(', ') })
  if (data.genres.length) facts.push({ label: 'Genres', value: data.genres.join(', ') })
  if (memberSince) facts.push({ label: 'Member Since', value: memberSince })

  const hasContent = Boolean(data.bio) || facts.length > 0 || socials.length > 0

  if (!hasContent) {
    return (
      <EmptyState
        title="Profile in progress"
        body="Biography, location, languages, genres and links appear here once added."
        action={isSelf ? <Button variant="gold" size="sm" onClick={onEdit}>Complete Profile</Button> : undefined}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-4)' }}>
      {data.bio && (
        <Card padding="lg">
          <span className="gv-eyebrow">Biography</span>
          <p style={{ marginTop: 8, fontSize: 'var(--gv-text-sm)', lineHeight: 1.6, color: 'var(--gv-text-secondary)' }}>
            {data.bio}
          </p>
        </Card>
      )}
      {facts.length > 0 && (
        <Card padding="lg">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--gv-space-4)' }}>
            {facts.map(f => (
              <Fact key={f.label} label={f.label} value={f.value} />
            ))}
          </div>
        </Card>
      )}
      {socials.length > 0 && (
        <Card padding="lg">
          <span className="gv-eyebrow">Links</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gv-space-2)', marginTop: 'var(--gv-space-3)' }}>
            {socials.map(s => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="gv-focusable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--gv-radius-md)',
                  border: '1px solid var(--gv-border)',
                  background: 'var(--gv-surface-2)',
                  color: 'var(--gv-text)',
                  textDecoration: 'none',
                  fontSize: 'var(--gv-text-sm)',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Globe size={14} style={{ color: 'var(--gv-text-muted)' }} />
                  {s.label}
                </span>
                <ExternalLink size={14} style={{ color: 'var(--gv-text-muted)' }} />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
