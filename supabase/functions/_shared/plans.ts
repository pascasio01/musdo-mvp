// Plan <-> Stripe price mapping. Price IDs are stored as Edge Function secrets
// so the catalogue can change without a code deploy. Price IDs are not secret
// in the cryptographic sense, but keeping them server-side means the client
// only ever speaks in plan names ("premium" / "creator_pro").
export type PaidPlan = "premium" | "creator_pro";
export type Plan = "free" | PaidPlan;

export const TRIAL_DAYS = 15;

export function priceIdForPlan(plan: PaidPlan): string | null {
  if (plan === "premium") return Deno.env.get("STRIPE_PRICE_PREMIUM") ?? null;
  if (plan === "creator_pro") {
    return Deno.env.get("STRIPE_PRICE_CREATOR_PRO") ?? null;
  }
  return null;
}

export function planForPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "free";
  if (priceId === Deno.env.get("STRIPE_PRICE_PREMIUM")) return "premium";
  if (priceId === Deno.env.get("STRIPE_PRICE_CREATOR_PRO")) return "creator_pro";
  return "free";
}

export function isPaidPlan(plan: string): plan is PaidPlan {
  return plan === "premium" || plan === "creator_pro";
}
