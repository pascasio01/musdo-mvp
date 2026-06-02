import type { AppRole, VerificationStatus, BadgeType } from './index'

export interface DbProfile {
  id: string
  username: string
  email: string
  role: AppRole
  sub_role: string | null
  avatar_url: string | null
  bio: string | null
  verified_artist: boolean | null
  verified_composer: boolean | null
  verified_rights_holder: boolean | null
  human_verified: boolean | null
  label_verified: boolean | null
  verification_status: VerificationStatus | null
  verification_level: number | null
  created_at: string
  updated_at: string | null
}

export interface DbSong {
  id: string
  title: string
  artist_name: string
  genre: string
  bpm: number | null
  key: string | null
  duration: number | null
  audio_url: string | null
  artwork_url: string | null
  owner_id: string
  human_verified: boolean | null
  verified_rights_holder: boolean | null
  created_at: string
  updated_at: string | null
}

export interface DbLicense {
  id: string
  song_id: string
  owner_id: string
  license_type: 'exclusive' | 'non-exclusive' | 'sync' | 'publishing'
  price: number
  status: 'available' | 'sold' | 'pending'
  created_at: string
}

export interface DbDemo {
  id: string
  title: string
  composer_id: string
  demo_url: string | null
  notes: string | null
  visibility: 'private' | 'public' | 'licensing_only'
  created_at: string
}

export interface DbLyrics {
  id: string
  title: string
  content: string
  composer_id: string
  timestamp_proof: string | null
  created_at: string
}

export interface DbVerificationRequest {
  id: string
  user_id: string
  badge_type: BadgeType
  status: VerificationStatus
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  notes: string | null
  rejection_reason: string | null
}

export interface DbAuditLog {
  id: string
  actor_id: string
  action: string
  resource_type: string
  resource_id: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export type SubscriptionPlan = 'free' | 'premium' | 'creator_pro'

export type SubscriptionStatus =
  | 'inactive'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused'

export interface DbSubscription {
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  trial_end: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_used: boolean
  created_at: string
  updated_at: string | null
}

export interface DbBillingInvoice {
  id: string
  user_id: string
  amount_total: number
  currency: string
  status: string | null
  plan: string | null
  hosted_invoice_url: string | null
  invoice_pdf: string | null
  period_start: string | null
  created_at: string
}

/**
 * Marks every property whose type includes `null` as optional.
 * Mirrors Postgres semantics: nullable columns can be omitted on INSERT
 * (the DB substitutes NULL or the column DEFAULT).
 */
type NullableOptional<T> =
  & { [K in keyof T as null extends T[K] ? never : K]: T[K] }
  & { [K in keyof T as null extends T[K] ? K : never]?: T[K] }

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: DbProfile
        Insert: NullableOptional<Omit<DbProfile, 'created_at' | 'updated_at'>>
        Update: Partial<Omit<DbProfile, 'id' | 'created_at'>>
        Relationships: []
      }
      songs: {
        Row: DbSong
        Insert: NullableOptional<Omit<DbSong, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<DbSong, 'id' | 'owner_id' | 'created_at'>>
        Relationships: []
      }
      licenses: {
        Row: DbLicense
        Insert: Omit<DbLicense, 'id' | 'created_at'>
        Update: Partial<Pick<DbLicense, 'status' | 'price'>>
        Relationships: []
      }
      demos: {
        Row: DbDemo
        Insert: NullableOptional<Omit<DbDemo, 'id' | 'created_at'>>
        Update: Partial<Omit<DbDemo, 'id' | 'composer_id' | 'created_at'>>
        Relationships: []
      }
      lyrics: {
        Row: DbLyrics
        Insert: NullableOptional<Omit<DbLyrics, 'id' | 'created_at'>>
        Update: Partial<Pick<DbLyrics, 'title' | 'content'>>
        Relationships: []
      }
      verification_requests: {
        Row: DbVerificationRequest
        Insert: NullableOptional<Omit<DbVerificationRequest, 'id' | 'submitted_at'>>
        Update: Partial<Pick<DbVerificationRequest, 'status' | 'reviewed_at' | 'reviewed_by' | 'rejection_reason'>>
        Relationships: []
      }
      audit_logs: {
        Row: DbAuditLog
        Insert: NullableOptional<Omit<DbAuditLog, 'id' | 'created_at'>>
        Update: Record<string, never>
        Relationships: []
      }
      subscriptions: {
        Row: DbSubscription
        // Client is read-only (RLS denies writes); types kept for completeness.
        Insert: NullableOptional<Omit<DbSubscription, 'created_at' | 'updated_at'>>
        Update: Partial<Omit<DbSubscription, 'user_id' | 'created_at'>>
        Relationships: []
      }
      billing_invoices: {
        Row: DbBillingInvoice
        Insert: NullableOptional<DbBillingInvoice>
        Update: Record<string, never>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
