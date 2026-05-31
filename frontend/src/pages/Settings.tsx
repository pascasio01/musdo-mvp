import { useState } from 'react'
import { ArrowLeft, Bell, Shield, Eye, Mic2, Palette, LogOut, Headphones } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import { useAuth } from '../lib/auth'
import { Toggle, ActionCard } from '../components/ui'
import SafeListenPanel from '../components/audio/SafeListenPanel'
import AudioTuningPanel from '../components/audio/AudioTuningPanel'
import SpatialListeningPanel from '../components/audio/SpatialListeningPanel'

export default function Settings() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(false)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [creatorVisible, setCreatorVisible] = useState(true)
  const [marketVisible, setMarketVisible] = useState(true)

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-white font-black text-3xl mb-8">Settings</h1>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}>
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Palette size={14} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Appearance</p>
            </div>
            <div className="p-3">
              <ActionCard
                label="Appearance & Themes"
                desc="Themes, aura, accent color, motion"
                icon={Palette}
                onClick={() => navigate('/appearance')}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}>
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Bell size={14} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Notifications</p>
            </div>
            <div className="px-5 pb-2">
              <Toggle label="Push Notifications" desc="License requests, streams, activity" value={notifications} onChange={setNotifications} />
              <Toggle label="Email Notifications" desc="Weekly summary, billing alerts" value={emailNotifs} onChange={setEmailNotifs} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}>
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Eye size={14} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Privacy</p>
            </div>
            <div className="px-5 pb-2">
              <Toggle label="Private Profile" desc="Hide your profile from discovery" value={privateProfile} onChange={setPrivateProfile} />
              <Toggle label="Creator Visibility" desc="Show on creator discovery" value={creatorVisible} onChange={setCreatorVisible} />
              <Toggle label="Marketplace Visibility" desc="Show songs in marketplace" value={marketVisible} onChange={setMarketVisible} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}>
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Shield size={14} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Security</p>
            </div>
            <div className="p-3 space-y-1">
              <ActionCard label="Active Sessions" desc="Manage where you're logged in" icon={Shield} onClick={() => navigate('/security')} />
              <ActionCard label="Change Password" desc="Update your account password" icon={Shield} />
              <ActionCard label="Two-Factor Auth" desc="Coming soon" icon={Shield} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}>
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Headphones size={14} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Audio</p>
            </div>
            <div className="px-3 pb-3">
              <SafeListenPanel />
              <AudioTuningPanel />
              <SpatialListeningPanel />
              <p className="text-[10px] mt-3 px-2" style={{ color: 'var(--text-muted)' }}>
                These panels also appear in the player. Settings sync across the app.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}>
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Mic2 size={14} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Creator</p>
            </div>
            <div className="p-3 space-y-1">
              <ActionCard label="Verification Status" desc="View your verification level" icon={Mic2} onClick={() => navigate('/verify')} />
              <ActionCard label="Licensing Preferences" desc="Default license settings" icon={Mic2} />
              <ActionCard label="Payout Settings" desc="Revenue destination (coming soon)" icon={Mic2} />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full py-4 rounded-2xl border border-violet-500/20 text-violet-400 font-semibold text-sm hover:bg-violet-500/8 transition-colors"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            Manage Subscription
          </button>
          <button
            onClick={() => navigate('/legal')}
            className="w-full py-4 rounded-2xl border border-white/8 text-zinc-400 font-semibold text-sm hover:bg-white/5 transition-colors"
          >
            Legal & Policies
          </button>
          <button
            onClick={async () => { await signOut(); navigate('/') }}
            className="w-full py-4 rounded-2xl border border-white/8 text-zinc-500 font-semibold text-sm flex items-center justify-center gap-2 hover:border-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <p className="text-center text-zinc-800 text-[10px] mt-8 font-mono">
          MUSVORA v1.0 MVP · Human Music Infrastructure
        </p>
      </div>
    </AppShell>
  )
}
