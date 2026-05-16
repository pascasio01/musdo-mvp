import { useNavigate } from 'react-router-dom'
import { Settings, Music, Shield, TrendingUp, LogOut, Plus } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import MusicCard from '../components/MusicCard'
import { VerificationStatusCard } from '../components/VerificationBadge'
import CinematicProfileHeader from '../components/identity/CinematicProfileHeader'
import EmotionalIdentityCard from '../components/identity/EmotionalIdentityCard'
import FollowButton from '../components/identity/FollowButton'
import PlaylistCard from '../components/identity/PlaylistCard'
import { mockSongs, mockProfile } from '../data/mockData'
import {
  mockPublicIdentity,
  mockResonance,
  mockPlaylists,
} from '../data/identityMock'
import { useAuth } from '../lib/auth'
import { useIdentity, maskResonanceForPrivacy } from '../lib/identity'
import { humanizeRole } from '../utils/format'

export default function Profile() {
  const navigate = useNavigate()
  const { user, profile: authProfile, signOut } = useAuth()
  const { privacy, customization } = useIdentity()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Public identity is what gets rendered. Pull alias / bio / status from
  // the user's identity customization with sensible fallbacks. Legal
  // identity (auth user.email, etc.) is NEVER shown here.
  const displayAlias =
    authProfile?.username ?? user?.user_metadata?.username ?? mockPublicIdentity.alias

  const publicIdentity = {
    ...mockPublicIdentity,
    alias: displayAlias,
    bio: authProfile?.bio ?? mockPublicIdentity.bio,
    aura: customization.aura,
    accentColor: customization.accentColor ?? mockPublicIdentity.accentColor,
    headerImageUrl: customization.headerImageUrl ?? mockPublicIdentity.headerImageUrl,
    emotionalStatus: customization.emotionalStatus ?? mockPublicIdentity.emotionalStatus,
    verifiedHuman: authProfile?.human_verified ?? mockPublicIdentity.verifiedHuman,
    verifiedArtist: authProfile?.verified_artist ?? mockPublicIdentity.verifiedArtist,
  }

  const verificationData = authProfile ?? mockProfile
  const roleLabel = humanizeRole(authProfile?.role ?? mockProfile.role).toUpperCase()
  const resonance = maskResonanceForPrivacy(mockResonance, privacy)

  // Visible playlists honour both viewer perspective (this is the OWN profile,
  // so creator_only / private are visible to self) — for a third-party view
  // you'd filter visibility !== 'creator_only' here.
  const visiblePlaylists = mockPlaylists

  const stats = [
    { value: '24', label: 'Songs', icon: Music },
    { value: '12.4K', label: 'Streams', icon: TrendingUp },
    { value: '8', label: 'Licenses', icon: Shield },
  ]

  return (
    <AppShell>
      <div className="relative">
        {/* Top action bar — floats over the cinematic header */}
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-5 pt-5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted font-bold">
            Profile
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-2xl border flex items-center justify-center text-secondary hover:text-primary transition-colors backdrop-blur-md"
              style={{ background: 'var(--glass-bg-medium)', borderColor: 'var(--border-soft)' }}
              aria-label="Analytics dashboard"
            >
              <TrendingUp size={16} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-2xl border flex items-center justify-center text-secondary hover:text-primary transition-colors backdrop-blur-md"
              style={{ background: 'var(--glass-bg-medium)', borderColor: 'var(--border-soft)' }}
              aria-label="Settings"
            >
              <Settings size={16} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>

        {/* Cinematic header with adaptive aura */}
        <CinematicProfileHeader identity={publicIdentity} immersive />

        <div className="px-5 pb-6 space-y-6">
          {/* Role pill — ABOVE follow button for hierarchy */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
              style={{
                background: 'var(--accent-soft)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-soft)',
              }}
            >
              {roleLabel}
            </span>
            {verificationData.verification_status === 'approved' && (
              <span
                className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                Verified
              </span>
            )}
          </div>

          {/* Resonance row — followers / following / tier (own profile = no follow btn) */}
          {resonance && (
            <div className="flex items-center justify-between rounded-2xl px-4 py-3 border"
                 style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-primary font-black text-lg leading-none">
                    {resonance.followers.toLocaleString()}
                  </p>
                  <p className="text-muted text-[10px] uppercase tracking-wider mt-1 font-bold">
                    Resonating with
                  </p>
                </div>
                <div className="w-px h-8" style={{ background: 'var(--border-soft)' }} aria-hidden />
                <div>
                  <p className="text-primary font-black text-lg leading-none">
                    {resonance.following}
                  </p>
                  <p className="text-muted text-[10px] uppercase tracking-wider mt-1 font-bold">
                    Following
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] uppercase tracking-wider font-bold text-right"
                style={{ color: 'var(--accent)' }}
              >
                Kindred
                <br />
                Creator
              </span>
            </div>
          )}

          {/* Stats — songs / streams / licenses */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border p-4 text-center"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--border-soft)',
                }}
              >
                <p className="text-primary font-black text-xl">{value}</p>
                <p className="text-muted text-[10.5px] mt-1 uppercase tracking-wider font-bold">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Emotional Identity — the centerpiece */}
          {publicIdentity.signature && (
            <EmotionalIdentityCard signature={publicIdentity.signature} />
          )}

          {/* Verification surface */}
          <VerificationStatusCard profile={verificationData} />

          {/* Playlists — cinematic collections */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-0.5">
                  Cinematic Collections
                </p>
                <h2 className="text-primary font-bold text-lg leading-tight">Playlists</h2>
              </div>
              <button
                className="w-9 h-9 rounded-2xl border flex items-center justify-center text-secondary hover:text-primary transition-colors"
                style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-soft)' }}
                aria-label="Create playlist"
              >
                <Plus size={16} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <div className="space-y-2.5">
              {visiblePlaylists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onClick={id => navigate(`/playlist/${id}`)}
                />
              ))}
            </div>
          </div>

          {/* Songs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-primary font-bold text-lg">My Songs</h2>
              <button className="text-muted text-sm hover:text-primary transition-colors">
                See all
              </button>
            </div>
            <div className="space-y-1">
              {mockSongs.slice(0, 4).map(song => (
                <MusicCard key={song.id} song={song} variant="compact" />
              ))}
            </div>
          </div>

          {/* Demo: third-party FollowButton (shows resonance language) */}
          <div className="rounded-2xl border p-4"
               style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-soft)' }}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-3">
              Preview: how others see your follow button
            </p>
            <FollowButton userId="self" resonance={mockResonance} />
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-4 rounded-2xl border text-muted font-semibold flex items-center justify-center gap-2 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
            style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-soft)' }}
          >
            <LogOut size={18} aria-hidden />
            Sign Out
          </button>
        </div>
      </div>
    </AppShell>
  )
}
