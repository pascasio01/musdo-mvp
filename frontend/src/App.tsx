import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { PlayerProvider } from './lib/player'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Player from './pages/Player'
import Vault from './pages/Vault'
import Upload from './pages/Upload'
import Market from './pages/Market'
import SongPassport from './pages/SongPassport'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/market" element={<Market />} />
            <Route path="/song/:id" element={<Player />} />
            <Route path="/passport/:id" element={<SongPassport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  )
}
