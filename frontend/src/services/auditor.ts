/**
 * MUSVORA AI Catalog Auditor — V1 engine.
 *
 * The first REAL MUSVORA AI Core module. It analyzes the user's actual Vault
 * catalogue (Demos + Lyrics from Supabase) and flags missing readiness items.
 *
 * Honesty rules (MANDATORY — see replit.md › MUSVORA AI Core):
 *  - This module AUDITS and SUGGESTS. It never certifies ownership, never gives
 *    legal advice, never guarantees recovery, never invents financial claims.
 *  - Output language is limited to: Potential Issue · Suggested Action ·
 *    Pending Analysis · Requires Confirmation · Legal Review Recommended.
 *  - Where the data model genuinely does not store a field (e.g. ISRC, contracts,
 *    split sheets), the auditor reports it as a Potential Issue — it does not
 *    fabricate a value.
 *  - When no real catalogue exists, a clearly-labelled internal SAMPLE is used.
 *
 * Pure module: no console logging of user content, no exposure of private file
 * URLs. Reusable by /readiness and /scan in future sprints.
 */
import type { Demo, Lyrics } from '../types'
import { vaultService } from './vault.service'
import { scoreStatus, type ReadinessStatus } from '../data/readiness'

export type AuditPriority = 'critical' | 'high' | 'medium' | 'low'
export type AuditDimension = 'distribution' | 'licensing' | 'copyright' | 'monetization'
export type AuditSource = 'vault' | 'sample'

export const PRIORITY_META: Record<
  AuditPriority,
  { label: string; weight: number; tone: 'danger' | 'warning' | 'neutral'; rank: number }
> = {
  critical: { label: 'Critical', weight: 4, tone: 'danger', rank: 0 },
  high: { label: 'High', weight: 3, tone: 'danger', rank: 1 },
  medium: { label: 'Medium', weight: 2, tone: 'warning', rank: 2 },
  low: { label: 'Low', weight: 1, tone: 'neutral', rank: 3 },
}

export const DIMENSION_LABEL: Record<AuditDimension, string> = {
  distribution: 'Distribution',
  licensing: 'Licensing',
  copyright: 'Copyright & Ownership',
  monetization: 'Monetization',
}

export interface AuditCheckDef {
  key: string
  label: string
  dimension: AuditDimension
  priority: AuditPriority
  /** True when contracts/rights are involved — surfaces "Legal Review Recommended". */
  legalReview: boolean
  appliesTo: ('demo' | 'lyrics')[]
  suggestedAction: string
}

/** The full V1 audit checklist (see MUSVORA AI Core spec). */
export const AUDIT_CHECKS: AuditCheckDef[] = [
  { key: 'title', label: 'Title', dimension: 'distribution', priority: 'critical', legalReview: false, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Add a clear title so the work can be identified across registries and splits.' },
  { key: 'composer', label: 'Composer', dimension: 'copyright', priority: 'high', legalReview: true, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Confirm the composer(s) of record. Legal Review Recommended before finalizing authorship.' },
  { key: 'artist', label: 'Performing artist', dimension: 'copyright', priority: 'medium', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Add the performing artist so neighbouring rights can be attributed.' },
  { key: 'producer', label: 'Producer', dimension: 'copyright', priority: 'low', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Add the producer to complete the credit chain.' },
  { key: 'genre', label: 'Genre', dimension: 'distribution', priority: 'medium', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Tag a genre to improve catalog organization and licensing matches.' },
  { key: 'bpm', label: 'BPM', dimension: 'distribution', priority: 'low', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Add BPM to support sync and event-context matching.' },
  { key: 'key', label: 'Musical key', dimension: 'distribution', priority: 'low', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Add the musical key to enrich metadata for licensing.' },
  { key: 'lyrics', label: 'Lyrics', dimension: 'copyright', priority: 'medium', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Attach or link lyrics to strengthen authorship proof and reprint licensing.' },
  { key: 'demoFile', label: 'Demo audio', dimension: 'distribution', priority: 'high', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Upload the demo audio so the work is protected in the Vault.' },
  { key: 'master', label: 'Master recording', dimension: 'distribution', priority: 'medium', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Add the final master to reach distribution readiness.' },
  { key: 'artwork', label: 'Cover artwork', dimension: 'distribution', priority: 'medium', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Add cover art (3000×3000 px) to meet store delivery specs.' },
  { key: 'splitSheet', label: 'Split sheet', dimension: 'copyright', priority: 'high', legalReview: true, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Document contributor splits. Legal Review Recommended before relying on the split.' },
  { key: 'contract', label: 'Contract', dimension: 'licensing', priority: 'high', legalReview: true, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Attach the underlying agreement. Legal Review Recommended before acting on terms.' },
  { key: 'isrc', label: 'ISRC', dimension: 'distribution', priority: 'medium', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Assign an ISRC so recording royalties can be tracked.' },
  { key: 'iswc', label: 'ISWC', dimension: 'copyright', priority: 'medium', legalReview: true, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Register an ISWC for the composition. Legal Review Recommended for rights.' },
  { key: 'copyrightReg', label: 'Copyright registration', dimension: 'copyright', priority: 'high', legalReview: true, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Record a proof of existence / registration. Legal Review Recommended — MUSVORA does not provide legal advice.' },
  { key: 'licensingStatus', label: 'Licensing status', dimension: 'monetization', priority: 'low', legalReview: false, appliesTo: ['demo'], suggestedAction: 'Set a licensing status so the work can be discovered for opportunities.' },
  { key: 'ownershipConfidence', label: 'Ownership confidence data', dimension: 'copyright', priority: 'high', legalReview: true, appliesTo: ['demo', 'lyrics'], suggestedAction: 'Verify contributors and splits to raise ownership confidence. Legal Review Recommended.' },
]

export interface AuditAssetCheck {
  def: AuditCheckDef
  present: boolean
}

export interface AuditedAsset {
  id: string
  title: string
  typeLabel: string
  kind: 'demo' | 'lyrics'
  score: number
  status: ReadinessStatus
  checks: AuditAssetCheck[]
  /** Missing checks only (the Potential Issues), sorted by priority. */
  issues: AuditCheckDef[]
}

export interface AuditReport {
  source: AuditSource
  generatedAt: string
  assets: AuditedAsset[]
  overallScore: number
  overallStatus: ReadinessStatus
  totalIssues: number
  issuesByPriority: Record<AuditPriority, number>
  legalReviewCount: number
}

/** Genre/BPM/Key fields that Upload stringifies into the Demo `notes` field. */
export interface DemoNoteFields {
  genre?: string
  bpm?: string
  key?: string
}

/** Extract genre/bpm/key that Upload stringifies into the Demo `notes` field. */
export function parseDemoNotes(notes?: string): DemoNoteFields {
  const out: DemoNoteFields = {}
  if (!notes) return out
  const g = notes.match(/Genre:\s*([^•]+)/i)
  const b = notes.match(/BPM:\s*([^•]+)/i)
  const k = notes.match(/Key:\s*([^•]+)/i)
  if (g && g[1].trim()) out.genre = g[1].trim()
  if (b && b[1].trim()) out.bpm = b[1].trim()
  if (k && k[1].trim()) out.key = k[1].trim()
  return out
}

function evaluateDemo(demo: Demo, hasLinkedLyrics: boolean): Record<string, boolean> {
  const parsed = parseDemoNotes(demo.notes)
  return {
    title: !!demo.title?.trim(),
    composer: !!demo.composer_id,
    artist: false,
    producer: false,
    genre: !!parsed.genre,
    bpm: !!parsed.bpm,
    key: !!parsed.key,
    lyrics: hasLinkedLyrics,
    demoFile: !!demo.demo_url,
    master: false,
    artwork: false,
    splitSheet: false,
    contract: false,
    isrc: false,
    iswc: false,
    copyrightReg: false,
    licensingStatus: demo.visibility === 'licensing_only',
    ownershipConfidence: false,
  }
}

function evaluateLyrics(lyrics: Lyrics): Record<string, boolean> {
  return {
    title: !!lyrics.title?.trim(),
    composer: !!lyrics.composer_id,
    splitSheet: false,
    contract: false,
    iswc: false,
    // Lyrics get a timestamp proof on save — a genuine proof-of-existence signal.
    copyrightReg: !!lyrics.timestamp_proof,
    ownershipConfidence: false,
  }
}

function buildAsset(
  id: string,
  title: string,
  typeLabel: string,
  kind: 'demo' | 'lyrics',
  present: Record<string, boolean>,
): AuditedAsset {
  const applicable = AUDIT_CHECKS.filter(c => c.appliesTo.includes(kind))
  const checks: AuditAssetCheck[] = applicable.map(def => ({ def, present: !!present[def.key] }))

  const totalWeight = applicable.reduce((s, c) => s + PRIORITY_META[c.priority].weight, 0)
  const presentWeight = checks
    .filter(c => c.present)
    .reduce((s, c) => s + PRIORITY_META[c.def.priority].weight, 0)
  const score = totalWeight ? Math.round((presentWeight / totalWeight) * 100) : 0

  const issues = checks
    .filter(c => !c.present)
    .map(c => c.def)
    .sort((a, b) => PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank)

  return { id, title: title?.trim() || 'Untitled work', typeLabel, kind, score, status: scoreStatus(score), checks, issues }
}

/** Pure audit: turn raw Vault assets into a structured readiness report. */
export function auditCatalog(demos: Demo[], lyrics: Lyrics[], source: AuditSource): AuditReport {
  const lyricTitles = new Set(lyrics.map(l => l.title?.trim().toLowerCase()).filter(Boolean))

  const demoAssets = demos.map(d =>
    buildAsset(d.id, d.title, 'Demo', 'demo', evaluateDemo(d, lyricTitles.has(d.title?.trim().toLowerCase()))),
  )
  const lyricAssets = lyrics.map(l => buildAsset(l.id, l.title, 'Lyrics', 'lyrics', evaluateLyrics(l)))
  const assets = [...demoAssets, ...lyricAssets]

  const issuesByPriority: Record<AuditPriority, number> = { critical: 0, high: 0, medium: 0, low: 0 }
  let legalReviewCount = 0
  for (const a of assets) {
    for (const issue of a.issues) {
      issuesByPriority[issue.priority] += 1
      if (issue.legalReview) legalReviewCount += 1
    }
  }
  const totalIssues = assets.reduce((s, a) => s + a.issues.length, 0)
  const overallScore = assets.length ? Math.round(assets.reduce((s, a) => s + a.score, 0) / assets.length) : 0

  return {
    source,
    generatedAt: new Date().toISOString(),
    assets,
    overallScore,
    overallStatus: scoreStatus(overallScore),
    totalIssues,
    issuesByPriority,
    legalReviewCount,
  }
}

/**
 * Internal SAMPLE catalogue — used ONLY when no real Vault data is available
 * (signed-out, or an empty Vault). Always surfaced with a clear label in the UI.
 */
const SAMPLE_DEMOS: Demo[] = [
  { id: 'sample-d1', title: 'Sample · Midnight Bachata', composer_id: 'sample-composer', demo_url: 'sample', notes: 'Genre: Bachata • BPM: 128 • Key: Am', visibility: 'licensing_only', created_at: new Date().toISOString() },
  { id: 'sample-d2', title: 'Sample · Untitled Demo', composer_id: 'sample-composer', demo_url: 'sample', notes: undefined, visibility: 'private', created_at: new Date().toISOString() },
]
const SAMPLE_LYRICS: Lyrics[] = [
  { id: 'sample-l1', title: 'Sample · Sabor a Miel', content: 'Sample lyrics for demonstration only.', composer_id: 'sample-composer', timestamp_proof: 'sample-proof', created_at: new Date().toISOString() },
]

/** Build a sample audit report (clearly labelled, no real data). */
export function sampleAudit(): AuditReport {
  return auditCatalog(SAMPLE_DEMOS, SAMPLE_LYRICS, 'sample')
}

/**
 * Load and audit the current user's real catalogue. Falls back to the labelled
 * sample when signed-out or when the Vault is empty.
 */
export async function loadCatalogAudit(userId: string | undefined | null): Promise<AuditReport> {
  if (!userId) return sampleAudit()

  const [demosRes, lyricsRes] = await Promise.all([
    vaultService.getDemos(userId),
    vaultService.getLyrics(userId),
  ])

  // vaultService silently returns shared mock data on a Supabase error. Only trust
  // assets that genuinely belong to this user — otherwise we'd mislabel mock data as
  // a real Vault, violating MUSVORA's honesty rules. Mismatched data → labelled sample.
  const demos = (demosRes.data ?? []).filter(d => d.composer_id === userId)
  const lyrics = (lyricsRes.data ?? []).filter(l => l.composer_id === userId)

  if (demos.length === 0 && lyrics.length === 0) return sampleAudit()
  return auditCatalog(demos, lyrics, 'vault')
}
