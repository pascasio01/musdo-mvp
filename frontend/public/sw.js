/**
 * MUSDO Service Worker — minimal offline shell.
 * Caches the app shell on install, serves cache-first for static assets,
 * network-first for navigations with cache fallback for offline use.
 */
const VERSION = 'musdo-v1'
const SHELL_CACHE = `${VERSION}-shell`
const RUNTIME_CACHE = `${VERSION}-runtime`

const SHELL_ASSETS = ['/', '/favicon.svg', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
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

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          return res
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    )
    return
  }

  if (/\.(?:js|css|woff2?|svg|png|jpg|jpeg|webp|avif|ico)$/.test(url.pathname)) {
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
