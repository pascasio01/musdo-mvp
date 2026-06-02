---
name: AI DJ Complace data honesty
description: What is real vs honest-pending in the /dj module and its curation layer, and the data-honesty contract that governs it.
---

# AI DJ Complace (/dj)

Phase 1 "Music Director" module, Governance DS. Curation lives in a pure selector
layer fed strictly by the live catalogue + the user's library.

## What is real (derivable from catalogue fields)
- Trending — ranked **strictly by `analytics.plays`**, deterministic id tiebreak.
- Best by Genre / Mood / BPM — direct catalogue filters.
- Human Verified — `human_verified` flag.
- Top Artists — aggregated by plays (NOT labeled "independent" — see below).
- Composers / Producers — from `credits.composer` / `credits.producer`.
- Lyrics search — from `mockLyrics` (plain + synced text).

## Data-honesty contract (enforced; an architect review failed the sprint over these)
**Why:** standing directive — no fabricated metrics / placeholder stats / claimed
classifications. **How to apply:**
- Do NOT rank "trending" by `emotional_engagement` or any signal beyond the agreed
  selector set (genre, mood, bpm, human_verified, plays, credits). Engagement was
  rejected as outside the contract.
- Do NOT title a section with a claim the data can't back. There is no `independent`
  field, so "Best Independent Artists" was rejected → use "Top Artists by Plays".
- Anything not yet wired (Smart Mixing, Adaptive Intelligence, Business/Offline,
  By Location, Experience Modes) must read Coming Soon / Pending Integration — never
  a fake session or number.

## Albums
No album field on `Song` → Albums stays "Pending Integration" everywhere (search included).
