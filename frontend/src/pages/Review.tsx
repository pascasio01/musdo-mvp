import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  ShieldCheck,
  ScrollText,
  Sparkles,
  Info,
  Database,
  AlertTriangle,
  RefreshCw,
  Lock,
  Users,
  Check,
  Clock,
  BadgeCheck,
  PenLine,
  FileText,
} from 'lucide-react'
import { GovernanceScope, Button, Card, Badge, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import { STATUS_META } from '../data/readiness'
import { useAuth } from '../lib/auth'
import { OWNERSHIP_STATUS_META } from '../services/ownership'
import { PRIORITY_META } from '../services/auditor'
import { loadReviewAsset, type ReviewResult, type ReviewAsset, type StatusChip } from '../services/governancePlayer'

type Tab = 'audio' | 'metadata' | 'ownership' | 'readiness'
const TABS: { id: Tab; label: string }[] = [
  { id: 'audio', label: 'Audio' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'readiness', label: 'Readiness' },
]

function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ───────────────── governance status strip ───────────────── */

function StatusGrid({ asset }: { asset: ReviewAsset }) {
  const rb = STATUS_META[asset.readinessStatus]
  const ob = STATUS_META[asset.ownership.band]
  const cells: { label: string; value: string; sub: string; color: string }[] = [
    { label: 'Readiness', value: String(asset.readinessScore), sub: rb.label, color: rb.color },
    { label: 'Ownership', value: String(asset.ownership.confidence), sub: OWNERSHIP_STATUS_META[asset.ownership.status].label, color: ob.color },
    { label: 'Passport', value: asset.passport.label, sub: 'Pending Registration', color: 'var(--gv-gold)' },
    { label: 'Licensing', value: asset.licensing.label, sub: asset.licensing.detail, color: asset.licensing.tone === 'success' ? 'var(--gv-success)' : 'var(--gv-text-secondary)' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2">
      {cells.map(c => (
        <div key={c.label} style={{ background: 'var(--gv-surface)', border: '1px solid var(--gv-border)', borderRadius: 'var(--gv-radius-lg)', padding: 'var(--gv-space-3)' }}>
          <p className="gv-eyebrow mb-1">{c.label}</p>
          <p className="font-bold leading-tight truncate" style={{ fontSize: 'var(--gv-text-base)', color: c.color, fontFamily: 'var(--gv-font-display)' }}>
            {c.value}
          </p>
          <p className="truncate" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>{c.sub}</p>
        </div>
      ))}
    </div>
  )
}

/* ───────────────── audio tab ───────────────── */

function AudioTab({ asset }: { asset: ReviewAsset }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(asset.durationSec)
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasRealAudio = !!asset.audioUrl

  const stopSim = useCallback(() => {
    if (simRef.current) { clearInterval(simRef.current); simRef.current = null }
  }, [])

  const startSim = useCallback((from: number) => {
    stopSim()
    let t = from
    simRef.current = setInterval(() => {
      t += 0.25
      if (t >= duration) { t = duration; stopSim(); setPlaying(false) }
      setElapsed(t)
    }, 250)
  }, [duration, stopSim])

  useEffect(() => () => stopSim(), [stopSim])

  // Reset when asset changes.
  useEffect(() => {
    stopSim()
    setPlaying(false)
    setElapsed(0)
    setDuration(asset.durationSec)
    const a = audioRef.current
    if (a) { a.pause(); a.currentTime = 0 }
  }, [asset.id, asset.durationSec, stopSim])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (playing) {
      a?.pause(); stopSim(); setPlaying(false)
      return
    }
    if (hasRealAudio && a) {
      a.play().then(() => setPlaying(true)).catch(() => { setPlaying(true); startSim(elapsed) })
    } else {
      setPlaying(true); startSim(elapsed)
    }
  }, [playing, hasRealAudio, elapsed, startSim, stopSim])

  const onSeek = useCallback((pct: number) => {
    const target = (pct / 100) * duration
    setElapsed(target)
    const a = audioRef.current
    if (hasRealAudio && a && isFinite(a.duration)) a.currentTime = target
    else if (playing) startSim(target)
  }, [duration, hasRealAudio, playing, startSim])

  const progress = duration > 0 ? (elapsed / duration) * 100 : 0

  return (
    <div>
      {hasRealAudio && (
        <audio
          ref={audioRef}
          src={asset.audioUrl}
          preload="metadata"
          controlsList="nodownload"
          onLoadedMetadata={e => { const d = e.currentTarget.duration; if (isFinite(d)) setDuration(d) }}
          onTimeUpdate={e => setElapsed(e.currentTarget.currentTime)}
          onEnded={() => { setPlaying(false); setElapsed(0) }}
        />
      )}

      {/* Cover */}
      <div
        className="mx-auto mb-5 grid place-items-center"
        style={{
          width: 168, height: 168, borderRadius: 'var(--gv-radius-xl)',
          background: 'linear-gradient(145deg, var(--gv-surface-2), var(--gv-surface))',
          border: '1px solid var(--gv-border)',
          color: 'var(--gv-text-faint)',
        }}
      >
        {asset.kind === 'lyrics' ? <ScrollText size={48} /> : <ShieldCheck size={48} style={{ color: 'var(--gv-gold)', opacity: 0.7 }} />}
      </div>

      {!hasRealAudio && asset.kind === 'demo' && (
        <p className="text-center mb-4" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
          No audio file on record — review simulation only.
        </p>
      )}
      {asset.kind === 'lyrics' && (
        <p className="text-center mb-4" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>
          Lyrics asset — no audio. Use the Metadata and Ownership tabs.
        </p>
      )}

      {asset.kind === 'demo' && (
        <>
          {/* Seek */}
          <div className="mb-2">
            <div style={{ position: 'relative', height: 6, borderRadius: 999, background: 'var(--gv-surface-2)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gv-gold)' }} />
            </div>
            <input
              type="range" min={0} max={100} step={0.1} value={progress}
              onChange={e => onSeek(Number(e.target.value))}
              aria-label="Seek"
              className="gv-focusable"
              style={{ width: '100%', marginTop: -6, opacity: 0, height: 18, cursor: 'pointer' }}
            />
            <div className="flex items-center justify-between gv-mono" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>
              <span>{fmtTime(elapsed)}</span>
              <span>{fmtTime(duration)}</span>
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-center my-4">
            <button
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              className="gv-focusable grid place-items-center"
              style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--gv-gold)', color: 'var(--gv-navy)', boxShadow: 'var(--gv-shadow-md)' }}
            >
              {playing ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" style={{ marginLeft: 3 }} />}
            </button>
          </div>
        </>
      )}

      {/* Security note */}
      <div className="flex items-start gap-2 mt-4" style={{ background: 'var(--gv-surface-2)', borderRadius: 'var(--gv-radius-md)', padding: 'var(--gv-space-3)' }}>
        <Lock size={14} style={{ color: 'var(--gv-text-muted)', flexShrink: 0, marginTop: 1 }} aria-hidden />
        <p style={{ fontSize: '10px', color: 'var(--gv-text-muted)', lineHeight: 'var(--gv-leading-normal)' }}>
          Stream-only review — no download action is provided in the Governance Player.
        </p>
      </div>
    </div>
  )
}

/* ───────────────── metadata tab ───────────────── */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3" style={{ padding: 'var(--gv-space-2) 0', borderBottom: '1px solid var(--gv-border-faint)' }}>
      <span style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{label}</span>
      <span className="font-semibold text-right truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{value}</span>
    </div>
  )
}

function MetadataTab({ asset }: { asset: ReviewAsset }) {
  return (
    <div>
      <Row label="Title" value={asset.title} />
      <Row label="Composer" value={asset.composerName} />
      <Row label="Type" value={asset.typeLabel} />
      <Row label="Genre" value={asset.metadata.genre ?? 'Not set'} />
      <Row label="BPM" value={asset.metadata.bpm ?? 'Not set'} />
      <Row label="Key" value={asset.metadata.key ?? 'Not set'} />
      <Row label="Created" value={fmtDate(asset.createdAt)} />
      <Row label="Licensing" value={asset.licensing.label} />
      <p className="mt-3" style={{ fontSize: '10px', color: 'var(--gv-text-faint)' }}>
        Fields marked “Not set” are Suggested Actions — completing them raises readiness.
      </p>
    </div>
  )
}

/* ───────────────── ownership tab ───────────────── */

function ChipLine({ chip, icon }: { chip: StatusChip; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5" style={{ background: 'var(--gv-surface-2)', borderRadius: 'var(--gv-radius-md)', padding: 'var(--gv-space-3)' }}>
      <span style={{ color: 'var(--gv-text-muted)', flexShrink: 0 }}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{chip.label}</p>
        <p className="truncate" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>{chip.detail}</p>
      </div>
      <Badge tone={chip.tone}>{chip.label}</Badge>
    </div>
  )
}

function OwnershipTab({ asset }: { asset: ReviewAsset }) {
  const o = asset.ownership
  const meta = OWNERSHIP_STATUS_META[o.status]
  const band = STATUS_META[o.band]
  return (
    <div>
      <div className="flex items-center gap-3 mb-4" style={{ background: 'var(--gv-surface)', border: '1px solid var(--gv-border)', borderRadius: 'var(--gv-radius-lg)', padding: 'var(--gv-space-3)' }}>
        <ReadinessRing value={o.confidence} color={band.color} ariaLabel={`Ownership confidence ${o.confidence}`} size={64} stroke={6}>
          <span className="gv-mono font-bold" style={{ fontSize: 'var(--gv-text-md)', color: 'var(--gv-text)' }}>{o.confidence}</span>
        </ReadinessRing>
        <div className="min-w-0">
          <p className="gv-eyebrow mb-1">Ownership Confidence</p>
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <p className="mt-1.5" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>Requires Confirmation — a confidence signal pending human verification.</p>
        </div>
      </div>

      <p className="gv-eyebrow mb-1 inline-flex items-center gap-1"><Users size={11} /> Contributors &amp; splits</p>
      <div className="mb-4" style={{ borderTop: '1px solid var(--gv-border-faint)' }}>
        {o.contributors.map(c => {
          const cm = OWNERSHIP_STATUS_META[c.status]
          return (
            <div key={c.id} className="flex items-center gap-2.5" style={{ padding: 'var(--gv-space-2) 0' }}>
              <span className="grid place-items-center flex-shrink-0" style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gv-surface-2)', color: 'var(--gv-text-secondary)', fontSize: 'var(--gv-text-2xs)', fontWeight: 700 }}>
                {c.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{c.name}</p>
                <div className="flex items-center gap-2" style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>
                  <span>{c.role}</span>
                  <span className="inline-flex items-center gap-0.5"><BadgeCheck size={10} style={{ color: c.verified ? 'var(--gv-success)' : 'var(--gv-text-faint)' }} />{c.verified ? 'Verified' : 'Unverified'}</span>
                  <span className="inline-flex items-center gap-0.5"><PenLine size={10} style={{ color: c.signed ? 'var(--gv-success)' : 'var(--gv-text-faint)' }} />{c.signed ? 'Signed' : 'Unsigned'}</span>
                </div>
              </div>
              <span className="gv-mono font-bold flex-shrink-0" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{typeof c.splitPercent === 'number' ? `${c.splitPercent}%` : '—'}</span>
              <Badge tone={cm.tone}>{cm.label}</Badge>
            </div>
          )
        })}
      </div>

      {/* Timeline */}
      <p className="gv-eyebrow mb-2 inline-flex items-center gap-1"><Clock size={11} /> Ownership timeline</p>
      <div className="mb-1">
        {o.timeline.map((ev, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="grid place-items-center" style={{ width: 16, height: 16, borderRadius: '50%', background: ev.done ? 'var(--gv-success-soft)' : 'var(--gv-surface-2)', color: ev.done ? 'var(--gv-success)' : 'var(--gv-text-faint)', border: `1px solid ${ev.done ? 'transparent' : 'var(--gv-border)'}` }}>
                {ev.done ? <Check size={9} strokeWidth={3} /> : <Clock size={9} />}
              </span>
              {i < o.timeline.length - 1 && <span style={{ width: 1, flex: 1, minHeight: 12, background: 'var(--gv-border)' }} />}
            </div>
            <div className="pb-2 min-w-0">
              <p style={{ fontSize: 'var(--gv-text-sm)', color: ev.done ? 'var(--gv-text)' : 'var(--gv-text-muted)', fontWeight: ev.done ? 600 : 500 }}>{ev.label}</p>
              <p style={{ fontSize: '10px', color: 'var(--gv-text-faint)' }}>{ev.done ? fmtDate(ev.date) : 'Pending'}</p>
            </div>
          </div>
        ))}
      </div>

      {o.gaps.length > 0 && (
        <div className="mt-2" style={{ borderTop: '1px solid var(--gv-border-faint)', paddingTop: 'var(--gv-space-3)' }}>
          <p className="gv-eyebrow mb-2">To raise confidence</p>
          {o.gaps.map((g, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>
              <ArrowRight size={13} style={{ color: 'var(--gv-gold)', flexShrink: 0, marginTop: 3 }} aria-hidden />
              <span>{g}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────────────── readiness tab ───────────────── */

function ReadinessTab({ asset, onOpenAuditor }: { asset: ReviewAsset; onOpenAuditor: () => void }) {
  const band = STATUS_META[asset.readinessStatus]
  return (
    <div>
      <div className="flex flex-col items-center text-center pb-5">
        <ReadinessRing value={asset.readinessScore} color={band.color} ariaLabel={`Readiness ${asset.readinessScore}`}>
          <span className="gv-mono font-extrabold leading-none" style={{ fontSize: 'var(--gv-text-3xl)', color: 'var(--gv-text)' }}>{asset.readinessScore}</span>
          <span className="gv-eyebrow mt-1">readiness</span>
        </ReadinessRing>
        <Badge tone={band.tone} className="mt-3">{band.label}</Badge>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="gv-eyebrow inline-flex items-center gap-1"><Sparkles size={11} /> AI Catalog Auditor</p>
        <span style={{ fontSize: '10px', color: 'var(--gv-text-muted)' }}>{asset.audit.totalIssues} Potential {asset.audit.totalIssues === 1 ? 'Issue' : 'Issues'}</span>
      </div>

      {asset.audit.topIssues.length === 0 ? (
        <div className="flex items-center gap-2" style={{ background: 'var(--gv-success-soft)', borderRadius: 'var(--gv-radius-md)', padding: 'var(--gv-space-3)' }}>
          <Check size={15} style={{ color: 'var(--gv-success)' }} />
          <span style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>No outstanding readiness issues found.</span>
        </div>
      ) : (
        <div className="grid gap-1.5">
          {asset.audit.topIssues.map(issue => {
            const pm = PRIORITY_META[issue.priority]
            return (
              <div key={issue.key} className="flex items-start gap-2.5" style={{ background: 'var(--gv-surface-2)', borderRadius: 'var(--gv-radius-md)', padding: 'var(--gv-space-3)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: pm.tone === 'danger' ? 'var(--gv-danger)' : pm.tone === 'warning' ? 'var(--gv-warning)' : 'var(--gv-text-muted)', marginTop: 6, flexShrink: 0 }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{issue.label}</p>
                    <Badge tone={pm.tone}>{pm.label}</Badge>
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--gv-text-muted)', lineHeight: 'var(--gv-leading-normal)' }}>{issue.suggestedAction}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {asset.audit.legalReviewCount > 0 && (
        <p className="mt-3 inline-flex items-center gap-1.5" style={{ fontSize: '10px', color: 'var(--gv-gold)' }}>
          <FileText size={11} /> {asset.audit.legalReviewCount} item(s) — Legal Review Recommended.
        </p>
      )}

      <Button variant="secondary" size="md" block className="mt-4" onClick={onOpenAuditor} leadingIcon={<Sparkles size={15} />}>
        Open full AI Catalog Auditor
      </Button>
    </div>
  )
}

/* ───────────────── page ───────────────── */

export default function Review() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [tab, setTab] = useState<Tab>('audio')

  const run = useCallback(async () => {
    setStatus('loading')
    try {
      const r = await loadReviewAsset(user?.id, id, profile?.username ?? 'You')
      setResult(r)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [user?.id, id, profile?.username])

  useEffect(() => { run() }, [run])

  const asset = result?.asset
  const headerSub = useMemo(() => asset ? `${asset.typeLabel} · ${asset.composerName}` : '', [asset])

  return (
    <GovernanceScope className="min-h-screen">
      <div className="max-w-md mx-auto relative" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Header */}
        <header className="sticky top-0 z-20 safe-top" style={{ background: 'color-mix(in srgb, var(--gv-bg) 86%, transparent)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--gv-border-faint)' }}>
          <div className="flex items-center gap-3 px-5" style={{ height: 56 }}>
            <button onClick={() => navigate(-1)} aria-label="Back" className="gv-focusable grid place-items-center min-touch -ml-2" style={{ color: 'var(--gv-text-secondary)', borderRadius: 'var(--gv-radius-md)' }}>
              <ArrowLeft size={21} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="gv-eyebrow">MUSVORA · Asset Review</p>
              <h1 className="font-bold leading-none truncate" style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-md)', color: 'var(--gv-text)' }}>
                Governance Player
              </h1>
            </div>
            <button onClick={run} aria-label="Reload" className="gv-focusable grid place-items-center min-touch -mr-2" style={{ color: 'var(--gv-text-secondary)', borderRadius: 'var(--gv-radius-md)' }}>
              <RefreshCw size={18} className={status === 'loading' ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="px-5">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center text-center py-20" role="status" aria-live="polite">
              <div className="relative w-9 h-9 mb-4">
                <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--gv-border)' }} />
                <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--gv-gold)' }} />
              </div>
              <p className="gv-eyebrow">Pending Analysis</p>
              <p className="mt-1" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>Preparing asset review…</p>
            </div>
          )}

          {status === 'error' && (
            <Card padding="lg" className="mt-4" accent="danger">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-danger-soft)', color: 'var(--gv-danger)' }}><AlertTriangle size={18} /></span>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1" style={{ fontSize: 'var(--gv-text-base)', color: 'var(--gv-text)' }}>Could not load asset</h3>
                  <p className="mb-3" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>We couldn't prepare this review right now.</p>
                  <Button variant="secondary" size="sm" onClick={run} leadingIcon={<RefreshCw size={14} />}>Retry</Button>
                </div>
              </div>
            </Card>
          )}

          {status === 'ready' && asset && result && (
            <>
              {/* Source banner */}
              <div className="flex items-center gap-2.5 mt-4 mb-4" style={{ background: result.source === 'vault' ? 'var(--gv-success-soft)' : 'var(--gv-surface-2)', border: '1px solid var(--gv-border-faint)', borderRadius: 'var(--gv-radius-md)', padding: 'var(--gv-space-3)' }}>
                <Database size={15} style={{ color: result.source === 'vault' ? 'var(--gv-success)' : 'var(--gv-text-muted)', flexShrink: 0 }} aria-hidden />
                <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)' }}>
                  {result.source === 'vault'
                    ? <>Reviewing a <strong style={{ color: 'var(--gv-text)' }}>real Vault asset</strong>.</>
                    : <><strong style={{ color: 'var(--gv-text)' }}>Sample asset</strong> — sign in and open a work from your Vault to review real data.</>}
                </p>
              </div>

              {/* Title + status strip */}
              <div className="mb-4">
                <h2 className="font-bold leading-tight" style={{ fontSize: 'var(--gv-text-xl)', color: 'var(--gv-text)', fontFamily: 'var(--gv-font-display)' }}>{asset.title}</h2>
                <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-muted)' }}>{headerSub}</p>
              </div>
              <div className="mb-5"><StatusGrid asset={asset} /></div>

              {/* Disclaimer */}
              <Card padding="sm" className="mb-5" accent="gold">
                <div className="flex items-start gap-2.5">
                  <Info size={15} style={{ color: 'var(--gv-gold)', flexShrink: 0, marginTop: 2 }} aria-hidden />
                  <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>
                    An Asset Review surface for listening, verifying and evaluating. All governance signals <strong style={{ color: 'var(--gv-text)' }}>Require Confirmation</strong> and may need Legal Review — they are not a legal determination.
                  </p>
                </div>
              </Card>

              {/* Tabs */}
              <div role="tablist" aria-label="Asset review" className="flex gap-1 mb-5" style={{ background: 'var(--gv-surface-2)', borderRadius: 'var(--gv-radius-md)', padding: 4 }}>
                {TABS.map(t => {
                  const active = tab === t.id
                  return (
                    <button
                      key={t.id} role="tab" aria-selected={active} onClick={() => setTab(t.id)}
                      className="gv-focusable flex-1 font-semibold"
                      style={{
                        fontSize: 'var(--gv-text-2xs)', padding: '7px 4px', borderRadius: 'var(--gv-radius-sm)',
                        background: active ? 'var(--gv-surface)' : 'transparent',
                        color: active ? 'var(--gv-text)' : 'var(--gv-text-muted)',
                        border: active ? '1px solid var(--gv-border)' : '1px solid transparent',
                        transition: 'all 150ms var(--gv-ease)',
                      }}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>

              <div className="pb-2">
                {tab === 'audio' && <AudioTab asset={asset} />}
                {tab === 'metadata' && <MetadataTab asset={asset} />}
                {tab === 'ownership' && <OwnershipTab asset={asset} />}
                {tab === 'readiness' && <ReadinessTab asset={asset} onOpenAuditor={() => navigate('/auditor')} />}
              </div>
            </>
          )}
        </div>

        {/* Sticky CTA */}
        {status === 'ready' && asset && (
          <div className="fixed bottom-0 inset-x-0 z-20" style={{ background: 'linear-gradient(to top, var(--gv-bg) 62%, transparent)', paddingBottom: 'calc(var(--gv-space-4) + env(safe-area-inset-bottom, 0px))', paddingTop: 'var(--gv-space-6)' }}>
            <div className="max-w-md mx-auto px-5 grid gap-2.5">
              <Button variant="primary" size="lg" block onClick={() => navigate(`/passport/${asset.id}`)} leadingIcon={<ShieldCheck size={17} strokeWidth={2.4} />} trailingIcon={<ArrowRight size={17} strokeWidth={2.4} />} style={{ letterSpacing: '0.08em' }}>
                OPEN SONG PASSPORT
              </Button>
              <Button variant="secondary" size="lg" block onClick={() => navigate('/ownership')} leadingIcon={<Users size={17} strokeWidth={2.4} />} style={{ letterSpacing: '0.08em' }}>
                OWNERSHIP CONFIDENCE
              </Button>
            </div>
          </div>
        )}
      </div>
    </GovernanceScope>
  )
}
