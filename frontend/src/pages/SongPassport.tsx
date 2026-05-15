import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import SongPassportCard from '../components/SongPassportCard'
import AppShell from '../layouts/AppShell'
import { mockSongs } from '../data/mockData'

export default function SongPassport() {
  const { id } = useParams()
  const navigate = useNavigate()

  const song = mockSongs.find(s => s.id === id) ?? mockSongs[0]

  return (
    <AppShell>
      <div className="px-5 pt-14">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Share2 size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Download size={16} />
            </button>
          </div>
        </div>

        <SongPassportCard song={song} />

        <div className="mt-6 pb-6">
          <button
            onClick={() => navigate(`/player/${song.id}`)}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Listen to Song
          </button>
        </div>
      </div>
    </AppShell>
  )
}
