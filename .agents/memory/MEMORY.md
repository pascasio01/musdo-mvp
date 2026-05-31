# MUSVORA — Agent Memory Index

- [Rebrand storage keys](rebrand-storage-keys.md) — `musdo-*` localStorage/SW-cache/Supabase keys are persistence, NOT branding; never rename during MUSDO→MUSVORA rebrand.
- [Governance Design System](governance-design-system.md) — gradual migration: new institutional theme is scoped to `[data-ds="governance"]`; legacy dark-luxury screens stay untouched.
- [Governance module pattern](governance-module-pattern.md) — each new module (Readiness `/readiness`, Catalog Scan `/scan`) = open lazy route + GovernanceScope + one mock `data/*.ts` seam (e.g. `runCatalogScan`) that stays pure/deterministic for future real swap.
