import { ArrowLeft, TrendingUp, DollarSign, Music, Shield, BarChart3, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../layouts/AppShell'

const stats = [
  { label: 'Total Streams', value: '12,412', change: '+18%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20 border-green-500/20' },
  { label: 'Revenue', value: '$1,847', change: '+12%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-500/20' },
  { label: 'Active Songs', value: '24', change: '+2', icon: Music, color: 'text-violet-400', bg: 'bg-violet-900/20 border-violet-500/20' },
  { label: 'Licenses Sold', value: '8', change: '+3', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-500/20' },
]

const topSongs = [
  { title: 'Midnight Bachata', streams: '4,201', revenue: '$620', trend: '+24%' },
  { title: 'Broken Halo', streams: '3,412', revenue: '$480', trend: '+11%' },
  { title: 'Salgo a la Calle', streams: '2,890', revenue: '$340', trend: '+8%' },
  { title: 'Sabor a Miel', streams: '1,909', revenue: '$250', trend: '-2%' },
]

const recentActivity = [
  { type: 'license', text: 'License request for Midnight Bachata', time: '2h ago', color: 'text-amber-400' },
  { type: 'stream', text: 'Broken Halo reached 3,000 streams', time: '5h ago', color: 'text-green-400' },
  { type: 'passport', text: 'Song Passport issued for Salgo a la Calle', time: '1d ago', color: 'text-blue-400' },
  { type: 'sale', text: 'Non-exclusive license sold — $149', time: '2d ago', color: 'text-violet-400' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="px-5 pt-14">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/profile')} className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-white font-black text-2xl">Dashboard</h1>
            <p className="text-zinc-600 text-xs">Composer Analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={color} />
                <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Top Performing Songs</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {topSongs.map((song, i) => (
              <div key={song.title} className={`flex items-center gap-3 px-4 py-3.5 ${i < topSongs.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-zinc-700 font-bold text-sm w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                  <p className="text-zinc-600 text-xs">{song.streams} streams</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">{song.revenue}</p>
                  <p className={`text-xs font-semibold ${song.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{song.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Stream Analytics</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Last 30 days</p>
                <p className="text-white font-black text-3xl">12,412</p>
                <p className="text-green-400 text-sm font-semibold">+18% vs last month</p>
              </div>
              <BarChart3 size={32} className="text-zinc-700" />
            </div>
            <div className="flex items-end gap-1 h-16">
              {[35, 52, 48, 65, 71, 60, 80, 75, 90, 85, 95, 100, 88, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-800 to-violet-500 opacity-80 transition-all"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-white font-bold text-lg mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color.replace('text-', 'bg-')}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{item.text}</p>
                </div>
                <p className="text-zinc-600 text-xs flex-shrink-0">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-violet-950/60 to-blue-950/40 border border-violet-500/20 p-5 mb-6">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-violet-400" />
            <div>
              <p className="text-white font-semibold text-sm">Listener Demographics</p>
              <p className="text-zinc-500 text-xs mt-0.5">Dominican Republic · USA · Mexico — Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
