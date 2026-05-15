import { createContext, useContext, useState, ReactNode } from 'react'

export type AppMode = 'listener' | 'creator' | 'owner'

interface ModeContextType {
  mode: AppMode
  setMode: (m: AppMode) => void
  isOwner: boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL as string | undefined

export function ModeProvider({ children, userEmail }: { children: ReactNode; userEmail?: string }) {
  const isOwner = !!OWNER_EMAIL && userEmail?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  const [mode, setMode] = useState<AppMode>('listener')

  return (
    <ModeContext.Provider value={{ mode, setMode, isOwner }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be inside ModeProvider')
  return ctx
}
