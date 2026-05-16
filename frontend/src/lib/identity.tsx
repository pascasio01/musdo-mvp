import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type {
  IdentityState,
  PrivacySettings,
  ProfileCustomization,
  ResonanceSummary,
  ResonanceTier,
} from '../types/identity'

const STORAGE_PRIVACY = 'musdo-privacy-v1'
const STORAGE_CUSTOM = 'musdo-customization-v1'
const STORAGE_FOLLOWS = 'musdo-follows-v1'

const defaultPrivacy: PrivacySettings = {
  hideListeningActivity: false,
  hideRecentlyPlayed: false,
  privateSession: false,
  hiddenIdentity: false,
  hideSocialCounts: false,
  allowLicensingDms: true,
}

const defaultCustomization: ProfileCustomization = {
  aura: 'velvet_violet',
  accentColor: null,
  headerImageUrl: null,
  emotionalStatus: null,
  listeningMode: 'public',
}

const IdentityContext = createContext<IdentityState | undefined>(undefined)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [privacy, setPrivacy] = useLocalStorage<PrivacySettings>(STORAGE_PRIVACY, defaultPrivacy)
  const [customization, setCustomization] = useLocalStorage<ProfileCustomization>(
    STORAGE_CUSTOM,
    defaultCustomization,
  )
  const [followsArr, setFollowsArr] = useLocalStorage<string[]>(STORAGE_FOLLOWS, [])

  // Set is derived; we keep an array in storage for JSON friendliness.
  const [followsVersion, setFollowsVersion] = useState(0)
  const following = useMemo(() => new Set(followsArr), [followsArr, followsVersion])

  const follow = useCallback(
    (userId: string) => {
      setFollowsArr(prev => (prev.includes(userId) ? prev : [...prev, userId]))
      setFollowsVersion(v => v + 1)
    },
    [setFollowsArr],
  )

  const unfollow = useCallback(
    (userId: string) => {
      setFollowsArr(prev => prev.filter(id => id !== userId))
      setFollowsVersion(v => v + 1)
    },
    [setFollowsArr],
  )

  const isFollowing = useCallback((userId: string) => following.has(userId), [following])

  const updatePrivacy = useCallback(
    (partial: Partial<PrivacySettings>) => {
      setPrivacy(prev => ({ ...prev, ...partial }))
    },
    [setPrivacy],
  )

  const updateCustomization = useCallback(
    (partial: Partial<ProfileCustomization>) => {
      setCustomization(prev => ({ ...prev, ...partial }))
    },
    [setCustomization],
  )

  const value = useMemo<IdentityState>(
    () => ({
      following,
      privacy,
      customization,
      follow,
      unfollow,
      isFollowing,
      updatePrivacy,
      updateCustomization,
    }),
    [following, privacy, customization, follow, unfollow, isFollowing, updatePrivacy, updateCustomization],
  )

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>
}

export function useIdentity(): IdentityState {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error('useIdentity must be used within IdentityProvider')
  return ctx
}

/* ── Pure helpers ─────────────────────────────────────────────── */

const tierLabels: Record<ResonanceTier, string> = {
  shared_atmosphere: 'Shared Atmosphere',
  night_listeners: 'Night Listeners',
  human_verified_listener: 'Human Verified Listener',
  kindred_creator: 'Kindred Creator',
}

export function formatResonanceTier(tier: ResonanceTier): string {
  return tierLabels[tier]
}

/** Compact 1.2K / 12.4K / 1.4M formatter for follower counts. */
export function formatCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10_000) return `${(n / 1000).toFixed(1)}K`
  if (n < 1_000_000) return `${Math.round(n / 1000)}K`
  return `${(n / 1_000_000).toFixed(1)}M`
}

/** Apply privacy filter to a ResonanceSummary before public render. */
export function maskResonanceForPrivacy(
  summary: ResonanceSummary,
  privacy: PrivacySettings,
): ResonanceSummary | null {
  if (privacy.hideSocialCounts) return null
  return summary
}
