import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Play,
  RefreshCw,
  Database,
  Info,
  AlertTriangle,
  Check,
  Clock,
  Users,
  PenLine,
  BadgeCheck,
} from 'lucide-react'
import { GovernanceScope, Button, Card, Badge, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import { STATUS_META } from '../data/readiness'
import { useAuth } from '../lib/auth'
import {
  loadOwnershipPortfolio,
  OWNERSHIP_STATUS_META,
  type OwnershipReport,
  type OwnershipStatus,
  type OwnershipAsset,
  type Contributor,
} from '../services/ownership'

const STATUS_ORDER: OwnershipStatus[] = ['complete', 'pending_signature', 'pending_verification', 'missing_contributor']

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ───────────────────────── ownership graph ───────────────────────── */

function OwnershipGraph({ asset }: { asset: OwnershipAsset }) {
  return (
    <div className="flex flex-col items-center" style={{ paddingTop: 'var(--gv-space-2)' }}>
      {/* Asset node */}
      <div
        className="inline-flex items-center gap-1.5"
        style={{
          background: 'var(--gv-surface-2)',
          border: '1px solid var(--gv-border)',
          borderRadius: 'var(--gv-radius-pill)',
          padding: '4px 12px',
          fontSize: 'var(--gv-text-2xs)',
          color: 'var(--gv-text)',
          fontWeight: 600,
          maxWidth: '100%',
        }}
      >
        <ShieldCheck size={12} style={{ color: 'var(--gv-gold)' }} aria-hidden />
        <span className="truncate">{asset.title}</span>
      </div>

      {/* Connector */}
      <span style={{ width: 1, height: 14, background: 'var(--gv-border)' }} aria-hidden />

      {/* Contributor nodes */}
      <div className="flex flex-wrap items-stretch justify-center gap-2">
        {asset.contributors.map(c => {
          const meta = OWNERSHIP_STATUS_META[c.status]
          return (
            <div
              key={c.id}
              className="flex flex-col items-center text-center"
              style={{
                background: 'var(--gv-surface)',
                border: '1px solid var(--gv-border)',
                borderTop: `2px solid ${meta.color}`,
                borderRadius: 'var(--gv-radius-md)',
                padding: 'var(--gv-space-2) var(--gv-space-3)',
                minWidth: 84,
              }}
            >
              <span className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text)', maxWidth: 96 }}>
                {c.name}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>{c.role}</span>
              <span className="gv-mono font-bold mt-0.5" style={{ fontSize: 'var(--gv-text-2xs)', color: meta.color }}>
                {typeof c.splitPercent === 'number' ? `${c.splitPercent}%` : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────────────────── contributor row ───────────────────────── */

function ContributorRow({ c }: { c: Contributor }) {
  const meta = OWNERSHIP_STATUS_META[c.status]
  return (
    <div className="flex items-center gap-2.5" style={{ padding: 'var(--gv-space-2) 0' }}>
      <span
        className="grid place-items-center flex-shrink-0"
        style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gv-surface-2)', color: 'var(--gv-text-secondary)', fontSize: 'var(--gv-text-2xs)', fontWeight: 700 }}
      >
        {c.name.slice(0, 1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
          {c.name}
        </p>
        <div className="flex items-center gap-2" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>
          <span>{c.role}</span>
          <span className="inline-flex items-center gap-0.5">
            <BadgeCheck size={10} style={{ color: c.verified ? 'var(--gv-success)' : 'var(--gv-text-faint)' }} />
            {c.verified ? 'Verified' : 'Unverified'}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <PenLine size={10} style={{ color: c.signed ? 'var(--gv-success)' : 'var(--gv-text-faint)' }} />
            {c.signed ? 'Signed' : 'Unsigned'}
          </span>
        </div>
      </div>
      <span className="gv-mono font-bold flex-shrink-0" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
        {typeof c.splitPercent === 'number' ? `${c.splitPercent}%` : '—'}
      </span>
      <Badge tone={meta.tone}>{meta.label}</Badge>
    </div>
  )
}

/* ───────────────────────── asset card ───────────────────────── */

function AssetCard({ asset, onReview }: { asset: OwnershipAsset; onReview: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const meta = OWNERSHIP_STATUS_META[asset.status]
  const bandMeta = STATUS_META[asset.band]

  return (
    <Card padding="none" className="overflow-hidden" accent={meta.tone === 'gold' ? 'gold' : meta.tone}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="gv-focusable w-full text-left flex items-center gap-3"
        style={{ padding: 'var(--gv-space-4)' }}
      >
        <span className="flex-shrink-0" style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
            {asset.title}
          </p>
          <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
            {asset.typeLabel} · {asset.contributors.length} {asset.contributors.length === 1 ? 'contributor' : 'contributors'}
          </p>
        </div>
        <span className="gv-mono font-bold" style={{ fontSize: 'var(--gv-text-sm)', color: bandMeta.color }}>
          {asset.confidence}
        </span>
        <ChevronDown
          size={16}
          style={{ color: 'var(--gv-text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--gv-ease)' }}
          aria-hidden
        />
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--gv-border-faint)', padding: 'var(--gv-space-4)' }}>
          <div className="flex items-center justify-between mb-3">
            <Badge tone={meta.tone}>{meta.label}</Badge>
            <span className="gv-mono" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
              Ownership Confidence {asset.confidence}/100
            </span>
          </div>

          {/* Contributors + splits */}
          <p className="gv-eyebrow mb-1 inline-flex items-center gap-1"><Users size={11} /> Contributors &amp; splits</p>
          <div style={{ borderTop: '1px solid var(--gv-border-faint)' }}>
            {asset.contributors.map(c => <ContributorRow key={c.id} c={c} />)}
          </div>
          {/* Split total bar */}
          <div className="mt-2 mb-4">
            <div className="flex items-center justify-between mb-1" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>
              <span>Documented splits</span>
              <span className="gv-mono" style={{ color: asset.splitsDocumented && asset.splitTotal === 100 ? 'var(--gv-success)' : 'var(--gv-warning)' }}>
                {asset.splitsDocumented ? `${asset.splitTotal}%` : 'Not documented'}
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 999, background: 'var(--gv-surface-2)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, asset.splitsDocumented ? asset.splitTotal : 0)}%`,
                  height: '100%',
                  background: asset.splitsDocumented && asset.splitTotal === 100 ? 'var(--gv-success)' : 'var(--gv-warning)',
                }}
              />
            </div>
          </div>

          {/* Ownership graph */}
          <p className="gv-eyebrow mb-2">Ownership graph</p>
          <div className="mb-4" style={{ background: 'var(--gv-surface-2)', borderRadius: 'var(--gv-radius-md)', padding: 'var(--gv-space-3)' }}>
            <OwnershipGraph asset={asset} />
          </div>

          {/* Ownership timeline */}
          <p className="gv-eyebrow mb-2 inline-flex items-center gap-1"><Clock size={11} /> Ownership timeline</p>
          <div className="grid gap-0 mb-1">
            {asset.timeline.map((ev, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <span
                    className="grid place-items-center"
                    style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: ev.done ? 'var(--gv-success-soft)' : 'var(--gv-surface-2)',
                      color: ev.done ? 'var(--gv-success)' : 'var(--gv-text-faint)',
                      border: `1px solid ${ev.done ? 'transparent' : 'var(--gv-border)'}`,
                    }}
                  >
                    {ev.done ? <Check size={9} strokeWidth={3} /> : <Clock size={9} />}
                  </span>
                  {i < asset.timeline.length - 1 && <span style={{ width: 1, flex: 1, minHeight: 14, background: 'var(--gv-border)' }} />}
                </div>
                <div className="pb-2.5 min-w-0">
                  <p style={{ fontSize: 'var(--gv-text-sm)', color: ev.done ? 'var(--gv-text)' : 'var(--gv-text-muted)', fontWeight: ev.done ? 600 : 500 }}>
                    {ev.label}
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--gv-text-faint)' }}>
                    {ev.done ? fmtDate(ev.date) : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gaps / suggested actions */}
          {asset.gaps.length > 0 && (
            <div className="mt-1" style={{ borderTop: '1px solid var(--gv-border-faint)', paddingTop: 'var(--gv-space-3)' }}>
              <p className="gv-eyebrow mb-2">To raise confidence</p>
              <div className="grid gap-1.5">
                {asset.gaps.map((g, i) => (
                  <div key={i} className="flex items-start gap-2" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>
                    <ArrowRight size={13} style={{ color: 'var(--gv-gold)', flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button variant="secondary" size="sm" block className="mt-4" onClick={() => onReview(asset.id)} leadingIcon={<Play size={14} />}>
            Open in Governance Player
          </Button>
        </div>
      )}
    </Card>
  )
}

/* ───────────────────────── page ───────────────────────── */

export default function Ownership() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [report, setReport] = useState<OwnershipReport | null>(null)

  const run = useCallback(async () => {
    setStatus('loading')
    try {
      const result = await loadOwnershipPortfolio(user?.id, profile?.username ?? 'You')
      setReport(result)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [user?.id, profile?.username])

  useEffect(() => { run() }, [run])

  const bandMeta = report ? STATUS_META[report.band] : STATUS_META.attention

  return (
    <GovernanceScope className="min-h-screen">
      <div className="max-w-md mx-auto relative" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Header */}
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
            <div className="min-w-0 flex-1">
              <p className="gv-eyebrow">MUSVORA · Governance</p>
              <h1 className="font-bold leading-none truncate" style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-md)', color: 'var(--gv-text)' }}>
                Ownership Confidence
              </h1>
            </div>
            <button
              onClick={run}
              aria-label="Re-run"
              className="gv-focusable grid place-items-center min-touch -mr-2"
              style={{ color: 'var(--gv-text-secondary)', borderRadius: 'var(--gv-radius-md)' }}
            >
              <RefreshCw size={18} className={status === 'loading' ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="px-5">
          {/* Trust disclaimer */}
          <Card padding="sm" className="mt-4 mb-4" accent="gold">
            <div className="flex items-start gap-2.5">
              <Info size={15} style={{ color: 'var(--gv-gold)', flexShrink: 0, marginTop: 2 }} aria-hidden />
              <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                MUSVORA tracks ownership signals — contributors, splits, signatures and timeline. This is a confidence indicator that <strong style={{ color: 'var(--gv-text)' }}>Requires Confirmation</strong> and is not a legal determination.
              </p>
            </div>
          </Card>

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center text-center py-16" role="status" aria-live="polite">
              <div className="relative w-9 h-9 mb-4">
                <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--gv-border)' }} />
                <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--gv-gold)' }} />
              </div>
              <p className="gv-eyebrow">Pending Analysis</p>
              <p className="mt-1" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>Building ownership picture…</p>
            </div>
          )}

          {status === 'error' && (
            <Card padding="lg" className="mt-2" accent="danger">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-danger-soft)', color: 'var(--gv-danger)' }}>
                  <AlertTriangle size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>Could not load ownership</h3>
                  <p className="mb-3" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>We couldn't read your catalogue right now. Please try again.</p>
                  <Button variant="secondary" size="sm" onClick={run} leadingIcon={<RefreshCw size={14} />}>Retry</Button>
                </div>
              </div>
            </Card>
          )}

          {status === 'ready' && report && (
            <>
              {/* Source banner */}
              <div
                className="flex items-center gap-2.5 mb-6"
                style={{
                  background: report.source === 'vault' ? 'var(--gv-success-soft)' : 'var(--gv-surface-2)',
                  border: '1px solid var(--gv-border-faint)',
                  borderRadius: 'var(--gv-radius-md)',
                  padding: 'var(--gv-space-3)',
                }}
              >
                <Database size={15} style={{ color: report.source === 'vault' ? 'var(--gv-success)' : 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
                <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                  {report.source === 'vault' ? (
                    <>Tracking ownership for <strong style={{ color: 'var(--gv-text)' }}>{report.assets.length}</strong> real {report.assets.length === 1 ? 'work' : 'works'} in your Vault.</>
                  ) : (
                    <><strong style={{ color: 'var(--gv-text)' }}>Sample portfolio</strong> — sign in and add works to your Vault to track real ownership.</>
                  )}
                </p>
              </div>

              {/* Overall confidence */}
              <section className="flex flex-col items-center text-center pb-6">
                <p className="gv-eyebrow mb-5">Portfolio Ownership Confidence</p>
                <ReadinessRing
                  value={report.overallConfidence}
                  color={bandMeta.color}
                  ariaLabel={`Ownership confidence ${report.overallConfidence} out of 100`}
                >
                  <span className="gv-mono font-extrabold leading-none" style={{ fontSize: 'var(--gv-text-4xl)', color: 'var(--gv-text)' }}>
                    {report.overallConfidence}
                  </span>
                  <span className="gv-eyebrow mt-1">out of 100</span>
                </ReadinessRing>
                <p className="mt-4" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', maxWidth: '34ch', lineHeight: 'var(--gv-leading-normal)' }}>
                  Confidence is computed from documented contributors, splits, verification and signatures — never assumed.
                </p>
              </section>

              {/* Status distribution */}
              <section className="grid grid-cols-4 gap-2 mb-8">
                {STATUS_ORDER.map(s => {
                  const m = OWNERSHIP_STATUS_META[s]
                  return (
                    <div key={s} style={{ background: 'var(--gv-surface)', border: '1px solid var(--gv-border)', borderRadius: 'var(--gv-radius-lg)', padding: 'var(--gv-space-3)' }}>
                      <span className="block mb-1.5" style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                      <p className="gv-mono font-bold leading-none" style={{ fontSize: 'var(--gv-text-lg)', color: 'var(--gv-text)' }}>
                        {report.statusCounts[s]}
                      </p>
                      <p className="mt-1 font-semibold leading-tight" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>
                        {m.label}
                      </p>
                    </div>
                  )
                })}
              </section>

              <SectionHeader eyebrow="Catalogue" title="Ownership by work" description="Tap a work to see contributors, splits, signatures, graph and timeline." />
              <div className="grid gap-2.5 mb-2">
                {report.assets.map(a => <AssetCard key={a.id} asset={a} onReview={id => navigate(`/review/${id}`)} />)}
              </div>
            </>
          )}
        </div>

        {/* Sticky CTA */}
        <div
          className="fixed bottom-0 inset-x-0 z-20"
          style={{
            background: 'linear-gradient(to top, var(--gv-bg) 62%, transparent)',
            paddingBottom: 'calc(var(--gv-space-4) + env(safe-area-inset-bottom, 0px))',
            paddingTop: 'var(--gv-space-6)',
          }}
        >
          <div className="max-w-md mx-auto px-5 grid gap-2.5">
            <Button variant="primary" size="lg" block onClick={() => navigate('/vault')} leadingIcon={<ShieldCheck size={17} strokeWidth={2.4} />} trailingIcon={<ArrowRight size={17} strokeWidth={2.4} />} style={{ letterSpacing: '0.08em' }}>
              OPEN VAULT
            </Button>
            <Button variant="secondary" size="lg" block onClick={() => navigate('/auditor')} leadingIcon={<Sparkles size={17} strokeWidth={2.4} />} style={{ letterSpacing: '0.08em' }}>
              RUN AI CATALOG AUDITOR
            </Button>
          </div>
        </div>
      </div>
    </GovernanceScope>
  )
}
