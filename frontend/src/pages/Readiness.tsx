import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Radio,
  Scale,
  PlayCircle,
  Copyright,
  DollarSign,
  Check,
  X,
  Sparkles,
  ScanLine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GovernanceScope, Button, Card, Badge, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import {
  OVERALL_READINESS,
  STATUS_SUMMARY,
  STATUS_META,
  READINESS_DIMENSIONS,
  READINESS_ASSETS,
  scoreStatus,
  type ReadinessStatus,
  type ReadinessDimension,
} from '../data/readiness'

const DIMENSION_ICONS: Record<ReadinessDimension['icon'], LucideIcon> = {
  distribution: Radio,
  licensing: Scale,
  copyright: Copyright,
  monetization: DollarSign,
}

const STATUS_ORDER: ReadinessStatus[] = ['ready', 'attention', 'risk']

function ReadinessBar({ value, color, label }: { value: number; color: string; label?: string }) {
  return (
    <div
      className="w-full overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ height: 6, borderRadius: 'var(--gv-radius-pill)', background: 'var(--gv-inset)' }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          borderRadius: 'var(--gv-radius-pill)',
          background: color,
          transition: 'width 800ms var(--gv-ease)',
        }}
      />
    </div>
  )
}

function DimensionCard({ dim }: { dim: ReadinessDimension }) {
  const meta = STATUS_META[dim.status]
  const Icon = DIMENSION_ICONS[dim.icon]
  const completed = dim.checks.filter(c => c.done).length

  return (
    <Card padding="md" accent={meta.tone === 'success' ? 'success' : meta.tone === 'warning' ? 'warning' : 'danger'}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="grid place-items-center flex-shrink-0"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--gv-radius-md)',
              background: meta.soft,
              color: meta.color,
            }}
          >
            <Icon size={19} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3
              className="font-semibold truncate"
              style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}
            >
              {dim.label}
            </h3>
            <Badge tone={meta.tone} className="mt-1">
              {meta.label}
            </Badge>
          </div>
        </div>
        <span
          className="gv-mono font-bold leading-none"
          style={{ fontSize: 'var(--gv-text-lg)', color: meta.color }}
        >
          {dim.score}
          <span style={{ fontSize: 'var(--gv-text-xs)', color: 'var(--gv-text-muted)' }}>/100</span>
        </span>
      </div>

      <ReadinessBar value={dim.score} color={meta.color} label={`${dim.label} score`} />

      <p
        className="mt-3"
        style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}
      >
        {dim.summary}
      </p>

      <div className="mt-3 grid gap-1.5">
        {dim.checks.map(c => (
          <div key={c.label} className="flex items-center gap-2">
            <span
              className="grid place-items-center flex-shrink-0"
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: c.done ? 'var(--gv-success-soft)' : 'var(--gv-inset)',
                color: c.done ? 'var(--gv-success)' : 'var(--gv-text-faint)',
              }}
            >
              {c.done ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
            </span>
            <span
              style={{
                fontSize: 'var(--gv-text-sm)',
                color: c.done ? 'var(--gv-text-secondary)' : 'var(--gv-text-muted)',
                textDecoration: c.done ? 'none' : 'none',
              }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <p className="gv-eyebrow mt-3">
        {completed} of {dim.checks.length} complete
      </p>
    </Card>
  )
}

export default function Readiness() {
  const navigate = useNavigate()
  const overallStatus = scoreStatus(OVERALL_READINESS)
  const overallMeta = STATUS_META[overallStatus]

  return (
    <GovernanceScope className="min-h-screen">
      <div className="max-w-md mx-auto relative" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}>
        {/* ── Sticky header ── */}
        <header
          className="sticky top-0 z-20 safe-top"
          style={{
            background: 'color-mix(in srgb, var(--gv-bg) 86%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--gv-border-faint)',
          }}
        >
          <div className="flex items-center gap-3 px-5" style={{ height: 56 }}>
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="gv-focusable grid place-items-center min-touch -ml-2"
              style={{ color: 'var(--gv-text-secondary)', borderRadius: 'var(--gv-radius-md)' }}
            >
              <ArrowLeft size={21} />
            </button>
            <div className="min-w-0">
              <p className="gv-eyebrow">MUSVORA</p>
              <h1
                className="font-bold leading-none truncate"
                style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-md)', color: 'var(--gv-text)' }}
              >
                Readiness Center
              </h1>
            </div>
          </div>
        </header>

        <div className="px-5">
          {/* ── Overall Readiness Score ── */}
          <section className="flex flex-col items-center text-center pt-7 pb-6">
            <p className="gv-eyebrow mb-5">Overall Readiness Score</p>
            <ReadinessRing
              value={OVERALL_READINESS}
              color={overallMeta.color}
              ariaLabel={`Overall readiness score ${OVERALL_READINESS} out of 100 — ${overallMeta.label}`}
            >
              <span
                className="gv-mono font-extrabold leading-none"
                style={{ fontSize: 'var(--gv-text-4xl)', color: 'var(--gv-text)' }}
              >
                {OVERALL_READINESS}
              </span>
              <span className="gv-eyebrow mt-1">out of 100</span>
            </ReadinessRing>
            <div className="mt-5">
              <Badge tone={overallMeta.tone} variant="outline">
                {overallMeta.label}
              </Badge>
            </div>
            <p
              className="mt-3"
              style={{
                fontSize: 'var(--gv-text-sm)',
                color: 'var(--gv-text-secondary)',
                lineHeight: 'var(--gv-leading-normal)',
                maxWidth: '34ch',
              }}
            >
              Your catalogue is collecting, but copyright gaps are holding back full
              monetization. Resolve the flagged items to raise your score.
            </p>
            <p className="gv-eyebrow mt-4" style={{ color: 'var(--gv-text-faint)' }}>
              Preview · sample data — connect your catalogue for live readiness
            </p>
          </section>

          {/* ── Status summary: Ready Now / Needs Attention / At Risk ── */}
          <section className="grid grid-cols-3 gap-2.5 mb-8">
            {STATUS_ORDER.map(status => {
              const meta = STATUS_META[status]
              return (
                <div
                  key={status}
                  style={{
                    background: 'var(--gv-surface)',
                    border: '1px solid var(--gv-border)',
                    borderRadius: 'var(--gv-radius-lg)',
                    padding: 'var(--gv-space-3)',
                  }}
                >
                  <span
                    className="block mb-1.5"
                    style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }}
                  />
                  <p
                    className="gv-mono font-bold leading-none"
                    style={{ fontSize: 'var(--gv-text-xl)', color: 'var(--gv-text)' }}
                  >
                    {STATUS_SUMMARY[status]}
                  </p>
                  <p
                    className="mt-1 font-semibold"
                    style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', letterSpacing: '0.01em' }}
                  >
                    {meta.label}
                  </p>
                </div>
              )
            })}
          </section>

          {/* ── AI Catalog Auditor entry ── */}
          <button onClick={() => navigate('/auditor')} className="w-full text-left mb-8">
            <Card interactive accent="gold" padding="md">
              <div className="flex items-center gap-3">
                <span
                  className="grid place-items-center flex-shrink-0"
                  style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-gold-soft)', color: 'var(--gv-gold)' }}
                >
                  <Sparkles size={19} strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                      AI Catalog Auditor
                    </p>
                    <Badge tone="gold">AI Core</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                    Audit your real Vault for missing readiness items.
                  </p>
                </div>
                <ArrowRight size={17} style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
              </div>
            </Card>
          </button>

          {/* ── Ownership Confidence entry ── */}
          <button onClick={() => navigate('/ownership')} className="w-full text-left mb-8">
            <Card interactive accent="navy" padding="md">
              <div className="flex items-center gap-3">
                <span
                  className="grid place-items-center flex-shrink-0"
                  style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-info-soft)', color: 'var(--gv-text-link)' }}
                >
                  <Scale size={19} strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                      Ownership Confidence
                    </p>
                    <Badge tone="navy">Governance</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                    Contributors, splits, signatures and ownership timeline.
                  </p>
                </div>
                <ArrowRight size={17} style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
              </div>
            </Card>
          </button>

          {/* ── Governance Player entry ── */}
          <button onClick={() => navigate('/review/sample')} className="w-full text-left mb-8">
            <Card interactive accent="gold" padding="md">
              <div className="flex items-center gap-3">
                <span
                  className="grid place-items-center flex-shrink-0"
                  style={{ width: 40, height: 40, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-gold-soft)', color: 'var(--gv-gold)' }}
                >
                  <PlayCircle size={19} strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                      Governance Player
                    </p>
                    <Badge tone="gold">Asset Review</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                    Listen, verify and evaluate an asset with live governance intelligence.
                  </p>
                </div>
                <ArrowRight size={17} style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
              </div>
            </Card>
          </button>

          {/* ── Readiness dimensions ── */}
          <SectionHeader
            eyebrow="Breakdown"
            title="Readiness by dimension"
            description="Each layer must hold before an asset is fully ready to earn."
          />
          <div className="grid gap-3 mb-8">
            {READINESS_DIMENSIONS.map(dim => (
              <DimensionCard key={dim.id} dim={dim} />
            ))}
          </div>

          {/* ── Assets by readiness ── */}
          <SectionHeader eyebrow="Catalogue" title="Assets by readiness" />
          <Card padding="none" className="mb-2 overflow-hidden">
            {READINESS_ASSETS.map((asset, i) => {
              const meta = STATUS_META[asset.status]
              return (
                <div
                  key={asset.id}
                  className="w-full flex items-center gap-3"
                  style={{
                    padding: 'var(--gv-space-4) var(--gv-space-4)',
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
                    <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{asset.type}</p>
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <span
                    className="gv-mono font-bold"
                    style={{ fontSize: 'var(--gv-text-sm)', color: meta.color }}
                  >
                    {asset.score}
                  </span>
                </div>
              )
            })}
          </Card>
        </div>

        {/* ── Sticky primary CTA: IMPROVE READINESS ── */}
        <div
          className="fixed bottom-0 inset-x-0 z-20"
          style={{
            background: 'linear-gradient(to top, var(--gv-bg) 62%, transparent)',
            paddingBottom: 'calc(var(--gv-space-4) + env(safe-area-inset-bottom, 0px))',
            paddingTop: 'var(--gv-space-6)',
          }}
        >
          <div className="max-w-md mx-auto px-5 grid gap-2.5">
            <Button
              variant="primary"
              size="lg"
              block
              onClick={() => navigate('/vault')}
              leadingIcon={<Sparkles size={17} strokeWidth={2.4} />}
              trailingIcon={<ArrowRight size={17} strokeWidth={2.4} />}
              style={{ letterSpacing: '0.08em' }}
            >
              IMPROVE READINESS
            </Button>
            <Button
              variant="secondary"
              size="lg"
              block
              onClick={() => navigate('/scan')}
              leadingIcon={<ScanLine size={17} strokeWidth={2.4} />}
              style={{ letterSpacing: '0.08em' }}
            >
              SCAN CATALOG
            </Button>
          </div>
        </div>
      </div>
    </GovernanceScope>
  )
}
