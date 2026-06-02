// customer-portal — authenticated.
// Opens the Stripe Billing Portal for the signed-in user. The portal handles
// cancel, resume, upgrade, downgrade and payment-method updates; all changes
// flow back to Supabase via the stripe-webhook function.
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin, getUserFromRequest } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    const user = await getUserFromRequest(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const { data: row } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!row?.stripe_customer_id) {
      return jsonResponse({ error: "no_customer" }, 404);
    }

    const origin = req.headers.get("origin") ?? Deno.env.get("APP_URL") ?? "";

    const session = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${origin}/billing`,
    });

    return jsonResponse({ url: session.url });
  } catch (err) {
    console.error("[customer-portal]", err);
    return jsonResponse({ error: "portal_failed" }, 500);
  }
});
