import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Clock, CheckCircle, Star, Wifi, Mic, Music, Edit } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { mockRequests } from '../data/talentData'
import { useAuth } from '../lib/auth'

const statusConfig = {
  draft: { label: 'Draft', color: 'text-zinc-500', bg: 'bg-zinc-500/10 border-zinc-500/20' },
  sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-400/20' },
  viewed: { label: 'Viewed', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-400/20' },
  accepted: { label: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-400/20' },
  declined: { label: 'Declined', color: 'text-red-400', bg: 'bg-red-500/10 border-red-400/20' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-400/20' },
  completed: { label: 'Completed', color: 'text-white', bg: 'bg-white/10 border-white/20' },
  cancelled: { label: 'Cancelled', color: 'text-zinc-600', bg: 'bg-zinc-700/10 border-zinc-700/20' },
}

export default function TalentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'settings'>('overview')

  const displayName = user?.user_metadata?.username ?? 'Your Profile'
  const received = mockRequests.filter(r => r.talent_id !== 'user-1')
  const totalEarned = 650
  const pending = mockRequests.filter(r => r.status === 'sent' || r.status === 'accepted').length

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">MUSVORA Connect</p>
            <h1 className="text-white font-black text-2xl">Talent Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/talent/register')}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <Edit size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: TrendingUp, label: 'Earned (Mock)', value: `$${totalEarned}`, color: 'text-white' },
            { icon: Clock, label: 'Pending', value: pending.toString(), color: 'text-amber-400' },
            { icon: CheckCircle, label: 'Completed', value: '1', color: 'text-emerald-400' },
            { icon: Star, label: 'Rating', value: '4.9', color: 'text-amber-300' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <Icon size={14} className={`${color} mb-2`} strokeWidth={1.5} />
              <p className={`font-black text-2xl ${color}`}>{value}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-5">
          {(['overview', 'requests', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-3">Profile Visibility</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-semibold">{displayName}</span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-2.5 py-1 font-bold">LIVE</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { icon: Wifi, label: 'Remote', active: true },
                  { icon: Mic, label: 'Live', active: true },
                  { icon: Music, label: 'Studio', active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <span key={label} className={`flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 border ${active ? 'text-zinc-300 bg-white/5 border-white/15' : 'text-zinc-700 bg-zinc-800/30 border-zinc-700/20'}`}>
                    <Icon size={10} />{label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-3">Upcoming Sessions (Mock)</p>
              <div className="py-6 text-center">
                <p className="text-zinc-600 text-sm">No upcoming sessions.</p>
                <p className="text-zinc-700 text-xs mt-1">Accepted requests will appear here.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-900/10 border border-amber-500/15 p-4">
              <p className="text-amber-400 text-xs font-bold mb-1">Payments (Mock)</p>
              <p className="text-zinc-600 text-xs leading-relaxed">
                Payment infrastructure is not yet live. Future payments will use secure deposit and release via Stripe Connect.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-3">
            {mockRequests.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-zinc-600 text-sm">No requests yet.</p>
              </div>
            ) : (
              mockRequests.map(req => {
                const sc = statusConfig[req.status]
                return (
                  <div key={req.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{req.talent_name ?? req.requester_name}</p>
                        <p className="text-zinc-500 text-xs capitalize">{req.project_type.replace('_', ' ')} · {req.budget}</p>
                      </div>
                      <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 border ${sc.bg} ${sc.color}`}>
                        {sc.label.toUpperCase()}
                      </span>
                    </div>
                    {req.notes && <p className="text-zinc-600 text-xs line-clamp-2">{req.notes}</p>}
                    <p className="text-zinc-700 text-[10px] mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3">
            {[
              'Edit Profile',
              'Availability Status',
              'Notification Preferences',
              'Contact Settings',
              'Payout Settings (Coming Soon)',
            ].map(item => (
              <button
                key={item}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-left text-sm text-zinc-300 hover:text-white hover:bg-white/8 transition-all flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="text-zinc-600 text-xs">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
