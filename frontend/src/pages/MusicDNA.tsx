import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Music, Mic2, Sliders, Tag, Fingerprint } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { mockSongs } from '../data/mockData'

const dnaData = {
  producers: ['Emmanuel Studios', 'BeatsByCarlos'],
  composers: ['Emmanuel R.'],
  engineers: ['Studio Norte — Mix Engineer'],
  musicians: ['Guitar: Julio Martínez', 'Keys: Ana Díaz', 'Bass: Robert Pérez'],
  vocalChain: ['Neumann U87', 'API 312', 'SSL G-Bus', 'Waves SSL'],
  recordingStudio: 'MUSVORA Studios, Santo Domingo',
  emotionalTags: ['Nostalgia', 'Longing', 'Romance', 'Sensual'],
  instruments: ['Acoustic Guitar', 'Electric Bass', 'Keys', 'Percussion', 'Strings'],
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
      <p className="text-zinc-600 text-xs uppercase tracking-wider font-medium w-24 flex-shrink-0">{label}</p>
      <p className="text-zinc-300 text-sm text-right flex-1">{value}</p>
    </div>
  )
}

export default function MusicDNA() {
  const { id } = useParams()
  const navigate = useNavigate()
  const song = mockSongs.find(s => s.id === id) ?? mockSongs[0]

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
            {song.artwork_url
              ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800" />
            }
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Music DNA</p>
            <h1 className="text-white font-black text-xl">{song.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'BPM', value: String(song.bpm ?? '—'), icon: Music },
            { label: 'Key', value: song.key ?? '—', icon: Sliders },
            { label: 'Genre', value: song.genre, icon: Tag },
            { label: 'Duration', value: song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '—', icon: Fingerprint },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-zinc-600" />
                <p className="text-zinc-600 text-xs uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-white font-bold text-lg">{value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[
            { icon: Sliders, label: 'Production', items: dnaData.producers },
            { icon: Music, label: 'Composers', items: dnaData.composers },
            { icon: Mic2, label: 'Vocal Chain', items: dnaData.vocalChain },
          ].map(({ icon: Icon, label, items }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={15} className="text-zinc-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</p>
              </div>
              <div className="space-y-2">
                {items.map(item => (
                  <p key={item} className="text-zinc-300 text-sm">{item}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Emotional Tags</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {dnaData.emotionalTags.map(tag => (
                <span key={tag} className="text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Music size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Instruments</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {dnaData.instruments.map(inst => (
                <span key={inst} className="text-xs font-semibold text-zinc-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                  {inst}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-medium mb-3">Energy Curve</p>
            <div className="flex items-end gap-1 h-12">
              {[40, 55, 70, 65, 80, 90, 85, 75, 88, 95, 80, 70, 60, 50, 45].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-800 to-violet-400 opacity-70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-zinc-700 text-[10px]">
              <span>0:00</span>
              <span>{song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '3:30'}</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
