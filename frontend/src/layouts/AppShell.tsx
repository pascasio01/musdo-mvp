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
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: 'var(--bg, #000)' }}>
      {auraSettings.enabled && !settings.reduceMotion && (
        <>
          <div
            className="fixed top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none -z-0"
            style={{
              background: 'var(--aura-primary, transparent)',
              filter: 'blur(80px)',
              opacity: 0.7,
              transform: 'translate(35%, -35%)',
              animation: settings.ambientAnimation
                ? 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite'
                : 'none',
            }}
          />
          <div
            className="fixed bottom-0 left-0 w-[320px] h-[320px] rounded-full pointer-events-none -z-0"
            style={{
              background: 'var(--aura-secondary, transparent)',
              filter: 'blur(80px)',
              opacity: 0.5,
              transform: 'translate(-35%, 35%)',
              animation: settings.ambientAnimation
                ? 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite 2.2s'
                : 'none',
            }}
          />
        </>
      )}

      {settings.cinematicMode && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.65) 100%)',
            zIndex: 0,
          }}
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
