export interface Profile {
  id: string
  username: string
  email: string
  role: 'listener' | 'composer' | 'producer' | 'admin'
  avatar_url?: string
  bio?: string
  created_at: string
}

export interface Song {
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
  human_verified?: boolean
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
