import { useState } from 'react'
import { Plus, Shield, Music, FileText, Lock, Unlock, Eye, MoreVertical } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { mockDemos } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const tabs = ['Demos', 'Lyrics', 'Passports']

const visibilityConfig = {
  private:      { icon: Lock,   label: 'Private',      color: 'text-muted' },
  public:       { icon: Unlock, label: 'Public',        color: 'text-teal-400' },
  licensing_only: { icon: Eye,  label: 'License Only',  color: 'text-amber-400' },
}

const statCards = [
  { icon: Music,    label: 'Demos',     count: 0, color: 'text-violet-400', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
  { icon: FileText, label: 'Lyrics',   count: 7, color: 'text-blue-400',   bg: 'rgba(37,99,235,0.1)', border: 'rgba(37,99,235,0.2)' },
  { icon: Shield,   label: 'Passports',count: 5, color: 'text-teal-400',   bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
]

export default function Vault() {
  const [activeTab, setActiveTab] = useState('Demos')
  const navigate = useNavigate()
  const demos = mockDemos

  statCards[0].count = demos.length

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-muted text-xs uppercase tracking-widest font-semibold">Composer</p>
            <h1 className="text-primary text-3xl font-black">Vault</h1>
          </div>
          <button
            className="w-10 h-10 rounded-2xl flex items-center justify-center hover:opacity-90 transition-opacity"
            style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
            aria-label="Upload new"
            onClick={() => navigate('/upload')}
          >
            <Plus size={20} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
        <p className="text-muted text-sm mb-8">Secure your music. Protect your rights.</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {statCards.map(({ icon: Icon, label, count, color, bg, border }) => (
            <div
              key={label}
              className="rounded-2xl border p-4"
              style={{ background: bg, borderColor: border }}
            >
              <Icon size={20} className={color} aria-hidden />
              <p className={`text-2xl font-black mt-2 ${color}`}>{count}</p>
              <p className="text-muted text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-[var(--speed,300ms)]"
              style={
                activeTab === tab
                  ? { background: 'var(--text-primary)', color: 'var(--text-inverse)' }
                  : { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {activeTab === 'Demos' && (
          <div className="space-y-3" role="tabpanel">
            {demos.map(demo => {
              const vis = visibilityConfig[demo.visibility]
              const VIcon = vis.icon
              return (
                <div
                  key={demo.id}
                  className="rounded-2xl border border-theme p-4"
                  style={{ background: 'var(--glass-bg)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.2)' }}
                      >
                        <Music size={18} className="text-violet-400" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-primary font-semibold truncate">{demo.title}</p>
                        {demo.notes && <p className="text-muted text-xs truncate mt-0.5">{demo.notes}</p>}
                        <p className="text-muted text-xs mt-1">{new Date(demo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <div className={`flex items-center gap-1 text-[10px] font-semibold ${vis.color}`}>
                        <VIcon size={10} aria-hidden />
                        {vis.label}
                      </div>
                      <button
                        className="text-muted hover:text-primary transition-colors"
                        aria-label="More options"
                      >
                        <MoreVertical size={16} aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              onClick={() => navigate('/upload')}
              className="w-full py-4 rounded-2xl border border-dashed border-theme text-muted text-sm font-medium hover:text-primary transition-all flex items-center justify-center gap-2"
              style={{ borderStyle: 'dashed' }}
            >
              <Plus size={16} aria-hidden />
              Upload New Demo
            </button>
          </div>
        )}

        {activeTab === 'Lyrics' && (
          <div className="space-y-3" role="tabpanel">
            {['Midnight Bachata', 'Broken Halo', 'Noches Sin Ti', 'Salgo a la Calle', 'Sabor a Miel', 'Tu Recuerdo', 'Lluvia de Amor'].map((title, i) => (
              <div
                key={title}
                className="rounded-2xl border border-theme p-4 flex items-center gap-3"
                style={{ background: 'var(--glass-bg)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(37,99,235,0.1)', borderColor: 'rgba(37,99,235,0.2)' }}
                >
                  <FileText size={18} className="text-blue-400" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-semibold truncate">{title}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {i % 2 === 0 ? 'Timestamp verified · ' : ''}
                    {new Date(2026, i % 12, (i + 1) * 3).toLocaleDateString()}
                  </p>
                </div>
                <Shield
                  size={14}
                  aria-hidden
                  className={i % 3 !== 0 ? 'text-teal-400' : 'text-muted'}
                  aria-label={i % 3 !== 0 ? 'Verified' : undefined}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Passports' && (
          <div className="space-y-3" role="tabpanel">
            {['Midnight Bachata', 'Broken Halo', 'Salgo a la Calle', 'Sabor a Miel', 'Noches Sin Ti'].map((title, i) => (
              <div
                key={title}
                className="rounded-2xl border border-theme p-4 flex items-center gap-3 cursor-pointer transition-colors"
                style={{ background: 'var(--glass-bg)' }}
                onClick={() => navigate(`/passport/${i + 1}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/passport/${i + 1}`)}
                aria-label={`View passport for ${title}`}
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(20,184,166,0.1)', borderColor: 'rgba(20,184,166,0.2)' }}
                >
                  <Shield size={18} className="text-teal-400" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-semibold truncate">{title}</p>
                  <p className="text-muted text-xs mt-0.5">MSP-{String(i + 1).padStart(4, '0')}-2026 · Active</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-full px-2.5 py-1">
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
