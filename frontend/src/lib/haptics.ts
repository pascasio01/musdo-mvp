/**
 * Lightweight haptic feedback for mobile.
 * Uses the standards-based Vibration API; degrades silently on desktop / iOS Safari.
 */
type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  medium: 14,
  heavy: 22,
  success: [10, 30, 10],
  warning: [14, 60, 14],
  error: [20, 40, 20, 40, 20],
}

let enabled = true

export function setHapticsEnabled(value: boolean) {
  enabled = value
}

export function haptic(pattern: HapticPattern = 'light'): void {
  if (!enabled) return
  if (typeof navigator === 'undefined') return
  if (typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(PATTERNS[pattern])
  } catch {
    /* no-op */
  }
}
