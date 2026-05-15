import { Shield, Clock, Fingerprint, QrCode } from 'lucide-react'
import type { Song } from '../types'
import VerificationBadge, { VerificationBadgeRow } from './VerificationBadge'

interface SongPassportCardProps {
  song: Song
}

export default function SongPassportCard({ song }: SongPassportCardProps) {
  const passportId = `MSP-${song.id.toUpperCase()}-2026`
  const timestamp = new Date(song.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black shadow-2xl">
      <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-violet-950/60 to-blue-950/40 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Song Passport</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-full border border-white/10">
            MUSDO / 2026
          </span>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
            {song.artwork_url
              ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-2xl leading-tight">{song.title}</h2>
            <p className="text-zinc-400 text-sm mt-0.5">{song.artist_name}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {song.human_verified && (
                <VerificationBadge type="human_verified" size="xs" showLabel />
              )}
              {song.verified_rights_holder && (
                <VerificationBadge type="verified_rights_holder" size="xs" showLabel />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Genre</p>
            <p className="text-white text-sm font-semibold">{song.genre}</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Key</p>
            <p className="text-white text-sm font-semibold">{song.key ?? '—'}</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">BPM</p>
            <p className="text-white text-sm font-semibold">{song.bpm ?? '—'}</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Duration</p>
            <p className="text-white text-sm font-semibold">
              {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '—'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <Fingerprint size={15} className="text-zinc-500" />
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Passport ID</p>
              <p className="text-white text-xs font-mono font-semibold">{passportId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-zinc-500" />
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Registered</p>
              <p className="text-white text-xs font-semibold">{timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Shield size={15} className="text-zinc-500" />
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Owner</p>
              <p className="text-white text-xs font-semibold">{song.artist_name}</p>
            </div>
          </div>
        </div>

        {(song.human_verified || song.verified_rights_holder) && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3">Verification Badges</p>
            <VerificationBadgeRow
              human_verified={song.human_verified}
              verified_rights_holder={song.verified_rights_holder}
              size="sm"
              className="flex-wrap gap-2"
            />
          </div>
        )}

        <div className="rounded-2xl bg-violet-950/30 border border-violet-500/20 p-4 flex items-center gap-4">
          <QrCode size={40} className="text-violet-400 flex-shrink-0" />
          <div>
            <p className="text-white text-xs font-semibold">Verification QR</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Scan to verify on MUSDO Registry</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
        <p className="text-center text-[10px] text-zinc-600 font-mono">
          MUSDO HUMAN MUSIC INFRASTRUCTURE · POWERED BY PASCASIO
        </p>
      </div>
    </div>
  )
}
