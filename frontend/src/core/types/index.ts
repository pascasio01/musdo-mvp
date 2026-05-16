/**
 * MUSDO core types — re-exports the project's domain types from a single,
 * platform-neutral barrel.  Mobile / native code should import from here
 * (or `@core/types`) rather than reaching into `src/types/*` directly so
 * the dependency graph stays one-directional: UI → core → platform.
 */
export type {
  Song, SongCredits, AudioQuality, LicensingStatus,
  Profile, VerificationFields, VerificationStatus, VerificationRequest,
  Lyrics, LyricsTrack, SyncedLyric, LyricEmotion,
  License, Demo, MoodTag, BadgeType, AppRole,
} from '../../types'
