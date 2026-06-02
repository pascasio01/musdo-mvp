---
name: MUSVORA AI central FAB
description: How the single app-wide AI entry point works and the honesty constraints behind its sessions.
---

# MUSVORA AI — central FAB + unified panel

Single floating gold action button mounted once in `AppShell` (so it appears on every AppShell screen). Opens one bottom-sheet panel — the single AI entry point, NOT a chatbot. Panel offers: Find Music (reuses GlobalSearch), Surprise Me (shuffle), Create Playlist by mood, and 7 context Sessions (Sleep/Study/Focus/Restaurant/Driving/Gym/Event).

## Honesty contract (non-negotiable — see replit.md AI rules)
- Sessions are built ONLY from real song fields. In this catalogue **every song has `bpm` and `genre`; only ~6/39 have `mood`** — so selection keys on **tempo (bpm) + mood-as-bonus + favorites/history affinity + human_verified tie-break**. Genre is NOT used in scoring, so copy must say "tempo y mood", never claim genre curation.
- Every session card shows its REAL track count + REAL BPM range (computed via `buildSession().bpmRange`), surfaced before playback — never invented numbers.
- Create-Playlist only lists moods that actually exist in the catalogue (`availableMoods()` counts real tags).
- **Why:** the platform forbids fake AI certainty/metrics; sessions over a small Latin/bachata catalogue must be transparent about what they really are.

## Engine `src/lib/musvoraAI.ts`
- Pure functions: `buildSession(id, ctx)`, `surpriseMe(ctx)`, `availableMoods()`, `songsByMood(mood)`. `ctx = {favoriteIds, historyIds}`.
- Ordering: `asc`/`desc` by bpm; `arc` (Event) = climb to peak then ease down (even indices ascending, then odd indices reversed).

## Wiring gotchas
- Mounted in `AppShell` (additive). FAB offset: `bottom = song ? 158 : 92` to clear PlayerBar (shown only when a song is active) + BottomNav (`z-40`). FAB wrapper is `fixed inset-x-0 max-w-md mx-auto pointer-events-none`, button `pointer-events-auto` → keeps it aligned to the mobile column's right edge instead of the viewport.
- Panel uses `<GovernanceScope>`; modal needs focus trap + restore focus to FAB on close + Escape routed through `close()` (resets sub-view).
- `/dj` AI DJ route/tab intentionally left intact (non-destructive) even though the supreme rule is "one AI" — removing it would be destructive; defer.
