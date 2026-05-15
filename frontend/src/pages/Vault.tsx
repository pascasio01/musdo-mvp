import { useState } from 'react'
import { Plus, Shield, Music, FileText, Lock, Unlock, Eye, MoreVertical } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { mockDemos } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const tabs = ['Demos', 'Lyrics', 'Passports']

const visibilityConfig = {
  private: { icon: Lock, label: 'Private', color: 'text-zinc-500' },
  public: { icon: Unlock, label: 'Public', color: 'text-green-400' },
  licensing_only: { icon: Eye, label: 'License Only', color: 'text-amber-400' },
}

export default function Vault() {
  const [activeTab, setActiveTab] = useState('Demos')
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-zinc-500 text-sm uppercase tracking-widest text-xs font-semibold">Composer</p>
            <h1 className="text-white text-3xl font-black">Vault</h1>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center hover:opacity-90 transition-opacity">
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-zinc-600 text-sm mb-8">Secure your music. Protect your rights.</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Music, label: 'Demos', count: mockDemos.length, color: 'text-violet-400', bg: 'bg-violet-900/20 border-violet-500/20' },
            { icon: FileText, label: 'Lyrics', count: 7, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-500/20' },
            { icon: Shield, label: 'Passports', count: 5, color: 'text-green-400', bg: 'bg-green-900/20 border-green-500/20' },
          ].map(({ icon: Icon, label, count, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
              <Icon size={20} className={color} />
              <p className={`text-2xl font-black mt-2 ${color}`}>{count}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {activeTab === 'Demos' && (
          <div className="space-y-3">
            {mockDemos.map(demo => {
              const vis = visibilityConfig[demo.visibility]
              const Icon = vis.icon
              return (
                <div key={demo.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-violet-900/40 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <Music size={18} className="text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{demo.title}</p>
                        {demo.notes && <p className="text-zinc-600 text-xs truncate mt-0.5">{demo.notes}</p>}
                        <p className="text-zinc-700 text-xs mt-1">{new Date(demo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <div className={`flex items-center gap-1 text-[10px] font-semibold ${vis.color}`}>
                        <Icon size={10} />
                        {vis.label}
                      </div>
                      <button className="text-zinc-600 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              onClick={() => navigate('/upload')}
              className="w-full py-4 rounded-2xl border border-dashed border-white/15 text-zinc-600 text-sm font-medium hover:border-white/25 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Upload New Demo
            </button>
          </div>
        )}

        {activeTab === 'Lyrics' && (
          <div className="space-y-3">
            {['Midnight Bachata', 'Broken Halo', 'Noches Sin Ti', 'Salgo a la Calle', 'Sabor a Miel', 'Tu Recuerdo', 'Lluvia de Amor'].map((title, i) => (
              <div key={title} className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{title}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">
                    {i % 2 === 0 ? 'Timestamp verified · ' : ''}
                    {new Date(2026, i % 12, (i + 1) * 3).toLocaleDateString()}
                  </p>
                </div>
                <Shield size={14} className={i % 3 !== 0 ? 'text-green-400' : 'text-zinc-700'} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Passports' && (
          <div className="space-y-3">
            {['Midnight Bachata', 'Broken Halo', 'Salgo a la Calle', 'Sabor a Miel', 'Noches Sin Ti'].map((title, i) => (
              <div
                key={title}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3 cursor-pointer hover:bg-white/8 transition-colors"
                onClick={() => navigate(`/passport/${i + 1}`)}
              >
                <div className="w-10 h-10 rounded-xl bg-green-900/40 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{title}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">MSP-{String(i + 1).padStart(4, '0')}-2026 · Active</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
                  ACTIVE
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
