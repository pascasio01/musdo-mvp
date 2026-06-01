/**
 * MUSVORA Founder Console — read-only data layer.
 *
 * Aggregates ONLY data that genuinely exists for the owner. This module never
 * fabricates platform analytics. Where a real source is not connected (e.g.
 * platform-wide user counts, revenue, infrastructure monitoring), the value is
 * intentionally absent so the UI can render an honest "Pending Integration"
 * state instead of a fake number.
 *
 * Honesty rules (see replit.md):
 *  - Real metrics are COMPUTED from the owner's Vault / Ownership signals.
 *  - When no genuinely-owned catalogue exists, the underlying Ownership report
 *    falls back to a clearly-labelled SAMPLE (source === 'sample').
 *  - No legal certainty is asserted anywhere.
 *
 * Pure orchestration over existing services — no schema/Auth/backend changes.
 */
import { loadOwnershipPortfolio, type OwnershipReport, type OwnershipStatus } from './ownership'
import type { ReadinessStatus } from '../data/readiness'

export interface FounderSnapshot {
  /** 'vault' = real owned catalogue · 'sample' = labelled demonstration set. */
  source: OwnershipReport['source']
  generatedAt: string
  /** Number of assets in the owner's Vault (real) or in the sample set. */
  assetCount: number
  /** Ownership Confidence average (0–100), computed from real signals. */
  ownershipConfidence: number
  ownershipBand: ReadinessStatus
  /** Breakdown of assets by ownership status. */
  statusCounts: Record<OwnershipStatus, number>
  /** Assets in any non-complete state — i.e. genuinely requiring action. */
  worksNeedingAction: number
}

/**
 * Load the owner's real Founder snapshot. Resolves through the Ownership engine,
 * which already trusts only assets that belong to the user and otherwise returns
 * a labelled sample. Never throws — callers can render directly.
 */
export async function loadFounderSnapshot(
  userId: string | undefined | null,
  ownerName = 'You',
): Promise<FounderSnapshot> {
  const report = await loadOwnershipPortfolio(userId, ownerName)

  const worksNeedingAction =
    report.statusCounts.pending_signature +
    report.statusCounts.pending_verification +
    report.statusCounts.missing_contributor

  return {
    source: report.source,
    generatedAt: report.generatedAt,
    assetCount: report.assets.length,
    ownershipConfidence: report.overallConfidence,
    ownershipBand: report.band,
    statusCounts: report.statusCounts,
    worksNeedingAction,
  }
}
