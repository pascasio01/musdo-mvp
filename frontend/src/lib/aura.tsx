import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Song } from '../types'

export type AuraPreset = 'romantic' | 'sad' | 'energetic' | 'acoustic' | 'latin' | 'urban' | 'default'

interface AuraConfig {
  primary: string
  secondary: string
  glow: string
  pulseSpeed: string
}

const auraPresets: Record<AuraPreset, AuraConfig> = {
  romantic: {
    primary: 'rgba(180,60,80,0.16)',
    secondary: 'rgba(210,140,60,0.1)',
    glow: 'rgba(180,80,60,0.22)',
    pulseSpeed: '4.5s',
  },
  sad: {
    primary: 'rgba(40,60,180,0.14)',
    secondary: 'rgba(100,60,160,0.1)',
    glow: 'rgba(60,60,200,0.18)',
    pulseSpeed: '7s',
  },
  energetic: {
    primary: 'rgba(150,20,200,0.18)',
    secondary: 'rgba(180,20,60,0.13)',
    glow: 'rgba(150,50,220,0.25)',
    pulseSpeed: '1.8s',
  },
  acoustic: {
    primary: 'rgba(160,110,40,0.13)',
    secondary: 'rgba(200,170,80,0.09)',
    glow: 'rgba(180,140,60,0.16)',
    pulseSpeed: '5.5s',
  },
  latin: {
    primary: 'rgba(200,100,20,0.16)',
    secondary: 'rgba(220,160,30,0.1)',
    glow: 'rgba(210,120,20,0.22)',
    pulseSpeed: '2.2s',
  },
  urban: {
    primary: 'rgba(100,20,180,0.18)',
    secondary: 'rgba(160,20,80,0.12)',
    glow: 'rgba(120,30,200,0.22)',
    pulseSpeed: '2.8s',
  },
  default: {
    primary: 'rgba(124,58,237,0.1)',
    secondary: 'rgba(37,99,235,0.07)',
    glow: 'rgba(124,58,237,0.14)',
    pulseSpeed: '4s',
  },
}

export function detectAuraPreset(song: Song | null): AuraPreset {
  if (!song) return 'default'
  const g = song.genre.toLowerCase()
  const bpm = song.bpm ?? 100
  if (g.includes('bachata') && bpm < 120) return 'romantic'
  if (g.includes('bachata')) return 'latin'
  if (g.includes('romantic') || g.includes('balada') || g.includes('bolero')) return 'romantic'
  if (g.includes('salsa') || g.includes('merengue') || g.includes('latin')) return 'latin'
  if (g.includes('urban') || g.includes('trap') || g.includes('reggaeton')) return 'urban'
  if (g.includes('acoustic') || g.includes('folk') || g.includes('bossa')) return 'acoustic'
  if (bpm > 128) return 'energetic'
  if (bpm < 72) return 'sad'
  return 'default'
}

export interface AuraSettings {
  enabled: boolean
  intensity: 'low' | 'medium' | 'high'
  useCoverColors: boolean
}

interface AuraContextType {
  preset: AuraPreset
  config: AuraConfig
  auraSettings: AuraSettings
  updateAuraSettings: (p: Partial<AuraSettings>) => void
  setActiveSong: (song: Song | null) => void
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)
const AURA_KEY = 'musdo-aura-v1'

const defaultAuraSettings: AuraSettings = {
  enabled: true,
  intensity: 'medium',
  useCoverColors: true,
}

export function MusicAuraProvider({ children }: { children: ReactNode }) {
  const [activeSong, setActiveSong] = useState<Song | null>(null)
  const [auraSettings, setAuraSettings] = useState<AuraSettings>(() => {
    try {
      const s = localStorage.getItem(AURA_KEY)
      return s ? { ...defaultAuraSettings, ...JSON.parse(s) } : defaultAuraSettings
    } catch { return defaultAuraSettings }
  })

  const preset = auraSettings.enabled ? detectAuraPreset(activeSong) : 'default'
  const base = auraPresets[preset]

  const alphaScale = { low: 0.5, medium: 1, high: 1.7 }
  const scale = alphaScale[auraSettings.intensity]

  const config: AuraConfig = auraSettings.enabled
    ? { ...base, pulseSpeed: base.pulseSpeed }
    : auraPresets.default

  useEffect(() => {
    const root = document.documentElement
    if (!auraSettings.enabled) {
      root.style.setProperty('--aura-primary', 'rgba(0,0,0,0)')
      root.style.setProperty('--aura-secondary', 'rgba(0,0,0,0)')
      root.style.setProperty('--aura-glow', 'rgba(0,0,0,0)')
      root.style.setProperty('--aura-pulse', '4s')
      return
    }
    root.style.setProperty('--aura-primary', config.primary)
    root.style.setProperty('--aura-secondary', config.secondary)
    root.style.setProperty('--aura-glow', config.glow)
    root.style.setProperty('--aura-pulse', config.pulseSpeed)
  }, [preset, auraSettings.enabled, auraSettings.intensity, config])

  const updateAuraSettings = (partial: Partial<AuraSettings>) => {
    setAuraSettings(prev => {
      const next = { ...prev, ...partial }
      localStorage.setItem(AURA_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AuraContext.Provider value={{ preset, config, auraSettings, updateAuraSettings, setActiveSong }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useMusicAura() {
  const ctx = useContext(AuraContext)
  if (!ctx) throw new Error('useMusicAura must be inside MusicAuraProvider')
  return ctx
}
