---
name: Account deletion (client-only)
description: Honest Delete Account limits for a static SPA + Supabase with no privileged backend.
---

# Delete Account — what is actually possible client-side

This app is a static SPA + Supabase with NO service-role backend. Therefore client-side deletion can only:
1. Best-effort delete the user's own rows via RLS-scoped deletes.
2. Erase device data: all `localStorage` keys prefixed `musdo-` + Cache Storage namespaces prefixed `musdo-`.
3. `supabase.auth.signOut()`.

It CANNOT erase the auth credential (`auth.users`) — that needs a privileged server op that doesn't exist. So copy must say "requests deletion / removing the login itself requires support", never "permanently deleted from our servers".

**Gotcha:** supabase-js returns most DB/RLS errors in the response body (`{ error }`), NOT as throws. A bare try/catch silently swallows failures → check `error` per call and surface it; don't claim success you didn't verify.

**Note:** wiping current-user `musdo-*` keys on explicit deletion is intended and does NOT violate the "never rename musdo-* keys" rule (that rule is about renaming persistence keys, not user-triggered deletion).

**Why:** strict honesty rule — never show fake certainty about what was deleted.
