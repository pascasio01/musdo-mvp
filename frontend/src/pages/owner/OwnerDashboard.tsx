import { useEffect, useState } from 'react'
import {
  ArrowLeft, LayoutDashboard, BrainCircuit, ShieldCheck, FileBadge2,
  LineChart, Store, Sparkles, Lock, Activity, ChevronRight, Crown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GovernanceScope, Card, Badge, StatTile, SectionHeader } from '../../components/governance'
import { useAuth } from '../../lib/auth'
import { loadFounderSnapshot, type FounderSnapshot } from '../../services/founder'
import { scoreStatus } from '../../data/readiness'

/**
 * MUSVORA Founder Console.
 *
 * Owner-only command surface (route /owner, gated by <ProtectedRoute requireOwner>).
 * Built on the MUSVORA Governance Design System (Institutional Dark).
 *
 * Production rules (see replit.md):
 *  - Real metrics are computed from the owner's Vault / Ownership signals.
 *  - Where a live source is not connected, the UI shows an honest
 *    "Pending Integration" / "Internal Preview" state — never a fabricated number.
 *  - No private user data is exposed; no legal certainty is asserted.
 */

type ModuleStatus = 'live' | 'preview' | 'pending'

const STATUS_META: Record<ModuleStatus, { label: string; tone: 'success' | 'gold' | 'warning' }> = {
  live: { label: 'Live', tone: 'success' },
  preview: { label: 'Internal Preview', tone: 'gold' },
  pending: { label: 'Pending Integration', tone: 'warning' },
}

interface ModuleAction { label: string; path: string }

interface ConsoleModule {
  key: string
  icon: React.ElementType
  eyebrow: string
  title: string
  description: string
  status: ModuleStatus
  /** Short honest detail line — what is live vs pending. */
  note?: string
  actions?: ModuleAction[]
}

function StatusBadge({ status }: { status: ModuleStatus }) {
  const meta = STATUS_META[status]
  return <Badge tone={meta.tone} variant="soft">{meta.label}</Badge>
}

function buildModules(snap: FounderSnapshot | null): ConsoleModule[] {
  const confidence = snap ? `${snap.ownershipConfidence}%` : '—'
  const assets = snap ? String(snap.assetCount) : '—'
  const isLive = snap?.source === 'vault'
  const scope = isLive ? 'your Vault' : 'the sample catalogue'
  return [
    {
      key: 'executive',
      icon: LayoutDashboard,
      eyebrow: 'Module 01',
      title: 'Executive Dashboard',
      description: 'High-level state of the catalogue — assets under management, ownership confidence and works requiring action.',
      status: snap ? (isLive ? 'live' : 'preview') : 'preview',
      note: snap
        ? `${assets} assets · ${confidence} ownership confidence from ${scope}${isLive ? '' : ' (connect your Vault for live figures)'}. Platform-wide users & revenue are Pending Integration.`
        : 'Loading your catalogue snapshot…',
      actions: [{ label: 'Open Composer Analytics', path: '/dashboard' }],
    },
    {
      key: 'intelligence',
      icon: BrainCircuit,
      eyebrow: 'Module 02',
      title: 'Asset Intelligence',
      description: 'Catalogue health signals — readiness bands, ownership confidence and works at risk surfaced for triage.',
      status: 'live',
      note: 'Ownership Confidence is live from your Vault. Readiness scoring is an Internal Preview until the readiness engine is connected.',
      actions: [
        { label: 'Open Ownership Confidence', path: '/ownership' },
        { label: 'Open Readiness Center', path: '/readiness' },
      ],
    },
    {
      key: 'ownership',
      icon: ShieldCheck,
      eyebrow: 'Module 03',
      title: 'Ownership Engine',
      description: 'Contributors, documented splits, verification and signatures per asset. MUSVORA tracks ownership signals — it never certifies ownership.',
      status: 'live',
      note: snap
        ? `${snap.statusCounts.complete} complete · ${snap.statusCounts.pending_signature} pending signature · ${snap.statusCounts.pending_verification} pending verification · ${snap.statusCounts.missing_contributor} missing contributor.`
        : 'Computing ownership signals…',
      actions: [{ label: 'Open Ownership Engine', path: '/ownership' }],
    },
    {
      key: 'passport',
      icon: FileBadge2,
      eyebrow: 'Module 04',
      title: 'Song Passport Engine',
      description: 'Portable ownership record per work — creation history, ownership timeline, version history and licensing availability.',
      status: 'preview',
      note: 'Per-asset Passports open from the Vault. Registration states remain Pending Verification until proofs are filed.',
      actions: [{ label: 'Open Vault', path: '/vault' }],
    },
    {
      key: 'revenue',
      icon: LineChart,
      eyebrow: 'Module 05',
      title: 'Revenue Engine',
      description: 'Earnings, payouts and licensing performance across sync, film, TV, YouTube, commercial and playlist opportunities.',
      status: 'pending',
      note: 'No verified financial data source is connected. No revenue figures are shown until integrated.',
    },
    {
      key: 'marketplace',
      icon: Store,
      eyebrow: 'Module 06',
      title: 'Marketplace Governance',
      description: 'Oversight of licensing listings and the eligibility gates that protect the marketplace.',
      status: 'preview',
      note: 'Eligibility: Readiness ≥ 80 · Ownership Confidence ≥ 80 · Song Passport Active. Governance controls activate in a later phase.',
      actions: [{ label: 'Open Marketplace', path: '/market' }],
    },
    {
      key: 'ai',
      icon: Sparkles,
      eyebrow: 'Module 07',
      title: 'AI Command Center',
      description: 'MUSVORA AI may only audit, organize, verify, protect and monetize — Catalog Auditor, Metadata Assistant, Contract Checker, Licensing Match. It never generates songs or lyrics and never acts as legal counsel.',
      status: 'preview',
      note: 'AI Catalog Auditor is live. Metadata Assistant, Contract Checker and Licensing Match are Internal Preview.',
      actions: [{ label: 'Open AI Catalog Auditor', path: '/auditor' }],
    },
    {
      key: 'security',
      icon: Lock,
      eyebrow: 'Module 08',
      title: 'Security Center',
      description: 'Access controls, session policy, audit trail and protection posture for the platform.',
      status: 'preview',
      note: 'Security Center and Audit Log are reviewable today. Live threat signals are Pending Integration.',
      actions: [
        { label: 'Open Security Center', path: '/security' },
        { label: 'Open Audit Log', path: '/audit-log' },
      ],
    },
    {
      key: 'system',
      icon: Activity,
      eyebrow: 'Module 09',
      title: 'System Health',
      description: 'Operational status of core infrastructure — authentication, database, storage, APIs and performance.',
      status: 'pending',
      note: 'Real-time monitoring is not connected. No uptime figures are estimated here.',
    },
  ]
}

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [snap, setSnap] = useState<FounderSnapshot | null>(null)
  const [snapError, setSnapError] = useState(false)

  useEffect(() => {
    let active = true
    const ownerName = profile?.username || user?.email?.split('@')[0] || 'You'
    setSnapError(false)
    loadFounderSnapshot(user?.id, ownerName)
      .then(s => { if (active) setSnap(s) })
      .catch(() => { if (active) setSnapError(true) })
    return () => { active = false }
  }, [user?.id, profile?.username, user?.email])

  const modules = buildModules(snap)
  const confidenceTone = snap ? scoreStatus(snap.ownershipConfidence) : 'attention'
  const confTileTone = confidenceTone === 'ready' ? 'success' : confidenceTone === 'risk' ? 'danger' : 'warning'

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
              <p className="gv-eyebrow" style={{ marginBottom: 4 }}>MUSVORA · Music Asset Operating System</p>
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
                Founder · Music Asset Operating System
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge tone="navy" variant="outline">OWNER</Badge>
                <Badge tone="gold" variant="soft">Founder Console</Badge>
              </div>
            </div>
          </div>
        </Card>

        <SectionHeader
          eyebrow="Founder Console"
          title="Command Surface"
          description="Governing how the catalogue is created, protected, verified, licensed and monetized. Live metrics are computed from your Vault; everything without a connected source is labelled honestly — no analytics are fabricated and no private user data is exposed."
        />

        {/* Executive snapshot — real where data exists */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <StatTile
            label="Catalogue Assets"
            value={snap ? snap.assetCount : '—'}
            hint={snap ? (snap.source === 'vault' ? 'in vault' : 'sample') : 'loading'}
            tone="neutral"
          />
          <StatTile
            label="Ownership Confidence"
            value={snap ? `${snap.ownershipConfidence}%` : '—'}
            hint={snap ? 'computed' : 'loading'}
            tone={snap ? confTileTone : 'neutral'}
          />
          <StatTile
            label="Works Needing Action"
            value={snap ? snap.worksNeedingAction : '—'}
            hint={snap ? 'open items' : 'loading'}
            tone={snap && snap.worksNeedingAction > 0 ? 'warning' : 'neutral'}
          />
          <StatTile
            label="Platform Revenue"
            value="—"
            hint="pending"
            tone="neutral"
          />
        </div>

        {/* Honest source line */}
        <div className="flex items-center gap-2 mb-7">
          {snapError ? (
            <Badge tone="warning" variant="soft">Snapshot unavailable · Pending Verification</Badge>
          ) : snap ? (
            <Badge tone={snap.source === 'vault' ? 'success' : 'gold'} variant="soft">
              {snap.source === 'vault' ? 'Live from your Vault' : 'Sample data — connect your Vault'}
            </Badge>
          ) : (
            <Badge tone="neutral" variant="soft">Loading snapshot…</Badge>
          )}
          <Badge tone="warning" variant="soft">Users & Revenue · Pending Integration</Badge>
        </div>

        {/* Module cards */}
        <div className="flex flex-col gap-3">
          {modules.map(mod => {
            const Icon = mod.icon
            return (
              <Card key={mod.key} elevation="raised" padding="md">
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
                        <p className="gv-eyebrow" style={{ marginBottom: 4 }}>{mod.eyebrow}</p>
                        <h3
                          className="font-bold leading-tight"
                          style={{
                            fontFamily: 'var(--gv-font-display)',
                            fontSize: 'var(--gv-text-lg)',
                            color: 'var(--gv-text)',
                          }}
                        >
                          {mod.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={mod.status} />
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
                      {mod.description}
                    </p>
                    {mod.note && (
                      <p
                        className="mt-2 gv-mono"
                        style={{
                          fontSize: 'var(--gv-text-2xs)',
                          color: 'var(--gv-text-muted)',
                          lineHeight: 'var(--gv-leading-normal)',
                        }}
                      >
                        {mod.note}
                      </p>
                    )}
                    {mod.actions && mod.actions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        {mod.actions.map(action => (
                          <button
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            className="gv-focusable inline-flex items-center gap-1 font-semibold transition-colors"
                            style={{ color: 'var(--gv-text-link)', fontSize: 'var(--gv-text-sm)' }}
                          >
                            {action.label}
                            <ChevronRight size={14} aria-hidden />
                          </button>
                        ))}
                      </div>
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
          MUSVORA · Music Asset Operating System · Founder Console · Internal use only
        </p>
      </div>
    </GovernanceScope>
  )
}
