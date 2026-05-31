/**
 * MUSVORA — Readiness Center mock data (Sprint 2).
 *
 * MOCK ONLY. No backend, no business logic. This module powers the Readiness
 * Center UI exclusively. Replace with real signals when the readiness engine
 * is implemented in a future sprint.
 */

export type ReadinessStatus = 'ready' | 'attention' | 'risk'

export interface ReadinessCheck {
  label: string
  done: boolean
}

export interface ReadinessDimension {
  id: string
  label: string
  /** lucide icon name resolved in the page */
  icon: 'distribution' | 'licensing' | 'copyright' | 'monetization'
  score: number
  status: ReadinessStatus
  summary: string
  checks: ReadinessCheck[]
}

export interface ReadinessAsset {
  id: string
  title: string
  type: string
  score: number
  status: ReadinessStatus
}

/** Status presentation tokens — maps a status to label + governance tone. */
export const STATUS_META: Record<
  ReadinessStatus,
  { label: string; tone: 'success' | 'warning' | 'danger'; color: string; soft: string }
> = {
  ready: { label: 'Ready Now', tone: 'success', color: 'var(--gv-success)', soft: 'var(--gv-success-soft)' },
  attention: { label: 'Needs Attention', tone: 'warning', color: 'var(--gv-warning)', soft: 'var(--gv-warning-soft)' },
  risk: { label: 'At Risk', tone: 'danger', color: 'var(--gv-danger)', soft: 'var(--gv-danger-soft)' },
}

/** Score → status threshold (shared so the ring + summary stay consistent). */
export function scoreStatus(score: number): ReadinessStatus {
  if (score >= 80) return 'ready'
  if (score >= 55) return 'attention'
  return 'risk'
}

export const OVERALL_READINESS = 72

/** Portfolio summary — how many catalog assets fall in each status band. */
export const STATUS_SUMMARY: Record<ReadinessStatus, number> = {
  ready: 14,
  attention: 6,
  risk: 3,
}

export const READINESS_DIMENSIONS: ReadinessDimension[] = [
  {
    id: 'distribution',
    label: 'Distribution Readiness',
    icon: 'distribution',
    score: 88,
    status: 'ready',
    summary: 'Metadata, artwork and masters meet store delivery specifications.',
    checks: [
      { label: 'ISRC assigned to all tracks', done: true },
      { label: 'Cover art 3000×3000 px', done: true },
      { label: 'Lossless master uploaded', done: true },
      { label: 'Release date scheduled', done: false },
    ],
  },
  {
    id: 'licensing',
    label: 'Licensing Readiness',
    icon: 'licensing',
    score: 64,
    status: 'attention',
    summary: 'Licensing terms drafted, but rights confirmation is still pending.',
    checks: [
      { label: 'License tiers defined', done: true },
      { label: 'Pricing published', done: true },
      { label: 'Rights-holder sign-off', done: false },
      { label: 'Sample clearances logged', done: false },
    ],
  },
  {
    id: 'copyright',
    label: 'Copyright Readiness',
    icon: 'copyright',
    score: 41,
    status: 'risk',
    summary: 'Authorship proof is incomplete — exposure to ownership disputes.',
    checks: [
      { label: 'Composition registered', done: true },
      { label: 'Split sheet signed by all contributors', done: false },
      { label: 'Master rights documented', done: false },
      { label: 'Lyrics deposit filed', done: false },
    ],
  },
  {
    id: 'monetization',
    label: 'Monetization Readiness',
    icon: 'monetization',
    score: 70,
    status: 'attention',
    summary: 'Revenue channels are mostly configured and collecting.',
    checks: [
      { label: 'Payout method verified', done: true },
      { label: 'Marketplace listing live', done: true },
      { label: 'Royalty splits configured', done: true },
      { label: 'Sync catalog opt-in', done: false },
    ],
  },
]

export const READINESS_ASSETS: ReadinessAsset[] = [
  { id: 'a1', title: 'Midnight Bachata', type: 'Master · Single', score: 91, status: 'ready' },
  { id: 'a2', title: 'Broken Halo', type: 'Master · Single', score: 84, status: 'ready' },
  { id: 'a3', title: 'Salgo a la Calle', type: 'Composition', score: 67, status: 'attention' },
  { id: 'a4', title: 'Sabor a Miel', type: 'Demo · Lyrics', score: 38, status: 'risk' },
]
