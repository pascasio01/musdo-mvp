/**
 * MUSVORA Asset Intelligence — Home dashboard data.
 *
 * IMPORTANT: This is MOCK / INTERNAL demonstration data only. It contains no
 * live figures, no backend calls, and no real financial claims. Values are
 * illustrative so the executive dashboard can be evaluated without a backend.
 * Where possible it reuses the shared Readiness mock so the numbers stay
 * consistent across modules.
 */
import { OVERALL_READINESS, STATUS_SUMMARY, READINESS_ASSETS } from './readiness'

export interface RevenueOpportunity {
  id: string
  title: string
  channel: string
  potential: 'high' | 'medium' | 'low'
  note: string
}

/** Illustrative potential revenue opportunities — not actual earnings. */
export const REVENUE_OPPORTUNITIES: RevenueOpportunity[] = [
  {
    id: 'r1',
    title: 'Unregistered streaming royalties',
    channel: 'Recovery',
    potential: 'high',
    note: '2 works missing ISWC — royalties may be going uncollected.',
  },
  {
    id: 'r2',
    title: 'Sync licensing — instrumentals',
    channel: 'Licensing',
    potential: 'high',
    note: 'Add instrumental versions to open film, TV and ad placements.',
  },
  {
    id: 'r3',
    title: 'Neighbouring rights',
    channel: 'Recovery',
    potential: 'medium',
    note: 'Performer rights not yet registered with a collection society.',
  },
  {
    id: 'r4',
    title: 'Catalogue re-pitch',
    channel: 'Marketplace',
    potential: 'medium',
    note: '3 ready masters are not yet listed for licensing.',
  },
  {
    id: 'r5',
    title: 'Lyric reprint & publishing',
    channel: 'Publishing',
    potential: 'low',
    note: 'A lyrics deposit unlocks print and display licensing.',
  },
]

/** The single highest-leverage action surfaced on the dashboard. */
export const NEXT_BEST_ACTION = {
  title: 'Sign the split sheet on “Sabor a Miel”',
  description:
    'Unsigned contributor splits are the biggest factor lowering ownership confidence. Resolving this protects the work and unlocks clean royalty payouts.',
  primary: { label: 'Open Readiness', to: '/readiness' },
  secondary: { label: 'Scan Catalog', to: '/scan' },
} as const

/** Top-line metrics for the Asset Intelligence header (all mock/illustrative). */
export const ASSET_INTELLIGENCE = {
  readinessScore: OVERALL_READINESS,
  ownershipConfidence: 78,
  worksAtRisk: STATUS_SUMMARY.risk,
  revenueOpportunities: REVENUE_OPPORTUNITIES.length,
  catalogAssets: STATUS_SUMMARY.ready + STATUS_SUMMARY.attention + STATUS_SUMMARY.risk,
} as const

/** Catalogue assets that need attention, weakest first. */
export const ASSETS_AT_RISK = [...READINESS_ASSETS]
  .filter(a => a.status !== 'ready')
  .sort((a, b) => a.score - b.score)
