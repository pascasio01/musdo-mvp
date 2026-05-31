import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Music,
  FileText,
  AlignLeft,
  Database,
  Check,
  Minus,
  X,
  ScanLine,
  Radio,
  Scale,
  Copyright,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GovernanceScope, Button, Card, Badge, SectionHeader } from '../components/governance'
import { ReadinessRing } from '../components/readiness/ReadinessRing'
import { STATUS_META } from '../data/readiness'
import {
  runCatalogScan,
  FILE_KIND_META,
  SCAN_ELEMENT_ORDER,
  SEVERITY_META,
  SAMPLE_FILES,
  type UploadedFile,
  type ScanFileKind,
  type ScanResult,
  type ScanCategory,
  type ElementStatus,
} from '../data/scan'

type Stage = 'upload' | 'scanning' | 'result'

const KIND_ICONS: Record<ScanFileKind, LucideIcon> = {
  audio: Music,
  contract: FileText,
  lyrics: AlignLeft,
  metadata: Database,
}

const CATEGORY_ICONS: Record<ScanCategory['id'], LucideIcon> = {
  distribution: Radio,
  licensing: Scale,
  copyright: Copyright,
  monetization: DollarSign,
}

const ELEMENT_STATUS_META: Record<
  ElementStatus,
  { tone: 'success' | 'warning' | 'danger'; color: string; soft: string; Icon: LucideIcon }
> = {
  detected: { tone: 'success', color: 'var(--gv-success)', soft: 'var(--gv-success-soft)', Icon: Check },
  partial: { tone: 'warning', color: 'var(--gv-warning)', soft: 'var(--gv-warning-soft)', Icon: Minus },
  missing: { tone: 'danger', color: 'var(--gv-danger)', soft: 'var(--gv-danger-soft)', Icon: X },
}

const STAGE_STEPS: { stage: Stage; label: string }[] = [
  { stage: 'upload', label: 'Upload' },
  { stage: 'scanning', label: 'Scan' },
  { stage: 'result', label: 'Result' },
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ───────────────────────── small primitives ───────────────────────── */

function ScoreBar({ value, color, label }: { value: number; color: string; label?: string }) {
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

function StepIndicator({ active }: { active: Stage }) {
  const activeIndex = STAGE_STEPS.findIndex(s => s.stage === active)
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {STAGE_STEPS.map((s, i) => {
        const done = i < activeIndex
        const current = i === activeIndex
        return (
          <div key={s.stage} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className="grid place-items-center gv-mono font-bold transition-all"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  fontSize: '10px',
                  background: done || current ? 'var(--gv-white)' : 'var(--gv-inset)',
                  color: done || current ? 'var(--gv-text-inverse)' : 'var(--gv-text-muted)',
                }}
              >
                {done ? <Check size={11} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className="font-semibold"
                style={{
                  fontSize: 'var(--gv-text-2xs)',
                  color: current ? 'var(--gv-text)' : 'var(--gv-text-muted)',
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STAGE_STEPS.length - 1 && (
              <span style={{ width: 14, height: 1, background: 'var(--gv-border)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ───────────────────────── stage: upload ───────────────────────── */

function UploadStage({
  files,
  onAdd,
  onRemove,
  onAddSamples,
  onClear,
}: {
  files: UploadedFile[]
  onAdd: (kind: ScanFileKind, list: FileList) => void
  onRemove: (id: string) => void
  onAddSamples: () => void
  onClear: () => void
}) {
  const inputs = useRef<Record<ScanFileKind, HTMLInputElement | null>>({
    audio: null,
    contract: null,
    lyrics: null,
    metadata: null,
  })

  return (
    <div className="px-5">
      <SectionHeader
        eyebrow="Step 1"
        title="Upload your catalog"
        description="Add the material for one work. Files are analyzed on-device for this preview — nothing is uploaded."
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        {(Object.keys(FILE_KIND_META) as ScanFileKind[]).map(kind => {
          const meta = FILE_KIND_META[kind]
          const Icon = KIND_ICONS[kind]
          const count = files.filter(f => f.kind === kind).length
          return (
            <div key={kind}>
              <input
                ref={el => { inputs.current[kind] = el }}
                type="file"
                multiple
                accept={meta.accept}
                className="hidden"
                onChange={e => {
                  if (e.target.files?.length) onAdd(kind, e.target.files)
                  e.target.value = ''
                }}
              />
              <button
                onClick={() => inputs.current[kind]?.click()}
                className="gv-focusable w-full text-left transition-all active:scale-[0.98]"
                style={{
                  background: 'var(--gv-surface)',
                  border: '1px dashed var(--gv-border)',
                  borderRadius: 'var(--gv-radius-xl)',
                  padding: 'var(--gv-space-4)',
                  minHeight: 132,
                }}
              >
                <span
                  className="grid place-items-center mb-3"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--gv-radius-md)',
                    background: 'var(--gv-inset)',
                    color: 'var(--gv-text-secondary)',
                  }}
                >
                  <Icon size={19} strokeWidth={2} />
                </span>
                <p className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>
                  {meta.label}
                </p>
                <p className="mt-0.5" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', lineHeight: 'var(--gv-leading-normal)' }}>
                  {meta.hint}
                </p>
                <span className="inline-flex items-center gap-1 mt-2" style={{ fontSize: 'var(--gv-text-2xs)', color: count ? 'var(--gv-success)' : 'var(--gv-text-link)', fontWeight: 600 }}>
                  {count ? <><Check size={12} strokeWidth={3} /> {count} added</> : <><Plus size={12} strokeWidth={3} /> Add files</>}
                </span>
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={onAddSamples}
        className="gv-focusable w-full mb-6"
        style={{
          background: 'var(--gv-gold-soft)',
          color: 'var(--gv-gold)',
          border: '1px solid color-mix(in srgb, var(--gv-gold) 30%, transparent)',
          borderRadius: 'var(--gv-radius-md)',
          padding: 'var(--gv-space-3)',
          fontSize: 'var(--gv-text-sm)',
          fontWeight: 600,
        }}
      >
        Load sample catalog
      </button>

      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="gv-eyebrow">Queued · {files.length}</p>
            <button
              onClick={onClear}
              className="gv-focusable inline-flex items-center gap-1"
              style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)', fontWeight: 600 }}
            >
              <Trash2 size={12} /> Clear all
            </button>
          </div>
          <Card padding="none" className="overflow-hidden mb-2">
            {files.map((f, i) => {
              const Icon = KIND_ICONS[f.kind]
              return (
                <div
                  key={f.id}
                  className="flex items-center gap-3"
                  style={{
                    padding: 'var(--gv-space-3) var(--gv-space-4)',
                    borderTop: i === 0 ? 'none' : '1px solid var(--gv-border-faint)',
                  }}
                >
                  <span
                    className="grid place-items-center flex-shrink-0"
                    style={{ width: 30, height: 30, borderRadius: 'var(--gv-radius-sm)', background: 'var(--gv-inset)', color: 'var(--gv-text-secondary)' }}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{f.name}</p>
                    <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{FILE_KIND_META[f.kind].label} · {formatSize(f.size)}</p>
                  </div>
                  <button
                    onClick={() => onRemove(f.id)}
                    aria-label={`Remove ${f.name}`}
                    className="gv-focusable grid place-items-center flex-shrink-0"
                    style={{ width: 30, height: 30, borderRadius: 'var(--gv-radius-sm)', color: 'var(--gv-text-muted)' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )
            })}
          </Card>
        </>
      )}
    </div>
  )
}

/* ───────────────────────── stage: scanning ───────────────────────── */

function ScanningStage({ progress }: { progress: number }) {
  const total = SCAN_ELEMENT_ORDER.length
  const current = Math.min(total, Math.floor((progress / 100) * total))
  return (
    <div className="px-5 pt-4">
      <SectionHeader eyebrow="Step 2" title="Scanning catalog" description="Detecting the asset elements present in your material." />

      <div className="flex flex-col items-center text-center py-6">
        <ReadinessRing value={progress} color="var(--gv-gold)" ariaLabel={`Scan progress ${Math.round(progress)} percent`}>
          <ScanLine size={30} style={{ color: 'var(--gv-gold)' }} />
          <span className="gv-mono font-bold mt-2" style={{ fontSize: 'var(--gv-text-xl)', color: 'var(--gv-text)' }}>{Math.round(progress)}%</span>
        </ReadinessRing>
        <p className="mt-5" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>
          Analyzing {current} of {total} elements…
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        {SCAN_ELEMENT_ORDER.map((el, i) => {
          const checked = i < current
          return (
            <div
              key={el.key}
              className="flex items-center gap-3"
              style={{
                padding: 'var(--gv-space-3) var(--gv-space-4)',
                borderTop: i === 0 ? 'none' : '1px solid var(--gv-border-faint)',
                opacity: checked ? 1 : 0.4,
                transition: 'opacity 300ms var(--gv-ease)',
              }}
            >
              <span
                className="grid place-items-center flex-shrink-0"
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: checked ? 'var(--gv-success-soft)' : 'var(--gv-inset)',
                  color: checked ? 'var(--gv-success)' : 'var(--gv-text-faint)',
                }}
              >
                {checked && <Check size={11} strokeWidth={3} />}
              </span>
              <span style={{ fontSize: 'var(--gv-text-sm)', color: checked ? 'var(--gv-text)' : 'var(--gv-text-muted)' }}>{el.label}</span>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

/* ───────────────────────── stage: result ───────────────────────── */

function ResultStage({ result }: { result: ScanResult }) {
  const overallMeta = STATUS_META[result.status]
  return (
    <div className="px-5">
      {/* Step 3 — Readiness Result */}
      <section className="flex flex-col items-center text-center pt-4 pb-6">
        <p className="gv-eyebrow mb-1">Step 3</p>
        <p className="gv-eyebrow mb-5">Overall Readiness Score</p>
        <ReadinessRing
          value={result.overallScore}
          color={overallMeta.color}
          ariaLabel={`Overall readiness score ${result.overallScore} out of 100 — ${overallMeta.label}`}
        >
          <span className="gv-mono font-extrabold leading-none" style={{ fontSize: 'var(--gv-text-4xl)', color: 'var(--gv-text)' }}>
            {result.overallScore}
          </span>
          <span className="gv-eyebrow mt-1">out of 100</span>
        </ReadinessRing>
        <div className="mt-5">
          <Badge tone={overallMeta.tone} variant="outline">{overallMeta.label}</Badge>
        </div>
        <p className="mt-3" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)', maxWidth: '34ch' }}>
          Scanned {result.fileCount} {result.fileCount === 1 ? 'file' : 'files'} · {result.summary.detected} detected,{' '}
          {result.summary.partial} partial, {result.summary.missing} missing of {result.elements.length} elements.
        </p>
      </section>

      {/* category readiness */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {result.categories.map(cat => {
          const meta = STATUS_META[cat.status]
          const Icon = CATEGORY_ICONS[cat.id]
          return (
            <Card key={cat.id} padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="grid place-items-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 'var(--gv-radius-sm)', background: meta.soft, color: meta.color }}>
                  <Icon size={15} strokeWidth={2} />
                </span>
                <span className="gv-mono font-bold leading-none" style={{ fontSize: 'var(--gv-text-lg)', color: meta.color }}>{cat.score}</span>
              </div>
              <p className="font-semibold mb-2" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{cat.label}</p>
              <ScoreBar value={cat.score} color={meta.color} label={`${cat.label} score`} />
              <div className="mt-2">
                <Badge tone={cat.ready ? 'success' : meta.tone}>{cat.ready ? 'Ready' : meta.label}</Badge>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Step 2 result — element detection */}
      <SectionHeader eyebrow="Step 2 · Analysis" title="Detected elements" description="What the scan found inside your catalog." />
      <Card padding="none" className="overflow-hidden mb-8">
        {result.elements.map((el, i) => {
          const meta = ELEMENT_STATUS_META[el.status]
          const Icon = meta.Icon
          return (
            <div
              key={el.key}
              className="flex items-center gap-3"
              style={{ padding: 'var(--gv-space-3) var(--gv-space-4)', borderTop: i === 0 ? 'none' : '1px solid var(--gv-border-faint)' }}
            >
              <span className="grid place-items-center flex-shrink-0" style={{ width: 22, height: 22, borderRadius: '50%', background: meta.soft, color: meta.color }}>
                <Icon size={12} strokeWidth={3} />
              </span>
              <span className="flex-1 min-w-0 font-medium truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{el.label}</span>
              <Badge tone={meta.tone}>{el.detail}</Badge>
            </div>
          )
        })}
      </Card>

      {/* Step 4 — Detected Issues */}
      <SectionHeader
        eyebrow="Step 4 · Issues"
        title={result.issues.length ? `${result.issues.length} issues detected` : 'No issues detected'}
        description={result.issues.length ? 'Gaps that reduce readiness, most severe first.' : 'Every monitored element passed this scan.'}
      />
      {result.issues.length > 0 ? (
        <div className="grid gap-2.5 mb-8">
          {result.issues.map(issue => {
            const sev = SEVERITY_META[issue.severity]
            return (
              <Card key={issue.id} padding="md" accent={sev.tone}>
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 'var(--gv-radius-sm)', background: sev.soft, color: sev.color }}>
                    <AlertTriangle size={15} strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{issue.title}</h3>
                      <Badge tone={sev.tone}>{sev.label}</Badge>
                    </div>
                    <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>{issue.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card padding="lg" className="mb-8">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 'var(--gv-radius-md)', background: 'var(--gv-success-soft)', color: 'var(--gv-success)' }}>
              <Check size={18} strokeWidth={3} />
            </span>
            <p style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text-secondary)' }}>This catalog is clear of detectable readiness gaps.</p>
          </div>
        </Card>
      )}

      {/* Step 5 — Recommendations */}
      {result.recommendations.length > 0 && (
        <>
          <SectionHeader eyebrow="Step 5 · Recommendations" title="Priority actions" description="Ordered by impact on your readiness score." />
          <div className="grid gap-2.5 mb-2">
            {result.recommendations.map(rec => {
              const sev = SEVERITY_META[rec.priority]
              return (
                <Card key={rec.id} padding="md">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 'var(--gv-radius-sm)', background: sev.soft, color: sev.color }}>
                      <Lightbulb size={15} strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge tone={sev.tone}>{sev.label}</Badge>
                        <h3 className="font-semibold truncate" style={{ fontSize: 'var(--gv-text-sm)', color: 'var(--gv-text)' }}>{rec.title}</h3>
                      </div>
                      <p style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-secondary)', lineHeight: 'var(--gv-leading-normal)' }}>{rec.action}</p>
                      <p className="mt-1.5 inline-flex items-center gap-1" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-success)', fontWeight: 600 }}>
                        <ArrowRight size={11} strokeWidth={2.5} /> {rec.impact}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* ───────────────────────── page ───────────────────────── */

let fileSeq = 0

export default function Scan() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('upload')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)

  const addFiles = (kind: ScanFileKind, list: FileList) => {
    const added: UploadedFile[] = Array.from(list).map(f => ({
      id: `f${fileSeq++}`,
      name: f.name,
      kind,
      size: f.size,
    }))
    setFiles(prev => [...prev, ...added])
  }
  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))
  const addSamples = () => setFiles(SAMPLE_FILES.map(f => ({ ...f, id: `f${fileSeq++}` })))
  const clearFiles = () => setFiles([])

  const startScan = () => {
    setStage('scanning')
    setProgress(0)
  }

  const resetScan = () => {
    setStage('upload')
    setProgress(0)
    setResult(null)
  }

  // Drive the scanning animation, then compute the (mock) result.
  useEffect(() => {
    if (stage !== 'scanning') return
    const started = performance.now()
    const DURATION = 2200
    let raf = 0
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - started) / DURATION) * 100)
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setResult(runCatalogScan(files))
        setStage('result')
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stage, files])

  const headerSubtitle =
    stage === 'upload' ? 'Step 1 of 3' : stage === 'scanning' ? 'Step 2 of 3' : 'Steps 3–5 · Assessment'

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
              <p className="gv-eyebrow">MUSVORA</p>
              <h1
                className="font-bold leading-none truncate"
                style={{ fontFamily: 'var(--gv-font-display)', fontSize: 'var(--gv-text-md)', color: 'var(--gv-text)' }}
              >
                Catalog Scan Engine
              </h1>
            </div>
            <span className="flex-shrink-0" style={{ fontSize: 'var(--gv-text-2xs)', color: 'var(--gv-text-muted)' }}>{headerSubtitle}</span>
          </div>
          <div className="px-5 pb-3 flex justify-center">
            <StepIndicator active={stage} />
          </div>
        </header>

        <div className="pt-4">
          {stage === 'upload' && (
            <UploadStage
              files={files}
              onAdd={addFiles}
              onRemove={removeFile}
              onAddSamples={addSamples}
              onClear={clearFiles}
            />
          )}
          {stage === 'scanning' && <ScanningStage progress={progress} />}
          {stage === 'result' && result && <ResultStage result={result} />}
        </div>

        {/* Sticky primary CTA */}
        {stage !== 'scanning' && (
          <div
            className="fixed bottom-0 inset-x-0 z-20"
            style={{
              background: 'linear-gradient(to top, var(--gv-bg) 62%, transparent)',
              paddingBottom: 'calc(var(--gv-space-4) + env(safe-area-inset-bottom, 0px))',
              paddingTop: 'var(--gv-space-6)',
            }}
          >
            <div className="max-w-md mx-auto px-5">
              {stage === 'upload' ? (
                <Button
                  variant="primary"
                  size="lg"
                  block
                  disabled={files.length === 0}
                  onClick={startScan}
                  leadingIcon={<ScanLine size={17} strokeWidth={2.4} />}
                  trailingIcon={<ArrowRight size={17} strokeWidth={2.4} />}
                  style={{ letterSpacing: '0.08em' }}
                >
                  RUN CATALOG SCAN
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  block
                  onClick={resetScan}
                  leadingIcon={<RotateCcw size={16} strokeWidth={2.4} />}
                  style={{ letterSpacing: '0.06em' }}
                >
                  SCAN ANOTHER CATALOG
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </GovernanceScope>
  )
}
