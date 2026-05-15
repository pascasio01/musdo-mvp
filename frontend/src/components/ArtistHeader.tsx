import { useState } from 'react'
import { X } from 'lucide-react'
import VerificationBadge from './VerificationBadge'
import type { Profile } from '../types'

const roleSubtitles: Record<string, string[]> = {
  composer: ['Emotional Songwriter', 'Composer · Arranger', 'Music Architect'],
  producer: ['Producer · Beatmaker', 'Producer · Arranger', 'Sound Designer'],
  artist: ['Independent Artist', 'Modern Bachata Artist', 'Singer · Songwriter'],
  listener: ['Music Explorer', 'Curator · Listener'],
  admin: ['Platform Administrator'],
  supreme_owner: ['Platform Architect', 'Founder · MUSDO'],
}

const emotionalStatuses = [
  'Currently creating…',
  'In Studio',
  'Inspired by late nights',
  'Late-night sessions',
  'Between melodies',
  'Writing something deep',
  'In the zone',
]

interface ArtistHeaderProps {
  profile: Profile
  songCount?: number
  streams?: string
  compact?: boolean
}

function MiniProfileModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const subtitleList = roleSubtitles[profile.sub_role ?? profile.role] ?? roleSubtitles['listener']
  const subtitle = subtitleList[0]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
          <X size={15} />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-700 to-blue-900 flex items-center justify-center text-white text-2xl font-black"
              style={{ boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
            >
              {profile.username?.[0]?.toUpperCase() ?? 'M'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-500 border-2 border-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-black text-xl">{profile.username}</h3>
              {profile.human_verified && <VerificationBadge type="human_verified" size="sm" />}
            </div>
            <p className="text-zinc-500 text-sm">{subtitle}</p>
          </div>
        </div>

        {profile.bio && <p className="text-zinc-400 text-sm leading-relaxed mb-4">{profile.bio}</p>}

        <div className="flex gap-2 flex-wrap">
          {profile.verified_artist && <VerificationBadge type="verified_artist" size="sm" />}
          {profile.verified_composer && <VerificationBadge type="verified_composer" size="sm" />}
          {profile.verified_rights_holder && <VerificationBadge type="verified_rights_holder" size="sm" />}
          {profile.label_verified && <VerificationBadge type="label_verified" size="sm" />}
        </div>
      </div>
    </div>
  )
}

export default function ArtistHeader({ profile, songCount, streams, compact = false }: ArtistHeaderProps) {
  const [showModal, setShowModal] = useState(false)
  const [statusIdx] = useState(() => Math.floor(Math.random() * emotionalStatuses.length))

  const subtitleList = roleSubtitles[profile.sub_role ?? profile.role] ?? roleSubtitles['listener']
  const subtitle = subtitleList[0]
  const emotionalStatus = emotionalStatuses[statusIdx]
  const initial = profile.username?.[0]?.toUpperCase() ?? 'M'

  return (
    <>
      <div className={`flex items-center gap-4 ${compact ? 'mb-4' : 'mb-6'}`}>
        <button
          onClick={() => setShowModal(true)}
          className="relative flex-shrink-0 group"
          aria-label="View profile"
        >
          <div
            className="relative rounded-2xl bg-gradient-to-br from-violet-700 to-blue-900 flex items-center justify-center text-white font-black overflow-hidden"
            style={{
              width: compact ? 48 : 64,
              height: compact ? 48 : 64,
              fontSize: compact ? 20 : 26,
              boxShadow: '0 0 0 1px rgba(124,58,237,0.3), 0 0 24px rgba(124,58,237,0.15)',
              animation: 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite',
            }}
          >
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              : initial
            }
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-violet-500 border-2 border-black"
            title="Active"
          />
        </button>

        <div className="flex-1 min-w-0">
          <button onClick={() => setShowModal(true)} className="text-left group">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-white font-black group-hover:opacity-80 transition-opacity ${compact ? 'text-lg' : 'text-xl'}`}>
                {profile.username}
              </h2>
              {profile.human_verified && <VerificationBadge type="human_verified" size="sm" />}
              {profile.verified_artist && !profile.human_verified && <VerificationBadge type="verified_artist" size="sm" />}
              {profile.verified_composer && !profile.verified_artist && <VerificationBadge type="verified_composer" size="sm" />}
            </div>
            <p className="text-zinc-500 text-sm truncate">{subtitle}</p>
          </button>

          {!compact && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <p className="text-zinc-600 text-xs italic">{emotionalStatus}</p>
            </div>
          )}
        </div>

        {(songCount !== undefined || streams) && (
          <div className="flex flex-col items-end flex-shrink-0">
            {songCount !== undefined && (
              <p className="text-white font-bold text-sm">{songCount}</p>
            )}
            {songCount !== undefined && (
              <p className="text-zinc-600 text-[10px]">songs</p>
            )}
            {streams && (
              <p className="text-zinc-500 text-[10px] mt-0.5">{streams} streams</p>
            )}
          </div>
        )}
      </div>

      {showModal && <MiniProfileModal profile={profile} onClose={() => setShowModal(false)} />}
    </>
  )
}
