import { ArrowLeft, LayoutDashboard, Activity, Users, ShieldCheck, ScrollText, Store, Sparkles, Scale, LineChart, Flag, ChevronRight, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GovernanceScope, Card, Badge, StatTile, SectionHeader } from '../../components/governance'

/**
 * MUSVORA Owner Dashboard — V1.
 *
 * Owner-only console (route /owner, gated by <ProtectedRoute requireOwner>).
 * Built on the MUSVORA Governance Design System. This is an INTERNAL scaffold:
 * it never shows fabricated analytics and never exposes private user data.
 * Every module is honestly labelled (Internal Preview / Pending Integration /
 * Coming Soon) until its real data source is wired in.
 */

type Status = 'preview' | 'pending' | 'soon' | 'available'

const STATUS_META: Record<Status, { label: string; tone: 'gold' | 'warning' | 'neutral' | 'success' }> = {
  preview: { label: 'Internal Preview', tone: 'gold' },
  pending: { label: 'Pending Integration', tone: 'warning' },
  soon: { label: 'Coming Soon', tone: 'neutral' },
  available: { label: 'Available', tone: 'success' },
}

interface Section {
  key: string
  icon: React.ElementType
  eyebrow: string
  title: string
  description: string
  status: Status
  action?: { label: string; path: string }
}

const SECTIONS: Section[] = [
  {
    key: 'overview',
    icon: LayoutDashboard,
    eyebrow: 'Module 01',
    title: 'Platform Overview',
    description: 'High-level state of the platform — catalogue volume, creator base and asset readiness. Metrics activate once live data sources are connected.',
    status: 'preview',
  },
  {
    key: 'health',
    icon: Activity,
    eyebrow: 'Module 02',
    title: 'System Health',
    description: 'Operational status of core infrastructure (authentication, database, storage, API). Real-time monitoring is being wired in — no figures are estimated here.',
    status: 'pending',
  },
  {
    key: 'users',
    icon: Users,
    eyebrow: 'Module 03',
    title: 'User Management Preview',
    description: 'Manage roles, creator verification and account actions. Private user data is never surfaced in this preview.',
    status: 'preview',
    action: { label: 'Open Admin Panel', path: '/admin' },
  },
  {
    key: 'security',
    icon: ShieldCheck,
    eyebrow: 'Module 04',
    title: 'Security Center Preview',
    description: 'Access controls, session policy and protection posture for the platform. Live threat signals are pending integration.',
    status: 'preview',
    action: { label: 'Open Security Center', path: '/security' },
  },
  {
    key: 'audit',
    icon: ScrollText,
    eyebrow: 'Module 05',
    title: 'Audit Logs Preview',
    description: 'Immutable record of privileged and system actions for accountability. Full audit history streaming is being connected.',
    status: 'preview',
    action: { label: 'Open Audit Log', path: '/audit-log' },
  },
  {
    key: 'marketplace',
    icon: Store,
    eyebrow: 'Module 06',
    title: 'Marketplace Control Preview',
    description: 'Oversight of licensing listings, gating rules and marketplace policy. Controls become active in a later phase.',
    status: 'soon',
  },
  {
    key: 'ai',
    icon: Sparkles,
    eyebrow: 'Module 07',
    title: 'AI Control Preview',
    description: 'Configuration for MUSVORA AI modules. AI may only audit, organize, verify, protect and monetize — it never generates songs or lyrics, and never acts as legal counsel.',
    status: 'soon',
  },
  {
    key: 'legal',
    icon: Scale,
    eyebrow: 'Module 08',
    title: 'Legal Center',
    description: 'Platform policies, disclaimers and compliance documents. These pages are live and reviewable today.',
    status: 'available',
    action: { label: 'Open Legal Center', path: '/legal' },
  },
  {
    key: 'revenue',
    icon: LineChart,
    eyebrow: 'Module 09',
    title: 'Revenue Analytics Preview',
    description: 'Earnings, payouts and licensing performance. No revenue figures are shown until verified financial data is integrated.',
    status: 'pending',
  },
  {
    key: 'flags',
    icon: Flag,
    eyebrow: 'Module 10',
    title: 'Feature Flags Preview',
    description: 'Roll features in or out gradually and gate experimental modules. Toggling becomes available in a later phase.',
    status: 'soon',
  },
]

const OVERVIEW_TILES = [
  { label: 'Total Assets', hint: 'pending' },
  { label: 'Verified Creators', hint: 'pending' },
  { label: 'Readiness Avg', hint: 'pending' },
  { label: 'Active Licenses', hint: 'pending' },
]

function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status]
  return <Badge tone={meta.tone} variant="soft">{meta.label}</Badge>
}

export default function OwnerDashboard() {
  const navigate = useNavigate()

  return (
    <GovernanceScope className="min-h-screen" style={{ fontFamily: 'var(--gv-font-sans)' }}>
      <div className="mx-auto w-full max-w-2xl px-5 pt-10 pb-16">
        <button
          onClick={() => navigate('/home')}
          className="gv-focusable inline-flex items-center gap-2 mb-8 transition-colors"
          style={{ color: 'var(--gv-text-muted)' }}
        >
          <ArrowLeft size={16} aria-hidden />
          <span style={{ fontSize: 'var(--gv-text-sm)' }}>Back to app</span>
        </button>

        {/* Owner identity */}
        <Card elevation="raised" padding="lg" accent="gold" className="mb-8">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--gv-radius-lg)',
                background: 'var(--gv-gold-soft)',
                border: '1px solid color-mix(in srgb, var(--gv-gold) 30%, transparent)',
              }}
            >
              <Crown size={20} style={{ color: 'var(--gv-gold)' }} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="gv-eyebrow" style={{ marginBottom: 4 }}>MUSVORA · Owner Console</p>
              <h1
                className="font-bold leading-tight"
                style={{
                  fontFamily: 'var(--gv-font-display)',
                  fontSize: 'var(--gv-text-2xl)',
                  letterSpacing: 'var(--gv-tracking-tight)',
                  color: 'var(--gv-text)',
                }}
              >
                Pascasio Emmanuel Reynoso Reyes
              </h1>
              <p className="mt-1" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>
                Founder &amp; Creator
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge tone="navy" variant="outline">OWNER</Badge>
                <Badge tone="gold" variant="soft">V1</Badge>
              </div>
            </div>
          </div>
        </Card>

        <SectionHeader
          eyebrow="Internal Scaffold"
          title="Owner Dashboard"
          description="Owner-only control surface. Modules below are scaffolded and clearly labelled — no live analytics are fabricated and no private user data is exposed."
        />

        {/* Platform Overview tiles — structure only, awaiting live data */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {OVERVIEW_TILES.map(t => (
            <StatTile key={t.label} label={t.label} value="—" hint={t.hint} tone="neutral" />
          ))}
        </div>

        {/* Module cards */}
        <div className="flex flex-col gap-3">
          {SECTIONS.map(section => {
            const Icon = section.icon
            return (
              <Card key={section.key} elevation="raised" padding="md">
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 'var(--gv-radius-md)',
                      background: 'var(--gv-surface-2)',
                      border: '1px solid var(--gv-border)',
                    }}
                  >
                    <Icon size={17} style={{ color: 'var(--gv-text-secondary)' }} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="gv-eyebrow" style={{ marginBottom: 4 }}>{section.eyebrow}</p>
                        <h3
                          className="font-bold leading-tight"
                          style={{
                            fontFamily: 'var(--gv-font-display)',
                            fontSize: 'var(--gv-text-lg)',
                            color: 'var(--gv-text)',
                          }}
                        >
                          {section.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={section.status} />
                      </div>
                    </div>
                    <p
                      className="mt-2"
                      style={{
                        fontSize: 'var(--gv-text-sm)',
                        color: 'var(--gv-text-secondary)',
                        lineHeight: 'var(--gv-leading-normal)',
                      }}
                    >
                      {section.description}
                    </p>
                    {section.action && (
                      <button
                        onClick={() => navigate(section.action!.path)}
                        className="gv-focusable inline-flex items-center gap-1 mt-3 font-semibold transition-colors"
                        style={{ color: 'var(--gv-text-link)', fontSize: 'var(--gv-text-sm)' }}
                      >
                        {section.action.label}
                        <ChevronRight size={14} aria-hidden />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <p
          className="text-center mt-10"
          style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}
        >
          MUSVORA Owner Console · V1 · Internal use only
        </p>
      </div>
    </GovernanceScope>
  )
}
