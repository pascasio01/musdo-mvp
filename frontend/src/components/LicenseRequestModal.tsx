import { useState } from 'react'
import { X, BadgeCheck, FileText, Music, Globe, Zap } from 'lucide-react'
import type { License } from '../types'

interface LicenseRequestModalProps {
  license: License
  onClose: () => void
}

const licenseTypeInfo = {
  exclusive: { icon: Zap, label: 'Exclusive', desc: 'Full ownership transfer. One buyer only.' },
  'non-exclusive': { icon: Globe, label: 'Non-Exclusive', desc: 'Multiple buyers permitted.' },
  sync: { icon: Music, label: 'Sync', desc: 'Use in video/film/ad content.' },
  publishing: { icon: FileText, label: 'Publishing', desc: 'Publishing rights included.' },
}

export default function LicenseRequestModal({ license, onClose }: LicenseRequestModalProps) {
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const info = licenseTypeInfo[license.license_type]
  const Icon = info.icon

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-bold text-xl">Request License</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <BadgeCheck size={28} className="text-green-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Request Sent</h3>
            <p className="text-zinc-400 text-sm mb-6">The composer will review your request and respond within 48h.</p>
            <button onClick={onClose} className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition-opacity">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                {license.song?.artwork_url
                  ? <img src={license.song.artwork_url} alt={license.song.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-zinc-800" />
                }
              </div>
              <div>
                <p className="text-white font-semibold">{license.song?.title}</p>
                <p className="text-zinc-400 text-sm">{license.song?.artist_name}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-900/40 border border-violet-500/30 flex items-center justify-center">
                <Icon size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{info.label} License</p>
                <p className="text-zinc-400 text-xs">{info.desc}</p>
              </div>
              <span className="ml-auto text-white font-bold text-lg">${license.price}</span>
            </div>

            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
                Message to Composer
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Introduce yourself and describe how you plan to use this song..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 text-sm resize-none outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base hover:opacity-90 transition-opacity"
            >
              Send License Request
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
