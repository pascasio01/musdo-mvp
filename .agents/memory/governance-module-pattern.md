---
name: Governance module pattern
description: How new MUSVORA governance modules (Readiness, Catalog Scan, future Vault/Recovery/etc.) are structured for gradual migration + future real backend.
---

New MUSVORA intelligence/governance modules follow one consistent shape so the gradual migration stays clean and future real integrations are a drop-in.

**The pattern**
- One page in `src/pages/` wrapped in `<GovernanceScope>`, using only governance primitives (`Button`, `Card`, `Badge`, `SectionHeader`, `StatTile`) + `--gv-*` tokens. No legacy dark-luxury imports.
- Registered as an **open** lazy route in `src/App.tsx` under the "Governance Modules" comment block (so it's directly viewable with mock data, not behind auth).
- All data/logic lives in a single `src/data/<module>.ts` file that is the **only seam** to a future real backend. Keep these functions **pure and deterministic** (no `Date.now()`, no randomness) so identical inputs give identical output — the UI contract (types) stays stable when the real engine replaces the function body.
- Shared status vocabulary is reused across modules: `ReadinessStatus` + `STATUS_META` + `scoreStatus()` from `data/readiness.ts` (thresholds: ≥80 ready/green, ≥55 attention/amber, else risk/red). Scan severity HIGH/MEDIUM/LOW maps to danger/warning/success tones.

**Why:** replit.md mandates gradual, non-destructive migration and "create architecture only, ready for future real integrations." Keeping one pure seam per module means swapping mock→real touches one file and the determinism keeps it testable.

**How to apply:** when building the next module (Vault, Recovery Center, Ownership, Passport, AI Auditor), mirror Readiness/Scan: GovernanceScope page + open lazy route + single pure `data/*.ts` engine. Do not modify existing screens or other modules.
