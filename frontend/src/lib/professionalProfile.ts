/**
 * MUSVORA Professional Profile — data layer + pure helpers.
 *
 * Persistence: localStorage (key `musdo-pro-profile-v1`), mirroring the app's
 * existing hybrid architecture (Supabase for auth/works, localStorage for
 * frontend-only profile customisation). This keeps the Professional Profile V1
 * fully functional WITHOUT touching the Supabase schema.
 *
 * NOTE: `musdo-` prefix is a persistence key, never branding — do not rename.
 */
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { AppRole, Profile } from '../types'
import type {
  ProfessionalProfileData,
  ProfessionalRole,
  ProfileVerificationState,
} from '../types/profile'

const STORAGE_PRO_PROFILE = 'musdo-pro-profile-v1'

/**
 * Storage key is scoped per authenticated user so private data (e.g. legal
 * name) can never leak across accounts on a shared browser. We intentionally do
 * NOT fall back to the unscoped legacy key for a specific user, since that would
 * re-introduce the cross-account leak. `musdo-` prefix is persistence, not
 * branding — never rename.
 */
function proProfileKey(userId: string | null | undefined): string {
  return userId ? `${STORAGE_PRO_PROFILE}:${userId}` : STORAGE_PRO_PROFILE
}

export const emptyProfessionalProfile: ProfessionalProfileData = {
  artisticName: null,
  legalName: null,
  professionalRole: null,
  bio: null,
  country: null,
  city: null,
  languages: [],
  genres: [],
  website: null,
  instagram: null,
  tiktok: null,
  youtube: null,
  spotify: null,
  appleMusic: null,
  avatarUrl: null,
  coverImageUrl: null,
}

export function useProfessionalProfile(userId: string | null | undefined) {
  return useLocalStorage<ProfessionalProfileData>(
    proProfileKey(userId),
    emptyProfessionalProfile,
  )
}

/* ── Role helpers ─────────────────────────────────────────────── */

export const professionalRoleLabels: Record<ProfessionalRole, string> = {
  composer: 'Composer',
  artist: 'Artist',
  producer: 'Producer',
  publisher: 'Publisher',
  manager: 'Manager',
  business: 'Business',
}

/** Best-effort default professional role from the auth AppRole. */
export function mapAuthRoleToProfessional(role: AppRole | undefined): ProfessionalRole {
  switch (role) {
    case 'composer':
      return 'composer'
    case 'producer':
      return 'producer'
    default:
      return 'artist'
  }
}

/* ── Verification (HONEST — real criteria only) ───────────────── */

/**
 * A profile is "Verified" ONLY when real verification criteria exist on the
 * auth profile. Everything else is "Pending Verification". Never fabricated.
 */
export function computeVerification(profile: Profile | null | undefined): {
  state: ProfileVerificationState
  label: string
} {
  const verified =
    profile?.verification_status === 'approved' ||
    Boolean(
      profile?.verified_artist ||
        profile?.verified_composer ||
        profile?.verified_rights_holder ||
        profile?.human_verified ||
        profile?.label_verified,
    )
  return verified
    ? { state: 'verified', label: 'Verified Profile' }
    : { state: 'pending', label: 'Pending Verification' }
}

/* ── Role-specific overview stats ─────────────────────────────── */

export interface RoleStat {
  label: string
  value: string
  /** Honest hint when a metric is not yet wired to live data. */
  hint?: string
}

/**
 * Role-specific overview tiles. Metrics that are not yet wired to live data
 * render "—" with a "Pending" hint — MUSVORA never shows fabricated numbers.
 * Metrics derivable from real profile fields (e.g. genre count) show live.
 */
export function getRoleStats(
  role: ProfessionalRole,
  data: ProfessionalProfileData,
): RoleStat[] {
  const pending = (label: string): RoleStat => ({ label, value: '—', hint: 'Pending' })
  const genresCount = data.genres.length ? String(data.genres.length) : '—'
  const langCount = data.languages.length ? String(data.languages.length) : '—'

  switch (role) {
    case 'composer':
      return [
        pending('Total Works'),
        pending('Readiness Avg'),
        pending('Ownership Confidence'),
        pending('Active Passports'),
        pending('Licensing Availability'),
      ]
    case 'artist':
      return [
        pending('Music Catalog'),
        pending('Licensed Works'),
        pending('Public Playlists'),
        pending('Followers'),
      ]
    case 'producer':
      return [
        pending('Projects'),
        { label: 'Genres', value: genresCount, hint: genresCount === '—' ? 'Add genres' : undefined },
        pending('Collaborations'),
      ]
    case 'publisher':
      return [
        pending('Catalog Managed'),
        pending('Licensing Activity'),
        pending('Rights Administration'),
      ]
    case 'manager':
      return [
        pending('Managed Roster'),
        pending('Licensing Activity'),
        pending('Representation'),
      ]
    case 'business':
      return [
        { label: 'Languages', value: langCount, hint: langCount === '—' ? 'Add languages' : undefined },
        pending('Licensing Interests'),
        pending('Active Contacts'),
      ]
    default:
      return []
  }
}

/* ── Social links ─────────────────────────────────────────────── */

export interface SocialLink {
  key: string
  label: string
  value: string
  href: string
}

function toHref(value: string): string {
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v}`
}

/** Only returns links the user actually filled in. */
export function getSocialLinks(data: ProfessionalProfileData): SocialLink[] {
  const defs: Array<[keyof ProfessionalProfileData, string]> = [
    ['website', 'Website'],
    ['instagram', 'Instagram'],
    ['tiktok', 'TikTok'],
    ['youtube', 'YouTube'],
    ['spotify', 'Spotify'],
    ['appleMusic', 'Apple Music'],
  ]
  const links: SocialLink[] = []
  for (const [key, label] of defs) {
    const value = data[key]
    if (typeof value === 'string' && value.trim()) {
      links.push({ key: String(key), label, value: value.trim(), href: toHref(value) })
    }
  }
  return links
}

/** Read a File into a data-URL (local fallback when Supabase storage is offline). */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
