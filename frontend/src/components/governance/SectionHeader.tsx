import type { ReactNode } from 'react'

interface SectionHeaderProps {
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string
  title: string
  description?: string
  /** Right-aligned actions (buttons, filters). */
  actions?: ReactNode
}

/** Governance SectionHeader — consistent section framing across MUSVORA modules. */
export function SectionHeader({ eyebrow, title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4" style={{ marginBottom: 'var(--gv-space-5)' }}>
      <div className="min-w-0">
        {eyebrow && <p className="gv-eyebrow" style={{ marginBottom: 'var(--gv-space-2)' }}>{eyebrow}</p>}
        <h2
          className="font-bold leading-tight"
          style={{
            fontFamily: 'var(--gv-font-display)',
            fontSize: 'var(--gv-text-xl)',
            letterSpacing: 'var(--gv-tracking-tight)',
            color: 'var(--gv-text)',
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-1.5"
            style={{
              fontSize: 'var(--gv-text-sm)',
              color: 'var(--gv-text-secondary)',
              lineHeight: 'var(--gv-leading-normal)',
              maxWidth: '46ch',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

export default SectionHeader
