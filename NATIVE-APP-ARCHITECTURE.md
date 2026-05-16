# MUSDO Native App Architecture

The blueprint for taking the existing React + Vite web app to React Native
(Expo) without rewriting domain logic.  Read alongside `MOBILE-ROADMAP.md`
(when) and `PWA-CHECKLIST.md` (the bridge step).

## 1. Layered Architecture

```
┌──────────────────────────────────────────────────────────┐
│ UI                                                       │
│  • Web:    React components in frontend/src/components   │
│  • Native: React Native screens in mobile/expo/src       │
└──────────────────────────────────────────────────────────┘
                          ↑ depends on
┌──────────────────────────────────────────────────────────┐
│ React Providers (platform-coupled)                       │
│  • lib/player.tsx   ← <audio> on web, expo-av on native  │
│  • lib/auth.tsx     ← supabase-js + browser/secure store │
│  • lib/theme.tsx    ← CSS vars on web, Restyle on native │
│  • lib/audioIntelligence.tsx (shared, no DOM)            │
└──────────────────────────────────────────────────────────┘
                          ↑ depends on
┌──────────────────────────────────────────────────────────┐
│ core/  (PLATFORM-NEUTRAL CONTRACTS — single source)      │
│  • core/audio/AudioService.ts    interface + bridge      │
│  • core/auth/AuthService.ts      interface + bridge      │
│  • core/storage/StorageService.ts                        │
│  • core/platform/Platform.ts                             │
│  • core/types, core/music, core/theme, core/settings     │
└──────────────────────────────────────────────────────────┘
                          ↑ depends on
┌──────────────────────────────────────────────────────────┐
│ Backend (shared across platforms)                        │
│  • Supabase: Auth, Postgres, Storage                     │
│  • MUSDO REST/RPC endpoints                              │
│  • Future: WebSocket for live licensing                  │
└──────────────────────────────────────────────────────────┘
```

**Rule:** dependencies point downward only.  `core/*` must never import
from `components/*`, `pages/*`, or platform-specific React APIs.

## 2. Platform Adapters via `.native.ts`

React Native's bundler (Metro) automatically prefers `Foo.native.ts` over
`Foo.ts` when building for iOS/Android.  We use this to ship a single
import path with two implementations:

```
core/audio/AudioService.ts          ← Web (delegates to PlayerProvider)
core/audio/AudioService.native.ts   ← RN (expo-av / track-player)
```

Web and Native callsites both write:

```ts
import { Audio } from '@core/audio/AudioService'
Audio.play(song)
```

Metro picks `.native.ts` on RN; Vite picks `.ts` on web.  Zero conditional
branches in business code.

## 3. Service Contracts

### AudioService

| Method | Web today | Native (planned) |
|---|---|---|
| `play(song)` | `<audio>.play()` | `Sound.playAsync()` (expo-av) |
| `pause()` | `<audio>.pause()` | `Sound.pauseAsync()` |
| `setVolume(v)` | `<audio>.volume = v` | `Sound.setVolumeAsync(v)` |
| `seek(s)` | `<audio>.currentTime = s` | `Sound.setPositionAsync(s*1000)` |
| `subscribe(cb)` | event emitter | `setOnPlaybackStatusUpdate` bridge |
| Background audio | Media Session API | `expo-av` background audio mode |
| Lock screen art | Media Session metadata | RN Track Player metadata |

### AuthService

| Method | Web today | Native (planned) |
|---|---|---|
| `signIn` | `supabase.auth.signInWithPassword` | identical (RN-safe Supabase JS) |
| Token storage | localStorage (Supabase default) | `expo-secure-store` |
| Deep links / OAuth | URL params | `expo-auth-session` |
| Biometric unlock | — | `expo-local-authentication` (Phase 4) |

### StorageService

| Surface | Web | Native |
|---|---|---|
| Settings (preferences, EQ, theme) | `localStorage` | MMKV |
| Sensitive (auth tokens) | Supabase-managed | `expo-secure-store` |
| Bulk cache (artwork, lyrics) | Cache API + SW | `expo-file-system` |

### Platform

```ts
import { Platform, isIOS, isAndroid } from '@core/platform/Platform'
if (isIOS()) showCupertinoAffordance()
```

Web populates from UA + display-mode; native populates from RN's `Platform`
module.  Same shape, same imports.

## 4. State Management

- **React Providers stay React Providers.**  We do not introduce Redux,
  Zustand, or Jotai. Both web and native render the same provider tree
  (the providers themselves load the right adapter based on platform).
- **Persistence** flows through `StorageService` exclusively. Settings
  keys are declared once in `core/settings` and shared across platforms,
  so a user's preferences survive sign-in on a different device once the
  optional MUSDO Cloud sync ships.

## 5. Styling Strategy

| Layer | Web | Native |
|---|---|---|
| Tokens | CSS vars in `styles/index.css` | Restyle theme generated from same tokens |
| Layout | Tailwind utility classes | RN StyleSheet + Restyle props |
| Glassmorphism | `backdrop-filter` | `expo-blur` |
| Safe area | `env(safe-area-inset-*)` | `react-native-safe-area-context` |
| Motion | Framer Motion (where used) | `react-native-reanimated` |

The **token names** (`--accent`, `--text-muted`, `--glass-bg`) become the
Restyle theme keys (`accent`, `textMuted`, `glassBg`).  A single script
in `mobile/expo/scripts/sync-tokens.ts` will read the CSS file and emit
the Restyle palette so the two platforms stay visually identical.

## 6. Audio Intelligence on Native

The web build ships SafeListen™ + Smart EQ + Adaptive Spatial as
*persisted-only* (mock DSP) because Web Audio API integration was
deferred per spec.  Native is the natural place to ship real DSP:

- `expo-av` exposes basic playback rate / volume but **not** EQ.
- For real EQ on iOS use `AVAudioUnitEQ`; on Android use `AudioEffect.Equalizer`.
- Both can live behind the same `core/audio/AudioService` extension
  `Audio.setEQGains(gains)`, with the web implementation a no-op until
  the Web Audio API integration ships.

## 7. Project Layout (Future)

```
musdo/
├── frontend/                     ← Vite + React (today's app)
│   └── src/
│       ├── core/                 ← shared contracts (single source)
│       ├── components/
│       ├── pages/
│       └── lib/                  ← Web adapters (PlayerProvider, AuthProvider)
├── mobile/
│   ├── README.md
│   └── expo/                     ← Future Expo workspace
│       ├── app/                  ← Expo Router screens
│       ├── src/
│       │   ├── adapters/         ← .native.ts impls referenced by core
│       │   └── components/       ← Native-only components
│       └── package.json
└── packages/                     ← Optional: extract core when stable
    └── core/                     ← Symlink/copy of frontend/src/core
```

For Phase 1 we keep `core/` inside `frontend/src/` and reference it from
`mobile/expo/` via TypeScript path aliases. We only extract a true
workspace package (`packages/core`) once the contract is exercised by
both bundlers and changes settle.

## 8. CI & Release

- **Web:** Vite build → static deploy (Replit Deployments) — already live.
- **Native:** EAS Build → TestFlight + Play internal track.
- **Shared core types:** linted/typed in CI before either build runs.
  A type-error in `core/` blocks both pipelines simultaneously, which is
  the protection we want.

## 9. Out of Scope for This Phase

- React Server Components (no SSR planned)
- Server Actions / Edge runtime
- Codepush / OTA updates (revisit at Phase 4)
- Custom Hermes patches
- Native modules in C++ (revisit only if EQ perf demands it)
