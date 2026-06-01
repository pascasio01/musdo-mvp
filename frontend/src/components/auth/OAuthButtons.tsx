import { Loader2 } from 'lucide-react'

export type OAuthProvider = 'google' | 'apple'

const PROVIDER_LABEL: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
}

/** Official Google "G" mark — multicolor, decorative (label lives on the button). */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

/** Official Apple mark — monochrome, inherits the button text color. */
function AppleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.05 12.04c-.03-2.6 2.12-3.84 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.23 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.14-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13z" />
      <path d="M14.7 4.86c.71-.87 1.19-2.07 1.06-3.27-1.02.04-2.26.68-3 1.55-.66.76-1.24 1.99-1.08 3.16 1.14.09 2.31-.58 3.02-1.44z" />
    </svg>
  )
}

/**
 * Translate raw Supabase/OAuth errors into a clear, user-facing message.
 * Kept here so every auth screen stays DRY and consistent across providers.
 */
export function oauthErrorMessage(raw: string, provider: OAuthProvider): string {
  const name = PROVIDER_LABEL[provider]
  const m = (raw || '').toLowerCase()
  if (m.includes('not enabled') || m.includes('unsupported provider') || m.includes('provider is not'))
    return `${name} Sign-In is not configured yet. Enable the ${name} provider in Supabase Auth settings.`
  if (m.includes('popup') || m.includes('pop-up') || m.includes('window closed') || m.includes('blocked'))
    return `Your browser blocked the ${name} sign-in window. Allow pop-ups for this site and try again.`
  if (m.includes('redirect') && m.includes('url'))
    return 'The sign-in redirect URL is missing or invalid. Please try again.'
  if (m.includes('redirect'))
    return `${name} sign-in could not redirect back to MUSVORA. Please try again.`
  if (m.includes('network') || m.includes('fetch') || m.includes('load failed'))
    return `Connection error reaching ${name}. Check your internet and try again.`
  return `${name} sign-in failed. Please try again.`
}

interface OAuthButtonProps {
  provider: OAuthProvider
  label: string
  loading?: boolean
  disabled?: boolean
  onClick: () => void
}

export function OAuthButton({ provider, label, loading = false, disabled = false, onClick }: OAuthButtonProps) {
  const name = PROVIDER_LABEL[provider]
  const Mark = provider === 'google' ? GoogleMark : AppleMark
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      aria-label={label}
      aria-busy={loading}
      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base flex items-center justify-center gap-3 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Mark />}
      <span>{loading ? `Connecting to ${name}…` : label}</span>
    </button>
  )
}
