import { memo } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToast, type ToastVariant } from '../lib/toast'

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
  warning: AlertTriangle,
}

const ACCENT: Record<ToastVariant, string> = {
  success: 'rgba(20, 184, 130, 0.95)',
  error:   'rgba(239, 68, 68, 0.95)',
  info:    'rgba(99, 102, 241, 0.95)',
  warning: 'rgba(245, 158, 11, 0.95)',
}

function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 px-4 w-full max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map(t => {
        const Icon = ICONS[t.variant]
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto rounded-2xl border border-theme shadow-theme px-4 py-3 flex items-start gap-3 animate-[toast-in_220ms_ease-out]"
            style={{
              background: 'var(--card-elevated)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: `3px solid ${ACCENT[t.variant]}`,
            }}
          >
            <Icon size={18} style={{ color: ACCENT[t.variant], flexShrink: 0, marginTop: 2 }} aria-hidden />
            <p className="text-primary text-sm flex-1 leading-relaxed">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-muted hover:text-primary transition-colors flex-shrink-0"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default memo(ToastContainer)
