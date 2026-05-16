/**
 * MUSDO Platform Service — runtime platform detection.
 *
 * Used by the rest of `core/` to decide which adapter to load and by the UI
 * to surface install prompts, safe-area treatments, and platform-specific
 * affordances. All detection is best-effort and SSR-safe.
 *
 * Today the only platform is `'web'`. When MUSDO ships to React Native we
 * add `'ios'` / `'android'` returns from a parallel `Platform.native.ts`
 * picked up by Metro via the `.native.ts` extension.
 */

export type PlatformKind = 'web' | 'ios' | 'android' | 'unknown'

export interface PlatformInfo {
  /** Logical platform — what runtime are we executing in? */
  kind: PlatformKind
  /** PWA installed and launched standalone (Android, iOS, ChromeOS) */
  isStandalone: boolean
  /** True if the user is on a touch-primary device */
  isTouch: boolean
  /** True iff the device is iOS Safari (web) — needed for some quirks */
  isIOSWeb: boolean
  /** True iff Android Chrome / WebView (web) */
  isAndroidWeb: boolean
  /** Reduced-motion user preference */
  prefersReducedMotion: boolean
}

const safeWindow = typeof window !== 'undefined' ? window : undefined
const safeNav    = typeof navigator !== 'undefined' ? navigator : undefined

function detect(): PlatformInfo {
  if (!safeWindow || !safeNav) {
    return {
      kind: 'unknown', isStandalone: false, isTouch: false,
      isIOSWeb: false, isAndroidWeb: false, prefersReducedMotion: false,
    }
  }
  const ua = safeNav.userAgent || ''
  const isIOSWeb     = /iPad|iPhone|iPod/.test(ua) && !(safeWindow as unknown as { MSStream?: unknown }).MSStream
  const isAndroidWeb = /Android/i.test(ua)
  const isStandalone =
    safeWindow.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari proprietary
    (safeNav as Navigator & { standalone?: boolean }).standalone === true
  const isTouch =
    'ontouchstart' in safeWindow ||
    (safeNav.maxTouchPoints ?? 0) > 0
  const prefersReducedMotion = safeWindow.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  return {
    kind: 'web', isStandalone, isTouch, isIOSWeb, isAndroidWeb, prefersReducedMotion,
  }
}

export const Platform: PlatformInfo = detect()

/** Convenience predicate — useful for `if (isWeb()) { ... }` paths */
export const isWeb     = () => Platform.kind === 'web'
export const isIOS     = () => Platform.kind === 'ios'    || Platform.isIOSWeb
export const isAndroid = () => Platform.kind === 'android' || Platform.isAndroidWeb
export const isMobile  = () => isIOS() || isAndroid() || Platform.isTouch

/**
 * Future React Native shim — the `.native.ts` companion file will export
 * `Platform.kind === 'ios' | 'android'` based on RN's own Platform module.
 */
