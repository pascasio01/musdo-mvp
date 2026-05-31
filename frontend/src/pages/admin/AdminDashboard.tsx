import { ArrowLeft, Users, BadgeCheck, Music, ShoppingBag, AlertTriangle, MoreVertical, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AppShell from '../../layouts/AppShell'
import AdminVerificationQueue from '../../components/AdminVerificationQueue'

const mockUsers = [
  { id: 'u001', name: 'Pascasio Emmanuel', role: 'composer', status: 'active', verified: true },
  { id: 'u002', name: 'María Fernanda R.', role: 'composer', status: 'active', verified: false },
  { id: 'u003', name: 'Carlos Beats', role: 'producer', status: 'active', verified: true },
  { id: 'u004', name: 'user_4492', role: 'listener', status: 'suspended', verified: false },
  { id: 'u005', name: 'AnaBeats', role: 'composer', status: 'active', verified: false },
]

const tabs = ['Users', 'Verifications', 'Marketplace', 'Content']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Users')
  const [search, setSearch] = useState('')

  const filteredUsers = mockUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell>
      <div className="px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Users size={18} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">MUSVORA</p>
            <h1 className="text-white font-black text-2xl">Admin Panel</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-900/15 border border-amber-500/20 p-3 mb-5 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
          <p className="text-zinc-500 text-xs">Admin access. All actions are logged and reviewed.</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: Users, label: 'Users', value: '1,284', color: 'text-blue-400' },
            { icon: BadgeCheck, label: 'Verified', value: '89', color: 'text-green-400' },
            { icon: Music, label: 'Songs', value: '312', color: 'text-violet-400' },
            { icon: ShoppingBag, label: 'Licenses', value: '43', color: 'text-amber-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <Icon size={14} className={`${color} mx-auto mb-1`} />
              <p className={`font-black text-lg ${color}`}>{value}</p>
              <p className="text-zinc-700 text-[10px]">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Users' && (
          <>
            <div className="relative mb-4">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-700 text-sm outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <div key={user.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{user.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                      {user.verified && <BadgeCheck size={12} className="text-blue-400 flex-shrink-0" />}
                    </div>
                    <p className="text-zinc-600 text-xs capitalize">{user.role} · {user.id}</p>
                  </div>
                  <div className={`text-[10px] font-bold rounded-full px-2.5 py-1 ${
                    user.status === 'active'
                      ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                      : 'text-red-400 bg-red-500/10 border border-red-500/20'
                  }`}>
                    {user.status.toUpperCase()}
                  </div>
                  <button className="text-zinc-600 hover:text-white transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'Verifications' && (
          <AdminVerificationQueue />
        )}

        {activeTab === 'Marketplace' && (
          <div className="py-8 text-center">
            <ShoppingBag size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm">Marketplace management</p>
            <p className="text-zinc-700 text-xs mt-1">43 active listings · 8 pending review</p>
          </div>
        )}

        {activeTab === 'Content' && (
          <div className="py-8 text-center">
            <Music size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm">Content moderation</p>
            <p className="text-zinc-700 text-xs mt-1">312 songs · 247 demos · 0 flagged</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
