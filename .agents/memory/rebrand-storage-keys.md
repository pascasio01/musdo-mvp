---
name: Rebrand storage keys
description: Why the musdo- prefix must survive the MUSDO→MUSVORA rebrand
---

The product is being rebranded MUSDO → MUSVORA. **Only brand-visible text changes**
(UI strings, page titles, metadata, manifest, favicon). Persistence identifiers do NOT.

**Invariant:** never rename anything matching the lowercase `musdo-` / `musdo_` prefix
(localStorage keys, the Supabase auth `storageKey` + client header, the service-worker
cache namespace, the storage probe). These are persistence keys, not branding.

**Why:** renaming the auth storageKey logs every existing user out; renaming a
localStorage key silently wipes their saved settings/personalization. It looks like a
regression, not a rebrand. The user's standing rule is "never change business logic."

**How to apply:** rebrand only uppercase `MUSDO` / title-case brand text. A safe sweep
is `rg -l 'MUSDO'` (case-sensitive smart-case) → `sed 's/MUSDO/MUSVORA/g'`, which leaves
lowercase `musdo` identifiers untouched. Always grep lowercase `musdo` afterward to
confirm no key was caught.
