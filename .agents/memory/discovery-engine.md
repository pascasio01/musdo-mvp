---
name: Discovery Engine (emotional/contextual/AI lenses)
description: How MUSVORA's discovery surface curates the real catalogue into emotional/contextual/AI lenses, and the honesty rules that keep it real over a tiny catalogue.
---

# Discovery Engine — real lenses, never a fake library

`lib/discovery.ts` (pure) turns the REAL catalogue into three groups of "lenses":
AI Picks (Surprise Me / Your Next Obsession / Based On Your Week / Something Different),
8 Emotional lenses, 8 Context lenses. UI is `components/discovery/DiscoveryExplorer.tsx`,
rendered in the **Search tab idle state** (the browse surface — preserves the 5-item nav).
It replaced the old generic mood-chip browse block.

## Honesty rules (non-negotiable — see replit.md)
- A lens is a **curation rule** (bpm band + mood set + real engagement/favorites/history),
  NOT a metadata claim. Labels like "Nostalgia"/"Heartbroken" are lenses, not tags the
  songs carry.
- A lens that resolves to **0 qualifying tracks is hidden** — never render an empty/❝coming soon❞ lens.
- Each lens card shows its **real** count + **real** BPM range (or top real mood). Never invent counts.
- `Based On Your Week` with no play history falls back to real trending and is labelled
  "Aún sin historial…" with `personalized:false` — it does not pretend to be personalised.
- **Why:** the catalogue is small (currently 6 songs, moods only romantic/late_night/emotional/sad/street).
  Honest curation over few real tracks beats faking a big library. Adding songs auto-enriches every lens.

## How to apply / extend
- Add a lens by appending a `LensConfig` (center/band/moods/order) to `EMOTION_LENSES`/`CONTEXT_LENSES`
  — membership = mood match OR within tempo band (`qualifies`), ranked by `scoreFor`, capped by `size`.
- Reuses `musvoraAI` helpers (`surpriseMe`/`trendingSongs`/`moodLabel`) — keep the AI honesty contract in sync.
- The dead `aiMockData.ts` + `AIDiscoveryBar.tsx` are NOT used here (and are unimported); do not wire them in.
