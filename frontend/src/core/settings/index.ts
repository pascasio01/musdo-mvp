/**
 * MUSDO core/settings — barrel for cross-cutting user preferences that
 * must persist across platforms (audio safety, EQ, spatial, awareness).
 *
 * The reactive layer lives in `lib/audioIntelligence.tsx` (Provider).
 * This barrel re-exports the *types* and the storage keys so a future
 * native app can read/write the same payload from secure-store and stay
 * in sync if the user is signed in to MUSDO Cloud.
 */
export type { SafeListenSettings, AwarenessSettings, AwarenessProfile, MaxVolumeCap } from '../../types/audioSafety'
export type { AudioTuningSettings, SpatialSettings, EQPresetId, SpatialModeId, ListeningEnvironmentId } from '../../types/audio'

/** localStorage / AsyncStorage keys — MUST stay stable across platforms */
export const SETTINGS_KEYS = {
  safeListen:  'musdo-safelisten-v1',
  tuning:      'musdo-tuning-v1',
  spatial:     'musdo-spatial-v1',
  awareness:   'musdo-awareness-v1',
  theme:       'musdo-theme-v1',
} as const
