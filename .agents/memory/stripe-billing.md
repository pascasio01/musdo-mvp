---
name: Stripe billing
description: How real Stripe monetization works in MUSVORA — Option B (Supabase Edge Functions), trial + single-subscription rules, and the security model.
---

# Stripe monetization — Option B

MUSVORA stays a static SPA. There is NO Replit backend for billing. Stripe runs
entirely through **Supabase Edge Functions** + two Supabase tables. The Stripe
**stripe-replit-sync** skill (Option A / Express / Replit Postgres) is NOT used —
only its "use real Stripe price IDs" rule was borrowed.

## Pieces
- Tables (`frontend/db/schema_billing.sql`): `subscriptions` (one row per user, PK=user_id) + `billing_invoices`. RLS = SELECT-own only; **no client write policy** → only the service-role webhook writes. This is the core anti-self-upgrade guarantee.
- Edge Functions (`supabase/functions/`): `create-checkout`, `customer-portal` (both verify the user's access token via `getUserFromRequest`), `stripe-webhook` (verifies Stripe signature with `constructEventAsync` + subtle-crypto provider). All three set `verify_jwt = false` in `config.toml` and enforce auth in code.
- Frontend: `lib/useSubscription.ts` (read-only hook, realtime), `lib/billing.ts` (`startCheckout`/`openCustomerPortal` via `supabase.functions.invoke`, which auto-attaches the JWT). Pricing/Billing/Settings consume them.

## Rules baked into the design (don't break these)
- **Single live subscription is enforced SERVER-SIDE** in `create-checkout`: if the user has a `stripe_subscription_id` with status active/trialing/past_due it returns `409 already_subscribed`. Plan changes (upgrade/downgrade) MUST go through the Customer Portal, never a 2nd Checkout — a 2nd subscription would corrupt the one-row-per-user model. The UI mirrors this but the function is the source of truth.
- **Trial = 15 days on both paid plans, one per customer.** Guarded by the monotonic `trial_used` flag (set true once trialing/trial_end seen, never reset). Best-effort only: a new account with a different email = different Stripe customer = eligible again. Documented limitation, not a bug.
- **Cancel keeps benefits until period end:** `cancel_at_period_end=true` keeps plan/status; only `customer.subscription.deleted` downgrades to `plan='free', status='canceled'`.

## Deploy / secrets (user action, see `supabase/README.md`)
Secrets live ONLY as Supabase function secrets, never in the frontend: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PREMIUM`, `STRIPE_PRICE_CREATOR_PRO`, optional `APP_URL` (success/cancel/return origin fallback). `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` auto-injected. Until the user creates Stripe prices + sets secrets + deploys functions + registers the webhook, checkout will error with a toast (honest, no fake "live" claim).

## Receipt emails (after each payment)
Member payment receipts use **Stripe's native automatic receipts**, NOT a custom
email. There is no pure-code way to force Stripe to email a receipt that bypasses
the account-level Dashboard switch (Settings → Customer emails → "Successful
payments"), and it's per-mode (test receipts never actually deliver). So this is
a documented one-time setup step (supabase/README.md step 6), not code.
- Code's only job: keep the Stripe customer email current so receipts reach the
  right inbox — `create-checkout` sets it on customer creation and refreshes it
  when an existing customer re-subscribes.
- Renewals are covered automatically by Stripe (same invoice.payment_succeeded
  events already subscribed); no extra webhook wiring.
- A branded/self-sent receipt from the webhook is the documented alternative but
  needs an email provider (Resend) + secret — deliberately NOT added.
