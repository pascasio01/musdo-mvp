import { NavLink, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Shield, Upload, User } from 'lucide-react'

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/market', icon: ShoppingBag, label: 'Market' },
  { to: '/vault', icon: Shield, label: 'Vault' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 safe-bottom"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(var(--blur, 24px))' }}
    >
      <div className="flex items-center justify-around px-1 py-2 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative"
            >
              <Icon
                size={22}
                className={active ? 'text-white' : 'text-zinc-600'}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-white' : 'text-zinc-600'}`}>
                {label}
              </span>
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-white" />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
