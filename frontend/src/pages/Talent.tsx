import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Users } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import TalentCard from '../components/TalentCard'
import { mockTalents, mockSavedTalentIds } from '../data/talentData'
import type { TalentCategory } from '../types/talent'

const CATEGORIES: TalentCategory[] = [
  'Vocalist', 'Guitarist', 'Producer', 'Composer / Songwriter',
  'Drummer', 'Pianist', 'Mixing Engineer', 'Beatmaker',
  'Tambora Player', 'Arranger', 'DJ', 'Session Musician',
  'Mastering Engineer', 'Videographer', 'Percussionist',
]

export default function Talent() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<TalentCategory | 'All'>('All')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>(mockSavedTalentIds)

  const filtered = useMemo(() => {
    return mockTalents.filter(t => {
      const q = search.toLowerCase()
      const matchesSearch = !search
        || t.stage_name.toLowerCase().includes(q)
        || t.categories.some(c => c.toLowerCase().includes(q))
        || t.location.toLowerCase().includes(q)
        || t.skills.some(s => s.toLowerCase().includes(q))
        || t.genres.some(g => g.toLowerCase().includes(q))
        || t.instruments.some(i => i.toLowerCase().includes(q))
      const matchesCategory = activeCategory === 'All' || t.categories.includes(activeCategory)
      const matchesRemote = !remoteOnly || t.remote_available
      const matchesAvailable = !availableOnly || t.availability_status === 'available'
      const matchesVerified = !verifiedOnly || t.verified_status
      return matchesSearch && matchesCategory && matchesRemote && matchesAvailable && matchesVerified
    })
  }, [search, activeCategory, remoteOnly, availableOnly, verifiedOnly])

  const featured = mockTalents.filter(t => t.featured)
  const activeFilters = [remoteOnly, availableOnly, verifiedOnly].filter(Boolean).length

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-6">
        <div className="mb-5">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">MUSDO</p>
          <h1 className="text-white text-3xl font-black">Connect</h1>
          <p className="text-zinc-600 text-sm mt-1">Find music professionals for your next project.</p>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, instrument, genre..."
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-white/20 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center relative transition-all ${
              showFilters || activeFilters > 0
                ? 'bg-white text-black border-white'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={16} />
            {activeFilters > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4 space-y-3">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Filters</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Remote Only', state: remoteOnly, set: setRemoteOnly },
                { label: 'Available Now', state: availableOnly, set: setAvailableOnly },
                { label: 'Verified Only', state: verifiedOnly, set: setVerifiedOnly },
              ].map(f => (
                <button
                  key={f.label}
                  onClick={() => f.set(v => !v)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    f.state ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('All')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === 'All' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!search && activeCategory === 'All' && !remoteOnly && !availableOnly && !verifiedOnly && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">Featured Talent</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featured.map(t => (
                <TalentCard
                  key={t.id}
                  talent={t}
                  saved={savedIds.includes(t.id)}
                  onSaveToggle={id => setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                  variant="grid"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-base">
            {search || activeCategory !== 'All' ? `Results` : 'All Professionals'}
          </h2>
          <span className="text-zinc-600 text-xs">{filtered.length} found</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No professionals match your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setRemoteOnly(false); setAvailableOnly(false); setVerifiedOnly(false) }}
              className="mt-3 text-xs text-zinc-600 hover:text-white underline transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(t => (
              <TalentCard
                key={t.id}
                talent={t}
                saved={savedIds.includes(t.id)}
                onSaveToggle={id => setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
              />
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-zinc-600 text-[11px] leading-relaxed text-center">
            MUSDO is a connection platform only. We are not an employer, booking agency or legal representative. Professional collaborations should use written agreements.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
