/**
 * MUSDO Service Worker — minimal offline shell.
 *
 *  - Pre-caches the app shell on install
 *  - Serves cache-first for static assets (JS, CSS, fonts, images, icons)
 *  - Network-first for navigations with a cache fallback (then /offline.html)
 *  - Bypasses anything under /api/ and any cross-origin request
 *
 * IMPORTANT: This SW intentionally does NOT cache audio/video media.
 * Audio caching belongs to a future MUSDO Offline Library feature gated
 * behind explicit user consent and the "musdo-offline-v1" cache namespace.
 */
const VERSION = 'musdo-v2'
const SHELL_CACHE = `${VERSION}-shell`
const RUNTIME_CACHE = `${VERSION}-runtime`

const SHELL_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.webmanifest',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return
  // Never serve cached audio media — always go to network for streaming
  if (/\.(?:mp3|wav|flac|m4a|aac|ogg|webm)$/i.test(url.pathname)) return

  // Navigation requests → network-first, then cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          return res
        })
        .catch(() =>
          caches.match(request)
            .then((cached) => cached || caches.match('/offline.html') || caches.match('/'))
        )
    )
    return
  }

  // Static assets → stale-while-revalidate
  if (/\.(?:js|css|woff2?|svg|png|jpg|jpeg|webp|avif|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((res) => {
            const copy = res.clone()
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
            return res
          })
          .catch(() => cached)
        return cached || fetchPromise
      })
    )
  }
})
