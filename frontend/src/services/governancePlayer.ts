/**
 * MUSVORA Governance Player — V1 data layer.
 *
 * Assembles the "Asset Review" intelligence for a single Vault asset by id,
 * REUSING the existing engines (no duplicated logic):
 *   - services/ownership.ts → Ownership Confidence (contributors, splits,
 *     signatures, timeline, score)
 *   - services/auditor.ts   → Readiness Score + AI Catalog Auditor summary
 *
 * Honesty rules (MANDATORY — see replit.md):
 *   - This is an asset-review surface. It never certifies ownership, never
 *     claims "Legally Verified", never invents registration IDs.
 *   - Passport status is reported honestly as "Pending Registration" /
 *     "Proof on File"; never a fabricated active registration.
 *   - Licensing status is read from the real asset's visibility.
 *   - When the asset can't be resolved from the real Vault, a clearly-labelled
 *     SAMPLE asset is returned.
 *
 * No schema/Auth/backend changes. Pure assembly over existing pure engines.
 */
import type { Demo, Lyrics } from '../types'
import { vaultService } from './vault.service'
import { auditCatalog, type AuditCheckDef } from './auditor'
import { computeOwnership, type OwnershipAsset } from './ownership'
import { scoreStatus, type ReadinessStatus } from '../data/readiness'

export type ReviewSource = 'vault' | 'sample'
export type ChipTone = 'neutral' | 'navy' | 'gold' | 'success' | 'warning' | 'danger'

export interface StatusChip {
  label: string
  detail: string
  tone: ChipTone
}

export interface ReviewMetadata {
  genre?: string
  bpm?: string
  key?: string
}

export interface ReviewAuditSummary {
  score: number
  status: ReadinessStatus
  totalIssues: number
  legalReviewCount: number
  topIssues: AuditCheckDef[]
}

export interface ReviewAsset {
  id: string
  title: string
  composerName: string
  kind: 'demo' | 'lyrics'
  typeLabel: string
  audioUrl?: string
  durationSec: number
  createdAt: string
  metadata: ReviewMetadata
  readinessScore: number
  readinessStatus: ReadinessStatus
  ownership: OwnershipAsset
  passport: StatusChip
  licensing: StatusChip
  audit: ReviewAuditSummary
}

export interface ReviewResult {
  source: ReviewSource
  asset: ReviewAsset
}

/** Mirror of auditor's note parser (kept local so auditor stays untouched). */
function parseDemoNotes(notes?: string): ReviewMetadata {
  const out: ReviewMetadata = {}
  if (!notes) return out
  const g = notes.match(/Genre:\s*([^•]+)/i)
  const b = notes.match(/BPM:\s*([^•]+)/i)
  const k = notes.match(/Key:\s*([^•]+)/i)
  if (g && g[1].trim()) out.genre = g[1].trim()
  if (b && b[1].trim()) out.bpm = b[1].trim()
  if (k && k[1].trim()) out.key = k[1].trim()
  return out
}

function licensingChip(visibility: Demo['visibility']): StatusChip {
  switch (visibility) {
    case 'licensing_only':
      return { label: 'Available for Licensing', detail: 'Discoverable for licensing opportunities', tone: 'success' }
    case 'public':
      return { label: 'Listed', detail: 'Publicly visible asset', tone: 'navy' }
    default:
      return { label: 'Private', detail: 'Not exposed for licensing', tone: 'neutral' }
  }
}

/**
 * Passport status — honest. MUSVORA does not issue registration IDs yet, so a
 * work with upload/creation proof is "Proof on File · Pending Registration".
 */
function passportChip(hasProof: boolean): StatusChip {
  return hasProof
    ? { label: 'Proof on File', detail: 'Registration Pending — no registration ID issued', tone: 'gold' }
    : { label: 'Pending Registration', detail: 'No proof of existence on file yet', tone: 'warning' }
}

function assembleDemo(demo: Demo, allLyrics: Lyrics[], ownerName: string, source: ReviewSource): ReviewAsset {
  const audit = auditCatalog([demo], allLyrics, source)
  const auditAsset = audit.assets.find(a => a.id === demo.id) ?? audit.assets[0]
  const ownershipReport = computeOwnership([demo], [], ownerName, source)
  const ownership = ownershipReport.assets[0]

  return {
    id: demo.id,
    title: demo.title?.trim() || 'Untitled demo',
    composerName: ownerName,
    kind: 'demo',
    typeLabel: 'Demo',
    audioUrl: demo.demo_url && demo.demo_url !== 'sample' ? demo.demo_url : undefined,
    durationSec: 180,
    createdAt: demo.created_at,
    metadata: parseDemoNotes(demo.notes),
    readinessScore: auditAsset.score,
    readinessStatus: auditAsset.status,
    ownership,
    passport: passportChip(true),
    licensing: licensingChip(demo.visibility),
    audit: {
      score: auditAsset.score,
      status: auditAsset.status,
      totalIssues: auditAsset.issues.length,
      legalReviewCount: auditAsset.issues.filter(i => i.legalReview).length,
      topIssues: auditAsset.issues.slice(0, 4),
    },
  }
}

function assembleLyrics(lyrics: Lyrics, ownerName: string, source: ReviewSource): ReviewAsset {
  const audit = auditCatalog([], [lyrics], source)
  const auditAsset = audit.assets[0]
  const ownershipReport = computeOwnership([], [lyrics], ownerName, source)
  const ownership = ownershipReport.assets[0]

  return {
    id: lyrics.id,
    title: lyrics.title?.trim() || 'Untitled lyrics',
    composerName: ownerName,
    kind: 'lyrics',
    typeLabel: 'Lyrics',
    audioUrl: undefined,
    durationSec: 0,
    createdAt: lyrics.created_at,
    metadata: {},
    readinessScore: auditAsset.score,
    readinessStatus: auditAsset.status,
    ownership,
    passport: passportChip(!!lyrics.timestamp_proof),
    licensing: { label: 'Private', detail: 'Lyrics are not exposed for licensing', tone: 'neutral' },
    audit: {
      score: auditAsset.score,
      status: auditAsset.status,
      totalIssues: auditAsset.issues.length,
      legalReviewCount: auditAsset.issues.filter(i => i.legalReview).length,
      topIssues: auditAsset.issues.slice(0, 4),
    },
  }
}

/** Clearly-labelled sample asset — used when the id can't be resolved from the Vault. */
function sampleDemo(): Demo {
  return {
    id: 'sample-review',
    title: 'Sample · Midnight Bachata',
    composer_id: 'sample-composer',
    demo_url: 'sample',
    notes: 'Genre: Bachata • BPM: 128 • Key: Am',
    visibility: 'licensing_only',
    created_at: new Date().toISOString(),
  }
}

export function sampleReview(): ReviewResult {
  return { source: 'sample', asset: assembleDemo(sampleDemo(), [], 'Sample Composer', 'sample') }
}

/**
 * Resolve a single reviewable asset by id from the user's real Vault. Falls back
 * to a clearly-labelled sample when signed-out or when the id can't be matched.
 */
export async function loadReviewAsset(
  userId: string | undefined | null,
  assetId: string | undefined,
  ownerName = 'You',
): Promise<ReviewResult> {
  if (!userId || !assetId) return sampleReview()

  const [demosRes, lyricsRes] = await Promise.all([
    vaultService.getDemos(userId),
    vaultService.getLyrics(userId),
  ])

  // vaultService silently returns shared mock data on a Supabase error. Only trust
  // assets that genuinely belong to this user, else we'd mislabel mock as real.
  const demos = (demosRes.data ?? []).filter(d => d.composer_id === userId)
  const lyrics = (lyricsRes.data ?? []).filter(l => l.composer_id === userId)

  const demo = demos.find(d => d.id === assetId)
  if (demo) return { source: 'vault', asset: assembleDemo(demo, lyrics, ownerName, 'vault') }

  const lyric = lyrics.find(l => l.id === assetId)
  if (lyric) return { source: 'vault', asset: assembleLyrics(lyric, ownerName, 'vault') }

  return sampleReview()
}
