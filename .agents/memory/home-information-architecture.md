---
name: Home page information architecture
description: Why the MUSVORA Home is 5 calm areas, not the old dense Asset Intelligence dashboard, and where the intelligence lives now.
---

# Home IA — 5 primary areas

`pages/Home.tsx` is intentionally simplified to **5 primary areas**, in order:
1. **Continue Listening** — REAL per-user history via `useLibrary().historySongs`, with an honest empty state (no mock slices).
2. **Discover** — the browsable catalogue (`mockSongs`, sorted by readiness), labelled in-section as a sample catalogue.
3. **AI Music Director** — single card → `/dj`.
4. **Library** — single card with real favorite/playlist counts → `/library`.
5. **My Music** — ONE consolidated card (readiness ring + assets/at-risk/opportunities summary) → `/readiness`.

**Why:** brand brief + user asked to cut cognitive load and keep every important
action within ≤3 taps. The old Home was a dense 7-section dashboard (readiness hero,
2×2 metric grid, Next Best Action, 4 song rows, Works At Risk, Revenue
Opportunities). That density worked against the "simpler than Spotify/Apple Music"
goal.

**How to apply / don't regress:**
- Do NOT re-add the full Works-At-Risk / Revenue Opportunities / Next-Best-Action
  blocks to Home. That detail was **not deleted** — it lives in full at `/readiness`,
  and the My Music card links there. Consolidation, not removal.
- Keep search **always visible** in the sticky header (brand requirement).
- Continue Listening must stay wired to real library history; never fall back to
  mock slices to fake activity. Discover may use the catalogue but must read as a
  sample/demo catalogue (honesty rule).
- The old `components/home/AssetSections.tsx` was removed (it became dead code after
  this redesign); don't resurrect it.
