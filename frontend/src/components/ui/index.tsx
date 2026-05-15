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

const btnBase = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none'

const btnVariants: Record<BtnVariant, string> = {
  primary: 'bg-white text-black hover:opacity-90',
  secondary: 'bg-white/8 border border-white/12 text-white hover:bg-white/12',
  ghost: 'text-zinc-400 hover:text-white hover:bg-white/5',
  danger: 'bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/22',
  accent: 'bg-violet-600/25 border border-violet-500/30 text-violet-300 hover:bg-violet-600/35',
}

const btnSizes: Record<BtnSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
}

export function Btn({ children, variant = 'primary', size = 'md', fullWidth, disabled, loading, onClick, type = 'button', className = '' }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <div className="w-3.5 h-3.5 rounded-full border border-current/20 border-t-current animate-spin" />}
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
      className={`
        rounded-2xl border border-white/8
        ${hover ? 'hover:bg-white/8 hover:border-white/15 cursor-pointer transition-all duration-200' : ''}
        ${padding ? 'p-5' : ''}
        ${className}
      `}
      style={{ background: 'var(--card, rgba(255,255,255,0.04))' }}
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

export function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">{label}</label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3.5 rounded-2xl border text-white placeholder-zinc-700 outline-none transition-colors text-sm
          ${error
            ? 'border-red-500/30 bg-red-500/5 focus:border-red-500/50'
            : 'border-white/10 bg-white/5 focus:border-white/20'
          } ${className}`}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      {hint && !error && <p className="text-zinc-700 text-xs mt-1.5">{hint}</p>}
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
        <label className="text-xs text-zinc-600 uppercase tracking-wider font-medium block mb-2">{label}</label>
      )}
      <textarea
        {...props}
        className={`w-full px-4 py-3.5 rounded-2xl border text-white placeholder-zinc-700 outline-none transition-colors text-sm resize-none
          ${error
            ? 'border-red-500/30 bg-red-500/5'
            : 'border-white/10 bg-white/5 focus:border-white/20'
          } ${className}`}
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
    <div className={`flex items-center justify-between py-3.5 border-b border-white/5 last:border-0 ${className}`}>
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-zinc-600 text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 ${value ? 'bg-white' : 'bg-white/15'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
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
    <div className={`flex gap-1 p-1 rounded-2xl border border-white/8 overflow-x-auto scrollbar-hide ${className}`}
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            active === id ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {Icon && <Icon size={11} />}
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
        {label && <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">{label}</p>}
        <h1 className="text-white font-black text-3xl leading-none">{title}</h1>
        {subtitle && <p className="text-zinc-600 text-sm mt-1.5">{subtitle}</p>}
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
        {Icon && <Icon size={13} className="text-zinc-600" />}
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
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

export function StatCard({ label, value, change, up, icon: Icon, accent = 'text-violet-400', glow = 'rgba(124,58,237,0.1)' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 p-4" style={{ background: glow }}>
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon size={15} className={accent} />}
        {change && (
          <span className={`text-xs font-bold ${up !== false && (up || change.startsWith('+')) ? 'text-emerald-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <p className={`text-xl font-black ${accent}`}>{value}</p>
      <p className="text-zinc-600 text-[10px] mt-0.5">{label}</p>
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
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/6 hover:bg-white/5 hover:border-white/10 transition-all text-left ${className}`}
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      {Icon && (
        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-zinc-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{label}</p>
        {desc && <p className="text-zinc-600 text-xs mt-0.5">{desc}</p>}
      </div>
      {rightElement ?? <span className="text-zinc-700 text-sm flex-shrink-0">›</span>}
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
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
          <Icon size={22} className="text-zinc-600" />
        </div>
      )}
      <p className="text-white font-bold text-base mb-1">{title}</p>
      {desc && <p className="text-zinc-600 text-sm leading-relaxed mb-5">{desc}</p>}
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
    <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'py-16'}`}
      style={fullScreen ? { background: 'var(--bg, #000)' } : undefined}
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-0 rounded-full border-2 border-t-white/50 border-transparent animate-spin" />
      </div>
      {label && <p className="text-zinc-700 text-xs uppercase tracking-widest font-medium">{label}</p>}
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
    <div className="py-12 flex flex-col items-center justify-center text-center px-6">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <span className="text-red-400 text-lg">!</span>
      </div>
      <p className="text-white font-bold text-base mb-1">{title}</p>
      <p className="text-zinc-500 text-sm mb-5 leading-relaxed">{message}</p>
      {action}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'violet' | 'blue' | 'amber' | 'green' | 'red' | 'slate'

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/8 border-white/12 text-zinc-300',
  violet: 'bg-violet-500/12 border-violet-500/22 text-violet-300',
  blue: 'bg-blue-500/12 border-blue-500/22 text-blue-300',
  amber: 'bg-amber-500/12 border-amber-500/22 text-amber-300',
  green: 'bg-emerald-500/12 border-emerald-500/22 text-emerald-300',
  red: 'bg-red-500/12 border-red-500/22 text-red-300',
  slate: 'bg-slate-400/10 border-slate-400/20 text-slate-300',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-1 border ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`border-t border-white/5 ${className}`} />
}
