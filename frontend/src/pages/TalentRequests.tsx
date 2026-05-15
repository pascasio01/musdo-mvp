import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import AppShell from '../layouts/AppShell'
import { mockRequests } from '../data/talentData'
import type { RequestStatus } from '../types/talent'

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-zinc-500', bg: 'bg-zinc-500/10 border-zinc-500/20' },
  sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-400/20' },
  viewed: { label: 'Viewed', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-400/20' },
  accepted: { label: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-400/20' },
  declined: { label: 'Declined', color: 'text-red-400', bg: 'bg-red-500/10 border-red-400/20' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-400/20' },
  completed: { label: 'Completed', color: 'text-white', bg: 'bg-white/10 border-white/20' },
  cancelled: { label: 'Cancelled', color: 'text-zinc-600', bg: 'bg-zinc-700/10 border-zinc-700/20' },
}

const paymentConfig = {
  unpaid: { label: 'Unpaid', color: 'text-red-400' },
  deposit_paid: { label: 'Deposit Paid', color: 'text-amber-400' },
  completed: { label: 'Paid', color: 'text-emerald-400' },
  disputed: { label: 'Disputed', color: 'text-red-400' },
}

const tabs: { key: RequestStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sent', label: 'Sent' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TalentRequests() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<RequestStatus | 'all'>('all')

  const filtered = activeTab === 'all'
    ? mockRequests
    : mockRequests.filter(r => r.status === activeTab)

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">MUSDO Connect</p>
          <h1 className="text-white font-black text-2xl">My Requests</h1>
          <p className="text-zinc-600 text-sm mt-1">{mockRequests.length} total requests.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.key ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">
                ({tab.key === 'all' ? mockRequests.length : mockRequests.filter(r => r.status === tab.key).length})
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Send size={28} className="text-zinc-700 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-zinc-500 text-sm">No requests found.</p>
            <button
              onClick={() => navigate('/talent')}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Find Talent
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const sc = statusConfig[req.status]
              const pc = req.payment_status ? paymentConfig[req.payment_status] : null

              return (
                <div
                  key={req.id}
                  onClick={() => navigate(`/talent/${req.talent_id}`)}
                  className="rounded-3xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold">{req.talent_name}</p>
                      <p className="text-zinc-500 text-xs capitalize mt-0.5">
                        {req.project_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 border ${sc.bg} ${sc.color} flex-shrink-0 ml-2`}>
                      {sc.label.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-zinc-600 text-xs line-clamp-2 mb-3">{req.service_needed}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-sm">{req.budget}</span>
                      {pc && (
                        <span className={`text-[10px] font-semibold ${pc.color}`}>{pc.label}</span>
                      )}
                    </div>
                    <span className="text-zinc-700 text-[11px]">{formatDate(req.created_at)}</span>
                  </div>

                  {req.deadline && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <p className="text-zinc-700 text-[10px]">Deadline: {new Date(req.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            All payment terms, delivery schedules and agreements are between you and the talent directly. MUSDO does not guarantee work quality, payment or project completion.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
