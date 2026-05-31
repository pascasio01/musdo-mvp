import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, Heart, Mic2, FileText } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { mockSongs } from '../data/mockData'

const storyData = {
  origin: 'Written in a single night after a heartbreak in Santo Domingo. The melody came first — a guitar riff that felt like walking through empty streets at 2 AM.',
  inspiration: 'Inspired by real moments of loss and the feeling of loving someone who has already left. The lyrics pull directly from journal entries written during that period.',
  timeline: [
    { date: 'Jan 3, 2026', event: 'Initial melody recorded on voice note — 47 seconds.' },
    { date: 'Jan 7, 2026', event: 'Lyrics completed. First acoustic demo recorded.' },
    { date: 'Jan 14, 2026', event: 'Studio session — full arrangement built.' },
    { date: 'Jan 20, 2026', event: 'Vocals tracked. Mix started.' },
    { date: 'Feb 5, 2026', event: 'Song finalized. Uploaded to MUSVORA Vault.' },
    { date: 'Feb 10, 2026', event: 'Published to Marketplace for licensing.' },
  ],
  commentary: 'This song is different from everything I\'d written before. I wanted it to feel like a memory — something you can touch but not hold. The production is intentionally sparse in the first verse, then opens up completely in the bridge. That contrast was intentional.',
  memories: [
    'The guitar was recorded in a living room at 3 AM.',
    'The hook was written in under 10 minutes.',
    'Three different bridge melodies were tried. The simplest one won.',
  ],
}

export default function SongStory() {
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

        <div className="relative rounded-3xl overflow-hidden mb-8 h-48">
          {song.artwork_url
            ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover opacity-50" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-900" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-0 left-0 px-6 pb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Song Story</p>
            <h1 className="text-white font-black text-3xl">{song.title}</h1>
            <p className="text-zinc-400 text-sm">{song.artist_name}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Origin</p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{storyData.origin}</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Inspiration</p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{storyData.inspiration}</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Creation Timeline</p>
            </div>
            <div className="space-y-4">
              {storyData.timeline.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                    {i < storyData.timeline.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-zinc-500 text-xs mb-0.5">{item.date}</p>
                    <p className="text-zinc-300 text-sm">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Mic2 size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Composer Notes</p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed italic">"{storyData.commentary}"</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-zinc-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Memories</p>
            </div>
            <ul className="space-y-2">
              {storyData.memories.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-semibold">Handwritten Lyrics</p>
              <p className="text-zinc-600 text-xs mt-0.5">Scan / image — coming soon</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FileText size={20} className="text-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
