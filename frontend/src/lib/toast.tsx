import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: number
  message: string
  variant: ToastVariant
  duration: number
}

interface ToastContextType {
  toasts: Toast[]
  show: (message: string, options?: { variant?: ToastVariant; duration?: number }) => number
  success: (message: string, duration?: number) => number
  error:   (message: string, duration?: number) => number
  info:    (message: string, duration?: number) => number
  warning: (message: string, duration?: number) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const show = useCallback((
    message: string,
    options: { variant?: ToastVariant; duration?: number } = {},
  ) => {
    const id = ++counter
    const variant = options.variant ?? 'info'
    const duration = options.duration ?? (variant === 'error' ? 5000 : 3200)
    setToasts(prev => [...prev, { id, message, variant, duration }])
    const timer = setTimeout(() => dismiss(id), duration)
    timers.current.set(id, timer)
    return id
  }, [dismiss])

  const success = useCallback((m: string, d?: number) => show(m, { variant: 'success', duration: d }), [show])
  const error   = useCallback((m: string, d?: number) => show(m, { variant: 'error',   duration: d }), [show])
  const info    = useCallback((m: string, d?: number) => show(m, { variant: 'info',    duration: d }), [show])
  const warning = useCallback((m: string, d?: number) => show(m, { variant: 'warning', duration: d }), [show])

  const value = useMemo<ToastContextType>(() => ({
    toasts, show, success, error, info, warning, dismiss,
  }), [toasts, show, success, error, info, warning, dismiss])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
