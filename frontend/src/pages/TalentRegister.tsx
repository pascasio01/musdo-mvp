import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import type { TalentCategory } from '../types/talent'

const CATEGORIES: TalentCategory[] = [
  'Vocalist', 'Composer / Songwriter', 'Producer', 'Arranger',
  'Mixing Engineer', 'Mastering Engineer', 'Guitarist', 'Pianist',
  'Bassist', 'Drummer', 'Tambora Player', 'Percussionist',
  'Trumpet Player', 'Saxophonist', 'Violinist', 'DJ',
  'Background Vocalist', 'Session Musician', 'Studio Owner',
  'Videographer', 'Cover Designer', 'Music Director', 'Live Band',
  'Choir / Background Vocal Group', 'Beatmaker', 'Audio Editor',
]

const GENRES = ['Bachata', 'Merengue', 'Latin Pop', 'Salsa', 'Reggaeton', 'Urban', 'Tropical', 'Bolero', 'Hip-Hop', 'R&B', 'Pop', 'Jazz', 'Classical', 'Electronic', 'Afrobeats', 'Gospel']

export default function TalentRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [stageName, setStageName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<TalentCategory[]>([])
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [yearsExp, setYearsExp] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [instruments, setInstruments] = useState('')
  const [readsMusic, setReadsMusic] = useState(false)
  const [playsByEar, setPlaysByEar] = useState(false)
  const [remoteAvailable, setRemoteAvailable] = useState(true)
  const [studioAvailable, setStudioAvailable] = useState(false)
  const [liveAvailable, setLiveAvailable] = useState(true)
  const [hourlyRate, setHourlyRate] = useState('')
  const [projectRate, setProjectRate] = useState('')

  const toggleCategory = (cat: TalentCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }
  const toggleGenre = (g: string) => {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="px-5 pt-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-white font-black text-3xl mb-3">Profile<br />Submitted.</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-2">
            Your talent profile for <span className="text-white font-semibold">{stageName}</span> is under review.
          </p>
          <p className="text-zinc-700 text-xs mb-8">
            Only your stage name and professional details will be shown publicly. Legal identity stays private.
          </p>
          <button
            onClick={() => navigate('/talent')}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity"
          >
            Browse MUSDO Connect
          </button>
          <button
            onClick={() => navigate('/talent-dashboard')}
            className="w-full py-4 mt-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-semibold hover:text-white transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(s => s - 1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">MUSDO Connect</p>
          <h1 className="text-white font-black text-2xl">Register as Talent</h1>
        </div>

        <div className="flex gap-2 mb-7">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/15'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="text-white font-bold text-lg mb-1">What's your stage name?</p>
              <p className="text-zinc-500 text-sm mb-4">This is what clients will see. Legal name stays private.</p>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Stage / Professional Name</label>
              <input
                type="text"
                value={stageName}
                onChange={e => setStageName(e.target.value)}
                placeholder="Your artist or professional name"
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-3">What do you do? (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                      selectedCategories.includes(cat)
                        ? 'bg-white text-black'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!stageName || selectedCategories.length === 0}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="text-white font-bold text-lg mb-1">Tell us about your work.</p>
              <p className="text-zinc-500 text-sm mb-5">This helps clients understand your style and experience.</p>

              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Describe your background, style and what makes you unique..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Instruments / Tools</label>
              <input
                type="text"
                value={instruments}
                onChange={e => setInstruments(e.target.value)}
                placeholder="e.g. Classical Guitar, Logic Pro, MPC"
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Years of Experience</label>
              <input
                type="number"
                value={yearsExp}
                onChange={e => setYearsExp(e.target.value)}
                placeholder="10"
                min="0"
                max="60"
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-3">Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedGenres.includes(g)
                        ? 'bg-white text-black'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'I read sheet music', state: readsMusic, set: setReadsMusic },
                { label: 'I play by ear', state: playsByEar, set: setPlaysByEar },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5">
                  <span className="text-white text-sm">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => item.set(v => !v)}
                    className={`w-10 h-6 rounded-full transition-all relative ${item.state ? 'bg-white' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${item.state ? 'bg-theme right-1' : 'bg-zinc-600 left-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!bio}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-white font-bold text-lg mb-1">Availability & Rates</p>
              <p className="text-zinc-500 text-sm mb-5">Set how you work and what you charge.</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Available for Remote Work', state: remoteAvailable, set: setRemoteAvailable },
                { label: 'Studio Available', state: studioAvailable, set: setStudioAvailable },
                { label: 'Available for Live Performance', state: liveAvailable, set: setLiveAvailable },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5">
                  <span className="text-white text-sm">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => item.set(v => !v)}
                    className={`w-10 h-6 rounded-full transition-all relative ${item.state ? 'bg-white' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${item.state ? 'bg-theme right-1' : 'bg-zinc-600 left-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Hourly Rate (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">$</span>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                    placeholder="75"
                    className="w-full pl-8 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Project Rate (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">$</span>
                  <input
                    type="number"
                    value={projectRate}
                    onChange={e => setProjectRate(e.target.value)}
                    placeholder="350"
                    className="w-full pl-8 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/25 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                By registering, you understand that MUSDO is a connection platform only. We do not guarantee work, payments, or project outcomes. Professional collaborations should use written agreements. Your legal identity will not be displayed publicly.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : 'Submit Profile'}
            </button>
          </form>
        )}
      </div>
    </AppShell>
  )
}
