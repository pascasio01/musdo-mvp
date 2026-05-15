import { useState } from 'react'
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import VerificationBadge from './VerificationBadge'
import { mockVerificationQueue } from '../data/mockData'
import type { VerificationRequest, VerificationStatus } from '../types'

const statusConfig: Record<VerificationStatus, { label: string; color: string; bg: string; icon: React.FC<{ size: number; className: string }> }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: (p) => <Clock {...p} /> },
  approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: (p) => <CheckCircle {...p} /> },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: (p) => <XCircle {...p} /> },
  none: { label: 'None', color: 'text-zinc-500', bg: 'bg-zinc-500/10 border-zinc-500/20', icon: (p) => <Clock {...p} /> },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminVerificationQueue() {
  const [queue, setQueue] = useState<VerificationRequest[]>(mockVerificationQueue)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending')

  const filtered = filter === 'all' ? queue : queue.filter(r => r.status === filter)

  const updateStatus = (id: string, status: VerificationStatus) => {
    setQueue(q => q.map(r => r.id === id ? { ...r, status, reviewed_at: new Date().toISOString() } : r))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
              filter === f ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {f === 'all' ? `All (${queue.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${queue.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-zinc-600 text-sm">No {filter === 'all' ? '' : filter} requests.</p>
          </div>
        )}
        {filtered.map(req => {
          const sConfig = statusConfig[req.status]
          const StatusIcon = sConfig.icon
          const isExpanded = expanded === req.id

          return (
            <div key={req.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : req.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm truncate">{req.username}</span>
                    <VerificationBadge type={req.badge_type} size="xs" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 border ${sConfig.bg} ${sConfig.color}`}>
                      <StatusIcon size={9} className="" />
                      {sConfig.label}
                    </span>
                    <span className="text-zinc-600 text-[11px]">{formatDate(req.submitted_at)}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-zinc-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-zinc-500 flex-shrink-0" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <div className="pt-3 space-y-2">
                    {req.notes && (
                      <div className="rounded-xl bg-white/5 px-3 py-2.5">
                        <p className="text-zinc-400 text-xs leading-relaxed">{req.notes}</p>
                      </div>
                    )}
                    {req.reviewed_at && (
                      <p className="text-zinc-600 text-[11px]">Reviewed: {formatDate(req.reviewed_at)}</p>
                    )}
                    {req.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateStatus(req.id, 'approved')}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle size={13} />
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, 'rejected')}
                          className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
