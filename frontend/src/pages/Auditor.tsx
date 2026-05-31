import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  ChevronDown,
  AlertTriangle,
  Scale,
  RefreshCw,
  Database,
  Info,
  Check,
} from 'lucide-react'
import { GovernanceScope, Button, Card, Badge, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import { STATUS_META } from '../data/readiness'
import { useAuth } from '../lib/auth'
import {
  loadCatalogAudit,
  PRIORITY_META,
  DIMENSION_LABEL,
  type AuditReport,
  type AuditPriority,
  type AuditedAsset,
} from '../services/auditor'

const PRIORITY_ORDER: AuditPriority[] = ['critical', 'high', 'medium', 'low']

function timeAgo(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

/* ───────────────────────── asset row ───────────────────────── */

function AssetCard({ asset }: { asset: AuditedAsset }) {
  const [open, setOpen] = useState(false)
  const meta = STATUS_META[asset.status]

  return (
    <Card padding="none" className="overflow-hidden" accent={meta.tone === 'success' ? 'success' : meta.tone === 'warning' ? 'warning' : 'danger'}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="gv-focusable w-full text-left flex items-center gap-3"
        style={{ padding: 'var(--gv-space-4)' }}
      >
        <span
          className="flex-shrink-0"
          style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
            {asset.title}
          </p>
          <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
            {asset.typeLabel} · {asset.issues.length === 0 ? 'No issues' : `${asset.issues.length} potential ${asset.issues.length === 1 ? 'issue' : 'issues'}`}
          </p>
        </div>
        <span className="gv-mono font-bold" style={{ fontSize: 'var(--gv-text-sm)', color: meta.color }}>
          {asset.score}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--gv-text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms var(--gv-ease)',
          }}
          aria-hidden
        />
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--gv-border-faint)' }}>
          {asset.issues.length === 0 ? (
            <div className="flex items-center gap-2" style={{ padding: 'var(--gv-space-4)' }}>
              <span
                className="grid place-items-center flex-shrink-0"
                style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gv-success-soft)', color: 'var(--gv-success)' }}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>
                No readiness gaps detected for the data on file.
              </p>
            </div>
          ) : (
            <div className="grid gap-2.5" style={{ padding: 'var(--gv-space-4)' }}>
              {asset.issues.map(issue => {
                const pri = PRIORITY_META[issue.priority]
                return (
                  <div key={issue.key} style={{ borderLeft: `2px solid var(--gv-${pri.tone})`, paddingLeft: 'var(--gv-space-3)' }}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge tone={pri.tone}>{pri.label}</Badge>
                      <span className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                        Potential Issue · {issue.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', marginBottom: 4 }}>
                      Readiness Impact · lowers {DIMENSION_LABEL[issue.dimension]} readiness
                    </p>
                    <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                      <span style={{ color: 'var(--gv-text)', fontWeight: 600 }}>Suggested Action · </span>
                      {issue.suggestedAction}
                    </p>
                    {issue.legalReview && (
                      <span className="inline-flex items-center gap-1 mt-1.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-gold)', fontWeight: 600 }}>
                        <Scale size={11} strokeWidth={2.4} /> Legal Review Recommended
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

/* ───────────────────────── page ───────────────────────── */

export default function Auditor() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [report, setReport] = useState<AuditReport | null>(null)

  const run = useCallback(async () => {
    setStatus('loading')
    try {
      const result = await loadCatalogAudit(user?.id)
      setReport(result)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [user?.id])

  useEffect(() => {
    run()
  }, [run])

  const overallMeta = report ? STATUS_META[report.overallStatus] : STATUS_META.attention

  return (
    <GovernanceScope className="min-h-screen">
      <div className="max-w-md mx-auto relative" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Sticky header */}
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
              <p className="gv-eyebrow">MUSVORA · AI Core</p>
              <h1
                className="font-bold leading-none truncate"
                style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-md)', color: 'var(--gv-text)' }}
              >
                AI Catalog Auditor
              </h1>
            </div>
            <button
              onClick={run}
              aria-label="Re-run audit"
              className="gv-focusable grid place-items-center min-touch -mr-2"
              style={{ color: 'var(--gv-text-secondary)', borderRadius: 'var(--gv-radius-md)' }}
            >
              <RefreshCw size={18} className={status === 'loading' ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="px-5">
          {/* Requires Confirmation — AI assistance disclaimer */}
          <Card padding="sm" className="mt-4 mb-4" accent="gold">
            <div className="flex items-start gap-2.5">
              <Info size={15} style={{ color: 'var(--gv-gold)', flexShrink: 0, marginTop: 2 }} aria-hidden />
              <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                AI assistance — not a legal determination. Every finding <strong style={{ color: 'var(--gv-text)' }}>Requires Confirmation</strong>.
                MUSVORA audits and suggests; it does not certify ownership or provide legal advice.
              </p>
            </div>
          </Card>

          {/* Loading */}
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center text-center py-16" role="status" aria-live="polite">
              <div className="relative w-9 h-9 mb-4">
                <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--gv-border)' }} />
                <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--gv-gold)' }} />
              </div>
              <p className="gv-eyebrow">Pending Analysis</p>
              <p className="mt-1" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>
                Auditing your catalogue…
              </p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <Card padding="lg" className="mt-2" accent="danger">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-danger-soft)', color: 'var(--gv-danger)' }}>
                  <AlertTriangle size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>
                    Audit could not complete
                  </h3>
                  <p className="mb-3" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>
                    We couldn't read your catalogue right now. Please try again.
                  </p>
                  <Button variant="secondary" size="sm" onClick={run} leadingIcon={<RefreshCw size={14} />}>
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Ready */}
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
                    <>
                      Auditing <strong style={{ color: 'var(--gv-text)' }}>{report.assets.length}</strong> real {report.assets.length === 1 ? 'work' : 'works'} from your Vault · {timeAgo(report.generatedAt)}
                    </>
                  ) : (
                    <>
                      <strong style={{ color: 'var(--gv-text)' }}>Sample catalogue</strong> — sign in and add works to your Vault to audit your real assets.
                    </>
                  )}
                </p>
              </div>

              {/* Overall readiness */}
              <section className="flex flex-col items-center text-center pb-6">
                <p className="gv-eyebrow mb-5">Catalogue Readiness</p>
                <ReadinessRing
                  value={report.overallScore}
                  color={overallMeta.color}
                  ariaLabel={`Catalogue readiness ${report.overallScore} out of 100 — ${overallMeta.label}`}
                >
                  <span className="gv-mono font-extrabold leading-none" style={{ fontSize: 'var(--gv-text-4xl)', color: 'var(--gv-text)' }}>
                    {report.overallScore}
                  </span>
                  <span className="gv-eyebrow mt-1">out of 100</span>
                </ReadinessRing>
                <div className="mt-5">
                  <Badge tone={overallMeta.tone} variant="outline">{overallMeta.label}</Badge>
                </div>
                <p className="mt-3" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)', maxWidth: '34ch' }}>
                  {report.totalIssues === 0
                    ? 'No readiness gaps detected across your catalogue.'
                    : `${report.totalIssues} potential ${report.totalIssues === 1 ? 'issue' : 'issues'} found across ${report.assets.length} ${report.assets.length === 1 ? 'work' : 'works'}.`}
                </p>
              </section>

              {/* Issues by priority */}
              <section className="grid grid-cols-4 gap-2 mb-8">
                {PRIORITY_ORDER.map(p => {
                  const pri = PRIORITY_META[p]
                  return (
                    <div
                      key={p}
                      style={{
                        background: 'var(--gv-surface)',
                        border: '1px solid var(--gv-border)',
                        borderRadius: 'var(--gv-radius-lg)',
                        padding: 'var(--gv-space-3)',
                      }}
                    >
                      <span className="block mb-1.5" style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--gv-${pri.tone})` }} />
                      <p className="gv-mono font-bold leading-none" style={{ fontSize: 'var(--gv-text-lg)', color: 'var(--gv-text)' }}>
                        {report.issuesByPriority[p]}
                      </p>
                      <p className="mt-1 font-semibold" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
                        {pri.label}
                      </p>
                    </div>
                  )
                })}
              </section>

              {/* Legal review note */}
              {report.legalReviewCount > 0 && (
                <div className="flex items-center gap-2 mb-6" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-gold)' }}>
                  <Scale size={13} strokeWidth={2.4} />
                  <span style={{ fontWeight: 600 }}>
                    {report.legalReviewCount} {report.legalReviewCount === 1 ? 'item' : 'items'} flagged Legal Review Recommended
                  </span>
                </div>
              )}

              {/* Per-asset findings */}
              <SectionHeader
                eyebrow="Findings"
                title="Audit by work"
                description="Tap a work to see its potential issues and suggested actions."
              />
              <div className="grid gap-2.5 mb-2">
                {report.assets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
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
            <Button
              variant="primary"
              size="lg"
              block
              onClick={() => navigate('/vault')}
              leadingIcon={<ShieldCheck size={17} strokeWidth={2.4} />}
              trailingIcon={<ArrowRight size={17} strokeWidth={2.4} />}
              style={{ letterSpacing: '0.08em' }}
            >
              OPEN VAULT
            </Button>
            <Button
              variant="secondary"
              size="lg"
              block
              onClick={() => navigate('/scan')}
              leadingIcon={<ScanLine size={17} strokeWidth={2.4} />}
              style={{ letterSpacing: '0.08em' }}
            >
              SCAN A SINGLE WORK
            </Button>
          </div>
        </div>
      </div>
    </GovernanceScope>
  )
}
