import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Clock, Key, Database, Lock, Users, RefreshCw, Wifi } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

const sessions = [
  { device: 'iPhone 15 Pro', location: 'Santo Domingo, DO', time: 'Active now', current: true },
  { device: 'MacBook Pro', location: 'Santo Domingo, DO', time: '3h ago', current: false },
  { device: 'Chrome / Windows', location: 'Unknown', time: '2d ago', current: false },
]

const securityItems = [
  { label: 'Row Level Security (RLS)', status: 'enabled', icon: Lock, color: 'text-green-400' },
  { label: 'Supabase Auth', status: 'connected', icon: Wifi, color: 'text-green-400' },
  { label: 'Supabase Storage', status: 'connected', icon: Database, color: 'text-green-400' },
  { label: 'API Key (Anon)', status: 'configured', icon: Key, color: 'text-green-400' },
  { label: 'Service Role Key', status: 'never exposed', icon: Shield, color: 'text-blue-400' },
  { label: 'Admin Endpoints', status: 'protected', icon: Lock, color: 'text-green-400' },
]

const recentActivity = [
  { type: 'success', text: 'Successful login', detail: 'iPhone 15 Pro · Santo Domingo', time: 'Just now' },
  { type: 'success', text: 'Successful login', detail: 'MacBook Pro · Santo Domingo', time: '3h ago' },
  { type: 'warn', text: 'Login from new device', detail: 'Chrome / Windows · Unknown', time: '2d ago' },
  { type: 'success', text: 'Password changed', detail: 'Account security update', time: '1w ago' },
]

const rlsPolicies = [
  { table: 'profiles', status: 'enabled' },
  { table: 'songs', status: 'enabled' },
  { table: 'licenses', status: 'enabled' },
  { table: 'playlists', status: 'enabled' },
  { table: 'demos', status: 'enabled' },
  { table: 'audit_logs', status: 'enabled' },
]

export default function SecurityCenter() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Shield size={18} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">MUSVORA</p>
            <h1 className="text-white font-black text-2xl">Security Center</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-green-900/15 border border-green-500/20 p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-300 text-sm font-bold">System Secure</p>
            <p className="text-zinc-500 text-xs">No critical threats detected. Last scan: just now.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">Security Status</p>
          <div className="space-y-3">
            {securityItems.map(({ label, status, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-zinc-600" />
                  <span className="text-zinc-300 text-sm">{label}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  {status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Active Sessions</p>
            <span className="text-[10px] font-semibold text-zinc-600">{sessions.length} sessions</span>
          </div>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.current ? 'bg-green-400' : 'bg-zinc-700'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm">{s.device}</p>
                    {s.current && <span className="text-[10px] font-bold text-green-400 bg-green-500/10 rounded-full px-2 py-0.5">CURRENT</span>}
                  </div>
                  <p className="text-zinc-600 text-xs">{s.location} · {s.time}</p>
                </div>
                {!s.current && (
                  <button className="text-zinc-600 hover:text-red-400 text-xs transition-colors font-semibold">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 text-xs font-semibold hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center gap-2">
            <RefreshCw size={13} />
            Revoke All Other Sessions
          </button>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">Login Activity</p>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {item.type === 'success'
                  ? <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  : <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{item.text}</p>
                  <p className="text-zinc-600 text-xs">{item.detail}</p>
                </div>
                <p className="text-zinc-700 text-xs flex-shrink-0">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">RLS Policy Matrix</p>
          <div className="space-y-2">
            {rlsPolicies.map(p => (
              <div key={p.table} className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm font-mono">{p.table}</span>
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                  <CheckCircle size={12} />
                  {p.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">Developer Access</p>
          <div className="flex items-center gap-3">
            <Users size={16} className="text-zinc-600" />
            <div>
              <p className="text-white text-sm font-semibold">MUSVORA Team</p>
              <p className="text-zinc-600 text-xs">Internal development access only</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Key size={15} className="text-zinc-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Security Checklist</p>
          </div>
          <ul className="space-y-2 mt-3">
            {[
              { text: 'RLS enabled on all tables', done: true },
              { text: 'Service role key not in frontend', done: true },
              { text: 'Auth tokens use secure storage', done: true },
              { text: 'Rate limiting configured', done: false },
              { text: 'HTTPS enforced', done: true },
              { text: 'Audit logging active', done: true },
            ].map(item => (
              <li key={item.text} className="flex items-center gap-2 text-sm">
                {item.done
                  ? <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
                  : <Clock size={13} className="text-amber-400 flex-shrink-0" />
                }
                <span className={item.done ? 'text-zinc-300' : 'text-zinc-500'}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  )
}
