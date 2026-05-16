import { ReactNode } from 'react'
import BottomNav from '../components/BottomNav'
import PlayerBar from '../components/PlayerBar'
import { usePlayer } from '../lib/player'
import { useMusicAura } from '../lib/aura'
import { useTheme } from '../lib/theme'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const { song } = usePlayer()
  const { auraSettings } = useMusicAura()
  const { settings } = useTheme()

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {auraSettings.enabled && !settings.reduceMotion && (
        <>
          <div
            className="fixed top-0 right-0 w-[360px] h-[360px] rounded-full pointer-events-none -z-0 will-change-transform"
            style={{
              background: 'var(--aura-primary, transparent)',
              filter: 'blur(56px)',
              opacity: 0.65,
              transform: 'translate3d(35%, -35%, 0)',
              animation: settings.ambientAnimation
                ? 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite'
                : 'none',
            }}
            aria-hidden
          />
          <div
            className="fixed bottom-0 left-0 w-[280px] h-[280px] rounded-full pointer-events-none -z-0 will-change-transform"
            style={{
              background: 'var(--aura-secondary, transparent)',
              filter: 'blur(56px)',
              opacity: 0.45,
              transform: 'translate3d(-35%, 35%, 0)',
              animation: settings.ambientAnimation
                ? 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite 2.2s'
                : 'none',
            }}
            aria-hidden
          />
        </>
      )}

      {settings.cinematicMode && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, var(--overlay, rgba(0,0,0,0.65)) 100%)',
            zIndex: 0,
          }}
          aria-hidden
        />
      )}

      <main
        className="relative z-10 max-w-md mx-auto"
        style={{ paddingBottom: song ? '148px' : '80px' }}
      >
        {children}
      </main>

      <PlayerBar />
      <BottomNav />
    </div>
  )
}
