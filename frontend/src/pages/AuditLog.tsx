import { ArrowLeft, FileText, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

const logs = [
  { level: 'info', action: 'HUMAN_VERIFIED_APPROVED', user: 'admin_01', target: 'song:midnight-bachata', time: '2026-05-15 14:22:01' },
  { level: 'warn', action: 'LOGIN_NEW_DEVICE', user: 'user_4492', target: 'device:chrome-windows', time: '2026-05-13 09:14:33' },
  { level: 'info', action: 'LICENSE_REQUEST_SENT', user: 'buyer_22', target: 'song:broken-halo', time: '2026-05-12 18:45:11' },
  { level: 'info', action: 'ACCOUNT_CREATED', user: 'user_1104', target: 'role:composer', time: '2026-05-11 11:02:45' },
  { level: 'error', action: 'ACCOUNT_SUSPENDED', user: 'admin_01', target: 'user:user_4492', time: '2026-05-10 16:33:00' },
  { level: 'info', action: 'DEMO_UPLOADED', user: 'composer_01', target: 'demo:untitled-track-07', time: '2026-05-10 10:15:20' },
  { level: 'info', action: 'SONG_PASSPORT_ISSUED', user: 'system', target: 'song:salgo-a-la-calle', time: '2026-05-09 08:55:10' },
  { level: 'warn', action: 'FAILED_LOGIN_ATTEMPT', user: 'unknown', target: 'email:***@***.com', time: '2026-05-08 03:22:44' },
]

const levelConfig = {
  info: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  warn: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
}

export default function AuditLog() {
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
            <FileText size={18} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">MUSVORA</p>
            <h1 className="text-white font-black text-2xl">Audit Log</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-3 mb-5 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
          <p className="text-zinc-500 text-xs">Audit logs are immutable. No entries can be deleted.</p>
        </div>

        <div className="space-y-2">
          {logs.map((log, i) => {
            const config = levelConfig[log.level as keyof typeof levelConfig]
            const Icon = config.icon
            return (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg border flex items-center justify-center ${config.bg}`}>
                    <Icon size={13} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-mono font-semibold">{log.action}</p>
                    <p className="text-zinc-600 text-xs mt-0.5">
                      {log.user} → {log.target}
                    </p>
                    <p className="text-zinc-700 text-[10px] font-mono mt-1">{log.time}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 border ${config.bg} ${config.color}`}>
                    {log.level}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-zinc-700 text-xs font-mono">Showing 8 of 1,204 entries</p>
        </div>
      </div>
    </AppShell>
  )
}
