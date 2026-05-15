import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export default function GlassCard({ children, className = '', onClick, hover = false }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl
        ${hover ? 'hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
