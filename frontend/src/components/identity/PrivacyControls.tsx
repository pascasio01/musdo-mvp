import { memo } from 'react'
import { Shield, EyeOff, Activity, History, Mail, Hash, Users } from 'lucide-react'
import { useIdentity } from '../../lib/identity'
import type { PrivacySettings } from '../../types/identity'

interface ToggleRowProps {
  icon: typeof Shield
  label: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors hover:bg-[var(--glass-bg)]"
    >
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}
        aria-hidden
      >
        <Icon size={14} className="text-secondary" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-primary text-sm font-semibold leading-tight">{label}</p>
        <p className="text-muted text-[11.5px] leading-snug mt-0.5">{description}</p>
      </div>
      {/* iOS-style switch */}
      <div
        className="relative w-10 h-6 rounded-full flex-shrink-0 transition-colors mt-0.5"
        style={{
          background: checked ? 'var(--accent)' : 'var(--glass-bg-medium)',
          border: '1px solid var(--border-soft)',
        }}
        aria-hidden
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
          style={{ left: checked ? 'calc(100% - 18px)' : '2px' }}
        />
      </div>
    </button>
  )
}

const rows: Array<{
  key: keyof PrivacySettings
  icon: typeof Shield
  label: string
  description: string
}> = [
  {
    key: 'privateSession',
    icon: EyeOff,
    label: 'Private session',
    description: 'Nothing this session is broadcast to followers or recorded for the public feed.',
  },
  {
    key: 'hideListeningActivity',
    icon: Activity,
    label: 'Hide listening activity',
    description: 'Followers won\u2019t see what you\u2019re currently playing.',
  },
  {
    key: 'hideRecentlyPlayed',
    icon: History,
    label: 'Hide recently played',
    description: 'The recently played module disappears from your public profile.',
  },
  {
    key: 'hiddenIdentity',
    icon: Hash,
    label: 'Hidden identity mode',
    description: 'Your alias is removed from search and discovery surfaces.',
  },
  {
    key: 'hideSocialCounts',
    icon: Users,
    label: 'Hide follower counts',
    description: 'Resonance counts won\u2019t appear on your public profile.',
  },
  {
    key: 'allowLicensingDms',
    icon: Mail,
    label: 'Allow licensing requests',
    description: 'Other creators can send licensing inquiries directly.',
  },
]

function PrivacyControlsImpl() {
  const { privacy, updatePrivacy } = useIdentity()

  return (
    <div
      className="rounded-2xl p-2 border"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--border-soft)',
      }}
    >
      <div className="px-3 py-2 flex items-center gap-2">
        <Shield size={14} className="text-secondary" strokeWidth={2} aria-hidden />
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
          Privacy & Identity
        </p>
      </div>
      <div className="space-y-0.5">
        {rows.map(row => (
          <ToggleRow
            key={row.key}
            icon={row.icon}
            label={row.label}
            description={row.description}
            checked={privacy[row.key]}
            onChange={next => updatePrivacy({ [row.key]: next } as Partial<PrivacySettings>)}
          />
        ))}
      </div>
    </div>
  )
}

export const PrivacyControls = memo(PrivacyControlsImpl)
export default PrivacyControls
