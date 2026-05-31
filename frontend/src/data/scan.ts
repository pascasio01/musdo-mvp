/**
 * MUSVORA — Catalog Scan Engine V1 (Sprint 3).
 *
 * MOCK ANALYSIS ENGINE. No backend, no business logic, no AI. This module is
 * the single architectural seam between the Catalog Scan UI and a future real
 * analysis service: the UI only ever calls `runCatalogScan(files)` and renders
 * the returned `ScanResult`. When the real engine lands, replace the body of
 * `runCatalogScan` — the types and the UI contract stay the same.
 */

import type { ReadinessStatus } from './readiness'
import { scoreStatus } from './readiness'

/* ─────────────────────────── Inputs ─────────────────────────── */

/** The kinds of material a creator can submit for a scan. */
export type ScanFileKind = 'audio' | 'contract' | 'lyrics' | 'metadata'

export interface UploadedFile {
  id: string
  name: string
  kind: ScanFileKind
  /** Size in bytes (display only — file contents are never read or uploaded). */
  size: number
}

export const FILE_KIND_META: Record<
  ScanFileKind,
  { label: string; hint: string; accept: string }
> = {
  audio: { label: 'Audio files', hint: 'Masters, demos, instrumentals, stems', accept: 'audio/*' },
  contract: { label: 'PDF contracts', hint: 'Split sheets, licenses, registrations', accept: 'application/pdf,.pdf' },
  lyrics: { label: 'Lyrics files', hint: 'Lyric sheets and toplines', accept: '.txt,.doc,.docx,.pdf,text/plain' },
  metadata: { label: 'Metadata files', hint: 'CSV / JSON credits & identifiers', accept: '.csv,.json,.xml,text/csv,application/json' },
}

/* ─────────────────────────── Elements ───────────────────────── */

/** The 14 asset elements the engine looks for inside a catalog. */
export type ScanElementKey =
  | 'title'
  | 'artist'
  | 'composer'
  | 'producer'
  | 'isrc'
  | 'iswc'
  | 'splitSheet'
  | 'copyrightReg'
  | 'master'
  | 'demo'
  | 'instrumental'
  | 'stems'
  | 'lyrics'
  | 'contracts'

export type ElementStatus = 'detected' | 'partial' | 'missing'

export interface ScanElement {
  key: ScanElementKey
  label: string
  status: ElementStatus
  detail: string
}

interface ElementSpec {
  key: ScanElementKey
  label: string
  /** Which uploaded material proves this element exists. */
  source: ScanFileKind
  /** Status assigned when the source material is present in the upload. */
  whenPresent: ElementStatus
}

/**
 * The element catalog the scanner walks. `whenPresent` lets the mock engine
 * stay realistic: uploading audio proves a master, but an instrumental version
 * still has to be found separately — so it can remain missing.
 */
const ELEMENT_SPECS: ElementSpec[] = [
  { key: 'title', label: 'Title', source: 'metadata', whenPresent: 'detected' },
  { key: 'artist', label: 'Artist', source: 'metadata', whenPresent: 'detected' },
  { key: 'composer', label: 'Composer', source: 'metadata', whenPresent: 'detected' },
  { key: 'producer', label: 'Producer', source: 'metadata', whenPresent: 'partial' },
  { key: 'isrc', label: 'ISRC', source: 'metadata', whenPresent: 'detected' },
  { key: 'iswc', label: 'ISWC', source: 'metadata', whenPresent: 'partial' },
  { key: 'splitSheet', label: 'Split Sheet', source: 'contract', whenPresent: 'partial' },
  { key: 'copyrightReg', label: 'Copyright Registration', source: 'contract', whenPresent: 'detected' },
  { key: 'master', label: 'Master', source: 'audio', whenPresent: 'detected' },
  { key: 'demo', label: 'Demo', source: 'audio', whenPresent: 'detected' },
  { key: 'instrumental', label: 'Instrumental', source: 'audio', whenPresent: 'missing' },
  { key: 'stems', label: 'Stems', source: 'audio', whenPresent: 'partial' },
  { key: 'lyrics', label: 'Lyrics', source: 'lyrics', whenPresent: 'detected' },
  { key: 'contracts', label: 'Contracts', source: 'contract', whenPresent: 'detected' },
]

/** Stable ordered list of the elements the engine reports on (for the UI). */
export const SCAN_ELEMENT_ORDER: { key: ScanElementKey; label: string }[] = ELEMENT_SPECS.map(
  ({ key, label }) => ({ key, label }),
)

/* ─────────────────────────── Categories ─────────────────────── */

export type ScanCategoryId = 'distribution' | 'licensing' | 'copyright' | 'monetization'

export interface ScanCategory {
  id: ScanCategoryId
  label: string
  score: number
  ready: boolean
  status: ReadinessStatus
  /** Elements that feed this category. */
  elements: ScanElementKey[]
}

const CATEGORY_SPECS: { id: ScanCategoryId; label: string; elements: ScanElementKey[] }[] = [
  { id: 'distribution', label: 'Distribution Ready', elements: ['title', 'artist', 'isrc', 'master'] },
  { id: 'licensing', label: 'Licensing Ready', elements: ['contracts', 'splitSheet', 'producer', 'stems'] },
  { id: 'copyright', label: 'Copyright Ready', elements: ['copyrightReg', 'splitSheet', 'iswc', 'composer', 'lyrics'] },
  { id: 'monetization', label: 'Monetization Ready', elements: ['isrc', 'master', 'contracts', 'demo', 'instrumental'] },
]

/* ─────────────────────────── Issues + recs ──────────────────── */

export type Severity = 'high' | 'medium' | 'low'

export interface ScanIssue {
  id: string
  title: string
  severity: Severity
  description: string
}

export interface Recommendation {
  id: string
  priority: Severity
  title: string
  action: string
  impact: string
}

export const SEVERITY_META: Record<
  Severity,
  { label: string; tone: 'danger' | 'warning' | 'success'; color: string; soft: string }
> = {
  high: { label: 'HIGH', tone: 'danger', color: 'var(--gv-danger)', soft: 'var(--gv-danger-soft)' },
  medium: { label: 'MEDIUM', tone: 'warning', color: 'var(--gv-warning)', soft: 'var(--gv-warning-soft)' },
  low: { label: 'LOW', tone: 'success', color: 'var(--gv-success)', soft: 'var(--gv-success-soft)' },
}

/* ─────────────────────────── Result ─────────────────────────── */

export interface ScanResult {
  fileCount: number
  overallScore: number
  status: ReadinessStatus
  elements: ScanElement[]
  categories: ScanCategory[]
  issues: ScanIssue[]
  recommendations: Recommendation[]
  summary: { detected: number; partial: number; missing: number }
}

const STATUS_SCORE: Record<ElementStatus, number> = { detected: 1, partial: 0.5, missing: 0 }

const ELEMENT_DETAIL: Record<ElementStatus, string> = {
  detected: 'Found in catalog',
  partial: 'Found, incomplete',
  missing: 'Not found',
}

/**
 * How a missing/partial element surfaces as a detected issue + recommendation.
 * Only elements that materially block readiness are escalated.
 */
const ISSUE_RULES: {
  key: ScanElementKey
  /** Escalate when the element is at or below this confidence. */
  when: ElementStatus[]
  severity: Severity
  issue: string
  description: string
  recommendation: string
  action: string
  impact: string
}[] = [
  {
    key: 'isrc',
    when: ['missing', 'partial'],
    severity: 'high',
    issue: 'Missing ISRC',
    description: 'One or more recordings have no ISRC, blocking store delivery and play tracking.',
    recommendation: 'Assign ISRC codes',
    action: 'Generate or import an ISRC for every recording before distribution.',
    impact: 'Unblocks distribution and accurate streaming royalties.',
  },
  {
    key: 'splitSheet',
    when: ['missing', 'partial'],
    severity: 'high',
    issue: 'Missing Split Sheet',
    description: 'Contributor splits are unsigned or incomplete, exposing the work to ownership disputes.',
    recommendation: 'Complete the split sheet',
    action: 'Confirm and collect signatures from every contributor on the ownership split.',
    impact: 'Secures ownership confidence and clean royalty payouts.',
  },
  {
    key: 'copyrightReg',
    when: ['missing'],
    severity: 'high',
    issue: 'Copyright Not Registered',
    description: 'The composition is not registered, weakening legal protection of the work.',
    recommendation: 'Register the copyright',
    action: 'File the composition with the relevant copyright office or PRO.',
    impact: 'Establishes enforceable ownership and protection.',
  },
  {
    key: 'contracts',
    when: ['missing'],
    severity: 'high',
    issue: 'Missing Contract',
    description: 'No underlying agreement was found to govern licensing and revenue.',
    recommendation: 'Attach the governing contract',
    action: 'Upload the signed agreement covering this work before licensing it.',
    impact: 'Enables compliant licensing and monetization.',
  },
  {
    key: 'instrumental',
    when: ['missing'],
    severity: 'medium',
    issue: 'No Instrumental Version',
    description: 'An instrumental was not found, limiting sync and licensing opportunities.',
    recommendation: 'Add an instrumental version',
    action: 'Export and attach an instrumental mix to widen licensing reach.',
    impact: 'Opens sync, film and ad licensing revenue.',
  },
  {
    key: 'iswc',
    when: ['missing', 'partial'],
    severity: 'medium',
    issue: 'Missing ISWC',
    description: 'The composition has no ISWC, reducing global royalty matching accuracy.',
    recommendation: 'Assign an ISWC',
    action: 'Request an ISWC through your PRO for the composition.',
    impact: 'Improves worldwide royalty collection.',
  },
  {
    key: 'stems',
    when: ['missing', 'partial'],
    severity: 'low',
    issue: 'Incomplete Stems',
    description: 'Full stem sets were not found, limiting remix and sync flexibility.',
    recommendation: 'Upload complete stems',
    action: 'Add the full stem package for the recording.',
    impact: 'Adds remix and adaptation licensing options.',
  },
  {
    key: 'producer',
    when: ['missing', 'partial'],
    severity: 'low',
    issue: 'Incomplete Producer Credit',
    description: 'Producer credits are missing or incomplete in the metadata.',
    recommendation: 'Complete producer credits',
    action: 'Add the full producer credit to the catalog metadata.',
    impact: 'Strengthens credit accuracy and discoverability.',
  },
]

function roundScore(n: number): number {
  return Math.round(n)
}

/**
 * Run a mock catalog scan against the submitted files.
 *
 * Deterministic and pure: the same files always produce the exact same result
 * (no wall-clock or randomness). Element detection reacts to the *kinds* of
 * material provided so the result feels like a real analysis without any
 * backend, file reading, or AI.
 */
export function runCatalogScan(files: UploadedFile[]): ScanResult {
  const presentKinds = new Set(files.map(f => f.kind))

  // 1. Resolve each element's status from the available material.
  const elements: ScanElement[] = ELEMENT_SPECS.map(spec => {
    const status: ElementStatus = presentKinds.has(spec.source) ? spec.whenPresent : 'missing'
    return { key: spec.key, label: spec.label, status, detail: ELEMENT_DETAIL[status] }
  })
  const byKey = new Map(elements.map(e => [e.key, e] as const))

  // 2. Score each readiness category from its contributing elements.
  const categories: ScanCategory[] = CATEGORY_SPECS.map(spec => {
    const scores = spec.elements.map(k => STATUS_SCORE[byKey.get(k)!.status])
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const score = roundScore(avg * 100)
    return {
      id: spec.id,
      label: spec.label,
      score,
      ready: score >= 80,
      status: scoreStatus(score),
      elements: spec.elements,
    }
  })

  // 3. Overall readiness = mean of category scores.
  const overallScore = roundScore(
    categories.reduce((a, c) => a + c.score, 0) / categories.length,
  )

  // 4. Detected issues + prioritized recommendations from unmet elements.
  const issues: ScanIssue[] = []
  const recommendations: Recommendation[] = []
  for (const rule of ISSUE_RULES) {
    const el = byKey.get(rule.key)!
    if (rule.when.includes(el.status)) {
      issues.push({
        id: `issue-${rule.key}`,
        title: rule.issue,
        severity: rule.severity,
        description: rule.description,
      })
      recommendations.push({
        id: `rec-${rule.key}`,
        priority: rule.severity,
        title: rule.recommendation,
        action: rule.action,
        impact: rule.impact,
      })
    }
  }
  const order: Severity[] = ['high', 'medium', 'low']
  issues.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity))
  recommendations.sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority))

  // 5. Element summary tally.
  const summary = {
    detected: elements.filter(e => e.status === 'detected').length,
    partial: elements.filter(e => e.status === 'partial').length,
    missing: elements.filter(e => e.status === 'missing').length,
  }

  return {
    fileCount: files.length,
    overallScore,
    status: scoreStatus(overallScore),
    elements,
    categories,
    issues,
    recommendations,
    summary,
  }
}

/** Sample files offered in the UI so the engine can be demoed without a real upload. */
export const SAMPLE_FILES: UploadedFile[] = [
  { id: 's1', name: 'midnight_bachata_master.wav', kind: 'audio', size: 48_210_944 },
  { id: 's2', name: 'midnight_bachata_demo.mp3', kind: 'audio', size: 7_340_032 },
  { id: 's3', name: 'credits_metadata.csv', kind: 'metadata', size: 12_288 },
  { id: 's4', name: 'license_agreement.pdf', kind: 'contract', size: 284_672 },
  { id: 's5', name: 'lyrics_sheet.txt', kind: 'lyrics', size: 4_096 },
]
