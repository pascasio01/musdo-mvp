/**
 * MUSDO core/music — domain barrel for music-related entities.
 *
 * Anything that touches "what is a Song" lives here.  Native code consumes
 * this barrel so we never duplicate the schema across platforms.
 */
export type {
  Song, SongCredits, AudioQuality, LicensingStatus,
  Lyrics, LyricsTrack, SyncedLyric, LyricEmotion, MoodTag,
} from '../../types'
