import { useState } from 'react'
import { ArrowLeft, Bell, Shield, Eye, Mic2, Palette, LogOut, Headphones, Lock, Wifi, Database, KeyRound, ScrollText, AlertTriangle } from 'lucide-react'
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Privacy & Security</p>
            </div>
            <div className="p-3 space-y-1">
              <ActionCard label="Active Sessions" desc="Manage where you're logged in" icon={Shield} onClick={() => navigate('/security')} />
              <ActionCard label="Audit Log" desc="Review account activity history" icon={ScrollText} onClick={() => navigate('/audit-log')} />
              <ActionCard label="Change Password" desc="Update your account password" icon={KeyRound} />
              <ActionCard label="Two-Factor Auth" desc="Planned — security foundation" icon={Lock} />
              <ActionCard label="Security Policy" desc="How we protect your assets" icon={Lock} onClick={() => navigate('/security-policy')} />
            </div>

            <div className="px-3 pb-3">
              <div className="rounded-xl border border-white/8 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Security Foundation</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Wifi size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Encrypted in transit</p>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">Connections use HTTPS/TLS between your device and our services.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Database size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Encrypted at rest</p>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">Stored data and uploaded assets are encrypted at rest by our infrastructure providers. MUSVORA does not provide end-to-end encryption.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Lock size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Role-based access</p>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">Row-level security and role-based controls keep your data scoped to you. Privileged actions are restricted.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ScrollText size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Audit logs</p>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">Selected security-relevant events may be logged for accountability. Expanded audit history is part of the planned security foundation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Shield size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Secure file handling</p>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">Files are stored with scoped, access-controlled permissions. Automated scanning and validation are planned.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 p-4 mt-3" style={{ background: 'rgba(245,158,11,0.06)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />
                  <p className="text-amber-400 text-[11px] font-bold uppercase tracking-wider">Before You Upload</p>
                </div>
                <ul className="space-y-1.5 text-zinc-500 text-[11px] leading-relaxed list-disc pl-4">
                  <li>Do not upload works you do not own or are not authorized to manage.</li>
                  <li>Do not share private contracts outside trusted parties.</li>
                  <li>Legal review is recommended before signing licenses.</li>
                </ul>
              </div>
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
