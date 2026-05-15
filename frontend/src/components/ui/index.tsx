import { ReactNode, ElementType, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

// ─── Button ─────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
type BtnSize = 'sm' | 'md' | 'lg'

interface BtnProps {
  children: ReactNode
  variant?: BtnVariant
  size?: BtnSize
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const btnBase = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius,18px)] transition-all duration-[var(--speed,300ms)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]'

const btnSizes: Record<BtnSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
}

export function Btn({ children, variant = 'primary', size = 'md', fullWidth, disabled, loading, onClick, type = 'button', className = '' }: BtnProps) {
  const variantStyle: React.CSSProperties =
    variant === 'primary' ? { background: 'var(--text-primary)', color: 'var(--text-inverse)' }
    : variant === 'secondary' ? { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
    : variant === 'ghost' ? {}
    : variant === 'danger' ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }
    : { background: 'var(--accent-soft)', border: '1px solid rgba(var(--accent-rgb),0.3)', color: 'var(--accent)' }

  const variantClass =
    variant === 'primary' ? 'hover:opacity-90'
    : variant === 'secondary' ? 'hover:bg-glass-medium'
    : variant === 'ghost' ? 'text-muted hover:text-primary hover:bg-glass'
    : variant === 'danger' ? 'hover:bg-red-500/20'
    : 'hover:bg-accent-soft'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${btnBase} ${variantClass} ${btnSizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={variantStyle}
    >
      {loading && (
        <div className="w-3.5 h-3.5 rounded-full border border-current/20 border-t-current animate-spin" />
      )}
      {children}
    </button>
  )
}

// ─── GlassCard ───────────────────────────────────────────────────────────────

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: boolean
}

export function GlassCard({ children, className = '', onClick, hover = false, padding = true }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[var(--radius,18px)] border border-theme transition-colors duration-[var(--speed,300ms)] ${hover ? 'hover:bg-glass-medium cursor-pointer' : ''} ${padding ? 'p-5' : ''} ${className}`}
      style={{ background: 'var(--glass-bg)' }}
    >
      {children}
    </div>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', style, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3.5 rounded-[var(--radius,18px)] border text-primary placeholder-zinc-600 outline-none transition-colors duration-[var(--speed,300ms)] text-sm focus:border-[var(--accent)] ${error ? 'border-red-400/30 bg-red-500/5' : 'border-theme bg-glass'} ${className}`}
        style={{ background: error ? undefined : 'var(--glass-bg)', ...style }}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      {hint && !error && <p className="text-muted text-xs mt-1.5">{hint}</p>}
    </div>
  )
}

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-2">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full px-4 py-3.5 rounded-[var(--radius,18px)] border text-primary placeholder-zinc-600 outline-none transition-colors duration-[var(--speed,300ms)] text-sm resize-none focus:border-[var(--accent)] ${error ? 'border-red-400/30 bg-red-500/5' : 'border-theme bg-glass'} ${className}`}
        style={error ? undefined : { background: 'var(--glass-bg)' }}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

interface ToggleProps {
  label: string
  desc?: string
  value: boolean
  onChange: (v: boolean) => void
  className?: string
}

export function Toggle({ label, desc, value, onChange, className = '' }: ToggleProps) {
  return (
    <div className={`flex items-center justify-between py-3.5 border-b border-soft last:border-0 ${className}`}>
      <div>
        <p className="text-primary text-sm font-medium">{label}</p>
        {desc && <p className="text-muted text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={`Toggle ${label}`}
        className="w-11 h-6 rounded-full relative transition-colors duration-[var(--speed,300ms)] flex-shrink-0"
        style={{ background: value ? 'var(--text-primary)' : 'var(--glass-bg-strong)' }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full transition-all duration-[var(--speed,300ms)]"
          style={{
            background: value ? 'var(--text-inverse)' : 'var(--text-muted)',
            left: value ? '1.5rem' : '0.25rem',
          }}
        />
      </button>
    </div>
  )
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

interface Tab {
  id: string
  label: string
  icon?: ElementType
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div
      className={`flex gap-1 p-1 rounded-[var(--radius,18px)] border border-soft overflow-x-auto scrollbar-hide ${className}`}
      style={{ background: 'var(--glass-subtle)' }}
    >
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-selected={active === id}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-[var(--speed,300ms)]`}
          style={
            active === id
              ? { background: 'var(--text-primary)', color: 'var(--text-inverse)' }
              : { color: 'var(--text-muted)' }
          }
        >
          {Icon && <Icon size={11} aria-hidden />}
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── PageHeader ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  label?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ label, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        {label && <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{label}</p>}
        <h1 className="text-primary font-black text-3xl leading-none">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// ─── SectionTitle ────────────────────────────────────────────────────────────

interface SectionTitleProps {
  icon?: ElementType
  label: string
  action?: ReactNode
  className?: string
}

export function SectionTitle({ icon: Icon, label, action, className = '' }: SectionTitleProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={13} className="text-muted" aria-hidden />}
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── StatCard ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  up?: boolean
  icon?: ElementType
  accent?: string
  glow?: string
}

export function StatCard({ label, value, change, up, icon: Icon, accent = 'var(--accent)', glow = 'var(--accent-soft)' }: StatCardProps) {
  return (
    <div className="rounded-[var(--radius,18px)] border border-soft p-4" style={{ background: glow }}>
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon size={15} style={{ color: accent }} aria-hidden />}
        {change && (
          <span className={`text-xs font-bold ${up !== false && (up || change.startsWith('+')) ? 'text-emerald-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-xl font-black" style={{ color: accent }}>{value}</p>
      <p className="text-muted text-[10px] mt-0.5">{label}</p>
    </div>
  )
}

// ─── ActionCard ──────────────────────────────────────────────────────────────

interface ActionCardProps {
  label: string
  desc?: string
  icon?: ElementType
  onClick?: () => void
  rightElement?: ReactNode
  className?: string
}

export function ActionCard({ label, desc, icon: Icon, onClick, rightElement, className = '' }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-soft hover:bg-glass hover:border-theme transition-all duration-[var(--speed,300ms)] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] ${className}`}
      style={{ background: 'var(--glass-subtle)' }}
    >
      {Icon && (
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--glass-bg)' }}
        >
          <Icon size={14} className="text-muted" aria-hidden />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-primary text-sm font-semibold">{label}</p>
        {desc && <p className="text-muted text-xs mt-0.5">{desc}</p>}
      </div>
      {rightElement ?? <span className="text-muted text-sm flex-shrink-0" aria-hidden>›</span>}
    </button>
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ElementType
  title: string
  desc?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, desc, action }: EmptyStateProps) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-6">
      {Icon && (
        <div
          className="w-14 h-14 rounded-2xl border border-soft flex items-center justify-center mb-4"
          style={{ background: 'var(--glass-bg)' }}
        >
          <Icon size={22} className="text-muted" aria-hidden />
        </div>
      )}
      <p className="text-primary font-bold text-base mb-1">{title}</p>
      {desc && <p className="text-muted text-sm leading-relaxed mb-5">{desc}</p>}
      {action}
    </div>
  )
}

// ─── LoadingState ────────────────────────────────────────────────────────────

interface LoadingStateProps {
  label?: string
  fullScreen?: boolean
}

export function LoadingState({ label, fullScreen }: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'py-16'}`}
      style={fullScreen ? { background: 'var(--bg)' } : undefined}
      aria-live="polite"
      role="status"
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-soft" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-transparent animate-spin" />
      </div>
      {label && <p className="text-muted text-xs uppercase tracking-widest font-medium">{label}</p>}
    </div>
  )
}

// ─── ErrorState ──────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string
  message: string
  action?: ReactNode
}

export function ErrorState({ title = 'Something went wrong', message, action }: ErrorStateProps) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center px-6" role="alert">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <span className="text-red-400 text-lg" aria-hidden>!</span>
      </div>
      <p className="text-primary font-bold text-base mb-1">{title}</p>
      <p className="text-muted text-sm mb-5 leading-relaxed">{message}</p>
      {action}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'violet' | 'blue' | 'amber' | 'emerald' | 'red' | 'slate'

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  default:  { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' },
  violet:   { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', color: '#c4b5fd' },
  blue:     { background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.22)', color: '#93c5fd' },
  amber:    { background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.22)', color: '#fcd34d' },
  emerald:  { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', color: '#6ee7b7' },
  red:      { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', color: '#fca5a5' },
  slate:    { background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', color: '#cbd5e1' },
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-1 ${className}`}
      style={badgeStyles[variant]}
    >
      {children}
    </span>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`border-t border-soft ${className}`} />
}
