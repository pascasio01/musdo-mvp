---
name: Professional Profile System
description: How the governance professional profile stores data and stays honest/private
---

# Professional Profile (V1)

Public, governance-styled profile at `/profile/:username` (+ `/profile/edit`), coexisting with the legacy cinematic personal `/profile` (which must stay untouched). Future-ready public URL per spec.

## Per-user localStorage scoping (privacy rule)
Extended professional fields live in localStorage (no Supabase schema change), under a **per-user** key `musdo-pro-profile-v1:${userId}` via `useProfessionalProfile(userId)`.

**Why:** the private `legalName` field is stored client-side; a single global key leaked one account's private data to the next account on a shared browser. Per-user scoping isolates it.

**How to apply:** any client-stored profile/identity data that includes private fields MUST be keyed by the authenticated user id. Do NOT add a read-fallback to the legacy unscoped key — that re-introduces the leak. These pages render only inside `ProtectedRoute`, so `user?.id` is available at first mount (matters because `useLocalStorage`'s state initializer reads the key once).

## Honesty rules baked in
- Verification: `computeVerification` returns "Verified Profile" ONLY if `verification_status==='approved'` or a real `verified_*` flag is true; else "Pending Verification". Never fabricated.
- Role-specific overview metrics render `—` + "Pending" hint when not wired to live data (no fake numbers); only genuinely derivable counts (genres/languages length) show live.
- Non-self `/profile/:username`: never borrow the viewer's role — show neutral "MUSVORA Member" label + a "public preview" disclaimer until a server-side by-username lookup exists.
- `/profile/me` is INTENTIONAL: ProfessionalProfile treats `username==='me'` as self (isSelf). Do NOT "fix" it as a broken route.
- Legacy `/profile` page stats are REAL useLibrary counts (Favorites/Playlists/Played), not creator metrics — there is no real Songs/Streams/Licenses source, so never re-add fabricated numbers there.

## Uploads
Avatar reuses `profileService.uploadAvatar` (`avatars` bucket); cover uses `profileService.uploadCover` (same bucket, `covers/` prefix — no new infra). Both fall back to a local data-URL when Supabase storage is offline, so upload works in any environment.
