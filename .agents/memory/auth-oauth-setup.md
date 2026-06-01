---
name: Auth OAuth setup (Google/Apple)
description: How MUSVORA social sign-in is wired and what must be configured outside the code (Supabase dashboard).
---

# OAuth social sign-in (Google + Apple)

Both providers use `supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } })`. On success Supabase does a full-page redirect, so the calling component only ever observes the error branch (a fail-safe timer clears the busy state if the redirect never happens).

**Why:** the button/handler living in the page cannot detect success — the page unmounts on redirect. Without the timer the button stays stuck "Connecting…".

**How to apply (enabling a provider is NOT a code change):**
- The provider must be turned on in the Supabase dashboard → Authentication → Providers. Until then `signInWithOAuth` returns an "unsupported provider / not enabled" error, which the UI maps to an honest "… not configured yet" message. Code alone cannot enable it.
- The redirect URL `<origin>/auth/callback` (dev `…picard.replit.dev`, plus the deploy domain) must be registered in Authentication → URL Configuration → Redirect URLs, and Site URL set, or the callback fails.
- Apple additionally needs an Apple Developer Service ID + key configured inside Supabase's Apple provider.

Shared button + error mapper live in `components/auth/OAuthButtons.tsx` (`OAuthButton`, `oauthErrorMessage(raw, provider)`); pages track a single `oauthBusy: OAuthProvider | null` and disable the email submit while OAuth is in flight (and vice-versa).
