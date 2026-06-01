/**
 * MUSVORA Professional Profile System — types.
 *
 * The professional profile is a PUBLIC, enterprise-grade representation of a
 * music-industry participant (Composer, Artist, Producer, Publisher, Manager,
 * Business). It is intentionally separate from:
 *   - The auth `Profile` (id / email / role) — never exposed publicly.
 *   - The identity customisation layer (aura / emotional status) — the legacy
 *     cinematic personal profile.
 *
 * SECURITY: `legalName` is PRIVATE. It is only ever editable by the owner of
 * the profile and is NEVER rendered on the public professional profile view.
 * Email, password, and internal IDs are never part of this shape.
 */

export type ProfessionalRole =
  | 'composer'
  | 'artist'
  | 'producer'
  | 'publisher'
  | 'manager'
  | 'business'

/** The public + private fields a user controls for their professional profile. */
export interface ProfessionalProfileData {
  /** Public stage / artistic / company name. */
  artisticName: string | null
  /** PRIVATE — legal name. Never rendered publicly. */
  legalName: string | null
  professionalRole: ProfessionalRole | null
  bio: string | null
  country: string | null
  city: string | null
  languages: string[]
  genres: string[]
  website: string | null
  instagram: string | null
  tiktok: string | null
  youtube: string | null
  spotify: string | null
  appleMusic: string | null
  /** Public avatar (Supabase URL or local data-URL fallback). */
  avatarUrl: string | null
  /** Optional cover image (Supabase URL or local data-URL fallback). */
  coverImageUrl: string | null
}

export type ProfileTabKey =
  | 'overview'
  | 'catalog'
  | 'licensing'
  | 'ownership'
  | 'about'

/** Honest verification state — only ever derived from real auth criteria. */
export type ProfileVerificationState = 'verified' | 'pending'
