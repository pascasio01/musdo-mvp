/**
 * MUSDO Identity + Social Layer
 *
 * Core principle: PUBLIC and PRIVATE identity are strictly separated.
 * - PublicIdentity is visible to anyone browsing a profile.
 * - PrivateIdentity (legal name, publishing data, royalties, owner contact)
 *   is ONLY exposed inside licensing flows, contracts, ownership verification,
 *   and the supreme_owner admin surfaces — never on a public profile page.
 *
 * The shapes mirror the Supabase schema in db/schema_identity.sql.
 */

export type ProfileAura =
  | 'velvet_violet'
  | 'midnight_blue'
  | 'amber_warmth'
  | 'crimson_dusk'
  | 'forest_dawn'
  | 'pearl_neutral'

export type EmotionalStatus =
  | 'in_the_studio'
  | 'late_night_writing'
  | 'feeling_nostalgic'
  | 'between_albums'
  | 'on_tour'
  | 'open_to_collab'
  | 'listening_only'
  | null

export type ListeningMode = 'public' | 'private_session' | 'invisible'

export interface EmotionalSignature {
  /** Three dominant moods that define this creator's musical fingerprint. */
  dominantMoods: string[]
  /** A single phrase the creator chose to describe their sound. */
  tagline: string
  /** Time-of-day this creator most often listens / creates. */
  primeHour: 'morning' | 'afternoon' | 'evening' | 'late_night'
  /** Density of the creator's catalogue: minimal, lush, layered, etc. */
  texture: 'minimal' | 'organic' | 'layered' | 'cinematic' | 'raw'
}

/** What anyone can see when they visit a profile. */
export interface PublicIdentity {
  userId: string
  /** Stage / artist / creator alias — never the legal name. */
  alias: string
  /** Optional handle, e.g. @emmanuelr (no spaces). */
  handle?: string
  bio?: string
  avatarUrl?: string
  headerImageUrl?: string
  aura: ProfileAura
  accentColor?: string
  emotionalStatus: EmotionalStatus
  emotionalTags: string[]
  signature?: EmotionalSignature
  /** Visible verification facets (badges only, not legal proof docs). */
  verifiedHuman: boolean
  verifiedArtist: boolean
}

/**
 * Private identity. NEVER serialised into a public profile response.
 * Lives behind RLS policies tied to:
 *   - the owner themselves (self-read)
 *   - parties to an active license/contract
 *   - admins / supreme_owner
 */
export interface PrivateIdentity {
  userId: string
  legalName: string
  legalEmail: string
  publishingEntity?: string
  pro?: 'ASCAP' | 'BMI' | 'SESAC' | 'SACM' | 'SGAE' | 'SOCAN' | 'OTHER'
  ipiNumber?: string
  taxId?: string
  payoutCurrency?: string
  ownershipNotes?: string
}

/** Follow relationship (resonance). */
export interface Follow {
  followerId: string
  followingId: string
  createdAt: string
  /** "Resonance" is MUSDO's framing — a soft signal of shared atmosphere. */
  resonanceScore?: number
}

export type ResonanceTier =
  | 'shared_atmosphere'
  | 'night_listeners'
  | 'human_verified_listener'
  | 'kindred_creator'

export interface ResonanceSummary {
  followers: number
  following: number
  tier: ResonanceTier
  /** Free-form descriptor surfaced under the follower count. */
  descriptor: string
}

/** Playlist visibility — finer-grained than just public/private. */
export type PlaylistVisibility =
  | 'public'
  | 'unlisted'
  | 'followers_only'
  | 'private'
  | 'creator_only'

export interface Playlist {
  id: string
  ownerId: string
  title: string
  /** A short cinematic line shown under the title — not a description. */
  subtitle?: string
  coverUrl?: string
  /** Atmosphere tag (e.g. "midnight drive", "acoustic morning"). */
  atmosphere?: string
  /** Up to 3 dominant moods that define the listening experience. */
  moodSignature: string[]
  visibility: PlaylistVisibility
  trackCount: number
  /** Hex or token reference for the hover-glow accent. */
  accentColor?: string
  createdAt: string
  updatedAt?: string
}

/** All privacy toggles a user can set. */
export interface PrivacySettings {
  /** Hides current playback from followers / public profile. */
  hideListeningActivity: boolean
  /** Removes the recently played module from the public profile. */
  hideRecentlyPlayed: boolean
  /** Master toggle: nothing this session is broadcast or recorded for feed. */
  privateSession: boolean
  /** Hide alias from public search & discovery. */
  hiddenIdentity: boolean
  /** Hide follower / following counts from the public profile. */
  hideSocialCounts: boolean
  /** Allow other users to send licensing requests directly. */
  allowLicensingDms: boolean
}

/** Profile customisation a user controls (separate from app theme). */
export interface ProfileCustomization {
  aura: ProfileAura
  accentColor: string | null
  headerImageUrl: string | null
  emotionalStatus: EmotionalStatus
  listeningMode: ListeningMode
}

/** What the IdentityProvider exposes to the rest of the app. */
export interface IdentityState {
  /** Set of userIds the current user follows (mock-only for MVP). */
  following: Set<string>
  privacy: PrivacySettings
  customization: ProfileCustomization
  follow: (userId: string) => void
  unfollow: (userId: string) => void
  isFollowing: (userId: string) => boolean
  updatePrivacy: (partial: Partial<PrivacySettings>) => void
  updateCustomization: (partial: Partial<ProfileCustomization>) => void
}
