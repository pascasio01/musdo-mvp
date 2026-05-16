import { useState } from 'react'
import { Bell } from 'lucide-react'
import MusicCard from '../components/MusicCard'
import ComposerCard from '../components/ComposerCard'
import AppShell from '../layouts/AppShell'
import AIDiscoveryBar from '../components/AIDiscoveryBar'
import { mockSongs } from '../data/mockData'
import { useAuth } from '../lib/auth'

const genres = ['All', 'Bachata', 'Latin Pop', 'Urban', 'Romantic', 'Fusion']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 18) return 'Good afternoon,'
  if (h < 22) return 'Good evening,'
  return 'Late-night sessions,'
}

export default function Home() {
  const { profile } = useAuth()
  const [activeGenre, setActiveGenre] = useState('All')

  const filteredSongs = mockSongs.filter(song =>
    activeGenre === 'All' || song.genre.toLowerCase().includes(activeGenre.toLowerCase())
  )

  const displayName = profile?.username ?? 'Emmanuel'

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted text-sm">{greeting()}</p>
            <h1 className="text-primary font-black text-2xl">{displayName}</h1>
          </div>
          <button
            className="w-10 h-10 rounded-2xl border border-theme flex items-center justify-center text-muted hover:text-primary transition-colors relative"
            style={{ background: 'var(--glass-bg)' }}
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.5} aria-hidden />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-500" aria-hidden />
          </button>
        </div>

        <AIDiscoveryBar />
      </div>

      <div className="px-5 mb-6">
        <h2 className="text-primary font-bold text-lg mb-4">Featured</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {mockSongs.slice(0, 3).map(song => (
            <MusicCard key={song.id} song={song} variant="featured" />
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="group" aria-label="Filter by genre">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              aria-pressed={activeGenre === g}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-[var(--speed,300ms)]"
              style={
                activeGenre === g
                  ? { background: 'var(--text-primary)', color: 'var(--text-inverse)' }
                  : { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <h2 className="text-primary font-bold text-lg mb-4">Songs</h2>
        <div className="space-y-1">
          {filteredSongs.map(song => (
            <MusicCard key={song.id} song={song} variant="compact" />
          ))}
          {filteredSongs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted text-sm">No songs for this genre yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mb-6">
        <h2 className="text-primary font-bold text-lg mb-4">Composers</h2>
        <div className="space-y-3">
          <ComposerCard name="Emmanuel R." genre="Bachata · Latin Pop" songCount={24} streams="12.4K" verified avatarGradient="from-violet-600 to-blue-900" />
          <ComposerCard name="María Fernanda R." genre="Romantic Bachata" songCount={11} streams="5.2K" verified={false} avatarGradient="from-rose-700 to-pink-900" />
          <ComposerCard name="Carlos Beats" genre="Urban · Fusion" songCount={18} streams="9.1K" verified avatarGradient="from-amber-700 to-zinc-900" />
        </div>
      </div>
    </AppShell>
  )
}
