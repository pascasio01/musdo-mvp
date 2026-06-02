import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

/**
 * MUSVORA AI panel state — decoupled from any single trigger.
 *
 * The AI is a first-class destination in the bottom navigation (centered tab),
 * not a floating button. This context lets the nav tab open the unified AI panel
 * while the panel itself lives in the AppShell. `openPanel` records the trigger
 * element so focus returns to it on close (accessibility).
 */
interface AIPanelContextValue {
  open: boolean
  openPanel: (trigger?: HTMLElement | null) => void
  closePanel: () => void
}

const AIPanelContext = createContext<AIPanelContextValue | null>(null)

export function AIPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  const openPanel = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null
    setOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  return (
    <AIPanelContext.Provider value={{ open, openPanel, closePanel }}>
      {children}
    </AIPanelContext.Provider>
  )
}

export function useAIPanel() {
  const ctx = useContext(AIPanelContext)
  if (!ctx) throw new Error('useAIPanel must be used within an AIPanelProvider')
  return ctx
}
