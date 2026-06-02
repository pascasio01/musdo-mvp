# MUSVORA — Supabase Edge Functions (Stripe Monetization)

Real Stripe subscriptions for the static SPA, with **no second backend**. The
Stripe secret key lives only as a Supabase secret. Membership state is stored in
Supabase and is written **only** by the webhook (service role). Clients can read
their own row but can never write it (see `frontend/db/schema_billing.sql`).

## Functions

| Function | Auth | Purpose |
|---|---|---|
| `create-checkout` | user JWT | Creates a Stripe Checkout Session (15-day trial if eligible) |
| `customer-portal` | user JWT | Opens the Stripe Billing Portal (cancel/upgrade/downgrade/payment method) |
| `stripe-webhook` | Stripe signature | Syncs subscription + invoices into Supabase |

## One-time setup

### 1. Apply the database schema
Run `frontend/db/schema_billing.sql` in the Supabase SQL editor (or via CLI).

### 2. Create the products/prices in Stripe
In the Stripe Dashboard (test mode first), create two recurring monthly prices:
- **Premium** — $7.99 / month
- **Creator Pro** — $14.99 / month

Copy each `price_...` id.

### 3. Set the Edge Function secrets (in Supabase, never in the frontend)
```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_xxx \
  STRIPE_WEBHOOK_SECRET=whsec_xxx \
  STRIPE_PRICE_PREMIUM=price_xxx \
  STRIPE_PRICE_CREATOR_PRO=price_xxx \
  APP_URL=https://your-deployed-site.example
```
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by the
Edge runtime — do not set them manually.

### 4. Deploy the functions
```bash
supabase functions deploy create-checkout
supabase functions deploy customer-portal
supabase functions deploy stripe-webhook
```
`config.toml` already disables the gateway JWT check for all three (the webhook
uses the Stripe signature; the other two verify the user token in code).

### 5. Register the webhook in Stripe
Point a Stripe webhook endpoint at:
```
https://<project-ref>.functions.supabase.co/stripe-webhook
```
Subscribe to at least:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Copy the endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` (step 3) and
redeploy `stripe-webhook` if you set it afterwards.

## Going live
Swap the test keys/prices for live ones (`sk_live_…`, live `price_…`), update the
secrets, and redeploy. No frontend changes are required — the client only ever
sends plan names (`premium` / `creator_pro`).

## Trial policy
- 15-day trial on Premium and Creator Pro.
- One trial per Stripe customer (`trial_used` flag, never reset).
- Best-effort only: a brand-new account with a different email is a different
  Stripe customer and would be eligible again. Absolute cross-account
  prevention is not possible without identity verification.
