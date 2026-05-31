---
name: Auth boot loading must always clear
description: Why the AuthProvider startup effect needs a fail-open guard so the splash can never hang
---
The `loading` flag owned by `AuthProvider` gates the "MUSVORA" splash (`LoadingScreen` in `ProtectedRoute`). The startup effect must guarantee `loading` is set false on every path: on `getSession()` resolve AND reject, on profile-sync settle, and via a timeout safety net (~8s). Use a `settled` flag to keep `setLoading(false)` idempotent and clear the timer on unmount.

**Why:** Originally `setLoading(false)` only ran inside `getSession().then(...).finally(loadProfile)` with no `.catch`/timeout. A returning logged-in user whose `getSession()` rejected or whose `profiles` fetch stalled (Supabase slow/unreachable) left `loading` true forever → permanent splash. Logged-out visitors never hit it (session resolves instantly), which is why it never reproduced in dev.

**How to apply:** Any startup-critical async gate that blocks routing/UI readiness must fail open, not deadlock. The 8s timeout is an intentional tradeoff: under severe latency it may briefly redirect a protected route to /login (recoverable) rather than freeze.
