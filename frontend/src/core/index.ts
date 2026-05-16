/**
 * MUSDO core — platform-neutral barrel.
 *
 * Import from here (or specific subpaths) when you need domain types or
 * platform services.  The contract:
 *
 *   • core/* never imports from React components.
 *   • core/* never imports browser-only APIs in the *interface* layer
 *     (but a Web *implementation* obviously may — that's the point of
 *     the abstraction).
 *   • UI imports core; core imports nothing in the other direction.
 *
 * Non-React modules (analytics, sync, integrations) talk to the engine
 * via the singleton facades exported below.  React components keep using
 * the existing hook-based APIs (`usePlayer`, `useAuth`, …) which are
 * faster and more idiomatic.
 */
export * from './types'
export * as Music from './music'
export { Audio, setAudioBridge, emitPlayerEvent } from './audio/AudioService'
export type { AudioService, AudioServiceState, PlayerEvent } from './audio/AudioService'
export { Auth, setAuthBridge } from './auth/AuthService'
export type { AuthService, AuthUser, AuthSession, AuthCredentials } from './auth/AuthService'
export { Storage } from './storage/StorageService'
export type { StorageService } from './storage/StorageService'
export { Platform, isWeb, isIOS, isAndroid, isMobile } from './platform/Platform'
export type { PlatformKind, PlatformInfo } from './platform/Platform'
export { SETTINGS_KEYS } from './settings'
