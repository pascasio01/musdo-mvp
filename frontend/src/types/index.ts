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
