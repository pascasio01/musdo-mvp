---
name: Offline downloads & Service Worker media cache
description: How MUSVORA Offline Mode genuinely caches cross-origin audio and reports real storage, and why it works that way.
---

# Offline downloads architecture

MUSVORA Offline Mode caches audio through the **Service Worker Cache API**, not
IndexedDB. Engine: `src/lib/offline.tsx` (`OfflineProvider`/`useOffline`). UI:
`pages/Downloads.tsx` (route `/downloads`), `components/DownloadButton.tsx`. SW:
`public/sw.js`.

**Why Cache API, not fetch→IndexedDB:** catalogue audio (SoundHelix and similar
CDNs) returns **no `Access-Control-Allow-Origin`**, so a browser `fetch()` cannot
read the bytes to store them. A `no-cors` fetch yields an **opaque** response that
Cache Storage *can* store and an `<audio>` element *can* play — so the SW serves it
back offline. This is the only honest way to get real offline media without a
backend/proxy (the app is a static Vite frontend, no server in prod).

**Consequences of opaque responses (important, durable):**
- Opaque bodies are unreadable, so you **cannot** know exact per-file byte size and
  **cannot** build a 206 partial. Per-item size is measured as the
  `navigator.storage.estimate()` delta before/after caching; `0` means the browser
  didn't report a delta → show "—", never fabricate a number.
- For a downloaded track the SW returns the **full** cached 200 even to a Range
  request; the browser buffers and seeks within it. True range/seek 206 is
  impossible for opaque media — this is a genuine browser constraint, not a bug.
- Non-downloaded audio always passes to network, so normal online streaming/seeking
  is untouched.

**SW gotchas:**
- The `activate` cleanup must **exclude** `musdo-offline-v1` or it deletes every
  download on the next SW upgrade. (Versioned shell caches use prefix `musdo-v2`;
  the offline cache does not, so it needs an explicit keep.)
- The audio cache-first branch must run **before** the same-origin guard, or
  cross-origin downloads never serve offline.
- SW is registered in dev too, as `/sw.js?dev=1`. In dev the SW ONLY handles audio
  (reads `?dev=1` from `self.location`) and does nothing else, so Vite HMR/modules
  are untouched. Without this, offline downloads can't be tested in the dev preview
  (SW was previously prod-only).

**Player needs no changes:** `lib/player.tsx` keeps using `song.audio_url` with
`new Audio()`; the SW serves cached bytes transparently when offline.

**Keys (persistence — never rename):** cache `musdo-offline-v1`; localStorage
`musdo-downloads-v1` (metadata), `musdo-offline-queue-v1` (offline-requested
re-sync queue), `musdo-offline-prefs-v1` (quality). Downloads are **device-level**
(not per-user) because Cache Storage is origin-wide.

**Quality selector is a real preference, not 4 fake file sizes.** The catalogue
ships one source file per song, so quality records the user's choice and the UI
states delivery depends on the source master. Do not fabricate multiple bitrate
variants/sizes.
