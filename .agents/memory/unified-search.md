---
name: Unified Search V1
description: How MUSVORA's real search is built and the honesty rules it must keep
---

# Unified Search

The canonical search is the `/search` page (a bottom-nav tab), backed by a pure
engine in `src/lib/search.ts` (`searchAll`, `fuzzyScore`, `suggest`, `topAvailable`).
The page is a new module → Governance DS (`--gv-*` inside `<GovernanceScope>`),
wrapped in `<AppShell>` so nav + player + AI FAB appear.

**Honesty contract (non-negotiable):**
- Index ONLY real data: `mockSongs`, `mockLyrics`, user playlists, composer/producer
  credits via `djCurator`. Artists are derived from songs.
- **Albums stay empty** — there is no album data model. Never invent album results;
  surface "Albums · Pending Integration".
- A query with no real catalogue match (e.g. a global artist like "Romeo Santos")
  must NOT fabricate an entry. Show "Not available for playback yet" + real
  `availableInMusvora` recommendations (top tracks by `analytics.plays`).

**Why:** the supreme rule is strict honesty — never claim music is available/playable
unless it legally exists in the app.

**How to apply / gotchas:**
- Song scoring MUST include `credits.composer` and `credits.producer`, otherwise
  drilling into a composer/producer row (which re-runs the query with their name)
  dead-ends with zero playable songs while `hasMatches` is still true.
- Keep `searchAll` pure: never call React `setState` inside the `useMemo` that runs
  it. Return a `{ results, computeError }` tuple and read the flag in render.
- Recent searches persist under the `musdo-recent-searches` key (musdo- prefix is a
  persistence convention — never rename).
- The legacy `GlobalSearch` overlay still exists (Home/Library/etc. headers); the
  page is the unified destination. The AI FAB "Find Music" navigates to `/search`.
- BottomNav is exactly Home · Search · Library · Vault · Profile. `/dj` (AI DJ) and
  `/scan` routes still exist — they were only removed from the nav bar.
