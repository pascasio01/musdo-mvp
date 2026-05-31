---
name: vaultService silent mock fallback
description: vaultService read methods return shared mock data on Supabase error — never trust as "real" without ownership check
---

`vaultService.getDemos(composerId)` / `getLyrics(composerId)` return shared mock
data (`mockDemos`, composer_id `'user-1'`) on a Supabase error or thrown exception,
with `error: null`. So a non-empty result does NOT prove the data is the signed-in
user's real Vault.

**Why:** MUSVORA AI honesty rules forbid labelling mock/sample data as real. A module
that reports "real works from your Vault" off a raw getDemos result will lie whenever
Supabase is down. (Caught in AI Catalog Auditor review.)

**How to apply:** Any feature that distinguishes real vs sample/mock catalogue must
filter returned assets to `composer_id === userId` before treating them as real, and
fall back to a clearly-labelled sample when nothing genuinely owned remains.
