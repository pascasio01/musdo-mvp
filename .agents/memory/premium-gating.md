---
name: Premium feature gating
description: How MUSVORA gates premium/creator features — the centralized matrix, the entitlement source, and where the real (server) enforcement lives.
---

# Premium feature gating

Centralized system. The SINGLE source of "which plan unlocks what" is `src/lib/access.ts`
(`FEATURE_MATRIX: Feature -> min Plan`, tiers `free < premium < creator_pro`). Every UI
surface asks `usePermissions().can(feature)` — never check plan/status strings inline.

**Why:** scattered plan checks drift and leak access. One matrix + one hook keeps the client
and the DB ranking identical.

## Entitlement (effective plan)
`usePermissions` derives effective plan from `useSubscription`, which treats ONLY
`active | trialing | past_due` as entitled. So a trial counts as its paid plan, and an
expired/canceled sub collapses to `free` automatically. Do NOT read the raw `subscriptions.plan`
column for gating — it can be a paid plan with an inactive status.

## Frontend is UX-only — real enforcement is in the DB
**How to apply:** route/feature gates (`RequirePlan`, `FeatureLock`, the Paywall) are upsell UX
and are bypassable by a determined client. The binding enforcement for data writes is Supabase
RLS in `frontend/db/schema_access.sql`: `public.user_plan()` / `public.has_min_plan()` (SECURITY
DEFINER, mirror the same entitled-status set) plus **RESTRICTIVE** `for all ... using(true) with
check(has_min_plan)` policies that AND on top of existing owner policies — gating INSERT+UPDATE
while leaving SELECT/DELETE open. Guarded by `to_regclass` AND an existing-policy check so they
never lock a table that has no owner policy (enabling RLS on a policy-less table denies everyone).

## Known client-only limits (cannot be server-enforced as built)
- **MUSVORA AI** is 100% client-side (`lib/musvoraAI.ts`) — no server to enforce; `ai.advanced`
  gate is UX only.
- **Playlists** live in localStorage (`lib/library.ts`), not the `playlists` table yet — the
  `playlists_requires_premium` RLS policy is future-proofing for when they migrate.
- Gate offline at the ACTION (`DownloadButton`, PlaylistDetail "download all"), not just the
  `/downloads` route, or free users download via `useOffline()` directly.
