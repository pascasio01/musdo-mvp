import { supabase } from './supabase'
import type { PaidPlan } from './useSubscription'

/**
 * Client-side bridge to the Supabase Edge Functions that own the Stripe secret
 * key. `functions.invoke` automatically attaches the signed-in user's access
 * token, which the functions verify before doing anything privileged.
 *
 * No Stripe secret ever reaches the browser — the frontend only sends a plan
 * name and receives a redirect URL.
 */

export interface BillingResult {
  ok: boolean
  /** Stable machine code for the UI to map to a friendly message. */
  error?: string
}

/** Pull the machine error code out of a non-2xx Edge Function response. */
async function errorCode(error: unknown, fallback: string): Promise<string> {
  const ctx = (error as { context?: Response } | null)?.context
  if (ctx && typeof ctx.json === 'function') {
    try {
      const body = await ctx.json()
      if (body && typeof body.error === 'string') return body.error
    } catch { /* not JSON */ }
  }
  return fallback
}

/** Start a Stripe Checkout for a paid plan and redirect the browser to it. */
export async function startCheckout(plan: PaidPlan): Promise<BillingResult> {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan },
    })
    if (error) return { ok: false, error: await errorCode(error, 'checkout_failed') }
    const url = (data as { url?: string } | null)?.url
    if (!url) return { ok: false, error: 'checkout_failed' }
    window.location.href = url
    return { ok: true }
  } catch {
    return { ok: false, error: 'checkout_failed' }
  }
}

/** Open the Stripe Billing Portal (manage / cancel / change plan) and redirect. */
export async function openCustomerPortal(): Promise<BillingResult> {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      body: {},
    })
    if (error) return { ok: false, error: 'portal_failed' }
    const url = (data as { url?: string } | null)?.url
    if (!url) return { ok: false, error: 'no_customer' }
    window.location.href = url
    return { ok: true }
  } catch {
    return { ok: false, error: 'portal_failed' }
  }
}
