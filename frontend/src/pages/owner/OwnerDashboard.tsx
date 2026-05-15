import { ShieldCheck, Users, Music, DollarSign, TrendingUp, Database, Wifi, HardDrive, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'

const systemStatus = [
  { label: 'Auth', status: 'operational', icon: Lock },
  { label: 'Database', status: 'operational', icon: Database },
  { label: 'Storage', status: 'operational', icon: HardDrive },
  { label: 'Supabase', status: 'operational', icon: Wifi },
]

const stats = [
  { label: 'Total Revenue', value: '$24,847', change: '+18%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-500/20' },
  { label: 'Monthly Revenue', value: '$3,201', change: '+12%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20 border-green-500/20' },
  { label: 'Active Users', value: '1,284', change: '+47', icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-500/20' },
  { label: 'Active Songs', value: '312', change: '+18', icon: Music, color: 'text-violet-400', bg: 'bg-violet-900/20 border-violet-500/20' },
]

const detailStats = [
  { label: 'Active Composers', value: '89' },
  { label: 'Total Demos', value: '247' },
  { label: 'License Requests', value: '43' },
  { label: 'Pending Payouts', value: '$1,840' },
  { label: 'Licensing Revenue', value: '$8,410' },
  { label: 'Storage Used', value: '12.4 GB' },
]

const recentActions = [
  { action: 'Human Verified approved', target: 'Midnight Bachata', time: '2h ago', type: 'approve' },
  { action: 'Account suspended', target: 'user_4492', time: '5h ago', type: 'warn' },
  { action: 'License request processed', target: 'Broken Halo', time: '1d ago', type: 'approve' },
  { action: 'New composer verified', target: 'Emmanuel R.', time: '2d ago', type: 'approve' },
]

export default function OwnerDashboard() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-900 flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">MUSDO</p>
            <h1 className="text-white font-black text-2xl">Owner Command</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-violet-900/20 border border-violet-500/30 p-4 mb-6 flex items-center gap-3">
          <ShieldCheck size={18} className="text-violet-400 flex-shrink-0" />
          <div>
            <p className="text-violet-300 text-sm font-bold">Supreme Owner Access</p>
            <p className="text-zinc-500 text-xs">Full system control enabled. This session is logged.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={color} />
                <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">Platform Details</p>
          <div className="grid grid-cols-2 gap-3">
            {detailStats.map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white/5 p-3">
                <p className="text-zinc-600 text-xs mb-0.5">{label}</p>
                <p className="text-white font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">System Health</p>
          <div className="space-y-3">
            {systemStatus.map(({ label, status, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-zinc-600" />
                  <span className="text-white text-sm">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs font-semibold capitalize">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">Recent Actions</p>
          <div className="space-y-3">
            {recentActions.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.type === 'approve'
                  ? <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  : <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{item.action}</p>
                  <p className="text-zinc-600 text-xs">{item.target}</p>
                </div>
                <p className="text-zinc-700 text-xs flex-shrink-0">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/admin')} className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
            Admin Panel
          </button>
          <button onClick={() => navigate('/security')} className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
            Security Center
          </button>
        </div>
      </div>
    </AppShell>
  )
}
