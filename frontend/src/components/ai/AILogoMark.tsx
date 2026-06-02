/**
 * MUSVORA AI wordmark glyph — the "M" lockup with a gold underline.
 * Shared by the bottom-navigation AI tab and any AI surface that needs the mark.
 */
export default function AILogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="flex-shrink-0"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
    >
      <path
        d="M14 45 V19 L23 19 L32 33 L41 19 L50 19 V45 H43.5 V30 L34 44 H30 L20.5 30 V45 Z"
        fill="#fff"
      />
      <rect x="14" y="49.5" width="36" height="3" rx="1.5" fill="var(--gv-gold, #D4AF37)" />
    </svg>
  )
}
