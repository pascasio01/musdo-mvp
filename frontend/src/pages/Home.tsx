import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ScanLine,
  TrendingUp,
  Layers,
} from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { GovernanceScope, Card, Badge, Button, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import { useAuth } from '../lib/auth'
import {
  STATUS_META,
  scoreStatus,
} from '../data/readiness'
import {
  ASSET_INTELLIGENCE,
  ASSETS_AT_RISK,
  REVENUE_OPPORTUNITIES,
  NEXT_BEST_ACTION,
  type RevenueOpportunity,
} from '../data/dashboard'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  if (h < 22) return 'Good evening'
  return 'Late-night session'
}

const POTENTIAL_TONE: Record<RevenueOpportunity['potential'], 'gold' | 'navy' | 'neutral'> = {
  high: 'gold',
  medium: 'navy',
  low: 'neutral',
}

const POTENTIAL_LABEL: Record<RevenueOpportunity['potential'], string> = {
  high: 'High potential',
  medium: 'Medium',
  low: 'Low',
}

/** A compact Bloomberg-style metric cell with its own emphasis tone. */
function MetricCell({
  label,
  value,
  hint,
  icon,
  tone = 'neutral',
}: {
  label: string
  value: string
  hint?: string
  icon: React.ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'gold'
}) {
  const color = {
    neutral: 'var(--gv-text)',
    success: 'var(--gv-success)',
    warning: 'var(--gv-warning)',
    danger: 'var(--gv-danger)',
    gold: 'var(--gv-gold)',
  }[tone]

  return (
    <div
      style={{
        background: 'var(--gv-surface)',
        border: '1px solid var(--gv-border)',
        borderRadius: 'var(--gv-radius-lg)',
        padding: 'var(--gv-space-4)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2.5" style={{ color: 'var(--gv-text-muted)' }}>
        {icon}
        <span className="gv-eyebrow">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="gv-mono font-bold leading-none" style={{ fontSize: 'var(--gv-text-2xl)', color }}>
          {value}
        </span>
        {hint && (
          <span style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{hint}</span>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const displayName = profile?.username ?? 'Emmanuel'

  const ai = ASSET_INTELLIGENCE
  const readinessStatus = scoreStatus(ai.readinessScore)
  const readinessMeta = STATUS_META[readinessStatus]

  return (
    <AppShell>
      <GovernanceScope className="min-h-screen">
        {/* ── Sticky header ── */}
        <header
          className="sticky top-0 z-30 safe-top"
          style={{
            background: 'color-mix(in srgb, var(--gv-bg) 88%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--gv-border-faint)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5" style={{ height: 64 }}>
            <div className="min-w-0">
              <p className="gv-eyebrow">MUSVORA · Asset Intelligence</p>
              <h1
                className="font-bold leading-none truncate"
                style={{
                  fontFamily: 'var(--gv-font-display)',
                  fontSize: 'var(--gv-text-lg)',
                  color: 'var(--gv-text)',
                }}
              >
                {greeting()}, {displayName}
              </h1>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="gv-focusable grid place-items-center flex-shrink-0 active:scale-95 transition-transform"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--gv-radius-md)',
                background: 'var(--gv-surface-2)',
                border: '1px solid var(--gv-border)',
                color: 'var(--gv-text-secondary)',
                position: 'relative',
              }}
            >
              <Bell size={18} strokeWidth={1.8} aria-hidden />
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 9,
                  right: 9,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--gv-gold)',
                }}
              />
            </button>
          </div>
        </header>

        <div className="px-5 pt-6">
          {/* ── Hero: Overall Readiness Score ── */}
          <Card padding="lg" accent={readinessMeta.tone === 'danger' ? 'danger' : readinessMeta.tone === 'warning' ? 'warning' : 'success'}>
            <div className="flex items-center gap-5">
              <ReadinessRing
                value={ai.readinessScore}
                color={readinessMeta.color}
                size={104}
                ariaLabel={`Overall readiness score ${ai.readinessScore} out of 100 — ${readinessMeta.label}`}
              >
                <span
                  className="gv-mono font-extrabold leading-none"
                  style={{ fontSize: 'var(--gv-text-2xl)', color: 'var(--gv-text)' }}
                >
                  {ai.readinessScore}
                </span>
                <span className="gv-eyebrow mt-0.5">/ 100</span>
              </ReadinessRing>
              <div className="min-w-0 flex-1">
                <p className="gv-eyebrow mb-1.5">Overall Readiness Score</p>
                <div className="mb-2">
                  <Badge tone={readinessMeta.tone} variant="outline">
                    {readinessMeta.label}
                  </Badge>
                </div>
                <p
                  style={{
                    fontSize: 'var(--gv-text-sm)',
                    color: 'var(--gv-text-secondary)',
                    lineHeight: 'var(--gv-leading-normal)',
                  }}
                >
                  Across {ai.catalogAssets} assets. Copyright gaps are the main drag on monetization.
                </p>
              </div>
            </div>
          </Card>

          {/* ── Metric grid ── */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <MetricCell
              label="Ownership Confidence"
              value={`${ai.ownershipConfidence}%`}
              hint="verified"
              tone="neutral"
              icon={<ShieldCheck size={13} strokeWidth={2} />}
            />
            <MetricCell
              label="Works At Risk"
              value={String(ai.worksAtRisk)}
              hint="need action"
              tone="danger"
              icon={<AlertTriangle size={13} strokeWidth={2} />}
            />
            <MetricCell
              label="Revenue Opportunities"
              value={String(ai.revenueOpportunities)}
              hint="potential"
              tone="gold"
              icon={<TrendingUp size={13} strokeWidth={2} />}
            />
            <MetricCell
              label="Catalogue Assets"
              value={String(ai.catalogAssets)}
              hint="in vault"
              tone="neutral"
              icon={<Layers size={13} strokeWidth={2} />}
            />
          </div>

          {/* ── Next Best Action ── */}
          <Card padding="md" accent="navy" className="mt-3">
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--gv-text-link)' }}>
              <Sparkles size={14} strokeWidth={2.2} />
              <span className="gv-eyebrow" style={{ color: 'var(--gv-text-link)' }}>Next Best Action</span>
            </div>
            <h3
              className="font-semibold"
              style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}
            >
              {NEXT_BEST_ACTION.title}
            </h3>
            <p
              className="mt-1.5"
              style={{
                fontSize: 'var(--gv-text-sm)',
                color: 'var(--gv-text-secondary)',
                lineHeight: 'var(--gv-leading-normal)',
              }}
            >
              {NEXT_BEST_ACTION.description}
            </p>
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <Button
                variant="primary"
                size="md"
                block
                onClick={() => navigate(NEXT_BEST_ACTION.primary.to)}
                trailingIcon={<ArrowRight size={15} strokeWidth={2.4} />}
              >
                {NEXT_BEST_ACTION.primary.label}
              </Button>
              <Button
                variant="secondary"
                size="md"
                block
                onClick={() => navigate(NEXT_BEST_ACTION.secondary.to)}
                leadingIcon={<ScanLine size={15} strokeWidth={2.4} />}
              >
                {NEXT_BEST_ACTION.secondary.label}
              </Button>
            </div>
          </Card>

          {/* ── Works At Risk ── */}
          <div className="mt-8">
            <SectionHeader
              eyebrow="Protect"
              title="Works At Risk"
              actions={
                <button
                  type="button"
                  onClick={() => navigate('/readiness')}
                  className="gv-focusable inline-flex items-center gap-1 font-semibold active:scale-95 transition-transform"
                  style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-link)' }}
                >
                  View all <ArrowUpRight size={13} strokeWidth={2.4} />
                </button>
              }
            />
            <Card padding="none" className="overflow-hidden">
              {ASSETS_AT_RISK.map((asset, i) => {
                const meta = STATUS_META[asset.status]
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => navigate('/readiness')}
                    className="w-full flex items-center gap-3 text-left active:opacity-70 transition-opacity"
                    style={{
                      padding: 'var(--gv-space-4)',
                      borderTop: i === 0 ? 'none' : '1px solid var(--gv-border-faint)',
                    }}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-semibold truncate"
                        style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}
                      >
                        {asset.title}
                      </p>
                      <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                        {asset.type}
                      </p>
                    </div>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span
                      className="gv-mono font-bold"
                      style={{ fontSize: 'var(--gv-text-sm)', color: meta.color }}
                    >
                      {asset.score}
                    </span>
                  </button>
                )
              })}
            </Card>
          </div>

          {/* ── Potential Revenue Opportunities ── */}
          <div className="mt-8">
            <SectionHeader
              eyebrow="Recover"
              title="Potential Revenue Opportunities"
              description="Surfaced from your catalogue. Illustrative — not a financial guarantee."
            />
            <div className="grid gap-2.5">
              {REVENUE_OPPORTUNITIES.map(op => (
                <Card key={op.id} padding="none">
                  <button
                    type="button"
                    onClick={() => navigate('/readiness')}
                    aria-label={`${op.title} — ${POTENTIAL_LABEL[op.potential]}`}
                    className="w-full text-left flex items-start justify-between gap-3 active:opacity-70 transition-opacity"
                    style={{ padding: 'var(--gv-space-5)' }}
                  >
                    <div className="min-w-0">
                      <h3
                        className="font-semibold truncate"
                        style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}
                      >
                        {op.title}
                      </h3>
                      <p
                        className="mt-1"
                        style={{
                          fontSize: 'var(--gv-text-xs)',
                          color: 'var(--gv-text-secondary)',
                          lineHeight: 'var(--gv-leading-normal)',
                        }}
                      >
                        {op.note}
                      </p>
                      <p className="gv-eyebrow mt-2">{op.channel}</p>
                    </div>
                    <Badge tone={POTENTIAL_TONE[op.potential]} variant="soft">
                      {POTENTIAL_LABEL[op.potential]}
                    </Badge>
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* ── Mock disclaimer ── */}
          <p
            className="text-center mt-8"
            style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-faint)', lineHeight: 'var(--gv-leading-normal)' }}
          >
            Illustrative intelligence using internal mock data. Figures are not financial advice or guaranteed earnings.
          </p>
        </div>
      </GovernanceScope>
    </AppShell>
  )
}
