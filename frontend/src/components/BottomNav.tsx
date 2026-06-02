import { memo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search as SearchIcon, Library as LibraryIcon, Shield } from 'lucide-react'
import AILogoMark from './ai/AILogoMark'
import { useAIPanel } from '../lib/aiPanel'
import { useTheme } from '../lib/theme'

const leftItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: SearchIcon, label: 'Search' },
]

const rightItems = [
  { to: '/library', icon: LibraryIcon, label: 'Library' },
  { to: '/vault', icon: Shield, label: 'Vault' },
]

function NavItem({ to, icon: Icon, label, active }: { to: string; icon: typeof Home; label: string; active: boolean }) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-[var(--speed,300ms)] relative flex-1"
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
}

/**
 * MUSVORA bottom navigation.
 *
 * MUSVORA AI is a centered, fixed navigation destination — never a floating
 * button. It occupies a reserved layout slot (so it never overlaps content),
 * is safe-area / Dynamic Island compatible, and breathes with a soft glow +
 * internal light pulse (disabled under reduced-motion). The panel it opens is
 * owned by AIPanelProvider and rendered in AppShell.
 *
 * Order: Home · Search · AI · Library · Vault
 */
function BottomNav() {
  const location = useLocation()
  const { open, openPanel } = useAIPanel()
  const { settings } = useTheme()
  const animate = !settings.reduceMotion

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-theme safe-bottom"
      style={{ background: 'var(--surface)', backdropFilter: 'blur(var(--blur, 24px))', WebkitBackdropFilter: 'blur(var(--blur, 24px))' }}
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around px-1 py-2 max-w-md mx-auto">
        {leftItems.map(item => (
          <NavItem key={item.to} {...item} active={location.pathname === item.to} />
        ))}

        {/* ── MUSVORA AI — centered, fixed destination (reserved slot) ──
            data-ds="governance" resolves the --gv-* tokens (gold) for this
            element + children without GovernanceScope dropping the button props. */}
        <button
          data-ds="governance"
          type="button"
          aria-label="Open MUSVORA AI"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={(e) => openPanel(e.currentTarget)}
          className="gv-focusable flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-[var(--speed,300ms)] flex-1"
        >
          <span
            className={`relative grid place-items-center ${animate ? 'gv-ai-nav' : ''}`}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background:
                'linear-gradient(155deg, color-mix(in srgb, var(--gv-gold) 26%, rgba(12,12,14,0.74)), rgba(10,10,12,0.7))',
              border: `1px solid color-mix(in srgb, var(--gv-gold) ${open ? '75%' : '50%'}, transparent)`,
              backdropFilter: 'blur(16px) saturate(160%)',
              WebkitBackdropFilter: 'blur(16px) saturate(160%)',
              boxShadow: '0 6px 22px color-mix(in srgb, var(--gv-gold) 22%, transparent), 0 2px 8px rgba(0,0,0,0.45)',
            }}
          >
            {/* internal light pulse */}
            <span
              aria-hidden
              className={`absolute pointer-events-none ${animate ? 'gv-ai-nav-pulse' : ''}`}
              style={{
                inset: 4,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--gv-gold) 55%, transparent), transparent 68%)',
                opacity: animate ? undefined : 0.45,
              }}
            />
            <AILogoMark size={26} />
          </span>
          <span
            className="text-[10px] font-semibold tracking-wide"
            style={{ color: open ? 'var(--gv-gold)' : 'var(--text-muted)' }}
          >
            AI
          </span>
        </button>

        {rightItems.map(item => (
          <NavItem key={item.to} {...item} active={location.pathname === item.to} />
        ))}
      </div>
    </nav>
  )
}

export default memo(BottomNav)
