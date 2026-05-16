/**
 * MUSDO core/theme — re-exports the design-system theme contract.
 *
 * The actual ThemeProvider remains in `lib/theme.tsx` (DOM-coupled because
 * it writes CSS variables to `document.documentElement`).  React Native
 * will provide a parallel implementation that maps the same `ThemeId`s to
 * a StyleSheet/Restyle palette — but the IDs and ThemeConfig shape are the
 * single source of truth for both platforms.
 */
export type { ThemeId, ThemeConfig, ThemeSettings } from '../../lib/theme'
