import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/index.css'

// ─── Boot-time env validation ─────────────────────────────────────────────────
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const
const missing = REQUIRED_ENV.filter(key => !import.meta.env[key])
if (missing.length > 0 && import.meta.env.DEV) {
  console.warn(
    '[MUSDO] Missing environment variables — Supabase features will degrade to mock data:',
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

// ─── Service Worker registration (production only) ────────────────────────────
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('[MUSDO] Service worker registration failed:', err)
    })
  })
}
