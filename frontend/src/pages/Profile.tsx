import { useNavigate } from 'react-router-dom'
import { Settings, Music, Shield, TrendingUp, LogOut } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import MusicCard from '../components/MusicCard'
import { VerificationBadgeRow, VerificationStatusCard } from '../components/VerificationBadge'
import { mockSongs, mockProfile } from '../data/mockData'
import { useAuth } from '../lib/auth'
import { humanizeRole } from '../utils/format'

export default function Profile() {
  const navigate = useNavigate()
  const { user, profile: authProfile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const displayName = authProfile?.username ?? user?.user_metadata?.username ?? mockProfile.username
  const roleLabel = humanizeRole(authProfile?.role ?? mockProfile.role).toUpperCase()
  const verificationData = authProfile ?? mockProfile

  const stats = [
    { value: '24',   label: 'Songs',   icon: Music },
    { value: '12.4K', label: 'Streams', icon: TrendingUp },
    { value: '8',    label: 'Licenses', icon: Shield },
  ]

  return (
    <AppShell>
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none h-64" aria-hidden>
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-violet-950/30 to-transparent" />
        </div>

        <div className="relative px-5 pt-14">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-primary font-black text-2xl">Profile</h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-2xl border border-theme flex items-center justify-center text-muted hover:text-primary transition-colors"
                style={{ background: 'var(--glass-bg)' }}
                aria-label="Analytics dashboard"
              >
                <TrendingUp size={18} strokeWidth={1.5} aria-hidden />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-10 h-10 rounded-2xl border border-theme flex items-center justify-center text-muted hover:text-primary transition-colors"
                style={{ background: 'var(--glass-bg)' }}
                aria-label="Settings"
              >
                <Settings size={18} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-900 flex-shrink-0 flex items-center justify-center" aria-hidden>
              <span className="text-white text-3xl font-black">{displayName[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-primary font-black text-2xl truncate">{displayName}</h2>
                <VerificationBadgeRow
                  verified_artist={verificationData.verified_artist}
                  verified_composer={verificationData.verified_composer}
                  label_verified={verificationData.label_verified}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[11px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 rounded-full px-2.5 py-1">
                  {roleLabel}
                </span>
                {verificationData.verification_status === 'approved' && (
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-1">
                    VERIFIED
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-theme p-4 text-center"
                style={{ background: 'var(--glass-bg)' }}
              >
                <p className="text-primary font-black text-2xl">{value}</p>
                <p className="text-muted text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl border border-theme p-4 mb-6"
            style={{ background: 'var(--glass-bg)' }}
          >
            <p className="text-secondary text-sm leading-relaxed">
              {authProfile?.bio ?? mockProfile.bio}
            </p>
          </div>

          <div className="mb-6">
            <VerificationStatusCard profile={verificationData} />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-primary font-bold text-lg">My Songs</h2>
              <button className="text-muted text-sm hover:text-primary transition-colors">See all</button>
            </div>
            <div className="space-y-1">
              {mockSongs.slice(0, 4).map(song => (
                <MusicCard key={song.id} song={song} variant="compact" />
              ))}
            </div>
          </div>

          <div className="pb-6">
            <button
              onClick={handleSignOut}
              className="w-full py-4 rounded-2xl border border-theme text-muted font-semibold flex items-center justify-center gap-2 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
              style={{ background: 'var(--glass-bg)' }}
            >
              <LogOut size={18} aria-hidden />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
