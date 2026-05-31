import { memo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Gauge, Shield, ScanLine, User } from 'lucide-react'

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/readiness', icon: Gauge, label: 'Readiness' },
  { to: '/vault', icon: Shield, label: 'Vault' },
  { to: '/scan', icon: ScanLine, label: 'Scan' },
  { to: '/profile', icon: User, label: 'Profile' },
]

function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-theme safe-bottom"
      style={{ background: 'var(--surface)', backdropFilter: 'blur(var(--blur, 24px))', WebkitBackdropFilter: 'blur(var(--blur, 24px))' }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-1 py-2 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-[var(--speed,300ms)] relative"
            >
              <Icon
                size={22}
                aria-hidden
                style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {label}
              </span>
              {active && (
                <span
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'var(--text-primary)' }}
                  aria-hidden
                />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default memo(BottomNav)
