import { useState } from 'react'
import { Bell, Search } from 'lucide-react'
import MusicCard from '../components/MusicCard'
import ComposerCard from '../components/ComposerCard'
import AppShell from '../layouts/AppShell'
import { mockSongs } from '../data/mockData'

const genres = ['All', 'Bachata', 'Latin Pop', 'Urban', 'Romantic', 'Fusion']

export default function Home() {
  const [activeGenre, setActiveGenre] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSongs = mockSongs.filter(song => {
    const matchesGenre = activeGenre === 'All' || song.genre.toLowerCase().includes(activeGenre.toLowerCase())
    const matchesSearch = !searchQuery || song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-zinc-500 text-sm">Good evening,</p>
            <h1 className="text-white text-2xl font-black">Emmanuel</h1>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Bell size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search songs, composers..."
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      <div className="px-5 mb-6">
        <h2 className="text-white font-bold text-lg mb-4">Featured</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {mockSongs.slice(0, 3).map(song => (
            <MusicCard key={song.id} song={song} variant="featured" />
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeGenre === g
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <h2 className="text-white font-bold text-lg mb-4">Songs</h2>
        <div className="space-y-1">
          {filteredSongs.map(song => (
            <MusicCard key={song.id} song={song} variant="compact" />
          ))}
          {filteredSongs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-zinc-600">No songs found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mb-6">
        <h2 className="text-white font-bold text-lg mb-4">Composers</h2>
        <div className="space-y-3">
          <ComposerCard name="Pascasio Emmanuel" genre="Bachata · Latin Pop" songCount={24} streams="12.4K" verified avatarGradient="from-violet-600 to-blue-900" />
          <ComposerCard name="María Fernanda R." genre="Romantic Bachata" songCount={11} streams="5.2K" verified={false} avatarGradient="from-rose-700 to-pink-900" />
          <ComposerCard name="Carlos Beats" genre="Urban · Fusion" songCount={18} streams="9.1K" verified avatarGradient="from-amber-700 to-zinc-900" />
        </div>
      </div>
    </AppShell>
  )
}
