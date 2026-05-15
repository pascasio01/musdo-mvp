import { useState } from 'react'
import { ArrowLeft, Moon, Bell, Shield, Eye, Mic2, Sliders, ChevronRight, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import { useAuth } from '../lib/auth'

type AccentColor = 'violet' | 'blue' | 'amber' | 'rose' | 'white'
type BlurLevel = 'low' | 'medium' | 'high'

const accentColors: { value: AccentColor; hex: string; label: string }[] = [
  { value: 'violet', hex: '#7c3aed', label: 'Violet' },
  { value: 'blue', hex: '#2563eb', label: 'Blue' },
  { value: 'amber', hex: '#d97706', label: 'Amber' },
  { value: 'rose', hex: '#e11d48', label: 'Rose' },
  { value: 'white', hex: '#ffffff', label: 'White' },
]

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-zinc-600 text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-white' : 'bg-white/15'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  )
}

function NavRow({ label, desc, onClick }: { label: string; desc?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
      <div className="text-left">
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-zinc-600 text-xs mt-0.5">{desc}</p>}
      </div>
      <ChevronRight size={16} className="text-zinc-600" />
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(false)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [creatorVisible, setCreatorVisible] = useState(true)
  const [marketVisible, setMarketVisible] = useState(true)
  const [accent, setAccent] = useState<AccentColor>('violet')
  const [blur, setBlur] = useState<BlurLevel>('medium')
  const [animIntensity, setAnimIntensity] = useState<'low' | 'medium' | 'high'>('medium')

  const sections = [
    {
      icon: Sliders,
      title: 'Appearance',
      content: (
        <div>
          <div className="py-4 border-b border-white/5">
            <p className="text-white text-sm font-medium mb-3">Accent Color</p>
            <div className="flex gap-3">
              {accentColors.map(c => (
                <button
                  key={c.value}
                  onClick={() => setAccent(c.value)}
                  className={`w-9 h-9 rounded-xl transition-all ${accent === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <div className="py-4 border-b border-white/5">
            <p className="text-white text-sm font-medium mb-3">Blur Level</p>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as BlurLevel[]).map(b => (
                <button
                  key={b}
                  onClick={() => setBlur(b)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${blur === b ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="py-4">
            <p className="text-white text-sm font-medium mb-3">Animation Intensity</p>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setAnimIntensity(a)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${animIntensity === a ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: 'Notifications',
      content: (
        <div>
          <ToggleRow label="Push Notifications" desc="License requests, streams, activity" value={notifications} onChange={setNotifications} />
          <ToggleRow label="Email Notifications" desc="Weekly summary, billing alerts" value={emailNotifs} onChange={setEmailNotifs} />
        </div>
      ),
    },
    {
      icon: Eye,
      title: 'Privacy',
      content: (
        <div>
          <ToggleRow label="Private Profile" desc="Hide your profile from discovery" value={privateProfile} onChange={setPrivateProfile} />
          <ToggleRow label="Creator Visibility" desc="Show on creator discovery" value={creatorVisible} onChange={setCreatorVisible} />
          <ToggleRow label="Marketplace Visibility" desc="Show songs in marketplace" value={marketVisible} onChange={setMarketVisible} />
        </div>
      ),
    },
    {
      icon: Shield,
      title: 'Security',
      content: (
        <div>
          <NavRow label="Active Sessions" desc="Manage where you're logged in" onClick={() => navigate('/security')} />
          <NavRow label="Change Password" desc="Update your password" />
          <NavRow label="Two-Factor Auth" desc="Coming soon" />
        </div>
      ),
    },
    {
      icon: Mic2,
      title: 'Creator',
      content: (
        <div>
          <NavRow label="Verification Status" desc="View your verification level" onClick={() => navigate('/verify')} />
          <NavRow label="Licensing Preferences" desc="Default license settings" />
          <NavRow label="Payout Settings" desc="Revenue destination (coming soon)" />
        </div>
      ),
    },
  ]

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-white font-black text-3xl mb-8">Settings</h1>

        <div className="space-y-4">
          {sections.map(({ icon: Icon, title, content }) => (
            <div key={title} className="rounded-2xl bg-white/5 border border-white/10">
              <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                <Icon size={16} className="text-zinc-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</p>
              </div>
              <div className="px-5 pb-2">{content}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full py-4 rounded-2xl bg-violet-900/20 border border-violet-500/20 text-violet-400 font-semibold text-sm hover:bg-violet-900/30 transition-colors"
          >
            Manage Subscription
          </button>
          <button
            onClick={() => navigate('/legal')}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Legal & Policies
          </button>
          <button
            onClick={async () => { await signOut(); navigate('/') }}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 font-semibold text-sm flex items-center justify-center gap-2 hover:border-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <p className="text-center text-zinc-700 text-[10px] mt-8 font-mono">MUSDO v1.0 MVP · Human Music Infrastructure</p>
      </div>
    </AppShell>
  )
}
