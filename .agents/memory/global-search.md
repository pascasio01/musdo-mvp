---
name: Global Search overlay
description: MUSVORA Home-header global search — data sources and modal a11y contract
---

# MUSVORA Global Search

Search trigger lives in the Home header (next to the Bell). Opens `GlobalSearch`
overlay (`frontend/src/components/home/GlobalSearch.tsx`), governance-styled.

## Data honesty (durable)
- **Live** categories search the app catalogue (`mockSongs`): Songs + Artists
  (artists derived as unique `artist_name`). The catalogue is the app's content
  layer used everywhere, so these are presented as real results.
- **Pending Integration** (no real index wired): Composers, Lyrics, Demos,
  Vault Assets, Marketplace, Licensing — shown as honest warning badges, never
  fabricated results. If you wire a real source later, move it out of the
  pending list.
- "See all" + artist taps deep-link to the existing `/search?q=` page; song taps
  `playSong` + `/player/:id`.

## Overlay must not cover the mini player
- Bottom bars: `BottomNav` fixed `bottom-0 z-40`; `PlayerBar` fixed `bottom-[64px] z-30`.
- Overlay is `fixed top-0` with `bottom: nowPlaying ? 156 : 88` so playback stays visible.

## Modal a11y contract (architect-enforced)
**Why:** review failed twice before this was right.
- Focus trap selector MUST exclude non-tabbable nodes with `:not([tabindex="-1"])`
  on every pattern, else the `tabIndex={-1}` backdrop button becomes "first" and
  Shift+Tab escapes the dialog.
- Restore focus to the opener on close (capture `document.activeElement` on open).
- Handle focus-outside-root on Tab by forcing first/last.
