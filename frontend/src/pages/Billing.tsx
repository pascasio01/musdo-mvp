import { ArrowLeft, CreditCard, Receipt, RefreshCw, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

const mockHistory = [
  { id: 'INV-0012', date: 'May 1, 2026', plan: 'Creator Pro', amount: '$14.99', status: 'Paid' },
  { id: 'INV-0011', date: 'Apr 1, 2026', plan: 'Creator Pro', amount: '$14.99', status: 'Paid' },
  { id: 'INV-0010', date: 'Mar 1, 2026', plan: 'Creator Basic', amount: '$4.99', status: 'Paid' },
]

export default function Billing() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-white font-black text-3xl mb-8">Billing</h1>

        <div className="rounded-3xl bg-gradient-to-br from-violet-950/60 to-zinc-900 border border-violet-500/20 p-6 mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Current Plan</p>
          <h2 className="text-white font-black text-2xl mb-1">Creator Pro</h2>
          <p className="text-zinc-400 text-sm mb-4">$14.99 / month · Renews Jun 1, 2026</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Change Plan
            </button>
            <button className="flex-1 py-3 rounded-2xl bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-colors">
              Cancel
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-zinc-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment Method</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-gradient-to-r from-zinc-700 to-zinc-800 border border-white/10" />
              <div>
                <p className="text-white text-sm font-semibold">•••• •••• •••• 4242</p>
                <p className="text-zinc-600 text-xs">Expires 12/27</p>
              </div>
            </div>
            <button className="text-zinc-500 hover:text-white text-xs transition-colors">Update</button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-white/5">
            <Receipt size={16} className="text-zinc-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment History</p>
          </div>
          {mockHistory.map(inv => (
            <div key={inv.id} className="flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-0">
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{inv.plan}</p>
                <p className="text-zinc-600 text-xs">{inv.date} · {inv.id}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{inv.amount}</p>
                <p className="text-green-400 text-xs">{inv.status}</p>
              </div>
              <ChevronRight size={14} className="text-zinc-700" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw size={16} className="text-zinc-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Refund Request</p>
          </div>
          <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
            Refund requests are reviewed by the MUSVORA Team. See our Refund Policy for eligibility.
          </p>
          <button
            onClick={() => navigate('/refund-policy')}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            View Refund Policy
          </button>
        </div>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-4">
          <p className="text-amber-400 text-xs font-semibold mb-1">Billing Note</p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Payments are not live in this MVP version. No real charges are processed. This is prepared for Stripe integration at public launch.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
