import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Star, Heart, Send, Wifi, Mic, Music, BookOpen, Headphones, Share2 } from 'lucide-react'
import { mockTalents, mockSavedTalentIds } from '../data/talentData'
import RequestSessionModal from '../components/RequestSessionModal'

const availabilityConfig = {
  available: { label: 'Available Now', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-400/25', dot: 'bg-emerald-400' },
  limited: { label: 'Limited Availability', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-400/25', dot: 'bg-amber-400' },
  busy: { label: 'Busy', color: 'text-red-400', bg: 'bg-red-500/10 border-red-400/25', dot: 'bg-red-400' },
  unavailable: { label: 'Unavailable', color: 'text-zinc-500', bg: 'bg-zinc-500/10 border-zinc-500/25', dot: 'bg-zinc-500' },
}

export default function TalentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const talent = mockTalents.find(t => t.id === id) ?? mockTalents[0]
  const [saved, setSaved] = useState(mockSavedTalentIds.includes(talent.id))
  const [showRequest, setShowRequest] = useState(false)

  const avail = availabilityConfig[talent.availability_status]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute top-0 left-0 right-0 h-72 overflow-hidden pointer-events-none">
        {talent.profile_photo && (
          <img src={talent.profile_photo} alt="" className="w-full h-full object-cover opacity-15 blur-xl scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      <div className="relative max-w-md mx-auto px-5 pt-14 pb-32">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(v => !v)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                saved ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'
              }`}
            >
              <Heart size={15} className={saved ? 'text-red-400 fill-red-400' : 'text-zinc-400'} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-end gap-5 mb-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10 shadow-2xl">
            {talent.profile_photo
              ? <img src={talent.profile_photo} alt={talent.stage_name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800 flex items-center justify-center">
                  <span className="text-white text-3xl font-black">{talent.stage_name[0]}</span>
                </div>
            }
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-black text-2xl">{talent.stage_name}</h1>
              {talent.verified_status && (
                <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-full px-2 py-0.5">VERIFIED</span>
              )}
            </div>
            <p className="text-zinc-400 text-sm mt-0.5">
              {talent.categories.slice(0, 2).join(' · ')}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 text-zinc-500 text-xs">
                <MapPin size={11} />
                <span>{talent.location}</span>
              </div>
              {talent.rating_mock && (
                <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                  <Star size={11} fill="currentColor" />
                  <span className="font-bold">{talent.rating_mock}</span>
                  <span className="text-zinc-600">({talent.reviews_count})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 mb-5 ${avail.bg}`}>
          <div className={`w-2 h-2 rounded-full ${avail.dot} animate-pulse`} />
          <span className={`text-sm font-semibold ${avail.color}`}>{avail.label}</span>
          <span className="text-zinc-600 text-xs ml-auto flex items-center gap-1">
            <Clock size={11} />
            {talent.response_time}
          </span>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {talent.remote_available && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded-full px-3 py-1.5">
              <Wifi size={11} />Remote Ready
            </span>
          )}
          {talent.live_available && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-400/20 rounded-full px-3 py-1.5">
              <Mic size={11} />Live Ready
            </span>
          )}
          {talent.studio_available && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-white/5 border border-white/15 rounded-full px-3 py-1.5">
              <Music size={11} />Studio Available
            </span>
          )}
          {talent.reads_music && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <BookOpen size={11} />Reads Music
            </span>
          )}
          {talent.plays_by_ear && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Headphones size={11} />Plays By Ear
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            {talent.years_experience} yrs exp
          </span>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
          <p className="text-zinc-400 text-sm leading-relaxed">{talent.bio}</p>
        </div>

        {talent.instruments.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Instruments</p>
            <div className="flex flex-wrap gap-2">
              {talent.instruments.map(inst => (
                <span key={inst} className="text-xs text-white bg-white/5 border border-white/10 rounded-full px-3 py-1.5 font-medium">
                  {inst}
                </span>
              ))}
            </div>
          </div>
        )}

        {talent.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map(skill => (
                <span key={skill} className="text-xs text-zinc-400 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {talent.genres.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Genres</p>
            <div className="flex flex-wrap gap-2">
              {talent.genres.map(g => (
                <span key={g} className="text-xs text-violet-400 bg-violet-500/10 border border-violet-400/15 rounded-full px-3 py-1.5">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {talent.languages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {talent.languages.map(lang => (
                <span key={lang} className="text-xs text-zinc-400 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {(talent.hourly_rate || talent.project_rate) && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-3">Rates</p>
            <div className="flex gap-4">
              {talent.hourly_rate && (
                <div>
                  <p className="text-white font-black text-2xl">${talent.hourly_rate}</p>
                  <p className="text-zinc-600 text-xs">per hour</p>
                </div>
              )}
              {talent.project_rate && (
                <div>
                  <p className="text-white font-black text-2xl">${talent.project_rate}</p>
                  <p className="text-zinc-600 text-xs">per project</p>
                </div>
              )}
            </div>
            <p className="text-zinc-700 text-[10px] mt-2">Final rates subject to project scope and agreement.</p>
          </div>
        )}

        {talent.social_links && talent.social_links.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Links</p>
            <div className="space-y-2">
              {talent.social_links.map(link => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/8 transition-all"
                >
                  <span>{link.platform}</span>
                  <span className="text-zinc-600 text-xs">View →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Professional collaborations should use written agreements. MUSDO provides connection tools only and does not replace legal, financial or management advice. All payment and delivery terms are agreed directly between parties.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-6 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex gap-3">
          <button
            onClick={() => setShowRequest(true)}
            className="flex-1 py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Send size={16} />
            Request Session
          </button>
          <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {showRequest && (
        <RequestSessionModal
          talent={talent}
          onClose={() => setShowRequest(false)}
          onSent={() => setShowRequest(false)}
        />
      )}
    </div>
  )
}
