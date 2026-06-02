---
name: Founder Console (owner-only)
description: Where the owner command surface lives, how it's gated, and the honest-data contract for its metrics.
---

# Founder Console

Owner-only command surface at route **`/owner`** (`pages/owner/OwnerDashboard.tsx`), gated by `<ProtectedRoute requireOwner>` which checks `user.email === VITE_OWNER_EMAIL`. Governance DS (Institutional Dark). Sibling `/admin` (AdminDashboard) is also requireOwner.

It presents **9 vision modules**: Executive Dashboard · Asset Intelligence · Ownership Engine · Song Passport Engine · Revenue Engine · Marketplace Governance · AI Command Center · Security Center · System Health. Each deep-links to an existing real route (`/dashboard`, `/ownership`, `/readiness`, `/vault`, `/market`, `/auditor`, `/security`, `/audit-log`).

## Honest-data contract (MANDATORY)
Real metrics come ONLY from `services/founder.ts` → `loadFounderSnapshot(userId, ownerName)`, a read-only orchestration over `loadOwnershipPortfolio` (ownership.ts). That engine trusts only assets genuinely owned by the user and otherwise returns a clearly-labelled **sample** (`source: 'sample'`). So Founder tiles must:
- show computed values for assetCount / ownershipConfidence / worksNeedingAction / status breakdown;
- mark anything with NO connected source (platform-wide users, revenue, system health, real-time monitoring) as **Pending Integration** — never a fabricated number;
- never claim "Live from your Vault" when `source === 'sample'`.

**Why:** owner directive is production-grade only — no fake metrics, no demo UI, no placeholder business data; use real data or honest Pending Integration / Pending Verification / Internal Preview.

**How to apply:** when wiring a new Founder metric, add it to `loadFounderSnapshot` only if a genuine source exists; otherwise render a pending state. Readiness scoring (`data/readiness.ts`) is MOCK — do not surface it as a real metric.

## Product Evolution (Module 22)
`lib/evolution.ts` is a governance-only registry surfaced in the owner console: DESIGN_VERSIONS (v1 Dark-Luxury active, v2 Governance DS migrating, v3 reserved — match replit.md reality), EVOLUTION_PRINCIPLES (text), MODERNIZATION_AUDIT (state `manual` = reviewed by hand vs `pending` = needs telemetry not connected).

**Why:** Module 22 mostly needs telemetry MUSVORA does NOT collect (navigation/drop-off/session/adoption/competitor analysis). No analytics pipeline exists.

**How to apply:** keep audit areas `pending` (no fabricated score) until a real event pipeline exists; never claim automated trend/competitor/UX analysis is active.
