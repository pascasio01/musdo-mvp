---
name: Ownership Confidence engine
description: Why ownership confidence is derived/honest-gap based, and how downstream modules should consume it
---

# Ownership Confidence — derived, not stored

`frontend/src/services/ownership.ts` is the pure engine. Song Passport, Recovery
Center and Marketplace eligibility are meant to consume it (do not re-derive).

**Rule:** The Vault data model (Demo/Lyrics) stores NO contributors, splits,
signatures or verification. So ownership confidence is *computed from absence*:
a real bare demo yields one unverified, unsigned Composer with undocumented
splits → low confidence (~35) + honest gaps. Never fabricate splits/contributors
to inflate the score.

**Why:** MUSVORA honesty rules — show what's missing, never assert "Legally
Verified Ownership"/certify. Confidence must be deterministic (fixed signal
weights summing 100), never random.

**How to apply:** When building Recovery/Marketplace, treat low confidence +
populated `gaps[]` as the source of "ownership gap" opportunities and the
eligibility gate (Ownership Confidence >= 80). Keep the mock-fallback guard
(`composer_id === userId`) on any new Vault read, or sample data masquerades as real.
