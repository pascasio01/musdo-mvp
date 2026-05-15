import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ThemeId = 'oled' | 'studio' | 'bachata' | 'neon' | 'soft' | 'midnight'

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  preview: string[]
  vars: Record<string, string>
}

export const themes: ThemeConfig[] = [
  {
    id: 'oled',
    name: 'OLED Black',
    description: 'Pure black, infinite depth',
    preview: ['#000000', '#7c3aed', '#111111'],
    vars: {
      '--bg': '#000000',
      '--surface': '#0a0a0a',
      '--card': '#111111',
      '--text': '#ffffff',
      '--text-2': '#71717a',
      '--accent': '#7c3aed',
      '--accent-rgb': '124,58,237',
      '--border': 'rgba(255,255,255,0.08)',
      '--glow-color': 'rgba(124,58,237,0.18)',
      '--blur': '24px',
      '--radius': '18px',
      '--speed': '300ms',
    },
  },
  {
    id: 'studio',
    name: 'Studio Mode',
    description: 'Focus atmosphere, deep charcoal',
    preview: ['#0d0d10', '#2563eb', '#1a1a24'],
    vars: {
      '--bg': '#0d0d10',
      '--surface': '#13131a',
      '--card': '#1a1a24',
      '--text': '#f0f0f5',
      '--text-2': '#6b7080',
      '--accent': '#2563eb',
      '--accent-rgb': '37,99,235',
      '--border': 'rgba(255,255,255,0.07)',
      '--glow-color': 'rgba(37,99,235,0.15)',
      '--blur': '20px',
      '--radius': '14px',
      '--speed': '250ms',
    },
  },
  {
    id: 'bachata',
    name: 'Bachata Amber',
    description: 'Warm nights, Dominican soul',
    preview: ['#0c0800', '#d97706', '#1a1503'],
    vars: {
      '--bg': '#0c0800',
      '--surface': '#120f02',
      '--card': '#1a1503',
      '--text': '#fef3c7',
      '--text-2': '#a08060',
      '--accent': '#d97706',
      '--accent-rgb': '217,119,6',
      '--border': 'rgba(217,119,6,0.14)',
      '--glow-color': 'rgba(217,119,6,0.2)',
      '--blur': '28px',
      '--radius': '20px',
      '--speed': '350ms',
    },
  },
  {
    id: 'neon',
    name: 'Neon Noir',
    description: 'Electric darkness, sharp contrast',
    preview: ['#080008', '#a855f7', '#170017'],
    vars: {
      '--bg': '#080008',
      '--surface': '#100010',
      '--card': '#170017',
      '--text': '#f5f0ff',
      '--text-2': '#7c6b9e',
      '--accent': '#a855f7',
      '--accent-rgb': '168,85,247',
      '--border': 'rgba(168,85,247,0.14)',
      '--glow-color': 'rgba(168,85,247,0.22)',
      '--blur': '32px',
      '--radius': '12px',
      '--speed': '200ms',
    },
  },
  {
    id: 'soft',
    name: 'Soft Light',
    description: 'Clean, minimal, breathable',
    preview: ['#f8f7f5', '#7c3aed', '#e8e7e3'],
    vars: {
      '--bg': '#f8f7f5',
      '--surface': '#f0efec',
      '--card': '#e8e7e3',
      '--text': '#1a1916',
      '--text-2': '#78716c',
      '--accent': '#7c3aed',
      '--accent-rgb': '124,58,237',
      '--border': 'rgba(0,0,0,0.08)',
      '--glow-color': 'rgba(124,58,237,0.1)',
      '--blur': '20px',
      '--radius': '16px',
      '--speed': '280ms',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Calm',
    description: 'Deep navy, serene depth',
    preview: ['#02040e', '#6366f1', '#080d22'],
    vars: {
      '--bg': '#02040e',
      '--surface': '#050818',
      '--card': '#080d22',
      '--text': '#e8eaf6',
      '--text-2': '#5c6391',
      '--accent': '#6366f1',
      '--accent-rgb': '99,102,241',
      '--border': 'rgba(99,102,241,0.1)',
      '--glow-color': 'rgba(99,102,241,0.16)',
      '--blur': '24px',
      '--radius': '16px',
      '--speed': '320ms',
    },
  },
]

export interface ThemeSettings {
  themeId: ThemeId
  accentCustom: string | null
  blurIntensity: 'low' | 'medium' | 'high'
  glowIntensity: 'none' | 'low' | 'medium' | 'high'
  motionIntensity: 'reduced' | 'normal' | 'expressive'
  fontScale: number
  roundedLevel: 'sharp' | 'medium' | 'soft'
  ambientAnimation: boolean
  cinematicMode: boolean
  reduceMotion: boolean
}

const defaultSettings: ThemeSettings = {
  themeId: 'oled',
  accentCustom: null,
  blurIntensity: 'medium',
  glowIntensity: 'medium',
  motionIntensity: 'normal',
  fontScale: 1,
  roundedLevel: 'soft',
  ambientAnimation: true,
  cinematicMode: false,
  reduceMotion: false,
}

interface ThemeContextType {
  settings: ThemeSettings
  currentTheme: ThemeConfig
  setTheme: (id: ThemeId) => void
  updateSettings: (partial: Partial<ThemeSettings>) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const STORAGE_KEY = 'musdo-theme-v1'

function applyVars(settings: ThemeSettings) {
  const theme = themes.find(t => t.id === settings.themeId) ?? themes[0]
  const root = document.documentElement

  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))

  if (settings.accentCustom) root.style.setProperty('--accent', settings.accentCustom)

  const blurMap = { low: '12px', medium: '24px', high: '44px' }
  root.style.setProperty('--blur', blurMap[settings.blurIntensity])

  const glowAlpha = { none: '0', low: '0.07', medium: '0.16', high: '0.3' }
  root.style.setProperty('--glow-color', `rgba(${theme.vars['--accent-rgb']},${glowAlpha[settings.glowIntensity]})`)

  const radiusMap = { sharp: '8px', medium: '12px', soft: '20px' }
  root.style.setProperty('--radius', radiusMap[settings.roundedLevel])

  const speedMap = { reduced: '80ms', normal: '300ms', expressive: '500ms' }
  root.style.setProperty('--speed', speedMap[settings.motionIntensity])

  root.style.setProperty('--font-scale', String(settings.fontScale))
  document.body.style.background = theme.vars['--bg']
  document.body.classList.toggle('reduce-motion', settings.reduceMotion)
  document.body.classList.toggle('cinematic', settings.cinematicMode)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? { ...defaultSettings, ...JSON.parse(s) } : defaultSettings
    } catch { return defaultSettings }
  })

  useEffect(() => {
    applyVars(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const setTheme = (id: ThemeId) => setSettings(p => ({ ...p, themeId: id }))
  const updateSettings = (partial: Partial<ThemeSettings>) => setSettings(p => ({ ...p, ...partial }))
  const currentTheme = themes.find(t => t.id === settings.themeId) ?? themes[0]

  return (
    <ThemeContext.Provider value={{ settings, currentTheme, setTheme, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
