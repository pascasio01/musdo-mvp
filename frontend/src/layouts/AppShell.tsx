import { ReactNode } from 'react'
import BottomNav from '../components/BottomNav'
import PlayerBar from '../components/PlayerBar'
import { usePlayer } from '../lib/player'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const { song } = usePlayer()

  return (
    <div className="min-h-screen bg-black text-white">
      <main
        className="max-w-md mx-auto"
        style={{ paddingBottom: song ? '140px' : '80px' }}
      >
        {children}
      </main>
      <PlayerBar />
      <BottomNav />
    </div>
  )
}
