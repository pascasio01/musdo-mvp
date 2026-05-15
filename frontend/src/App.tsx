import { lazy, Suspense, memo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { PlayerProvider } from './lib/player'
import { ThemeProvider } from './lib/theme'
import { MusicAuraProvider } from './lib/aura'
import ProtectedRoute from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import AuraConnector from './components/AuraConnector'

// ─── Route Loading Fallback ───────────────────────────────────────────────────

function RouteShell() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg, #000)' }}
      aria-label="Loading page"
      aria-live="polite"
    >
      <div className="relative w-8 h-8" role="status">
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-0 rounded-full border-2 border-t-white/40 border-l-white/15 border-transparent animate-spin" />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  )
}

// ─── Lazy Route Imports (code-split per route) ───────────────────────────────

// Public
const Landing       = lazy(() => import('./pages/Landing'))
const Login         = lazy(() => import('./pages/Login'))
const Register      = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Pricing       = lazy(() => import('./pages/Pricing'))

// Legal group (rarely visited — load together)
const Legal              = lazy(() => import('./pages/legal/Legal'))
const Terms              = lazy(() => import('./pages/legal/Terms'))
const Privacy            = lazy(() => import('./pages/legal/Privacy'))
const DMCA               = lazy(() => import('./pages/legal/DMCA'))
const RefundPolicy       = lazy(() => import('./pages/legal/RefundPolicy'))
const CreatorAgreement   = lazy(() => import('./pages/legal/CreatorAgreement'))
const LicensingDisclaimer = lazy(() => import('./pages/legal/LicensingDisclaimer'))
const AIDisclaimer       = lazy(() => import('./pages/legal/AIDisclaimer'))
const CommunityRules     = lazy(() => import('./pages/legal/CommunityRules'))
const RiskDisclaimer     = lazy(() => import('./pages/legal/RiskDisclaimer'))

// Open app routes
const Home        = lazy(() => import('./pages/Home'))
const Search      = lazy(() => import('./pages/Search'))
const Player      = lazy(() => import('./pages/Player'))
const SongPassport = lazy(() => import('./pages/SongPassport'))
const Market      = lazy(() => import('./pages/Market'))
const MusicDNA    = lazy(() => import('./pages/MusicDNA'))
const SongStory   = lazy(() => import('./pages/SongStory'))

// Auth-required routes
const Vault          = lazy(() => import('./pages/Vault'))
const Upload         = lazy(() => import('./pages/Upload'))
const Profile        = lazy(() => import('./pages/Profile'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const Settings       = lazy(() => import('./pages/Settings'))
const Appearance     = lazy(() => import('./pages/Appearance'))
const Billing        = lazy(() => import('./pages/Billing'))
const Verify         = lazy(() => import('./pages/Verify'))
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'))
const AuditLog       = lazy(() => import('./pages/AuditLog'))

// Talent routes
const Talent          = lazy(() => import('./pages/Talent'))
const TalentProfile   = lazy(() => import('./pages/TalentProfile'))
const TalentRegister  = lazy(() => import('./pages/TalentRegister'))
const TalentDashboard = lazy(() => import('./pages/TalentDashboard'))
const TalentRequests  = lazy(() => import('./pages/TalentRequests'))
const SavedTalent     = lazy(() => import('./pages/SavedTalent'))

// Privileged routes
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

// ─── Provider Stack ───────────────────────────────────────────────────────────

const Providers = memo(function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MusicAuraProvider>
        <AuthProvider>
          <PlayerProvider>
            <AuraConnector />
            {children}
          </PlayerProvider>
        </AuthProvider>
      </MusicAuraProvider>
    </ThemeProvider>
  )
})

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<RouteShell />}>
            <Routes>
              {/* ── Public ── */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* ── Legal ── */}
              <Route path="/legal" element={<Legal />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/dmca" element={<DMCA />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/creator-agreement" element={<CreatorAgreement />} />
              <Route path="/licensing-disclaimer" element={<LicensingDisclaimer />} />
              <Route path="/ai-disclaimer" element={<AIDisclaimer />} />
              <Route path="/community-rules" element={<CommunityRules />} />
              <Route path="/risk-disclaimer" element={<RiskDisclaimer />} />

              {/* ── Open App (mock data, no auth required) ── */}
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/player/:id" element={<Player />} />
              <Route path="/studio/:id" element={<Player />} />
              <Route path="/song/:id" element={<Player />} />
              <Route path="/passport/:id" element={<SongPassport />} />
              <Route path="/market" element={<Market />} />
              <Route path="/dna/:id" element={<MusicDNA />} />
              <Route path="/story/:id" element={<SongStory />} />

              {/* ── Auth-Required ── */}
              <Route path="/vault" element={
                <ProtectedRoute>
                  <Vault />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/appearance" element={
                <ProtectedRoute>
                  <Appearance />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              } />
              <Route path="/verify" element={
                <ProtectedRoute>
                  <Verify />
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute>
                  <SecurityCenter />
                </ProtectedRoute>
              } />
              <Route path="/audit-log" element={
                <ProtectedRoute>
                  <AuditLog />
                </ProtectedRoute>
              } />

              {/* ── Talent / MUSDO Connect ── */}
              <Route path="/talent" element={<Talent />} />
              <Route path="/talent/register" element={<TalentRegister />} />
              <Route path="/talent/:id" element={<TalentProfile />} />
              <Route path="/talent-dashboard" element={
                <ProtectedRoute>
                  <TalentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/talent-requests" element={
                <ProtectedRoute>
                  <TalentRequests />
                </ProtectedRoute>
              } />
              <Route path="/saved-talent" element={
                <ProtectedRoute>
                  <SavedTalent />
                </ProtectedRoute>
              } />

              {/* ── Owner-Only ── */}
              <Route path="/owner" element={
                <ProtectedRoute requireOwner>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireOwner>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </Providers>
  )
}
