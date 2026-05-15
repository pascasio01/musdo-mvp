export type TalentCategory =
  | 'Vocalist'
  | 'Composer / Songwriter'
  | 'Producer'
  | 'Arranger'
  | 'Mixing Engineer'
  | 'Mastering Engineer'
  | 'Guitarist'
  | 'Pianist'
  | 'Bassist'
  | 'Drummer'
  | 'Tambora Player'
  | 'Percussionist'
  | 'Trumpet Player'
  | 'Saxophonist'
  | 'Violinist'
  | 'DJ'
  | 'Background Vocalist'
  | 'Session Musician'
  | 'Studio Owner'
  | 'Videographer'
  | 'Cover Designer'
  | 'Music Director'
  | 'Live Band'
  | 'Choir / Background Vocal Group'
  | 'Beatmaker'
  | 'Audio Editor'

export type AvailabilityStatus = 'available' | 'busy' | 'limited' | 'unavailable'

export type RequestStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type ProjectType =
  | 'collaboration'
  | 'studio_session'
  | 'remote_recording'
  | 'live_performance'
  | 'beat_request'
  | 'arrangement'
  | 'mixing_mastering'
  | 'songwriting'
  | 'production'
  | 'other'

export interface TalentProfile {
  id: string
  user_id?: string
  stage_name: string
  categories: TalentCategory[]
  profile_photo?: string
  bio: string
  location: string
  languages: string[]
  instruments: string[]
  skills: string[]
  genres: string[]
  years_experience: number
  reads_music: boolean
  plays_by_ear: boolean
  remote_available: boolean
  studio_available: boolean
  live_available: boolean
  availability_status: AvailabilityStatus
  response_time: string
  portfolio_links?: string[]
  demo_links?: string[]
  social_links?: { platform: string; url: string }[]
  verified_status: boolean
  hourly_rate?: number
  project_rate?: number
  contact_mode: 'in_app' | 'email' | 'social' | 'phone'
  featured?: boolean
  rating_mock?: number
  reviews_count?: number
  created_at: string
}

export interface TalentRequest {
  id: string
  requester_id: string
  talent_id: string
  talent_name?: string
  requester_name?: string
  project_type: ProjectType
  service_needed: string
  budget: string
  date?: string
  time?: string
  location?: string
  remote: boolean
  notes?: string
  deadline?: string
  status: RequestStatus
  payment_status?: 'unpaid' | 'deposit_paid' | 'completed' | 'disputed'
  created_at: string
}

export interface SavedTalent {
  id: string
  user_id: string
  talent_id: string
  talent?: TalentProfile
  created_at: string
}
