import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Stretch to full width of container. */
  block?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  children: ReactNode
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12px] gap-1.5 rounded-[var(--gv-radius-sm)]',
  md: 'h-10 px-4 text-[13.5px] gap-2 rounded-[var(--gv-radius-md)]',
  lg: 'h-12 px-5 text-[15px] gap-2 rounded-[var(--gv-radius-lg)]',
}

function variantStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { background: 'var(--gv-white)', color: 'var(--gv-text-inverse)' }
    case 'secondary':
      return {
        background: 'var(--gv-surface-2)',
        color: 'var(--gv-text)',
        border: '1px solid var(--gv-border)',
      }
    case 'ghost':
      return { background: 'transparent', color: 'var(--gv-text-secondary)' }
    case 'gold':
      return {
        background: 'var(--gv-gold-soft)',
        color: 'var(--gv-gold)',
        border: '1px solid color-mix(in srgb, var(--gv-gold) 30%, transparent)',
      }
    case 'danger':
      return {
        background: 'var(--gv-danger-soft)',
        color: 'var(--gv-danger)',
        border: '1px solid color-mix(in srgb, var(--gv-danger) 30%, transparent)',
      }
  }
}

/** Governance Button — the standard interactive control for MUSVORA modules. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, leadingIcon, trailingIcon, children, className = '', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`gv-focusable inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none ${sizeStyles[size]} ${block ? 'w-full' : ''} ${className}`}
      style={{
        ...variantStyle(variant),
        transitionDuration: 'var(--gv-dur-fast)',
        transitionTimingFunction: 'var(--gv-ease)',
      }}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})

export default Button
