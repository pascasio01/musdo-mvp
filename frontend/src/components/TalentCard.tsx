import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star, Wifi, Heart, Mic } from 'lucide-react'
import type { TalentProfile, AvailabilityStatus } from '../types/talent'

const availabilityConfig: Record<AvailabilityStatus, { label: string; color: string; dot: string }> = {
  available: { label: 'Available Now', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  limited: { label: 'Limited', color: 'text-amber-400', dot: 'bg-amber-400' },
  busy: { label: 'Busy', color: 'text-red-400', dot: 'bg-red-400' },
  unavailable: { label: 'Unavailable', color: 'text-zinc-500', dot: 'bg-zinc-500' },
}

interface TalentCardProps {
  talent: TalentProfile
  saved?: boolean
  onSaveToggle?: (id: string) => void
  variant?: 'grid' | 'horizontal'
}

export default function TalentCard({ talent, saved = false, onSaveToggle, variant = 'horizontal' }: TalentCardProps) {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(saved)
  const avail = availabilityConfig[talent.availability_status]

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(v => !v)
    onSaveToggle?.(talent.id)
  }

  const handleRequest = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/talent/${talent.id}`)
  }

  if (variant === 'grid') {
    return (
      <div
        onClick={() => navigate(`/talent/${talent.id}`)}
        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/8 hover:border-white/15 transition-all cursor-pointer w-44 flex-shrink-0"
      >
        <div className="relative w-full h-36 bg-zinc-800">
          {talent.profile_photo
            ? <img src={talent.profile_photo} alt={talent.stage_name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800 flex items-center justify-center">
                <span className="text-white text-2xl font-black">{talent.stage_name[0]}</span>
              </div>
          }
          <button
            onClick={handleSave}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-theme/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Heart size={13} className={isSaved ? 'text-red-400 fill-red-400' : 'text-zinc-400'} />
          </button>
          {talent.verified_status && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-theme/60 backdrop-blur-sm rounded-full px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-blue-300 text-[9px] font-bold">VERIFIED</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-white font-bold text-sm truncate">{talent.stage_name}</p>
          <p className="text-zinc-500 text-[11px] truncate">{talent.categories[0]}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
            <span className={`text-[10px] font-semibold ${avail.color}`}>{avail.label}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/talent/${talent.id}`)}
      className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/[0.07] hover:border-white/15 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4 p-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800">
            {talent.profile_photo
              ? <img src={talent.profile_photo} alt={talent.stage_name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800 flex items-center justify-center">
                  <span className="text-white text-xl font-black">{talent.stage_name[0]}</span>
                </div>
            }
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${avail.dot}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-white font-bold">{talent.stage_name}</h3>
                {talent.verified_status && (
                  <span className="text-[9px] font-bold text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-full px-1.5 py-0.5">VERIFIED</span>
                )}
              </div>
              <p className="text-zinc-500 text-xs mt-0.5 truncate">
                {talent.categories.slice(0, 2).join(' · ')}
              </p>
            </div>
            <button onClick={handleSave} className="ml-2 flex-shrink-0 p-1">
              <Heart size={16} className={isSaved ? 'text-red-400 fill-red-400' : 'text-zinc-600 hover:text-zinc-400'} />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
              <MapPin size={10} />
              <span className="truncate max-w-[100px]">{talent.location}</span>
            </div>
            {talent.rating_mock && (
              <div className="flex items-center gap-0.5 text-amber-400 text-[11px]">
                <Star size={10} fill="currentColor" />
                <span className="font-semibold">{talent.rating_mock}</span>
                <span className="text-zinc-600">({talent.reviews_count})</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-zinc-600 text-[11px]">
              <Clock size={10} />
              <span>{talent.response_time}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {talent.remote_available && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded-full px-2 py-0.5">
                <Wifi size={9} />Remote
              </span>
            )}
            {talent.live_available && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-400/20 rounded-full px-2 py-0.5">
                <Mic size={9} />Live
              </span>
            )}
            {talent.reads_music && (
              <span className="text-[10px] font-semibold text-zinc-400 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                Reads Music
              </span>
            )}
            {talent.instruments.slice(0, 1).map(inst => (
              <span key={inst} className="text-[10px] text-zinc-500 bg-white/5 border border-white/8 rounded-full px-2 py-0.5 truncate max-w-[80px]">
                {inst}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between">
        <div>
          {talent.project_rate ? (
            <p className="text-white font-bold text-sm">
              From <span className="text-lg">${talent.project_rate}</span>
              <span className="text-zinc-600 text-xs"> /project</span>
            </p>
          ) : talent.hourly_rate ? (
            <p className="text-white font-bold text-sm">
              <span className="text-lg">${talent.hourly_rate}</span>
              <span className="text-zinc-600 text-xs"> /hour</span>
            </p>
          ) : (
            <p className="text-zinc-600 text-xs">Rate on request</p>
          )}
        </div>
        <button
          onClick={handleRequest}
          className="px-4 py-2.5 rounded-2xl bg-white text-black text-xs font-bold hover:opacity-90 transition-opacity"
        >
          View Profile
        </button>
      </div>
    </div>
  )
}
