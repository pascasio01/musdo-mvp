---
name: Trend Intelligence (Module 21)
description: How MUSVORA computes trends honestly — what's real, what's structurally impossible without a backend.
---

# Engine
- `src/lib/trends.ts` is a pure engine (honesty contract). Personal facets take the user's resolved `historySongs` (from `useLibrary`) as input — no React, no fabrication.
- Real, buildable facets: `freshForYou(history)` (catalogue minus played set, ranked by `created_at` then plays), `yourGenres`/`yourMoods` (leanings counted from really-played songs), `moreLikeGenre` (unplayed tracks in the user's top genre).
- Catalogue-level trending already lives in `djCurator.ts` (plays/genre/mood/bpm/human_verified/topArtists) — don't duplicate it.

# Hard constraints (why facets are NOT built)
- **Play history dedupes by song id** (`library.ts` filters out prior entries before prepending). So there are NO repeat-play counts → "on repeat / most replayed" would be fabricated. Never build it from this store.
- No cross-user/backend events table, no geo/country/language field, no time-series of play counts, no skip/completion tracking.
- **Therefore PENDING (never fake):** Trending Worldwide/Near Me, By Country/Language, Fastest Growing (needs growth over time), Save/Skip/Completion rates, scheduled Smart Refresh. These are declared in `PENDING_TREND_FACETS` and shown as honest "Pending Integration" roadmap cards.

**Why:** Module 21 asks for a huge trend surface; most of it needs infra that doesn't exist. The rule is to ship the real personal layer and surface the rest as honest Pending, not invented numbers.

**How to apply:** when a backend events table lands, replace each pending facet only behind an explicit data-availability check; until then keep them Pending.

# Surface
- Shown on the Music Director page (`AIDJComplace.tsx`): a "For You" section (real `historySongs`, honest empty state when no history; "Fresh for you · not in your history" works even for new users) + a "More Trending Soon" roadmap from `PENDING_TREND_FACETS`.
