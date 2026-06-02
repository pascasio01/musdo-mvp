import { useMemo } from 'react'
import { useSubscription } from './useSubscription'
import {
  type Feature,
  type Plan,
  canAccess,
  meetsPlan,
  requiredPlanFor,
} from './access'

export interface Permissions {
  loading: boolean
  /**
   * The plan the user is ENTITLED to right now. Derived from real membership
   * state, not the raw row: an active trial counts as its paid plan, and an
   * expired / canceled subscription collapses to 'free'. This is the value all
   * gating decisions use.
   */
  plan: Plan
  isTrialing: boolean
  /** Does the current entitlement unlock this feature? */
  can: (feature: Feature) => boolean
  /** Does the current entitlement meet at least this tier? */
  atLeast: (required: Plan) => boolean
  requiredPlanFor: (feature: Feature) => Plan
}

/**
 * The single hook every UI surface uses to gate premium features. It reads the
 * Supabase-backed subscription (source of truth) and never trusts any local
 * flag. `useSubscription` already treats only active/trialing/past_due as
 * entitled, so expiry automatically reverts the effective plan to free.
 */
export function usePermissions(): Permissions {
  const sub = useSubscription()

  const plan: Plan = sub.isCreatorPro ? 'creator_pro' : sub.isPremium ? 'premium' : 'free'

  return useMemo<Permissions>(() => ({
    loading: sub.loading,
    plan,
    isTrialing: sub.isTrialing,
    can: (feature: Feature) => canAccess(plan, feature),
    atLeast: (required: Plan) => meetsPlan(plan, required),
    requiredPlanFor,
  }), [sub.loading, sub.isTrialing, plan])
}
