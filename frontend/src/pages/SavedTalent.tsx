import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import TalentCard from '../components/TalentCard'
import { mockTalents, mockSavedTalentIds } from '../data/talentData'

export default function SavedTalent() {
  const navigate = useNavigate()
  const [savedIds, setSavedIds] = useState<string[]>(mockSavedTalentIds)

  const saved = mockTalents.filter(t => savedIds.includes(t.id))

  const handleToggle = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">MUSDO Connect</p>
          <h1 className="text-white font-black text-2xl">Saved Talent</h1>
          <p className="text-zinc-600 text-sm mt-1">{saved.length} professional{saved.length !== 1 ? 's' : ''} saved.</p>
        </div>

        {saved.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Heart size={22} className="text-zinc-600" strokeWidth={1.5} />
            </div>
            <p className="text-zinc-500 text-sm mb-1">No saved talent yet.</p>
            <p className="text-zinc-700 text-xs mb-6">Tap the heart on any profile to save them here.</p>
            <button
              onClick={() => navigate('/talent')}
              className="px-5 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Browse Professionals
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map(talent => (
              <TalentCard
                key={talent.id}
                talent={talent}
                saved
                onSaveToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
