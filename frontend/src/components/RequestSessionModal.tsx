import { useState } from 'react'
import { X, Send } from 'lucide-react'
import type { TalentProfile, ProjectType } from '../types/talent'

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: 'studio_session', label: 'Studio Session' },
  { value: 'remote_recording', label: 'Remote Recording' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'live_performance', label: 'Live Performance' },
  { value: 'beat_request', label: 'Beat Request' },
  { value: 'arrangement', label: 'Arrangement' },
  { value: 'mixing_mastering', label: 'Mix & Master' },
  { value: 'songwriting', label: 'Songwriting' },
  { value: 'production', label: 'Production' },
  { value: 'other', label: 'Other' },
]

interface RequestSessionModalProps {
  talent: TalentProfile
  onClose: () => void
  onSent?: () => void
}

export default function RequestSessionModal({ talent, onClose, onSent }: RequestSessionModalProps) {
  const [projectType, setProjectType] = useState<ProjectType>('studio_session')
  const [serviceNeeded, setServiceNeeded] = useState('')
  const [budget, setBudget] = useState('')
  const [date, setDate] = useState('')
  const [remote, setRemote] = useState(talent.remote_available)
  const [notes, setNotes] = useState('')
  const [deadline, setDeadline] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
    setTimeout(() => {
      onSent?.()
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-theme/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-950 px-5 pt-5 pb-4 border-b border-white/10 flex items-center justify-between z-10">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Send Request</p>
            <h2 className="text-white font-black text-lg">{talent.stage_name}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {sent ? (
          <div className="px-5 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Send size={22} className="text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-black text-xl mb-2">Request Sent</h3>
            <p className="text-zinc-500 text-sm">
              Your request has been sent to <span className="text-white">{talent.stage_name}</span>. They'll respond {talent.response_time.toLowerCase()}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4 pb-8">
            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Project Type</label>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map(pt => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setProjectType(pt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      projectType === pt.value
                        ? 'bg-white text-black'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Service Needed</label>
              <input
                type="text"
                value={serviceNeeded}
                onChange={e => setServiceNeeded(e.target.value)}
                placeholder={`e.g. ${talent.categories[0]} for a bachata track`}
                required
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 text-sm outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="$300"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 text-sm outline-none focus:border-white/25 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 text-sm outline-none focus:border-white/25 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Preferred Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 text-sm outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Session Format</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRemote(false)}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${!remote ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400'}`}
                >
                  In Person
                </button>
                <button
                  type="button"
                  onClick={() => setRemote(true)}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${remote ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400'}`}
                >
                  Remote
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">Project Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe your project, style references, specific requirements..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 text-sm outline-none focus:border-white/25 transition-all resize-none"
              />
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                Professional collaborations should use written agreements. MUSVORA provides connection tools only and does not replace legal, financial or management advice.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Send Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
