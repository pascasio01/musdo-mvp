---
name: MUSVORA AI unified panel
description: How the single app-wide AI entry point works and the honesty constraints behind its sessions.
---

# MUSVORA AI — unified panel

The single AI entry point is one full-screen panel (`ai/MusvoraAIPanel.tsx`), NOT a chatbot.
It is opened from the CENTERED bottom-nav AI tab (see `nav-ai-destination.md`) — the old
floating FAB is gone. Panel offers: Find Music (reuses GlobalSearch), Surprise Me (shuffle),
Create Playlist by mood, and 7 context Sessions (Sleep/Study/Focus/Restaurant/Driving/Gym/Event).

## Honesty contract (non-negotiable — see replit.md AI rules)
- Sessions are built ONLY from real song fields. In this catalogue **every song has `bpm` and `genre`; only ~6/39 have `mood`** — so selection keys on **tempo (bpm) + mood-as-bonus + favorites/history affinity + human_verified tie-break**. Genre is NOT used in scoring, so copy must say "tempo y mood", never claim genre curation.
- Every session card shows its REAL track count + REAL BPM range (computed via `buildSession().bpmRange`), surfaced before playback — never invented numbers.
- Create-Playlist only lists moods that actually exist in the catalogue (`availableMoods()` counts real tags).
- **Why:** the platform forbids fake AI certainty/metrics; sessions over a small Latin/bachata catalogue must be transparent about what they really are.

## Engine `src/lib/musvoraAI.ts`
- Pure functions: `buildSession(id, ctx)`, `surpriseMe(ctx)`, `availableMoods()`, `songsByMood(mood)`. `ctx = {favoriteIds, historyIds}`.
- Ordering: `asc`/`desc` by bpm; `arc` (Event) = climb to peak then ease down (even indices ascending, then odd indices reversed).

## Wiring gotchas
- Panel mounted in `AppShell` and driven by the `lib/aiPanel` context (open/openPanel/closePanel); the trigger is the centered nav AI tab, not a FAB. See `nav-ai-destination.md` for the nav/token/motion details.
- Panel uses `<GovernanceScope>`; modal needs focus trap + Escape routed through `close()` (resets sub-view). Focus restore to the trigger is handled by `closePanel()` (stores the trigger element), so the panel itself no longer tracks a FAB ref.
- REBRAND DONE: all AI-feature "DJ" naming removed → "MUSVORA AI / Your Music Director". Page is `pages/MusicDirector.tsx` at `/music-director`; `/dj` now 301-redirects via `<Navigate>`. NEVER rebrand the legit musician/talent role "DJ" (talentData, talent types, "Club & DJ Pools" market) — that is a real profession, not branding. Panel advanced actions wired to REAL helpers (trendingSongs/humanVerifiedSongs/freshSongs); data-impossible asks (Music Twin=cross-user, Around Me=geo, By Language=no field) shown as honest disabled "Pronto" chips, never faked.
