/**
 * MUSDO Service Worker — offline shell + offline music library.
 *
 *  - Pre-caches the app shell on install (production)
 *  - Serves cache-first for static assets (JS, CSS, fonts, images, icons)
 *  - Network-first for navigations with a cache fallback (then /offline.html)
 *  - Offline music: serves downloaded audio from the "musdo-offline-v1" cache
 *    (cache-first), so songs the user explicitly downloaded play with no network.
 *    The audio bytes are written by the app (MUSVORA Offline Mode) into this same
 *    cache namespace — the SW only reads them back.
 *
 * The "musdo-*" cache namespaces are persistence keys — never rename them.
 *
 * DEV mode (registered as /sw.js?dev=1): the SW ONLY handles offline audio so it
 * never interferes with the Vite dev server (HMR, modules, navigations).
 */
const VERSION = 'musdo-v2'
const SHELL_CACHE = `${VERSION}-shell`
const RUNTIME_CACHE = `${VERSION}-runtime`
const AUDIO_CACHE = 'musdo-offline-v1'

const DEV = new URL(self.location.href).searchParams.get('dev') === '1'

const SHELL_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.webmanifest',
]

const AUDIO_RE = /\.(?:mp3|wav|flac|m4a|aac|ogg|opus|webm)(?:$|\?)/i

self.addEventListener('install', (event) => {
  if (DEV) {
    self.skipWaiting()
    return
  }
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
        keys
          // Keep the versioned shell/runtime caches AND the offline audio cache.
          .filter((k) => !k.startsWith(VERSION) && k !== AUDIO_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

function isAudioRequest(request, url) {
  return request.destination === 'audio' || AUDIO_RE.test(url.pathname) || AUDIO_RE.test(url.href)
}

/**
 * Serve downloaded audio offline, range-aware.
 *
 * Catalogue audio is cross-origin without CORS, so it is cached as an OPAQUE
 * response. Opaque bodies cannot be read or sliced, so a true 206 partial is
 * impossible — for a downloaded track we always return the full cached body and
 * the browser buffers it and seeks within the buffered media (works fully
 * offline, including scrubbing). Tracks that are NOT downloaded always go to the
 * network, so normal streaming and byte-range seeking are untouched when online.
 */
async function handleAudio(request) {
  const cache = await caches.open(AUDIO_CACHE)
  const cached = await cache.match(request, { ignoreVary: true, ignoreSearch: false })
  if (cached) return cached
  try {
    return await fetch(request)
  } catch (err) {
    // Offline and not downloaded — surface a real network error (no fake bytes).
    return Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // ── Offline music (cross-origin aware) ──────────────────────────────
  // Downloaded audio is served cache-first from musdo-offline-v1. Runs in
  // both dev and prod and BEFORE the same-origin guard so cross-origin
  // catalogue audio (e.g. CDN) plays offline once downloaded.
  if (isAudioRequest(request, url)) {
    event.respondWith(handleAudio(request))
    return
  }

  // In dev, do nothing else — let Vite handle every other request untouched.
  if (DEV) return

  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

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
