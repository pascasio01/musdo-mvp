export type AppRole = 'listener' | 'composer' | 'producer' | 'admin' | 'supreme_owner'

export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected'

export type BadgeType =
  | 'verified_artist'
  | 'verified_composer'
  | 'human_verified'
  | 'verified_rights_holder'
  | 'label_verified'

export interface VerificationFields {
  verified_artist?: boolean
  verified_composer?: boolean
  verified_rights_holder?: boolean
  human_verified?: boolean
  label_verified?: boolean
  verification_status?: VerificationStatus
  verification_level?: number
}

export interface Profile extends VerificationFields {
  id: string
  username: string
  email: string
  role: AppRole
  sub_role?: string
  avatar_url?: string
  bio?: string
  created_at?: string
}

export type MoodTag =
  | 'romantic'
  | 'amargue'
  | 'late_night'
  | 'emotional'
  | 'sad'
  | 'nostalgic'
  | 'street'
  | 'energetic'
  | 'acoustic'
  | 'cinematic'

export type AudioQuality = 'demo_mp3' | 'demo_wav' | 'master_wav' | 'lossless_flac' | 'streaming_aac'

export type LicensingStatus = 'available' | 'private' | 'sold' | 'pending' | 'licensing_only'

export interface SongCredits {
  composer?: string
  producer?: string
  arranger?: string
  engineer?: string
  instruments?: string[]
  copyright_owner?: string
  royalty_split?: { name: string; percent: number }[]
}

export interface SongAnalytics {
  plays?: number
  emotional_engagement?: number
  avg_listen_time?: number
}

export interface Song extends VerificationFields {
  id: string
  title: string
  artist_name: string
  genre: string
  bpm?: number
  key?: string
  duration?: number
  audio_url?: string
  artwork_url?: string
  owner_id: string
  created_at: string
  mood?: MoodTag | string
  audio_quality?: AudioQuality
  licensing_status?: LicensingStatus
  aura_preset?: string
  credits?: SongCredits
  analytics?: SongAnalytics
}

/* ── Cinematic Lyrics ────────────────────────────────────────── */

export type LyricEmotion =
  | 'longing' | 'tender' | 'bittersweet' | 'hopeful'
  | 'aching' | 'release' | 'intimate' | 'reflective'

export interface SyncedLyric {
  /** seconds from start of track */
  time: number
  text: string
  /** 0..1 — drives subtle aura/glow modulation. Optional, defaults to 0.4. */
  intensity?: number
  emotion?: LyricEmotion
  /** soft section marker rendered as a quiet caption (verse/chorus/bridge) */
  section?: string
}

export interface LyricsTranslation {
  language: string
  lines: { time: number; text: string }[]
}

export interface LyricsTrack {
  song_id: string
  language: string
  /** raw plain-text fallback, line-separated */
  plain: string
  /** time-coded lines, sorted ascending by `time` */
  synced?: SyncedLyric[]
  translations?: LyricsTranslation[]
  writer_notes?: string
  emotional_tags?: LyricEmotion[]
}

export interface License {
  id: string
  song_id: string
  owner_id: string
  license_type: 'exclusive' | 'non-exclusive' | 'sync' | 'publishing'
  price: number
  status: 'available' | 'sold' | 'pending'
  created_at: string
  song?: Song
}

export interface Demo {
  id: string
  title: string
  composer_id: string
  demo_url?: string
  notes?: string
  visibility: 'private' | 'public' | 'licensing_only'
  created_at: string
}

export interface Lyrics {
  id: string
  title: string
  content: string
  composer_id: string
  timestamp_proof?: string
  created_at: string
}

export interface PlayerState {
  song: Song | null
  isPlaying: boolean
  progress: number
  volume: number
}

export interface VerificationRequest {
  id: string
  user_id: string
  username: string
  badge_type: BadgeType
  status: VerificationStatus
  submitted_at: string
  reviewed_at?: string
  notes?: string
}
