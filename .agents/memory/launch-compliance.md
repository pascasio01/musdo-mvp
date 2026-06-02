---
name: Launch security & compliance posture
description: What is verified-secure vs. the real blockers gating App Store / Google Play / GDPR launch for MUSVORA.
---

# Security posture (verified, good)
- No `service_role`/secret keys in frontend; Supabase uses public anon key from `VITE_SUPABASE_*` only. Never put service_role in frontend.
- RLS IS defined in `frontend/db/schema_identity.sql` (creator_identity, private_identity, follows, playlists, user_settings); private_identity locked to `auth.uid()=user_id` or supreme_owner. **Open question to verify before launch: is this SQL actually APPLIED to the live DB, and do the vault `demos`/storage buckets have policies?**
- Dependency audit: 0 vulns. HoundDog privacy: 0 findings.

# SAST quirks (don't chase false positives)
- Vite CVE-2025-30208 HIGH is read from the **declared floor in package.json**, NOT the installed version. Keep the declared `vite` floor at a patched version (>=6.2.3) even though installed is newer, or the scanner re-flags it.
- Two MEDIUM "missing integrity (SRI)" are the Google Fonts `<link rel=stylesheet>` in index.html. **Do NOT add SRI to Google Fonts** — Google serves browser-specific CSS so a pinned hash breaks fonts. Accepted exception.
- Three LOW "unsafe-formatstring" are internal `console.log(\`...${x}\`)` in StorageService.ts / useLocalStorage.ts — negligible.

# Real launch BLOCKERS (must build, honest gaps)
- **In-app Account Deletion + Data Export are MISSING.** Apple Guideline 5.1.1(v) requires in-app account deletion; GDPR/Google require export + deletion. `Settings.tsx` / `lib/auth` have no delete/export. This is the #1 launch blocker.
- **DMCA / copyright reporting is a STATIC policy page only** (`legal/DMCA.tsx`) — no submission form, no counter-notice flow, no repeat-infringer automation. Content moderation reports (impersonation, fraud, fake-ownership) have no intake.
- **No malware/file scanning on uploads** — only 50MB size cap + `accept="audio/*|image/*"`. SecurityPolicy.tsx lists scanning as "planned".
- Legal pages exist (14 in `src/pages/legal/`) but are marked **Draft/MVP**; missing dedicated Subscription Terms, Account Deletion Policy, Data Export Policy; Security Policy lacks breach-notification specifics. All need real business entity/contact/jurisdiction (do not fabricate — ask Pascasio).
- Supabase secrets (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) still not set in this env — separate functional launch blocker.
