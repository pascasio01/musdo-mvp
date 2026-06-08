// stripe-webhook — public (no Supabase JWT; authenticity comes from the Stripe
// signature). Deploy with verify_jwt = false (see supabase/config.toml).
//
// This is the ONLY writer of the subscriptions / billing_invoices tables. It
// uses the service-role client (bypasses RLS) and is idempotent.
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { stripe, cryptoProvider, Stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { planForPriceId } from "../_shared/plans.ts";

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

function toIso(seconds: number | null | undefined): string | null {
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

// Resolve our Supabase user id from a Stripe customer. Prefers the locally
// stored mapping; falls back to the customer's metadata if the row is missing.
async function resolveUserId(customerId: string | null): Promise<string | null> {
  if (!customerId) return null;
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (data?.user_id) return data.user_id;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (!("deleted" in customer) || !customer.deleted) {
      const meta = (customer as Stripe.Customer).metadata ?? {};
      return meta.supabase_user_id ?? null;
    }
  } catch (_e) { /* ignore */ }
  return null;
}

async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = await resolveUserId(customerId);
  if (!userId) {
    console.error("[webhook] no user for customer", customerId);
    return;
  }

  const priceId = sub.items.data[0]?.price?.id ?? null;
  const deleted = sub.status === "canceled";
  const plan = deleted ? "free" : planForPriceId(priceId);
  const trialEnd = toIso(sub.trial_end);

  // trial_used is monotonic: once true it stays true.
  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("trial_used")
    .eq("user_id", userId)
    .maybeSingle();
  const trialUsed = Boolean(existing?.trial_used) || sub.status === "trialing" || trialEnd !== null;

  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      plan,
      status: sub.status,
      trial_end: trialEnd,
      current_period_end: toIso(sub.current_period_end),
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      trial_used: trialUsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

async function recordInvoice(invoice: Stripe.Invoice): Promise<void> {
  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : invoice.customer?.id ?? null;
  const userId = await resolveUserId(customerId);
  if (!userId) return;

  const priceId = invoice.lines.data[0]?.price?.id ?? null;

  // The receipt links (hosted_invoice_url / invoice_pdf) are only populated once
  // an invoice is finalized. Different events for the same invoice can arrive
  // with or without them, so never let a later event with null links clobber a
  // value we already captured — fall back to what we have on record.
  const { data: existing } = await supabaseAdmin
    .from("billing_invoices")
    .select("hosted_invoice_url, invoice_pdf")
    .eq("id", invoice.id)
    .maybeSingle();

  await supabaseAdmin.from("billing_invoices").upsert(
    {
      id: invoice.id,
      user_id: userId,
      amount_total: invoice.amount_paid ?? invoice.amount_due ?? 0,
      currency: invoice.currency ?? "usd",
      status: invoice.status ?? null,
      plan: planForPriceId(priceId),
      hosted_invoice_url: invoice.hosted_invoice_url ?? existing?.hosted_invoice_url ?? null,
      invoice_pdf: invoice.invoice_pdf ?? existing?.invoice_pdf ?? null,
      period_start: toIso(invoice.period_start),
      created_at: toIso(invoice.created) ?? new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const signature = req.headers.get("stripe-signature");
  if (!signature) return jsonResponse({ error: "missing_signature" }, 400);

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return jsonResponse({ error: "invalid_signature" }, 400);
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.trial_will_end":
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subId = typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(sub);
        }
        break;
      }
      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
        await recordInvoice(event.data.object as Stripe.Invoice);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[webhook] handler error", event.type, err);
    return jsonResponse({ error: "handler_error" }, 500);
  }

  return jsonResponse({ received: true });
});
