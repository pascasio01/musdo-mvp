import { BadgeCheck, Music, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ComposerCardProps {
  name: string
  genre: string
  songCount: number
  streams: string
  verified?: boolean
  avatarGradient?: string
}

export default function ComposerCard({
  name,
  genre,
  songCount,
  streams,
  verified = false,
  avatarGradient = 'from-violet-600 to-blue-900',
}: ComposerCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="rounded-2xl bg-white/5 border border-white/10 p-5 cursor-pointer hover:bg-white/8 hover:border-white/20 transition-all duration-200"
      onClick={() => navigate('/profile')}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-white font-semibold truncate">{name}</h3>
            {verified && <BadgeCheck size={15} className="text-blue-400 flex-shrink-0" />}
          </div>
          <p className="text-zinc-500 text-sm truncate">{genre}</p>
        </div>
        {verified && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2.5 py-1">
            <Shield size={10} />
            PRO
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Music size={13} />
          <span className="text-sm font-medium">{songCount} songs</span>
        </div>
        <div className="text-zinc-500 text-sm">{streams} streams</div>
      </div>
    </div>
  )
}
