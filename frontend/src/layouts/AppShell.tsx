import { ReactNode } from 'react'
import BottomNav from '../components/BottomNav'
import PlayerBar from '../components/PlayerBar'
import { usePlayer } from '../lib/player'
import { useMusicAura } from '../lib/aura'
import { useTheme } from '../lib/theme'

interface AppShellProps {
  children: ReactNode
  noPad?: boolean
}

export default function AppShell({ children, noPad }: AppShellProps) {
  const { song } = usePlayer()
  const { auraSettings } = useMusicAura()
  const { settings } = useTheme()

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: 'var(--bg, #000)' }}>
      {auraSettings.enabled && (
        <>
          <div
            className="fixed top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background: 'var(--aura-primary, transparent)',
              filter: `blur(var(--blur, 24px))`,
              opacity: 0.8,
              transform: 'translate(30%, -30%)',
              animation: settings.ambientAnimation && !settings.reduceMotion
                ? 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite'
                : 'none',
            }}
          />
          <div
            className="fixed bottom-0 left-0 w-[360px] h-[360px] rounded-full pointer-events-none"
            style={{
              background: 'var(--aura-secondary, transparent)',
              filter: `blur(var(--blur, 24px))`,
              opacity: 0.6,
              transform: 'translate(-30%, 30%)',
              animation: settings.ambientAnimation && !settings.reduceMotion
                ? 'aura-breathe var(--aura-pulse, 4s) ease-in-out infinite 2s'
                : 'none',
            }}
          />
        </>
      )}

      {settings.cinematicMode && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      )}

      <main
        className="relative z-10 max-w-md mx-auto"
        style={{ paddingBottom: song ? '140px' : '80px' }}
      >
        {children}
      </main>
      <PlayerBar />
      <BottomNav />
    </div>
  )
}
