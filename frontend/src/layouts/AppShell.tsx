import { ReactNode } from 'react'
import BottomNav from '../components/BottomNav'
import PlayerBar from '../components/PlayerBar'
import MusvoraAIPanel from '../components/ai/MusvoraAIPanel'
import { AIPanelProvider } from '../lib/aiPanel'
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
    <AIPanelProvider>
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {/* Dark Luxury ambient depth — always-on, ultra-subtle Music-OS background.
          Two soft radial fields drift slowly behind all content (motion gated by
          reduce-motion + ambientAnimation), giving layered depth under the glass. */}
      <div className="fixed inset-0 pointer-events-none -z-0" aria-hidden>
        <div
          className="absolute -top-[20%] -right-[15%] w-[520px] h-[520px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle at center, var(--ambient-1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation:
              settings.ambientAnimation && !settings.reduceMotion
                ? 'ambient-drift-a 22s ease-in-out infinite'
                : 'none',
          }}
        />
        <div
          className="absolute top-[35%] -left-[20%] w-[460px] h-[460px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle at center, var(--ambient-2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation:
              settings.ambientAnimation && !settings.reduceMotion
                ? 'ambient-drift-b 26s ease-in-out infinite'
                : 'none',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] w-[380px] h-[380px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle at center, var(--ambient-3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation:
              settings.ambientAnimation && !settings.reduceMotion
                ? 'ambient-drift-a 30s ease-in-out infinite 4s'
                : 'none',
          }}
        />
      </div>

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

      <MusvoraAIPanel />
      <PlayerBar />
      <BottomNav />
    </div>
    </AIPanelProvider>
  )
}
