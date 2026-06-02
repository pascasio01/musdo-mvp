-- ============================================================================
-- MUSVORA Billing / Monetization — Supabase Schema (Sprint F)
-- ----------------------------------------------------------------------------
-- Membership state lives in Supabase but is OWNED by Stripe. The ONLY writer of
-- these tables is the Stripe webhook Edge Function, which uses the service-role
-- key and therefore bypasses RLS. Clients (anon / authenticated) may ONLY read
-- their own row — they can NEVER insert, update or delete membership data.
--
-- This file is additive and idempotent. Apply it in the Supabase SQL editor or
-- via the CLI on top of the existing schema. It does not touch other tables.
-- ============================================================================

-- ─── 1. subscriptions (one row per user, mirrors Stripe) ─────────────────────
create table if not exists public.subscriptions (
  user_id                uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  plan                   text not null default 'free'
                           check (plan in ('free','premium','creator_pro')),
  status                 text not null default 'inactive'
                           check (status in (
                             'inactive','trialing','active','past_due',
                             'canceled','incomplete','incomplete_expired',
                             'unpaid','paused'
                           )),
  trial_end              timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  -- Best-effort "one trial per customer" guard. Once a customer has ever
  -- started a trial this flips true and is never reset, so re-subscribing the
  -- same Stripe customer will not grant another free trial.
  trial_used             boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx on public.subscriptions(stripe_customer_id);
create index if not exists subscriptions_subscription_idx on public.subscriptions(stripe_subscription_id);

-- ─── 2. billing_invoices (real payment history, mirrors Stripe invoices) ──────
create table if not exists public.billing_invoices (
  id                  text primary key,                       -- Stripe invoice id
  user_id             uuid not null references public.profiles(id) on delete cascade,
  amount_total        integer not null default 0,             -- in the smallest currency unit (cents)
  currency            text not null default 'usd',
  status              text,                                   -- paid / open / void / uncollectible
  plan                text,                                   -- premium / creator_pro (best-effort)
  hosted_invoice_url  text,
  invoice_pdf         text,
  period_start        timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists billing_invoices_user_idx
  on public.billing_invoices(user_id, created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- SELECT: a user can read only their own membership / invoices.
-- INSERT/UPDATE/DELETE: NO client policy exists, so these are denied for anon
-- and authenticated roles. Only the service-role webhook (which bypasses RLS)
-- can write. This is the core security guarantee — clients cannot self-upgrade.
-- ============================================================================

alter table public.subscriptions enable row level security;
drop policy if exists "subscriptions_select_self" on public.subscriptions;
create policy "subscriptions_select_self" on public.subscriptions
  for select using (auth.uid() = user_id);

alter table public.billing_invoices enable row level security;
drop policy if exists "billing_invoices_select_self" on public.billing_invoices;
create policy "billing_invoices_select_self" on public.billing_invoices
  for select using (auth.uid() = user_id);
