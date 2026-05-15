import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { PlayerProvider } from './lib/player'
import { ThemeProvider } from './lib/theme'
import { MusicAuraProvider } from './lib/aura'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Player from './pages/Player'
import Vault from './pages/Vault'
import Upload from './pages/Upload'
import Market from './pages/Market'
import SongPassport from './pages/SongPassport'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

import Pricing from './pages/Pricing'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Appearance from './pages/Appearance'
import Verify from './pages/Verify'
import MusicDNA from './pages/MusicDNA'
import SongStory from './pages/SongStory'
import SecurityCenter from './pages/SecurityCenter'
import AuditLog from './pages/AuditLog'

import Legal from './pages/legal/Legal'
import Terms from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import DMCA from './pages/legal/DMCA'
import RefundPolicy from './pages/legal/RefundPolicy'
import CreatorAgreement from './pages/legal/CreatorAgreement'
import LicensingDisclaimer from './pages/legal/LicensingDisclaimer'
import AIDisclaimer from './pages/legal/AIDisclaimer'
import CommunityRules from './pages/legal/CommunityRules'
import RiskDisclaimer from './pages/legal/RiskDisclaimer'

import OwnerDashboard from './pages/owner/OwnerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

import Talent from './pages/Talent'
import TalentProfile from './pages/TalentProfile'
import TalentRegister from './pages/TalentRegister'
import TalentDashboard from './pages/TalentDashboard'
import TalentRequests from './pages/TalentRequests'
import SavedTalent from './pages/SavedTalent'

export default function App() {
  return (
    <ThemeProvider>
      <MusicAuraProvider>
        <AuthProvider>
          <PlayerProvider>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Legal */}
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

                {/* App (open access with mock data) */}
                <Route path="/home" element={<Home />} />
                <Route path="/player/:id" element={<Player />} />
                <Route path="/song/:id" element={<Player />} />
                <Route path="/passport/:id" element={<SongPassport />} />
                <Route path="/market" element={<Market />} />
                <Route path="/dna/:id" element={<MusicDNA />} />
                <Route path="/story/:id" element={<SongStory />} />

                {/* Auth-required */}
                <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/appearance" element={<ProtectedRoute><Appearance /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><SecurityCenter /></ProtectedRoute>} />
                <Route path="/audit-log" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />

                {/* MUSDO Connect */}
                <Route path="/talent" element={<Talent />} />
                <Route path="/talent/register" element={<TalentRegister />} />
                <Route path="/talent/:id" element={<TalentProfile />} />
                <Route path="/talent-dashboard" element={<ProtectedRoute><TalentDashboard /></ProtectedRoute>} />
                <Route path="/talent-requests" element={<ProtectedRoute><TalentRequests /></ProtectedRoute>} />
                <Route path="/saved-talent" element={<ProtectedRoute><SavedTalent /></ProtectedRoute>} />

                {/* Owner-only */}
                <Route path="/owner" element={<ProtectedRoute requireOwner><OwnerDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireOwner><AdminDashboard /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </PlayerProvider>
        </AuthProvider>
      </MusicAuraProvider>
    </ThemeProvider>
  )
}
