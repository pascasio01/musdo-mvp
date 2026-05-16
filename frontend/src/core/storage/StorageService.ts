/**
 * MUSDO Storage Service — platform-agnostic key/value persistence.
 *
 * Web implementation wraps `localStorage` with safe JSON serialisation.
 * React Native will provide a parallel `StorageService.native.ts` backed by
 * `AsyncStorage` or MMKV — same interface, no callsite changes.
 */

export interface StorageService {
  /** Read & parse the JSON value at `key`, or return `fallback` */
  get<T>(key: string, fallback: T): T | Promise<T>
  /** Serialize and write `value` at `key` */
  set<T>(key: string, value: T): void | Promise<void>
  /** Remove the entry at `key` */
  remove(key: string): void | Promise<void>
  /** Wipe everything in the MUSDO namespace (use with extreme caution) */
  clearAll(): void | Promise<void>
  /** Subscribe to cross-tab changes for a key.  Returns an unsubscribe fn. */
  subscribe?(key: string, cb: (next: unknown) => void): () => void
}

class WebStorageService implements StorageService {
  private readonly available: boolean

  constructor() {
    try {
      const probe = '__musdo_storage_probe__'
      window.localStorage.setItem(probe, '1')
      window.localStorage.removeItem(probe)
      this.available = true
    } catch {
      this.available = false
    }
  }

  get<T>(key: string, fallback: T): T {
    if (!this.available) return fallback
    try {
      const raw = window.localStorage.getItem(key)
      return raw == null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.available) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn(`[MUSDO/Storage] set("${key}") failed:`, e)
    }
  }

  remove(key: string): void {
    if (!this.available) return
    try { window.localStorage.removeItem(key) } catch { /* noop */ }
  }

  clearAll(): void {
    if (!this.available) return
    try { window.localStorage.clear() } catch { /* noop */ }
  }

  subscribe(key: string, cb: (next: unknown) => void): () => void {
    if (!this.available) return () => undefined
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return
      try { cb(e.newValue ? JSON.parse(e.newValue) : null) } catch { cb(null) }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }
}

export const Storage: StorageService = new WebStorageService()
