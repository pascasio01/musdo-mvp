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
- Mounted in `AppShell` (additive). FAB offset: `bottom = song ? 158 : 92` to clear PlayerBar + BottomNav (`z-40`). FAB is now CENTERED (`left-1/2` + inline `translateX(-50%)` — do NOT add Tailwind `active:scale-*` which overrides the translate), 66px, glassmorphism (gold-tinted translucent + backdrop blur + gold ring), official MUSVORA logo glyph (white M-note + gold bar, NOT Sparkles), soft breathing glow via `.gv-ai-fab` keyframe in governance.css (honors prefers-reduced-motion). Panel is full-screen (100dvh).
- Panel uses `<GovernanceScope>`; modal needs focus trap + restore focus to FAB on close + Escape routed through `close()` (resets sub-view).
- REBRAND DONE: all AI-feature "DJ" naming removed → "MUSVORA AI / Your Music Director". Page is `pages/MusicDirector.tsx` at `/music-director`; `/dj` now 301-redirects via `<Navigate>`. NEVER rebrand the legit musician/talent role "DJ" (talentData, talent types, "Club & DJ Pools" market) — that is a real profession, not branding. Panel advanced actions wired to REAL helpers (trendingSongs/humanVerifiedSongs/freshSongs); data-impossible asks (Music Twin=cross-user, Around Me=geo, By Language=no field) shown as honest disabled "Pronto" chips, never faked.
