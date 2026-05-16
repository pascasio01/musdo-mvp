# MUSDO PWA Checklist

Status of every requirement to ship MUSDO as an installable, offline-capable
Progressive Web App on Chrome (Android), Safari (iOS), and Edge/Chrome desktop.

Legend:  ✅ done · 🟡 placeholder (works, needs assets) · ⏳ planned

## 1. Manifest & Metadata

| Item | Status | Notes |
|---|---|---|
| `manifest.webmanifest` linked from `<head>` | ✅ | `frontend/index.html` |
| `name`, `short_name`, `description` | ✅ | English, EN/ES alternates declared in OG |
| `start_url` with tracking param | ✅ | `/home?source=pwa` |
| `scope: "/"` | ✅ | Whole app |
| `display: standalone` + `display_override` | ✅ | window-controls-overlay → standalone fallback |
| `background_color` / `theme_color` (OLED black) | ✅ | `#000000` |
| `categories`, `lang`, `dir` | ✅ | music / entertainment / lifestyle |
| `shortcuts` (Discover, Vault, Marketplace) | ✅ | Long-press app icon on Android |
| Icons 192/512 + maskable variants | 🟡 | Manifest references `/icons/` — generate per `frontend/public/icons/README.md` |
| Apple touch icon `180×180` opaque | 🟡 | Generate `apple-touch-icon.png` |
| iOS startup splash images | ⏳ | Optional polish — see `icons/README.md` |
| Screenshots for install promo UI | ⏳ | Add to manifest `screenshots[]` for richer install card |

## 2. Service Worker

| Item | Status | Notes |
|---|---|---|
| Registered in production only | ✅ | `frontend/src/main.tsx` (gated on `import.meta.env.PROD`) |
| App-shell precache | ✅ | `/`, `/offline.html`, `/favicon.svg`, `/manifest.webmanifest` |
| Static asset SWR (JS/CSS/fonts/images) | ✅ | Stale-while-revalidate |
| Navigation network-first → cache → `/offline.html` | ✅ | Graceful offline fallback |
| `/api/*` and audio media bypass cache | ✅ | Streaming integrity preserved |
| Versioned cache namespace + cleanup on activate | ✅ | `musdo-v2` |
| `SKIP_WAITING` message handler | ✅ | Enables instant updates from in-app prompts |
| Update prompt UI ("New version available — reload?") | ⏳ | Wire in App.tsx with `navigator.serviceWorker.controller` listener |
| Background sync (queued favourites/likes when offline) | ⏳ | Future — needs Background Sync API + queue store |
| Push notifications | ⏳ | Future — needs VAPID keys + opt-in flow |

## 3. Mobile Layout

| Item | Status | Notes |
|---|---|---|
| `viewport-fit=cover` | ✅ | `frontend/index.html` |
| Safe-area utilities (`safe-top/bottom/x/y/all`) | ✅ | `frontend/src/styles/index.css` |
| 44×44 minimum touch targets (`min-touch`) | ✅ | New utility |
| `touch-action: manipulation` on tap surfaces | ✅ | New utility — eliminates 300 ms delay |
| `-webkit-tap-highlight-color: transparent` | ✅ | Bundled in `touch-manipulation` |
| Standalone-only / browser-only conditional UI | ✅ | `.pwa-only` / `.browser-only` |
| Reduced-motion respected | ✅ | `Platform.prefersReducedMotion` |

## 4. Performance & Quality (Lighthouse PWA category)

| Item | Status | Notes |
|---|---|---|
| HTTPS + valid TLS | ✅ | Replit hosts under HTTPS |
| Responds with 200 when offline | ✅ | `/offline.html` via SW |
| Provides a valid `apple-touch-icon` | 🟡 | Generate the PNG |
| Sized for the viewport | ✅ | Mobile-first Tailwind |
| Themed address bar | ✅ | Dark + light `theme-color` meta variants |
| Content sized correctly for viewport | ✅ | No horizontal overflow |
| Maskable icon present | 🟡 | Generate `icon-*-maskable.png` |

## 5. Install UX

| Item | Status | Notes |
|---|---|---|
| Capture `beforeinstallprompt` | ⏳ | Add in App.tsx — store deferred event, show custom "Install MUSDO" CTA |
| Detect already-installed (`getInstalledRelatedApps`) | ⏳ | Hide CTA when standalone |
| iOS install instructions modal (Share → Add to Home Screen) | ⏳ | iOS Safari has no programmatic prompt |

## 6. Smoke Test

```bash
# 1. Build & serve
cd frontend && npm run build && npm run preview

# 2. Open Chrome DevTools → Lighthouse → "Progressive Web App"
#    Run audit. Expect ≥ 90 once icons are generated.

# 3. DevTools → Application → Service Workers → confirm 'musdo-v2' active.

# 4. DevTools → Application → Manifest → verify all icons resolve.

# 5. Offline test: DevTools → Network → Offline → reload → expect /offline.html.
```

## 7. Release Gate

Do **not** mark PWA work "done" until:

1. All four `/icons/icon-*.png` files exist and resolve (no 404).
2. `apple-touch-icon.png` exists at `/`.
3. Lighthouse PWA audit ≥ 90 in Chrome (Android & desktop).
4. Manual install + standalone launch tested on:
   - Android Chrome (real device)
   - iOS Safari → Add to Home Screen
   - Desktop Chrome / Edge install button
5. Offline reload returns the offline shell, not the browser error page.
