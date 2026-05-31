/**
 * MUSVORA Ownership Confidence — V1 engine.
 *
 * A REAL governance module. It derives an Ownership Confidence picture for each
 * asset in the user's Vault from the ownership signals that genuinely exist
 * (registered owner, creation/upload proof, documented splits, verification,
 * signatures) and honestly reports what is still missing.
 *
 * Honesty rules (MANDATORY — see replit.md):
 *  - MUSVORA tracks ownership SIGNALS. It never asserts "Legally Verified
 *    Ownership", never certifies ownership, never gives legal advice.
 *  - Approved status vocabulary only: Complete · Pending Signature ·
 *    Pending Verification · Missing Contributor.
 *  - The confidence score is COMPUTED from available data — never random.
 *  - Where the data model does not store something (splits, signatures,
 *    verification), it is surfaced as a gap, not fabricated.
 *  - When no real catalogue exists, a clearly-labelled SAMPLE is used.
 *
 * Pure, reusable module — designed to feed Song Passport, Recovery Center and
 * Marketplace eligibility in future sprints. No schema/Auth/backend changes.
 */
import type { Demo, Lyrics } from '../types'
import { vaultService } from './vault.service'
import { scoreStatus, type ReadinessStatus } from '../data/readiness'

export type OwnershipStatus = 'complete' | 'pending_signature' | 'pending_verification' | 'missing_contributor'
export type OwnershipSource = 'vault' | 'sample'

export const OWNERSHIP_STATUS_META: Record<
  OwnershipStatus,
  { label: string; tone: 'success' | 'warning' | 'gold' | 'danger'; color: string; rank: number }
> = {
  complete: { label: 'Complete', tone: 'success', color: 'var(--gv-success)', rank: 0 },
  pending_signature: { label: 'Pending Signature', tone: 'warning', color: 'var(--gv-warning)', rank: 1 },
  pending_verification: { label: 'Pending Verification', tone: 'gold', color: 'var(--gv-gold)', rank: 2 },
  missing_contributor: { label: 'Missing Contributor', tone: 'danger', color: 'var(--gv-danger)', rank: 3 },
}

/** Deterministic confidence weights (sum = 100). */
const SIGNAL_WEIGHTS = {
  ownerIdentified: 25,
  proofOfExistence: 10,
  splitsComplete: 25,
  allVerified: 20,
  allSigned: 20,
}

export interface Contributor {
  id: string
  name: string
  role: string
  /** Documented split. undefined = not documented yet. */
  splitPercent?: number
  verified: boolean
  signed: boolean
  status: OwnershipStatus
}

export interface OwnershipEvent {
  label: string
  date?: string
  done: boolean
}

export interface OwnershipAsset {
  id: string
  title: string
  typeLabel: string
  kind: 'demo' | 'lyrics'
  contributors: Contributor[]
  splitsDocumented: boolean
  splitTotal: number
  confidence: number
  status: OwnershipStatus
  /** Reuses the readiness band (ready/attention/risk) for the confidence ring color. */
  band: ReadinessStatus
  timeline: OwnershipEvent[]
  gaps: string[]
}

export interface OwnershipReport {
  source: OwnershipSource
  generatedAt: string
  assets: OwnershipAsset[]
  overallConfidence: number
  band: ReadinessStatus
  statusCounts: Record<OwnershipStatus, number>
}

function contributorStatus(c: { splitPercent?: number; verified: boolean; signed: boolean }): OwnershipStatus {
  if (typeof c.splitPercent !== 'number') return 'pending_verification'
  if (!c.verified) return 'pending_verification'
  if (!c.signed) return 'pending_signature'
  return 'complete'
}

/** Core builder — turns a set of contributors + signals into a scored asset. */
function buildOwnershipAsset(
  base: { id: string; title: string; typeLabel: string; kind: 'demo' | 'lyrics' },
  rawContributors: Omit<Contributor, 'status'>[],
  timeline: OwnershipEvent[],
  hasProof: boolean,
): OwnershipAsset {
  const contributors: Contributor[] = rawContributors.map(c => ({ ...c, status: contributorStatus(c) }))

  const documentedSplits = contributors.filter(c => typeof c.splitPercent === 'number')
  const splitsDocumented = contributors.length > 0 && documentedSplits.length === contributors.length
  const splitTotal = documentedSplits.reduce((s, c) => s + (c.splitPercent ?? 0), 0)

  const ownerIdentified = contributors.length > 0
  const splitsComplete = splitsDocumented && splitTotal === 100
  const allVerified = contributors.length > 0 && contributors.every(c => c.verified)
  const allSigned = contributors.length > 0 && contributors.every(c => c.signed)

  let confidence = 0
  if (ownerIdentified) confidence += SIGNAL_WEIGHTS.ownerIdentified
  if (hasProof) confidence += SIGNAL_WEIGHTS.proofOfExistence
  if (splitsComplete) confidence += SIGNAL_WEIGHTS.splitsComplete
  if (allVerified) confidence += SIGNAL_WEIGHTS.allVerified
  if (allSigned) confidence += SIGNAL_WEIGHTS.allSigned

  // Asset-level status.
  let status: OwnershipStatus
  if (!ownerIdentified) status = 'missing_contributor'
  else if (contributors.some(c => c.status === 'missing_contributor')) status = 'missing_contributor'
  else if (splitsDocumented && splitTotal !== 100) status = 'missing_contributor'
  else if (splitsComplete && allVerified && allSigned) status = 'complete'
  else if (allVerified && !allSigned && splitsDocumented) status = 'pending_signature'
  else status = 'pending_verification'

  // Gaps — honest, actionable, never legal claims.
  const gaps: string[] = []
  if (!splitsDocumented) gaps.push('Split percentages not documented')
  else if (splitTotal !== 100) gaps.push(`Documented splits total ${splitTotal}% — ${100 - splitTotal > 0 ? `${100 - splitTotal}% unaccounted` : 'over 100%'} (Missing Contributor)`)
  if (!allVerified) gaps.push('Contributors not yet verified (Pending Verification)')
  if (!allSigned) gaps.push('No signed split agreement on file (Pending Signature)')

  return {
    ...base,
    contributors,
    splitsDocumented,
    splitTotal,
    confidence,
    status,
    band: scoreStatus(confidence),
    timeline,
    gaps,
  }
}

function ownershipFromDemo(demo: Demo, ownerName: string): OwnershipAsset {
  const contributors: Omit<Contributor, 'status'>[] = [
    { id: demo.composer_id, name: ownerName, role: 'Composer', splitPercent: undefined, verified: false, signed: false },
  ]
  const timeline: OwnershipEvent[] = [
    { label: 'Work created', date: demo.created_at, done: true },
    { label: 'Uploaded to Vault', date: demo.created_at, done: true },
    { label: 'Contributors verified', done: false },
    { label: 'Splits signed', done: false },
  ]
  return buildOwnershipAsset(
    { id: demo.id, title: demo.title?.trim() || 'Untitled demo', typeLabel: 'Demo', kind: 'demo' },
    contributors,
    timeline,
    true,
  )
}

function ownershipFromLyrics(lyrics: Lyrics, ownerName: string): OwnershipAsset {
  const contributors: Omit<Contributor, 'status'>[] = [
    { id: lyrics.composer_id, name: ownerName, role: 'Writer', splitPercent: undefined, verified: false, signed: false },
  ]
  const timeline: OwnershipEvent[] = [
    { label: 'Lyrics written', date: lyrics.created_at, done: true },
    { label: 'Proof of existence recorded', date: lyrics.created_at, done: !!lyrics.timestamp_proof },
    { label: 'Contributors verified', done: false },
    { label: 'Splits signed', done: false },
  ]
  return buildOwnershipAsset(
    { id: lyrics.id, title: lyrics.title?.trim() || 'Untitled lyrics', typeLabel: 'Lyrics', kind: 'lyrics' },
    contributors,
    timeline,
    !!lyrics.timestamp_proof,
  )
}

function summarize(assets: OwnershipAsset[], source: OwnershipSource): OwnershipReport {
  const statusCounts: Record<OwnershipStatus, number> = {
    complete: 0,
    pending_signature: 0,
    pending_verification: 0,
    missing_contributor: 0,
  }
  for (const a of assets) statusCounts[a.status] += 1

  const overallConfidence = assets.length
    ? Math.round(assets.reduce((s, a) => s + a.confidence, 0) / assets.length)
    : 0

  return {
    source,
    generatedAt: new Date().toISOString(),
    assets,
    overallConfidence,
    band: scoreStatus(overallConfidence),
    statusCounts,
  }
}

/**
 * Internal SAMPLE portfolio — used ONLY when no real Vault data is available.
 * Showcases every status. Always surfaced with a clear label in the UI.
 */
function sampleAssets(): OwnershipAsset[] {
  const now = new Date()
  const iso = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString()

  const complete = buildOwnershipAsset(
    { id: 'sample-o1', title: 'Sample · Corazón de Acero', typeLabel: 'Demo', kind: 'demo' },
    [
      { id: 's1a', name: 'Sample Composer', role: 'Composer', splitPercent: 60, verified: true, signed: true },
      { id: 's1b', name: 'Sample Producer', role: 'Producer', splitPercent: 40, verified: true, signed: true },
    ],
    [
      { label: 'Work created', date: iso(120), done: true },
      { label: 'Uploaded to Vault', date: iso(118), done: true },
      { label: 'Contributors verified', date: iso(100), done: true },
      { label: 'Splits signed', date: iso(96), done: true },
    ],
    true,
  )

  const pendingSignature = buildOwnershipAsset(
    { id: 'sample-o2', title: 'Sample · Luna de Abril', typeLabel: 'Demo', kind: 'demo' },
    [
      { id: 's2a', name: 'Sample Composer', role: 'Composer', splitPercent: 70, verified: true, signed: true },
      { id: 's2b', name: 'Sample Co-writer', role: 'Co-writer', splitPercent: 30, verified: true, signed: false },
    ],
    [
      { label: 'Work created', date: iso(60), done: true },
      { label: 'Uploaded to Vault', date: iso(58), done: true },
      { label: 'Contributors verified', date: iso(40), done: true },
      { label: 'Splits signed', done: false },
    ],
    true,
  )

  const pendingVerification = buildOwnershipAsset(
    { id: 'sample-o3', title: 'Sample · Untitled Demo', typeLabel: 'Demo', kind: 'demo' },
    [{ id: 's3a', name: 'Sample Composer', role: 'Composer', splitPercent: undefined, verified: false, signed: false }],
    [
      { label: 'Work created', date: iso(10), done: true },
      { label: 'Uploaded to Vault', date: iso(10), done: true },
      { label: 'Contributors verified', done: false },
      { label: 'Splits signed', done: false },
    ],
    true,
  )

  const missingContributor = buildOwnershipAsset(
    { id: 'sample-o4', title: 'Sample · Bachata Collab', typeLabel: 'Demo', kind: 'demo' },
    [
      { id: 's4a', name: 'Sample Composer', role: 'Composer', splitPercent: 50, verified: true, signed: true },
      { id: 's4b', name: 'Sample Producer', role: 'Producer', splitPercent: 30, verified: false, signed: false },
    ],
    [
      { label: 'Work created', date: iso(30), done: true },
      { label: 'Uploaded to Vault', date: iso(28), done: true },
      { label: 'Contributors verified', done: false },
      { label: 'Splits signed', done: false },
    ],
    true,
  )

  return [complete, pendingSignature, pendingVerification, missingContributor]
}

export function sampleOwnership(): OwnershipReport {
  return summarize(sampleAssets(), 'sample')
}

/** Pure: build an ownership report from raw Vault assets. */
export function computeOwnership(demos: Demo[], lyrics: Lyrics[], ownerName: string, source: OwnershipSource): OwnershipReport {
  const assets = [
    ...demos.map(d => ownershipFromDemo(d, ownerName)),
    ...lyrics.map(l => ownershipFromLyrics(l, ownerName)),
  ]
  return summarize(assets, source)
}

/**
 * Load + compute the current user's real ownership portfolio. Falls back to the
 * labelled sample when signed-out or when the Vault has no genuinely-owned assets.
 */
export async function loadOwnershipPortfolio(
  userId: string | undefined | null,
  ownerName = 'You',
): Promise<OwnershipReport> {
  if (!userId) return sampleOwnership()

  const [demosRes, lyricsRes] = await Promise.all([
    vaultService.getDemos(userId),
    vaultService.getLyrics(userId),
  ])

  // vaultService silently returns shared mock data on a Supabase error. Only trust
  // assets that genuinely belong to this user, else we'd mislabel mock as real.
  const demos = (demosRes.data ?? []).filter(d => d.composer_id === userId)
  const lyrics = (lyricsRes.data ?? []).filter(l => l.composer_id === userId)

  if (demos.length === 0 && lyrics.length === 0) return sampleOwnership()
  return computeOwnership(demos, lyrics, ownerName, 'vault')
}
