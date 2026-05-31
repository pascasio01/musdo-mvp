# MUSVORA — Agent Memory Index

- [Rebrand storage keys](rebrand-storage-keys.md) — `musdo-*` localStorage/SW-cache/Supabase keys are persistence, NOT branding; never rename during MUSDO→MUSVORA rebrand.
- [Governance Design System](governance-design-system.md) — gradual migration: new institutional theme is scoped to `[data-ds="governance"]`; legacy dark-luxury screens stay untouched.
- [Governance module pattern](governance-module-pattern.md) — each new module (Readiness `/readiness`, Catalog Scan `/scan`) = open lazy route + GovernanceScope + one mock `data/*.ts` seam (e.g. `runCatalogScan`) that stays pure/deterministic for future real swap.
- [Auth boot loading](auth-boot-loading.md) — AuthProvider startup must always clear `loading` (getSession catch + profile finally + ~8s timeout) or the MUSVORA splash hangs for returning users.
- [Dev server port (Vite on 5000)](dev-server-port.md) — preview needs :5000; strictPort + kill stray vite/restart when it falls back to :5001
- [vaultService silent mock fallback](vault-service-mock-fallback.md) — read methods return shared mock data on Supabase error; verify composer_id===userId before calling data 'real'.
- [Ownership Confidence engine](ownership-confidence-engine.md) — confidence is derived from missing data + honest gaps, never fabricated; downstream modules consume ownership.ts
- [Honesty vocabulary ban](honesty-vocabulary-ban.md) — banned trust phrases ("Legally Verified" etc.) must not appear in UI copy even when negated; grep src/pages before finishing.
