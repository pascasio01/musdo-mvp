import { useState } from 'react'
import { ArrowLeft, BadgeCheck, Upload, Shield, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

const verificationLevels = [
  { id: 'listener', label: 'Listener', desc: 'Default for new users', active: true, badge: null },
  { id: 'creator_basic', label: 'Creator Basic', desc: 'Upload private drafts', active: false, badge: null },
  { id: 'verified_creator', label: 'Verified Creator', desc: 'Publish to marketplace', active: false, badge: 'Human Verified' },
  { id: 'verified_artist', label: 'Verified Artist', desc: 'Public profile + badge', active: false, badge: 'Artist Verified' },
  { id: 'rights_holder', label: 'Verified Rights Holder', desc: 'Sell & license songs', active: false, badge: 'Rights Holder' },
  { id: 'label', label: 'Label / Manager', desc: 'Manage multiple artists', active: false, badge: 'Label Verified' },
]

const pros = ['BMI', 'ASCAP', 'SESAC', 'SOCAN', 'PRS', 'Other']
const roles = ['Composer', 'Recording Artist', 'Producer', 'Beatmaker', 'Publisher', 'Label', 'Manager', 'Sync Buyer']

export default function Verify() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedPro, setSelectedPro] = useState('')
  const [artistName, setArtistName] = useState('')
  const [country, setCountry] = useState('')
  const [spotify, setSpotify] = useState('')
  const [youtube, setYoutube] = useState('')
  const [upc, setUpc] = useState('')
  const [isrc, setIsrc] = useState('')
  const [rightsDeclaration, setRightsDeclaration] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rightsDeclaration) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-6">
            <BadgeCheck size={32} className="text-blue-400" />
          </div>
          <h2 className="text-white font-black text-3xl mb-2">Application Submitted</h2>
          <p className="text-zinc-500 mb-2 max-w-xs">
            Your verification request is under review by the MUSVORA Team.
          </p>
          <p className="text-zinc-600 text-xs mb-8 max-w-xs">
            Review typically takes 3–5 business days. You'll receive a notification when complete.
          </p>
          <button onClick={() => navigate('/profile')} className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity">
            Back to Profile
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Identity</p>
          <h1 className="text-white font-black text-3xl mb-2">Creator<br />Verification</h1>
          <p className="text-zinc-500 text-sm">Your legal identity stays private. Only your artist name and badges appear publicly.</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">Verification Levels</p>
          <div className="space-y-2">
            {verificationLevels.map(level => (
              <div key={level.id} className={`flex items-center gap-3 py-2 ${level.active ? '' : 'opacity-50'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${level.active ? 'border-blue-400' : 'border-zinc-700'}`}>
                  {level.active && <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{level.label}</p>
                  <p className="text-zinc-600 text-xs">{level.desc}</p>
                </div>
                {level.badge && (
                  <span className="ml-auto text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                    {level.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Creator Role *</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-3 rounded-2xl text-xs font-semibold text-left px-4 transition-all border ${
                    selectedRole === r ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Artist / Stage Name *</label>
            <input
              value={artistName}
              onChange={e => setArtistName(e.target.value)}
              required
              placeholder="Your public artist name"
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Country *</label>
            <input
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
              placeholder="e.g. Dominican Republic"
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">PRO Affiliation</label>
            <div className="flex flex-wrap gap-2">
              {pros.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPro(p)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    selectedPro === p ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">UPC</label>
              <input value={upc} onChange={e => setUpc(e.target.value)} placeholder="Optional" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors text-sm" />
            </div>
            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">ISRC</label>
              <input value={isrc} onChange={e => setIsrc(e.target.value)} placeholder="Optional" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Social Links</label>
            <div className="space-y-3">
              <input value={spotify} onChange={e => setSpotify(e.target.value)} placeholder="Spotify artist URL" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors text-sm" />
              <input value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="YouTube channel URL" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Government ID (placeholder)</label>
            <div className="w-full py-8 rounded-2xl border border-dashed border-white/15 flex flex-col items-center gap-2">
              <Upload size={22} className="text-zinc-600" />
              <span className="text-zinc-500 text-sm">ID upload — coming in full launch</span>
            </div>
          </div>

          <div
            onClick={() => setRightsDeclaration(!rightsDeclaration)}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/8 transition-colors"
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${rightsDeclaration ? 'bg-white border-white' : 'border-zinc-600'}`}>
              {rightsDeclaration && <Check size={12} className="text-black" strokeWidth={3} />}
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              I declare that I am the rightful owner or authorized rights holder of the content I upload. I understand that MUSVORA does not guarantee copyright validity, legal outcomes, or income.
            </p>
          </div>

          <button
            type="submit"
            disabled={!rightsDeclaration}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            Submit Verification — $9.99 Review Fee
          </button>

          <p className="text-center text-zinc-600 text-xs">
            Review fee does not guarantee approval. This is not legal advice.
          </p>
        </form>
      </div>
    </AppShell>
  )
}
