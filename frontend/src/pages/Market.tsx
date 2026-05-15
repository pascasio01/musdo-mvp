import { useState } from 'react'
import { Search, Zap, Globe, Music, FileText } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import LicenseRequestModal from '../components/LicenseRequestModal'
import VerificationBadge from '../components/VerificationBadge'
import { mockLicenses } from '../data/mockData'
import type { License } from '../types'

const licenseTypeConfig = {
  exclusive: { label: 'Exclusive', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  'non-exclusive': { label: 'Non-Exclusive', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  sync: { label: 'Sync', icon: Music, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  publishing: { label: 'Publishing', icon: FileText, color: 'text-slate-300', bg: 'bg-slate-400/10 border-slate-400/20' },
}

const filterOptions = ['All', 'Exclusive', 'Non-Exclusive', 'Sync', 'Publishing']

export default function Market() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)

  const filtered = mockLicenses.filter(l => {
    const matchesSearch = !search
      || l.song?.title.toLowerCase().includes(search.toLowerCase())
      || l.song?.artist_name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === 'All' || l.license_type.replace('-', ' ').toLowerCase() === activeFilter.toLowerCase().replace('-', ' ')
    return matchesSearch && matchesFilter
  })

  return (
    <AppShell>
      <div className="px-5 pt-14">
        <div className="mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">License</p>
          <h1 className="text-white text-3xl font-black">Marketplace</h1>
          <p className="text-zinc-600 text-sm mt-1">Human-verified songs ready to license.</p>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search songs or composers..."
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-white/20 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {filterOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === opt
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="space-y-4 pb-6">
          {filtered.map(license => {
            const config = licenseTypeConfig[license.license_type]
            const Icon = config.icon
            const song = license.song

            return (
              <div key={license.id} className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/8 hover:border-white/15 transition-all">
                <div className="flex items-center gap-4 p-4 pb-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800">
                    {song?.artwork_url
                      ? <img src={song.artwork_url} alt={song.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-white font-bold truncate">{song?.title}</h3>
                      {song?.human_verified && (
                        <VerificationBadge type="human_verified" size="xs" />
                      )}
                      {song?.verified_rights_holder && (
                        <VerificationBadge type="verified_rights_holder" size="xs" />
                      )}
                    </div>
                    <p className="text-zinc-500 text-sm truncate">{song?.artist_name}</p>
                    <p className="text-zinc-600 text-xs mt-0.5">{song?.genre}</p>
                  </div>
                </div>

                <div className="px-4 py-4 flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 border ${config.bg} ${config.color}`}>
                    <Icon size={11} />
                    {config.label}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black text-xl">${license.price}</span>
                    <button
                      onClick={() => setSelectedLicense(license)}
                      className="px-4 py-2.5 rounded-2xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      License
                    </button>
                  </div>
                </div>

                {song?.bpm && (
                  <div className="px-4 pb-4 flex gap-4 text-[11px] text-zinc-700">
                    <span>{song.bpm} BPM</span>
                    {song.key && <span>Key of {song.key}</span>}
                    {song.duration && <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-zinc-600 text-sm">No licenses match your search.</p>
            </div>
          )}
        </div>
      </div>

      {selectedLicense && (
        <LicenseRequestModal
          license={selectedLicense}
          onClose={() => setSelectedLicense(null)}
        />
      )}
    </AppShell>
  )
}
