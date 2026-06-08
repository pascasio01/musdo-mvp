---
name: Supabase Realtime channel reuse pitfall
description: Why "cannot add postgres_changes callbacks after subscribe()" fires even when .on() is chained before .subscribe(), and the fix.
---

# Supabase Realtime: unique channel topics

`RealtimeClient.channel(topic)` (supabase-js v2 / realtime-js 2.x) does NOT always
create a fresh channel — if a channel with the same `realtime:<topic>` is still
registered, it RETURNS the existing one. `RealtimeChannel.on('postgres_changes'|'presence', …)`
then throws `cannot add \`postgres_changes\` callbacks for <topic> after \`subscribe()\``
whenever that returned channel is already `isJoined()` or `isJoining()`.

**Why it still happens with correct chaining:** even with `.channel().on().subscribe()`
in the right order, a re-running effect (React 18 StrictMode double-mount in dev, or a
new `user` object identity) calls `channel(sameFixedTopic)` again before the prior
channel's async `removeChannel`/unsubscribe completes → you get the old, already-joined
channel back → `.on()` throws.

**Fix:** give every subscription instance a UNIQUE topic (append a per-process nonce,
e.g. `subscription:${user.id}:${Date.now}+seq`). Keep `.on()` before `.subscribe()` and
always `supabase.removeChannel(channel)` in cleanup. Unique topics guarantee a brand-new
channel each mount, so listeners are always added pre-subscribe.

**How to apply:** any `supabase.channel(...)` created inside a React effect/hook must use
a unique topic per instance, never a fixed string keyed only on stable data. Audit
target dirs: `frontend/src` (lib/hooks/providers/contexts). As of this writing the only
Realtime channel in the app is in `useSubscription.ts`.
