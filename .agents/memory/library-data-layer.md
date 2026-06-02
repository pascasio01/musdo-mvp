---
name: Library data layer
description: How MUSVORA's real per-user music library (favorites/history/playlists) is stored and wired.
---

# Library data layer

`useLibrary()` (LibraryProvider) is the single source of truth for the user's real
library: favorites, auto-recorded play history, personal playlists CRUD, and
derived `libraryArtists`. History auto-records whenever the player starts a song.

**Persistence:** localStorage key `musdo-library-v1:<userId>` (per authenticated
user). Signed-out users fall back to a shared `:guest` bucket — acceptable because
the library is an authenticated surface, but it is NOT per-user isolated for guests.

**Provider order matters:** LibraryProvider must sit INSIDE both AuthProvider and
PlayerProvider (it consumes `useAuth` for the user id and `usePlayer` for history).
It is mounted inside IdentityProvider in the stack.

**Why ID-based shape:** stores only song IDs and resolves against the `mockSongs`
catalogue at read time. This keeps the context API stable so it can later be
lifted to Supabase tables without UI changes.

**How to apply:** any new surface that shows favorites/history/playlists should
consume `useLibrary()` rather than re-deriving from the catalogue. The Player like
heart and GlobalSearch (Playlists category) already do. Songs with no album/composer
fields stay honestly "Pending" — do not fabricate album/composer data.
