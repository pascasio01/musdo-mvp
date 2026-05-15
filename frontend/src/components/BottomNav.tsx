import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, Shield, ShoppingBag, User } from 'lucide-react'

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/market', icon: ShoppingBag, label: 'Market' },
  { to: '/vault', icon: Shield, label: 'Vault' },
  { to: '/upload', icon: Search, label: 'Upload' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-white/10 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
            >
              <Icon
                size={22}
                className={active ? 'text-white' : 'text-zinc-500'}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-white' : 'text-zinc-500'}`}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" style={{ position: 'relative' }} />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
