// create-checkout — authenticated.
// Find-or-create the Stripe customer for the signed-in user, then create a
// subscription Checkout Session for the chosen plan. A 15-day trial is granted
// ONLY if this customer has never trialed before (trial_used guard).
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin, getUserFromRequest } from "../_shared/supabaseAdmin.ts";
import { isPaidPlan, priceIdForPlan, TRIAL_DAYS } from "../_shared/plans.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    const user = await getUserFromRequest(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const { plan } = await req.json().catch(() => ({ plan: undefined }));
    if (typeof plan !== "string" || !isPaidPlan(plan)) {
      return jsonResponse({ error: "invalid_plan" }, 400);
    }

    const priceId = priceIdForPlan(plan);
    if (!priceId) return jsonResponse({ error: "price_not_configured" }, 500);

    // Existing membership row (created on a prior checkout, if any).
    const { data: existing } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id, status, trial_used")
      .eq("user_id", user.id)
      .maybeSingle();

    // Enforce a single live subscription server-side. Plan changes (upgrade /
    // downgrade) must go through the Customer Portal, never a second Checkout —
    // this prevents duplicate concurrent Stripe subscriptions and the
    // one-row-per-user state drift that would follow. The UI mirrors this, but
    // the rule is enforced here regardless of client behaviour.
    const liveStatuses = ["active", "trialing", "past_due"];
    if (existing?.stripe_subscription_id && liveStatuses.includes(existing.status ?? "")) {
      return jsonResponse({ error: "already_subscribed" }, 409);
    }

    // Find-or-create the Stripe customer, keyed to this user.
    let customerId = existing?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    // Persist the mapping BEFORE checkout so webhooks can always resolve the
    // user from the customer id, even if the user abandons checkout.
    await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    const trialEligible = !existing?.trial_used;

    const origin = req.headers.get("origin") ?? Deno.env.get("APP_URL") ?? "";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: trialEligible
        ? {
          trial_period_days: TRIAL_DAYS,
          metadata: { supabase_user_id: user.id, plan },
        }
        : { metadata: { supabase_user_id: user.id, plan } },
      metadata: { supabase_user_id: user.id, plan },
      success_url: `${origin}/billing?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
    });

    return jsonResponse({ url: session.url });
  } catch (err) {
    console.error("[create-checkout]", err);
    return jsonResponse({ error: "checkout_failed" }, 500);
  }
});
