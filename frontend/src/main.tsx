import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/index.css'
import './styles/governance.css'

// ─── Boot-time env validation ─────────────────────────────────────────────────
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const
const missing = REQUIRED_ENV.filter(key => !import.meta.env[key])
if (missing.length > 0 && import.meta.env.DEV) {
  console.warn(
    '[MUSVORA] Missing environment variables — Supabase features will degrade to mock data:',
    missing.join(', '),
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// ─── Service Worker registration ──────────────────────────────────────────────
// Registered in prod (full offline shell) AND dev. In dev the SW is started with
// `?dev=1`, which scopes it to ONLY serve downloaded offline audio — it never
// touches Vite's module/HMR pipeline (see public/sw.js). This lets MUSVORA
// Offline Mode be tested in the dev preview without breaking hot reload.
if ('serviceWorker' in navigator) {
  const swUrl = import.meta.env.DEV ? '/sw.js?dev=1' : '/sw.js'
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch(err => {
      console.warn('[MUSVORA] Service worker registration failed:', err)
    })
  })
}
