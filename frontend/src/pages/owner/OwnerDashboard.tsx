import { useState } from 'react'
import { ShieldCheck, Users, Music, DollarSign, TrendingUp, Database, Wifi, HardDrive, Lock, AlertCircle, CheckCircle, BarChart2, Sparkles, Settings, Send, Activity, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'

type Tab = 'command' | 'analytics' | 'security' | 'ai' | 'settings'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'command', label: 'Command', icon: ShieldCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'ai', label: 'AI', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const kpis = [
  { label: 'Total Revenue',   value: '$24,847', change: '+18%', up: true, icon: DollarSign,  color: 'text-amber-400',  glow: 'rgba(217,119,6,0.12)' },
  { label: 'Monthly Revenue', value: '$3,201',  change: '+12%', up: true, icon: TrendingUp,  color: 'text-violet-400', glow: 'rgba(124,58,237,0.12)' },
  { label: 'Active Users',    value: '1,284',   change: '+47',  up: true, icon: Users,       color: 'text-blue-400',   glow: 'rgba(37,99,235,0.12)' },
  { label: 'Active Songs',    value: '312',     change: '+18',  up: true, icon: Music,       color: 'text-rose-400',   glow: 'rgba(225,29,72,0.12)' },
]

const barData = [
  { label: 'Revenue',  bars: [45, 62, 48, 71, 55, 83, 76], color: '#d97706' },
  { label: 'Users',    bars: [30, 45, 60, 52, 68, 74, 81], color: '#7c3aed' },
  { label: 'Licenses', bars: [20, 35, 28, 42, 38, 55, 50], color: '#2563eb' },
]

const alerts = [
  { type: 'verify',  msg: '3 new verification requests',    sub: 'Composer badges · Pending', urgency: 'medium',   icon: CheckCircle },
  { type: 'growth',  msg: 'Creator growth spike',           sub: '+22 new composers this week', urgency: 'positive', icon: TrendingUp },
  { type: 'market',  msg: 'Licensing activity increased',   sub: '+34% from last week',       urgency: 'positive', icon: Activity },
  { type: 'login',   msg: 'Unusual login detected',         sub: 'user_4492 · 3 countries',   urgency: 'high',     icon: AlertCircle },
  { type: 'genre',   msg: 'Trending genre detected',        sub: 'Bachata Romántica +67%',    urgency: 'info',     icon: Zap },
]

const systemStatus = [
  { label: 'Auth',        ok: true, icon: Lock,     detail: 'Supabase Auth v2' },
  { label: 'Database',    ok: true, icon: Database, detail: 'PostgreSQL · 99.9% uptime' },
  { label: 'Storage',     ok: true, icon: HardDrive,detail: '12.4 GB used' },
  { label: 'API Gateway', ok: true, icon: Wifi,     detail: '38ms avg response' },
]

const recentActions = [
  { action: 'Human Verified approved', target: 'Midnight Bachata', time: '2h ago',  ok: true },
  { action: 'Account suspended',       target: 'user_4492',        time: '5h ago',  ok: false },
  { action: 'License processed',       target: 'Broken Halo',      time: '1d ago',  ok: true },
  { action: 'Composer verified',       target: 'Emmanuel R.',       time: '2d ago',  ok: true },
]

const aiSuggestions = [
  'Analyze creator growth this month',
  'Detect suspicious login patterns',
  'Suggest featured artists',
  'Review marketplace performance',
  'Generate weekly platform report',
  'Identify trending genres',
]

const alertColors: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-amber-400',
  positive: 'text-teal-400',
  info: 'text-blue-400',
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full rounded-sm overflow-hidden bg-glass" style={{ height: 40 }}>
        <div
          className="w-full rounded-sm transition-all duration-700"
          style={{ height: `${(value / max) * 100}%`, background: color, marginTop: `${100 - (value / max) * 100}%` }}
        />
      </div>
    </div>
  )
}

const panelClass = 'rounded-2xl border border-theme p-5'
const panelStyle = { background: 'var(--glass-bg)' }

function CommandTab() {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/20 p-4 flex items-center gap-3" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <ShieldCheck size={16} className="text-violet-400 flex-shrink-0" aria-hidden />
        <div>
          <p className="text-violet-300 text-sm font-bold">Supreme Owner · Session Active</p>
          <p className="text-muted text-xs">Full system control · This session is logged</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {kpis.map(({ label, value, change, up, icon: Icon, color, glow }) => (
          <div key={label} className="rounded-2xl border border-theme p-4" style={{ background: glow }}>
            <div className="flex items-center justify-between mb-2">
              <Icon size={14} className={color} aria-hidden />
              <span className={`text-xs font-bold ${up ? 'text-teal-400' : 'text-red-400'}`}>{change}</span>
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-muted text-[10px] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Live Intelligence</p>
        <div className="space-y-3">
          {alerts.map((a, i) => {
            const Icon = a.icon
            return (
              <div key={i} className="flex items-start gap-3">
                <Icon size={13} className={`${alertColors[a.urgency]} flex-shrink-0 mt-0.5`} aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-primary text-xs font-semibold">{a.msg}</p>
                  <p className="text-muted text-[10px]">{a.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Recent Actions</p>
        <div className="space-y-3">
          {recentActions.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.ok
                ? <CheckCircle size={13} className="text-teal-400 flex-shrink-0" aria-hidden />
                : <AlertCircle size={13} className="text-amber-400 flex-shrink-0" aria-hidden />
              }
              <div className="flex-1 min-w-0">
                <p className="text-primary text-xs">{item.action}</p>
                <p className="text-muted text-[10px]">{item.target}</p>
              </div>
              <p className="text-muted text-[10px] flex-shrink-0">{item.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="py-4 rounded-2xl border border-theme text-primary text-sm font-semibold transition-colors hover:bg-glass-medium"
          style={{ background: 'var(--glass-bg)' }}
        >
          Admin Panel
        </button>
        <button
          onClick={() => navigate('/security')}
          className="py-4 rounded-2xl border border-theme text-primary text-sm font-semibold transition-colors hover:bg-glass-medium"
          style={{ background: 'var(--glass-bg)' }}
        >
          Security
        </button>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div className="space-y-4">
      {barData.map(({ label, bars, color }) => {
        const max = Math.max(...bars)
        return (
          <div key={label} className={panelClass} style={panelStyle}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-primary text-sm font-bold">{label}</p>
              <span className="text-[10px] text-muted uppercase tracking-wider">7 days</span>
            </div>
            <div className="flex gap-1 items-end h-10">
              {bars.map((v, i) => <MiniBar key={i} value={v} max={max} color={color} />)}
            </div>
            <div className="flex justify-between mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className="flex-1 text-center text-[9px] text-muted">{d}</span>
              ))}
            </div>
          </div>
        )
      })}

      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Platform Details</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Active Composers', value: '89' },
            { label: 'Total Demos',      value: '247' },
            { label: 'License Requests', value: '43' },
            { label: 'Pending Payouts',  value: '$1,840' },
            { label: 'Licensing Revenue',value: '$8,410' },
            { label: 'Storage Used',     value: '12.4 GB' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-glass p-3">
              <p className="text-muted text-[10px] mb-0.5">{label}</p>
              <p className="text-primary font-bold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">System Health</p>
        <div className="space-y-4">
          {systemStatus.map(({ label, ok, icon: Icon, detail }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-glass flex items-center justify-center">
                  <Icon size={13} className="text-muted" aria-hidden />
                </div>
                <div>
                  <p className="text-primary text-sm font-medium">{label}</p>
                  <p className="text-muted text-[10px]">{detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-teal-400' : 'bg-red-400'}`} aria-hidden />
                <span className={`text-xs font-semibold ${ok ? 'text-teal-400' : 'text-red-400'}`}>
                  {ok ? 'Operational' : 'Down'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-red-900/10 border border-red-500/15 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={13} className="text-amber-400" aria-hidden />
          <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Active Alert</p>
        </div>
        <p className="text-primary text-sm font-semibold">Suspicious login detected</p>
        <p className="text-secondary text-xs mt-1">user_4492 logged in from 3 different countries within 2 hours.</p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-bold">
            Suspend Account
          </button>
          <button className="flex-1 py-2.5 rounded-xl border border-theme text-muted text-xs font-bold" style={{ background: 'var(--glass-bg)' }}>
            Dismiss
          </button>
        </div>
      </div>

      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Verification Queue</p>
        {[
          { user: 'Emanuel_B', type: 'Verified Composer', time: '4h ago' },
          { user: 'Roselyn_M', type: 'Human Verified',    time: '1d ago' },
          { user: 'Tony_RD',   type: 'Rights Holder',     time: '2d ago' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-soft last:border-0">
            <div className="w-8 h-8 rounded-xl bg-glass-medium flex items-center justify-center text-primary text-xs font-bold">
              {item.user[0]}
            </div>
            <div className="flex-1">
              <p className="text-primary text-xs font-semibold">{item.user}</p>
              <p className="text-muted text-[10px]">{item.type}</p>
            </div>
            <button className="px-3 py-1 rounded-lg bg-glass-medium text-primary text-[10px] font-bold hover:bg-glass-strong transition-colors">
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AITab() {
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runAI = (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setAiResponse(null)
    setTimeout(() => {
      setAiResponse(`MUSVORA AI Analysis: Based on platform data, ${q.toLowerCase().includes('growth') ? 'creator growth is accelerating — 22 new composers joined this week, up 34% from the prior week. Bachata Romántica and Urban Fusion are the top contributing genres. Recommend featuring top 3 new verified composers in the home discovery feed.' : q.toLowerCase().includes('suspicious') ? 'Security scan complete. 1 high-risk login detected (user_4492, 3 countries, 2h window). 12 low-risk flagged logins reviewed and cleared. Recommend immediate session revocation for user_4492.' : 'Analysis complete. Platform metrics are trending positively across all key areas. Recommend expanding verification capacity and preparing for increased marketplace demand.'}`)
      setLoading(false)
    }, 1400)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/20 p-5" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={13} className="text-violet-400" aria-hidden />
          <p className="text-violet-300 text-xs font-bold uppercase tracking-wider">MUSVORA AI Command</p>
        </div>
        <p className="text-muted text-xs mb-4">Ask anything about your platform</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAI(aiQuery)}
            placeholder="Ask MUSVORA AI…"
            aria-label="AI query"
            className="flex-1 px-4 py-3 rounded-xl border border-theme text-primary text-sm placeholder-zinc-600 outline-none"
            style={{ background: 'var(--glass-bg)' }}
          />
          <button
            onClick={() => runAI(aiQuery)}
            disabled={loading}
            className="px-4 py-3 rounded-xl bg-violet-600/30 border border-violet-500/30 text-violet-300 hover:bg-violet-600/40 transition-colors disabled:opacity-50"
            aria-label="Submit AI query"
          >
            {loading
              ? <div className="w-4 h-4 rounded-full border border-violet-400/30 border-t-violet-400 animate-spin" />
              : <Send size={14} aria-hidden />
            }
          </button>
        </div>
        {aiResponse && (
          <div className="mt-4 p-4 rounded-xl border border-soft" style={{ background: 'var(--glass-subtle)' }}>
            <p className="text-secondary text-xs leading-relaxed">{aiResponse}</p>
          </div>
        )}
      </div>

      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Quick Commands</p>
        <div className="space-y-2">
          {aiSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setAiQuery(s); runAI(s) }}
              className="w-full text-left px-4 py-3 rounded-xl border border-soft hover:bg-glass-medium transition-colors group"
              style={{ background: 'var(--glass-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={12} className="text-violet-500 flex-shrink-0" aria-hidden />
                <p className="text-secondary text-xs group-hover:text-primary transition-colors">{s}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function OwnerSettingsTab() {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      <div className={panelClass} style={panelStyle}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Owner Controls</p>
        <div className="space-y-2">
          {[
            { label: 'Platform Settings', desc: 'Global configuration',    path: '/settings' },
            { label: 'Appearance',        desc: 'Theme & visual settings', path: '/appearance' },
            { label: 'Audit Log',         desc: 'Full activity history',   path: '/audit-log' },
            { label: 'Admin Panel',       desc: 'User & content management', path: '/admin' },
          ].map(({ label, desc, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-soft hover:bg-glass-medium hover:border-theme transition-colors"
              style={{ background: 'var(--glass-subtle)' }}
            >
              <div className="text-left">
                <p className="text-primary text-sm font-semibold">{label}</p>
                <p className="text-muted text-xs">{desc}</p>
              </div>
              <span className="text-muted text-sm" aria-hidden>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OwnerDashboard() {
  const [tab, setTab] = useState<Tab>('command')

  const tabComponents: Record<Tab, React.ReactNode> = {
    command:  <CommandTab />,
    analytics: <AnalyticsTab />,
    security: <SecurityTab />,
    ai:       <AITab />,
    settings: <OwnerSettingsTab />,
  }

  return (
    <AppShell>
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-900 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(124,58,237,0.25)' }}
          >
            <ShieldCheck size={17} className="text-white" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">MUSVORA</p>
            <h1 className="text-primary font-black text-xl leading-none">Command Center</h1>
          </div>
        </div>

        <div
          className="flex gap-1 p-1 rounded-2xl border border-theme mb-6 overflow-x-auto scrollbar-hide"
          style={{ background: 'var(--glass-subtle)' }}
          role="tablist"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-[var(--speed,300ms)]"
              style={
                tab === id
                  ? { background: 'var(--text-primary)', color: 'var(--text-inverse)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <Icon size={11} aria-hidden />
              {label}
            </button>
          ))}
        </div>

        {tabComponents[tab]}
      </div>
    </AppShell>
  )
}
