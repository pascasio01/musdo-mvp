import { memo } from 'react'

interface WordmarkProps {
  /** Visual size of the mark + text. */
  size?: 'sm' | 'md' | 'lg'
  /** Show the "M" glyph mark before the wordmark. Default true. */
  showMark?: boolean
  /** Show the wordmark text. Default true. */
  showText?: boolean
  /** Optional tagline under the wordmark. */
  tagline?: string
  className?: string
}

const sizeMap = {
  sm: { mark: 22, text: 'text-[13px]', track: '0.22em' },
  md: { mark: 28, text: 'text-[16px]', track: '0.2em' },
  lg: { mark: 40, text: 'text-[22px]', track: '0.18em' },
} as const

/** MUSVORA brand mark — institutional "M" monogram + wordmark. */
function WordmarkImpl({
  size = 'md',
  showMark = true,
  showText = true,
  tagline,
  className = '',
}: WordmarkProps) {
  const s = sizeMap[size]
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {showMark && (
        <svg
          width={s.mark}
          height={s.mark}
          viewBox="0 0 64 64"
          aria-hidden
          className="flex-shrink-0"
        >
          <rect width="64" height="64" rx="14" fill="var(--gv-black, #0A0A0A)" />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="12.5"
            fill="none"
            stroke="var(--gv-navy, #001F3F)"
            strokeWidth="2.5"
          />
          <path
            d="M14 45 V19 L23 19 L32 33 L41 19 L50 19 V45 H43.5 V30 L34 44 H30 L20.5 30 V45 Z"
            fill="var(--gv-white, #fff)"
          />
          <rect x="14" y="49.5" width="36" height="3" rx="1.5" fill="var(--gv-gold, #D4AF37)" />
        </svg>
      )}
      {showText && (
        <span className="leading-none">
          <span
            className={`block font-extrabold ${s.text}`}
            style={{
              fontFamily: 'var(--gv-font-display)',
              letterSpacing: s.track,
              color: 'var(--gv-text)',
            }}
          >
            MUSVORA
          </span>
          {tagline && (
            <span
              className="block text-[9px] mt-1 uppercase font-semibold"
              style={{ letterSpacing: '0.14em', color: 'var(--gv-text-muted)' }}
            >
              {tagline}
            </span>
          )}
        </span>
      )}
    </div>
  )
}

export const Wordmark = memo(WordmarkImpl)
export default Wordmark
