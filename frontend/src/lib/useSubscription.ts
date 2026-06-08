import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'
import type {
  DbSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../types/database.types'

export type { SubscriptionPlan, SubscriptionStatus }
export type PaidPlan = 'premium' | 'creator_pro'

export interface SubscriptionView {
  loading: boolean
  /** Raw membership row, or null when the user has never started checkout. */
  subscription: DbSubscription | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  isPremium: boolean
  isCreatorPro: boolean
  /** Any paid, currently-entitled state (active or trialing). */
  isPaid: boolean
  isTrialing: boolean
  trialEnd: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  hasCustomer: boolean
  refresh: () => Promise<void>
}

const ENTITLED: SubscriptionStatus[] = ['active', 'trialing', 'past_due']

/** Monotonic per-process suffix so each realtime channel gets a unique topic. */
let realtimeChannelSeq = 0
const realtimeNonce = () => `${Date.now().toString(36)}${(realtimeChannelSeq++).toString(36)}`

/**
 * Reads the signed-in user's membership row from Supabase (RLS-scoped to self)
 * and keeps it fresh via realtime + an explicit refresh (used after returning
 * from Stripe Checkout). The row is written ONLY by the Stripe webhook, so this
 * hook never writes — it is a pure, honest view of real billing state.
 */
export function useSubscription(): SubscriptionView {
  const { user } = useAuth()
  const [row, setRow] = useState<DbSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRow = useCallback(async () => {
    if (!user) {
      setRow(null)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    setRow((data as DbSubscription | null) ?? null)
    setLoading(false)
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchRow()
  }, [fetchRow])

  // Realtime: reflect webhook-driven changes (trial end, upgrade, cancel) live.
  useEffect(() => {
    if (!user) return
    // Supabase's RealtimeClient.channel(topic) RETURNS an existing channel when
    // one with the same topic is still registered. If the effect re-runs (React
    // StrictMode double-mount in dev, or a new `user` identity) before the prior
    // channel finishes its async unsubscribe, a fixed topic would hand back the
    // already-subscribed channel and `.on('postgres_changes', ...)` throws
    // "cannot add postgres_changes callbacks after subscribe()". A per-instance
    // unique topic guarantees a fresh channel every time, so listeners are always
    // registered before subscribe(). Cleanup still removes it.
    const channel = supabase
      .channel(`subscription:${user.id}:${realtimeNonce()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` },
        () => { fetchRow() },
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, fetchRow])

  const plan: SubscriptionPlan = row?.plan ?? 'free'
  const status: SubscriptionStatus = row?.status ?? 'inactive'
  const entitled = ENTITLED.includes(status)

  return {
    loading,
    subscription: row,
    plan,
    status,
    isPremium: plan === 'premium' && entitled,
    isCreatorPro: plan === 'creator_pro' && entitled,
    isPaid: plan !== 'free' && entitled,
    isTrialing: status === 'trialing',
    trialEnd: row?.trial_end ? new Date(row.trial_end) : null,
    currentPeriodEnd: row?.current_period_end ? new Date(row.current_period_end) : null,
    cancelAtPeriodEnd: row?.cancel_at_period_end ?? false,
    hasCustomer: Boolean(row?.stripe_customer_id),
    refresh: fetchRow,
  }
}
