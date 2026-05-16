import { memo, CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  style?: CSSProperties
}

const ROUNDED: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  none: '0',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
}

function Skeleton({ className = '', width, height, rounded = 'lg', style }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius: ROUNDED[rounded],
        background: 'var(--glass-bg)',
        ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--glass-bg-strong) 50%, transparent 100%)',
          animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
        }}
      />
    </div>
  )
}

export default memo(Skeleton)

export const SongCardSkeleton = memo(function SongCardSkeleton() {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden>
      <Skeleton width={56} height={56} rounded="xl" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton width="70%" height={14} rounded="md" />
        <Skeleton width="45%" height={12} rounded="md" />
      </div>
    </div>
  )
})

export const FeaturedCardSkeleton = memo(function FeaturedCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden" aria-hidden>
      <Skeleton width="100%" height={220} rounded="3xl" />
    </div>
  )
})
