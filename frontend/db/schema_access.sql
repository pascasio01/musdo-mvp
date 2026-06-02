-- ============================================================================
-- MUSVORA Access Control — Server-Side Plan Enforcement (Premium Gating)
-- ----------------------------------------------------------------------------
-- The frontend permission system (src/lib/access.ts + usePermissions) is UX
-- only. THIS file is the part that makes "never trust frontend checks" true:
-- it teaches Postgres what plan a user is entitled to and refuses creator /
-- premium WRITES at the database level, regardless of what the client sends.
--
-- Design:
--   * `public.user_plan()`   — the effective plan for the calling user, derived
--                              from the Stripe-owned `subscriptions` table. Only
--                              active / trialing / past_due count as entitled,
--                              so an expired or canceled subscription collapses
--                              to 'free' — exactly mirroring the frontend.
--   * `public.has_min_plan()`— boolean tier comparison, single source of the
--                              free < premium < creator_pro ranking on the DB.
--   * RESTRICTIVE insert policies — they are AND-combined with whatever
--     permissive (e.g. owner = auth.uid()) policies already exist, so they
--     ADD a plan requirement without dropping or weakening existing rules.
--
-- This file is additive and idempotent. Each table guard is wrapped in a
-- `to_regclass` check so it is safe to run even if a table does not exist yet.
-- NOTE: a RESTRICTIVE policy only binds when RLS is ENABLED on the table. The
-- guards below enable RLS only when at least one policy already exists, to
-- avoid accidentally locking a table that has none.
-- ============================================================================

-- ─── 1. Effective plan for the current user ──────────────────────────────────
-- SECURITY DEFINER so it can read `subscriptions` past that table's own RLS.
create or replace function public.user_plan()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select case
               when s.status in ('active', 'trialing', 'past_due') then s.plan
               else 'free'
             end
      from public.subscriptions s
      where s.user_id = auth.uid()
      limit 1
    ),
    'free'
  );
$$;

revoke all on function public.user_plan() from public;
grant execute on function public.user_plan() to authenticated;

-- ─── 2. Tier comparison: does the user meet at least `min_plan`? ──────────────
create or replace function public.has_min_plan(min_plan text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    (case public.user_plan()
       when 'creator_pro' then 2
       when 'premium'     then 1
       else 0
     end)
    >=
    (case min_plan
       when 'creator_pro' then 2
       when 'premium'     then 1
       else 0
     end);
$$;

revoke all on function public.has_min_plan(text) from public;
grant execute on function public.has_min_plan(text) to authenticated;

-- ─── 3. Restrictive plan policies on protected write tables ──────────────────
-- Helper: add a RESTRICTIVE insert policy requiring `min_plan`, but only if the
-- table exists AND already has at least one policy (so RLS is in real use).
do $$
declare
  t          text;
  pol        text;
  cfg        record;
  schema_nm  text;
  table_nm   text;
  policy_cnt int;
begin
  for cfg in
    select * from (values
      ('public.demos',     'creator_pro', 'demos_requires_creator_pro'),
      ('public.lyrics',    'creator_pro', 'lyrics_requires_creator_pro'),
      ('public.licenses',  'creator_pro', 'licenses_requires_creator_pro'),
      ('public.playlists', 'premium',     'playlists_requires_premium')
    ) as v(tbl, min_plan, pol_name)
  loop
    t   := cfg.tbl;
    pol := cfg.pol_name;

    if to_regclass(t) is null then
      raise notice 'skip % (table not present)', t;
      continue;
    end if;

    schema_nm := split_part(t, '.', 1);
    table_nm  := split_part(t, '.', 2);

    -- Only act on tables that already have permissive policies in place. This
    -- guarantees RLS is genuinely in use and an owner-write rule already exists,
    -- so adding the restrictive plan policy ANDs on top without locking a table
    -- that otherwise has no policy (which would deny all owner access).
    select count(*) into policy_cnt
    from pg_policies
    where schemaname = schema_nm and tablename = table_nm and policyname <> pol;

    if policy_cnt = 0 then
      raise notice 'skip % (no existing permissive policy; add owner policy first)', t;
      continue;
    end if;

    -- Ensure RLS is on so the restrictive policy actually binds.
    execute format('alter table %s enable row level security;', t);

    -- Idempotent: drop then recreate the restrictive plan policy.
    -- `for all` + `using (true)` gates the WRITE paths that ADD/CHANGE protected
    -- content (INSERT + UPDATE go through WITH CHECK) while leaving SELECT and
    -- DELETE unrestricted by this policy — a downgraded user can still read and
    -- clean up their existing assets, but cannot create or modify protected ones.
    execute format('drop policy if exists %I on %s;', pol, t);
    execute format(
      'create policy %I on %s as restrictive for all to authenticated '
      || 'using (true) with check (public.has_min_plan(%L));',
      pol, t, cfg.min_plan
    );

    raise notice 'applied % on % (min plan %)', pol, t, cfg.min_plan;
  end loop;
end $$;

-- ============================================================================
-- IMPORTANT — for the server gate to actually bind, each protected table must
-- already have its OWNER permissive policy (e.g. auth.uid() = user_id/owner_id)
-- AND RLS enabled. The DO block above enables RLS; if a table previously had no
-- permissive policy, add one (owner-scoped) so legitimate owners can still
-- write. The restrictive plan policy only ADDS the plan requirement on top.
-- ============================================================================
