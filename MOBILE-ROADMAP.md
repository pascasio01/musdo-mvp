# MUSDO Mobile Roadmap

How MUSDO grows from "premium responsive web app" into a true multi-platform
product (Web · PWA · Android · iOS) without ever rewriting the brain.

## Guiding Principles

1. **One brain, many faces.** Domain logic lives in `frontend/src/core/`.
   Every UI surface — web, PWA, Android, iOS — talks to the same contracts.
2. **No premature native.** The web build IS the product today.  Native
   ships only when web telemetry proves the demand.
3. **Subtract, don't fork.** New features land in the React web codebase
   first.  Native gets them when the contract is stable, not before.
4. **Premium > parity.** A small native feature done beautifully beats a
   large feature that feels like a wrapped website.

## Phase 0 — Today (Web · Done)

- [x] React 18 + TypeScript + Vite app
- [x] OLED dark luxury design system
- [x] Supabase auth, storage, profiles
- [x] Composer Vault, Marketplace, Player, Lyrics, Audio Intelligence
- [x] Mobile-responsive Tailwind layout
- [x] Safe-area CSS utilities

## Phase 1 — PWA (In progress)

Goal: MUSDO becomes installable from any modern browser and works offline
for the app shell.

- [x] Web manifest with shortcuts, theme color, OLED background
- [x] Service worker with app-shell precache + offline fallback
- [x] Audio media bypass cache (streaming integrity preserved)
- [x] Safe-area, touch-target, standalone-aware CSS utilities
- [ ] Generate icon set (192, 512, maskable, apple-touch — see `PWA-CHECKLIST.md`)
- [ ] Custom install prompt UI (capture `beforeinstallprompt`)
- [ ] In-app "new version available" banner
- [ ] Lighthouse PWA score ≥ 90

## Phase 2 — Native Foundations (Quarter +1)

Goal: stand up an Expo (React Native) workspace that consumes the same
`core/` package and reuses brand tokens.  No public release yet.

- [ ] Initialise `mobile/expo` workspace inside the existing monorepo
- [ ] Path-alias `@core/*` → `frontend/src/core` (or extract into a
      proper `packages/core` workspace if it grows)
- [ ] Provide native adapters:
      - `AudioService.native.ts` → `expo-av` or `react-native-track-player`
      - `StorageService.native.ts` → `expo-secure-store` + MMKV cache
      - `AuthService.native.ts` → Supabase JS + secure-store
      - `Platform.native.ts` → React Native `Platform` module
- [ ] Port the design tokens (colours, spacing, type) to a Restyle theme
- [ ] Render Login + Home + Player screens in RN against the same data
- [ ] Internal alpha — TestFlight / Play internal track

## Phase 3 — Native Beta (Quarter +2)

Goal: a small but premium subset of MUSDO ships natively.  Web stays the
flagship; native is the on-the-go companion.

- [ ] Player (full screen, lock-screen controls, background audio)
- [ ] Vault (read-only — uploads stay web-first until Phase 4)
- [ ] Marketplace browse (purchase remains web-first)
- [ ] Push notifications (license requests, follower activity)
- [ ] Native sharing (system share sheet)
- [ ] Closed beta on TestFlight / Play closed track

## Phase 4 — Native GA (Quarter +3)

- [ ] Vault uploads (background upload via native HTTP)
- [ ] Apple / Google sign-in
- [ ] In-app purchase for licenses (StoreKit / Play Billing)
- [ ] Local Smart EQ DSP (`expo-av` filters or native Audio Unit)
- [ ] Public launch on App Store + Play Store

## Phase 5 — Smart Listening (Quarter +4)

- [ ] Real DSP: `BiquadFilterNode` web + Audio Unit / OpenSL ES native
- [ ] Spatial audio (Apple Spatial / Dolby Atmos passthrough where
      licensed by the rightsholder)
- [ ] Optional, opt-in awareness via on-device speech detection
- [ ] Apple Watch / Wear OS now-playing controls

## Out of Scope (For Now)

- Custom audio codec
- Native TV apps (Apple TV / Android TV)
- Desktop electron wrapper (PWA on desktop already covers this)
- Offline music caching at scale (legal + UX work first)

## Owner Notes

- **Composer-first.** Vault parity is the bar that gates Native GA.
- **No green.** No Spotify visual cues anywhere — including app store
  screenshots.
- **Cinematic over chrome.** Native feels like MUSDO, not like a default
  Material / Cupertino app.
