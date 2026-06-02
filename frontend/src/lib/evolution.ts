/**
 * MUSVORA Product Evolution — Adaptive Product Evolution Engine (Module 22).
 *
 * HONESTY CONTRACT (see replit.md): this is the governance record for HOW
 * MUSVORA modernizes — "evolution over revolution". It documents the design
 * versions that genuinely exist in this codebase and the operating principles
 * that gate any change. It fabricates NOTHING: trend/competitor/behaviour
 * analysis and adoption/satisfaction metrics need telemetry and a data pipeline
 * MUSVORA does not have yet, so those audit areas are marked honestly as
 * Pending — never with invented numbers.
 */

export type VersionStatus = 'active' | 'migrating' | 'planned'

export interface DesignVersion {
  id: string
  name: string
  status: VersionStatus
  summary: string
  scope: string
}

/** Design eras that really exist in the codebase today (see replit.md). */
export const DESIGN_VERSIONS: DesignVersion[] = [
  {
    id: 'v1',
    name: 'Dark-Luxury',
    status: 'active',
    summary: 'OLED black, glassmorphism, violet accent — the original premium look.',
    scope: 'All legacy screens (Home, Player, Vault, Upload, Profile, Marketplace). Kept working — never restyled without request.',
  },
  {
    id: 'v2',
    name: 'Governance DS',
    status: 'migrating',
    summary: 'Institutional dark — navy trust tones, subtle gold, Inter / Inter Tight, enterprise hierarchy.',
    scope: 'New modules opt in via <GovernanceScope>: Owner Console, Ownership, Readiness, Auditor, Music Director, Search.',
  },
  {
    id: 'v3',
    name: 'Reserved',
    status: 'planned',
    summary: 'Not started. A v3 begins only when a real, approved need exists — no uncontrolled redesign.',
    scope: 'Reserved for a future, deliberate evolution. Every change must stay reversible.',
  },
]

export interface EvolutionPrinciple {
  title: string
  rule: string
}

export const EVOLUTION_PRINCIPLES: EvolutionPrinciple[] = [
  { title: 'Evolution over revolution', rule: 'Improve gradually; never redesign the whole platform at once.' },
  { title: 'User-first', rule: 'Change only when it improves experience, speed, simplicity or accessibility — never because a trend exists.' },
  { title: 'Reversible by design', rule: 'Every visual change is scoped; legacy screens keep working throughout migration.' },
  { title: 'Principles, not copies', rule: 'Study leading apps (Apple, Linear, Notion, Spotify) to extract principles — never clone their UI.' },
  { title: 'Protect identity', rule: 'Stay modern without losing the MUSVORA identity.' },
]

export type AuditState = 'manual' | 'pending'
export type AuditCadence = 'monthly' | 'quarterly' | 'yearly'

export interface AuditArea {
  area: string
  cadence: AuditCadence
  state: AuditState
  detail: string
}

/**
 * Modernization audit areas with HONEST current state. "Manual" = reviewed by
 * hand today. "Pending" = needs telemetry / a data pipeline that is not
 * connected, so no score is shown rather than a fabricated one.
 */
export const MODERNIZATION_AUDIT: AuditArea[] = [
  { area: 'Visual design & design-system adoption', cadence: 'quarterly', state: 'manual', detail: 'Reviewed by hand; governance migration tracked per screen. No automated visual regression yet.' },
  { area: 'Navigation & information architecture', cadence: 'quarterly', state: 'manual', detail: 'Reviewed against the ≤3-taps rule. Flow / drop-off analytics are not collected.' },
  { area: 'Accessibility', cadence: 'quarterly', state: 'manual', detail: 'Focus styles, ARIA and contrast checked by hand. No automated a11y CI yet.' },
  { area: 'Performance', cadence: 'monthly', state: 'pending', detail: 'No runtime performance monitoring (RUM) or budget is connected.' },
  { area: 'Feature adoption', cadence: 'monthly', state: 'pending', detail: 'Requires usage telemetry MUSVORA does not record yet.' },
  { area: 'User satisfaction', cadence: 'yearly', state: 'pending', detail: 'Requires an in-app feedback / analytics pipeline that is not connected.' },
]
