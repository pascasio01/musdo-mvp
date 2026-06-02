import type { SubscriptionPlan } from '../types/database.types'

/**
 * MUSVORA centralized access-control matrix.
 *
 * This is the SINGLE source of truth for "which plan unlocks which feature".
 * Nothing else in the app should hardcode plan names against features — import
 * a `Feature` key and ask `canAccess` / `usePermissions().can(feature)`.
 *
 * The frontend layer here is UX only. Real enforcement of data writes lives in
 * Supabase RLS (see `frontend/db/schema_access.sql`) — the client gate and the
 * database gate use the SAME plan ranking so they never disagree.
 */

export type Plan = SubscriptionPlan // 'free' | 'premium' | 'creator_pro'

// Ordered tiers — higher index unlocks everything below it.
export const PLAN_ORDER: Plan[] = ['free', 'premium', 'creator_pro']

export function planRank(plan: Plan): number {
  const i = PLAN_ORDER.indexOf(plan)
  return i < 0 ? 0 : i
}

/** True when `plan` is at least `required` in the tier order. */
export function meetsPlan(plan: Plan, required: Plan): boolean {
  return planRank(plan) >= planRank(required)
}

export const PLAN_LABEL: Record<Plan, string> = {
  free: 'Free',
  premium: 'Premium',
  creator_pro: 'Creator Pro',
}

// ─── Feature catalogue ───────────────────────────────────────────────────────
// Add future premium modules here only — never scatter plan checks elsewhere.
export type Feature =
  // Premium (listener) tier
  | 'ai.advanced'         // MUSVORA AI advanced sessions & curation
  | 'playlists.premium'   // create / curate playlists
  | 'offline'             // offline downloads
  | 'player.premium'      // cinematic premium player extras
  // Creator Pro tier
  | 'creator.vault'       // professional vault custody
  | 'creator.upload'      // upload & distribution tools
  | 'creator.dashboard'   // creator dashboard
  | 'creator.analytics'   // analytics & revenue tracking
  | 'creator.marketplace' // licensing marketplace (list assets)

export const FEATURE_MATRIX: Record<Feature, Plan> = {
  'ai.advanced': 'premium',
  'playlists.premium': 'premium',
  'offline': 'premium',
  'player.premium': 'premium',
  'creator.vault': 'creator_pro',
  'creator.upload': 'creator_pro',
  'creator.dashboard': 'creator_pro',
  'creator.analytics': 'creator_pro',
  'creator.marketplace': 'creator_pro',
}

export const FEATURE_LABEL: Record<Feature, string> = {
  'ai.advanced': 'MUSVORA AI Advanced',
  'playlists.premium': 'Playlists',
  'offline': 'Offline Mode',
  'player.premium': 'Premium Player',
  'creator.vault': 'Composer Vault',
  'creator.upload': 'Upload & Distribution',
  'creator.dashboard': 'Creator Dashboard',
  'creator.analytics': 'Analytics & Revenue',
  'creator.marketplace': 'Licensing Marketplace',
}

export function requiredPlanFor(feature: Feature): Plan {
  return FEATURE_MATRIX[feature]
}

/** Core decision: does `plan` unlock `feature`? */
export function canAccess(plan: Plan, feature: Feature): boolean {
  return meetsPlan(plan, requiredPlanFor(feature))
}
