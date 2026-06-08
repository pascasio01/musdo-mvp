---
name: MUSVORA Design Language System (MDLS)
description: Single source of truth for product vocabulary; how/where it's applied and what must NOT be renamed.
---

# MDLS — product vocabulary canon

`frontend/src/lib/mdls.ts` exports `MDLS`, the single source of truth for user-facing
vocabulary. Import constants instead of hardcoding labels so terminology changes in one place.

**Why:** the product must read Human · Premium · Intelligent · Music-first, not like a
generic streaming app. Sprint replaced streaming jargon with MUSVORA-native language.

**Lexicon (display only):** Home→Pulse (nav) · Library→My Universe (nav: Universe) ·
Playlists(user lists)→Collections · AI mood sessions→Sound Journeys · Notifications→Music Signals ·
Vault→Creator Vault · Dashboard→Creator Studio · Streams→Listens · Top result→Perfect Match ·
Similar Music→Similar Vibes · Discover→Explore · Trending→Rising Now · For You→Curated For You ·
Favorites→Loved · History→Echoes.

**Two distinct concepts:** `Collections` = lists the user creates/saves; `Sound Journeys` =
mood sessions built by MUSVORA AI. Keep them separate.

**Intentional EN/ES mix:** page titles/section headers are English (via MDLS); body copy is Spanish.
Nav uses short labels ("Universe") while the page title is the full brand ("My Universe") — that
split is deliberate, not drift.

## Hard constraints — never rename (these are NOT vocabulary)
- Code identifiers: `createPlaylist`, `Playlist`/`LibraryPlaylist` types, `playlists.premium`,
  `creator.vault`, prop names, etc. MDLS only changes *displayed* text.
- Routes (e.g. `/library/playlist/:id`) and `musdo-*` persistence keys stay as-is.
- Industry music terms kept verbatim: Albums · Artists · Composers · Producers · Lyrics ·
  Passports · Licenses · Demos. Core verbs kept: Login/Register/Save/Delete/Share/Search.

**How to apply:** when adding/relabeling UI, pull the string from `MDLS`; if a term isn't there,
add it to `mdls.ts` rather than hardcoding. Watch the count-noun `listens` (capitalize at call site).
