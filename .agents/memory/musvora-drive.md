---
name: MUSVORA Drive
description: The living-catalogue discovery surface and its real-data-only / Pending Integration contract.
---

# MUSVORA Drive (`/drive`)

The user-facing "living catalogue" discovery page. Engine `lib/drive.ts` (`buildDrive`,
`driveStats`), page `pages/Drive.tsx`, reached via an additive AreaCard on Home.

## Data-honesty contract (non-negotiable — see replit.md)
- Every row is `live` or `pending`. NEVER fabricate tracks, counts or rankings.
- `live` rows come ONLY from real catalogue fields: `created_at` is treated as the real
  release date (New Releases + genre-fresh ordering), `analytics.plays` for rankings
  (Top Latino), and case-insensitive `genre` substring match for genre rows.
- `pending` rows render an honest "Pending Integration" card. A row is pending when its
  source is not connected: foreign charts (Top USA), external virality (Viral Now/TikTok),
  geo/local signal (Local Trends), OR a genre with zero catalogue tracks (Salsa/Merengue/
  Dembow/Regional MX today). When the real catalogue grows, those genres flip to live
  automatically — no code change needed.
- **Why:** the platform forbids invented data/metrics; the user explicitly required
  "Any source not connected must display Pending Integration."

## Section order is canonical
buildDrive returns a fixed 10-row order the product expects: New Releases · Bachata Fresh ·
Salsa Fresh · Merengue Fresh · Dembow Fresh · Regional MX Fresh · Top Latino · Top USA ·
Viral Now · Local Trends. Keep this order if editing.

## Wiring
- Route is open/unprotected inside the shell (same pattern as `/search`, `/music-director`).
- `buildDrive(catalog)` accepts an injected catalogue — when a real backend feed exists, pass
  it in at the page level and the same honesty contract holds.
