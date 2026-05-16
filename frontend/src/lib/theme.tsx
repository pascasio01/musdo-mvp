import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ThemeId = 'oled' | 'studio' | 'bachata' | 'neon' | 'soft' | 'midnight'

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  preview: string[]
  colorScheme: 'dark' | 'light'
  vars: Record<string, string>
}

export const themes: ThemeConfig[] = [
  {
    id: 'oled',
    name: 'OLED Black',
    description: 'Cinematic depth, layered black',
    preview: ['#09090B', '#7c3aed', '#18181D'],
    colorScheme: 'dark',
    vars: {
      // Layered surface system — micro-elevation from base → surface → card → elevated
      '--bg': '#09090B',
      '--surface': '#111113',
      '--card': '#141418',
      '--card-elevated': '#18181D',
      '--text': 'rgba(255,255,255,0.96)',
      '--text-2': 'rgba(255,255,255,0.48)',
      '--accent': '#7c3aed',
      '--accent-rgb': '124,58,237',
      '--border': 'rgba(255,255,255,0.08)',
      '--border-soft': 'rgba(255,255,255,0.06)',
      '--glow-color': 'rgba(124,58,237,0.14)',
      '--blur': '24px',
      '--radius': '18px',
      '--speed': '300ms',
      '--text-primary': 'rgba(255,255,255,0.96)',
      '--text-secondary': 'rgba(255,255,255,0.72)',
      '--text-muted': 'rgba(255,255,255,0.48)',
      '--text-inverse': '#09090B',
      '--accent-soft': 'rgba(124,58,237,0.10)',
      // Cinematic ambient shadows — softer, longer
      '--shadow': 'rgba(0,0,0,0.6)',
      '--glass-bg': 'rgba(255,255,255,0.035)',
      '--glass-bg-medium': 'rgba(255,255,255,0.07)',
      '--glass-bg-strong': 'rgba(255,255,255,0.11)',
      '--glass-border': 'rgba(255,255,255,0.08)',
      '--glass-subtle': 'rgba(255,255,255,0.02)',
      '--overlay': 'rgba(9,9,11,0.78)',
      '--overlay-soft': 'rgba(9,9,11,0.5)',
    },
  },
  {
    id: 'studio',
    name: 'Studio Mode',
    description: 'Focus atmosphere, layered charcoal',
    preview: ['#0E0E13', '#2563eb', '#1C1C24'],
    colorScheme: 'dark',
    vars: {
      '--bg': '#0E0E13',
      '--surface': '#14141B',
      '--card': '#1A1A22',
      '--card-elevated': '#22222C',
      '--text': 'rgba(240,240,245,0.96)',
      '--text-2': 'rgba(240,240,245,0.48)',
      '--accent': '#2563eb',
      '--accent-rgb': '37,99,235',
      '--border': 'rgba(255,255,255,0.08)',
      '--border-soft': 'rgba(255,255,255,0.06)',
      '--glow-color': 'rgba(37,99,235,0.13)',
      '--blur': '20px',
      '--radius': '14px',
      '--speed': '250ms',
      '--text-primary': 'rgba(240,240,245,0.96)',
      '--text-secondary': 'rgba(240,240,245,0.72)',
      '--text-muted': 'rgba(240,240,245,0.48)',
      '--text-inverse': '#08080C',
      '--accent-soft': 'rgba(37,99,235,0.10)',
      '--shadow': 'rgba(0,0,0,0.55)',
      '--glass-bg': 'rgba(255,255,255,0.035)',
      '--glass-bg-medium': 'rgba(255,255,255,0.07)',
      '--glass-bg-strong': 'rgba(255,255,255,0.11)',
      '--glass-border': 'rgba(255,255,255,0.08)',
      '--glass-subtle': 'rgba(255,255,255,0.02)',
      '--overlay': 'rgba(14,14,19,0.78)',
      '--overlay-soft': 'rgba(14,14,19,0.5)',
    },
  },
  {
    id: 'bachata',
    name: 'Bachata Amber',
    description: 'Warm nights, Dominican soul',
    preview: ['#0c0800', '#d97706', '#1a1503'],
    colorScheme: 'dark',
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
      '--text-primary': '#fef3c7',
      '--text-secondary': '#c4a87a',
      '--text-muted': '#a08060',
      '--text-inverse': '#0c0800',
      '--card-elevated': '#22180a',
      '--border-soft': 'rgba(217,119,6,0.07)',
      '--accent-soft': 'rgba(217,119,6,0.12)',
      '--shadow': 'rgba(0,0,0,0.5)',
      '--glass-bg': 'rgba(255,248,220,0.04)',
      '--glass-bg-medium': 'rgba(255,248,220,0.07)',
      '--glass-bg-strong': 'rgba(255,248,220,0.12)',
      '--glass-border': 'rgba(217,119,6,0.14)',
      '--glass-subtle': 'rgba(255,248,220,0.025)',
      '--overlay': 'rgba(0,0,0,0.72)',
      '--overlay-soft': 'rgba(0,0,0,0.4)',
    },
  },
  {
    id: 'neon',
    name: 'Neon Noir',
    description: 'Electric darkness, layered violet',
    preview: ['#0B080F', '#a855f7', '#1A1320'],
    colorScheme: 'dark',
    vars: {
      '--bg': '#0B080F',
      '--surface': '#13101A',
      '--card': '#1A1320',
      '--text': '#f5f0ff',
      '--text-2': '#7c6b9e',
      '--accent': '#a855f7',
      '--accent-rgb': '168,85,247',
      '--border': 'rgba(168,85,247,0.14)',
      '--glow-color': 'rgba(168,85,247,0.22)',
      '--blur': '32px',
      '--radius': '12px',
      '--speed': '200ms',
      '--text-primary': 'rgba(245,240,255,0.96)',
      '--text-secondary': 'rgba(245,240,255,0.72)',
      '--text-muted': 'rgba(245,240,255,0.48)',
      '--text-inverse': '#08050C',
      '--card-elevated': '#231929',
      '--border-soft': 'rgba(168,85,247,0.10)',
      '--accent-soft': 'rgba(168,85,247,0.12)',
      '--shadow': 'rgba(0,0,0,0.65)',
      '--glass-bg': 'rgba(240,224,255,0.03)',
      '--glass-bg-medium': 'rgba(240,224,255,0.07)',
      '--glass-bg-strong': 'rgba(240,224,255,0.12)',
      '--glass-border': 'rgba(168,85,247,0.14)',
      '--glass-subtle': 'rgba(240,224,255,0.02)',
      '--overlay': 'rgba(11,8,15,0.80)',
      '--overlay-soft': 'rgba(11,8,15,0.52)',
    },
  },
  {
    id: 'soft',
    name: 'Soft Light',
    description: 'Clean, minimal, breathable',
    preview: ['#f8f7f5', '#7c3aed', '#e8e7e3'],
    colorScheme: 'light',
    vars: {
      '--bg': '#f8f7f5',
      '--surface': '#f0efec',
      '--card': '#e9e8e4',
      '--text': '#1a1916',
      '--text-2': '#78716c',
      '--accent': '#7c3aed',
      '--accent-rgb': '124,58,237',
      '--border': 'rgba(0,0,0,0.1)',
      '--glow-color': 'rgba(124,58,237,0.12)',
      '--blur': '20px',
      '--radius': '16px',
      '--speed': '280ms',
      '--text-primary': '#1a1916',
      '--text-secondary': '#57534e',
      '--text-muted': '#78716c',
      '--text-inverse': '#ffffff',
      '--card-elevated': '#ffffff',
      '--border-soft': 'rgba(0,0,0,0.05)',
      '--accent-soft': 'rgba(124,58,237,0.08)',
      '--shadow': 'rgba(0,0,0,0.08)',
      '--glass-bg': 'rgba(0,0,0,0.04)',
      '--glass-bg-medium': 'rgba(0,0,0,0.07)',
      '--glass-bg-strong': 'rgba(0,0,0,0.12)',
      '--glass-border': 'rgba(0,0,0,0.1)',
      '--glass-subtle': 'rgba(0,0,0,0.025)',
      '--overlay': 'rgba(0,0,0,0.45)',
      '--overlay-soft': 'rgba(0,0,0,0.25)',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Calm',
    description: 'Deep navy, layered serenity',
    preview: ['#070A18', '#6366f1', '#101736'],
    colorScheme: 'dark',
    vars: {
      '--bg': '#070A18',
      '--surface': '#0C1124',
      '--card': '#101736',
      '--card-elevated': '#171F44',
      '--text': 'rgba(232,234,246,0.96)',
      '--text-2': 'rgba(232,234,246,0.48)',
      '--accent': '#6366f1',
      '--accent-rgb': '99,102,241',
      '--border': 'rgba(99,102,241,0.12)',
      '--border-soft': 'rgba(99,102,241,0.07)',
      '--glow-color': 'rgba(99,102,241,0.14)',
      '--blur': '24px',
      '--radius': '16px',
      '--speed': '320ms',
      '--text-primary': 'rgba(232,234,246,0.96)',
      '--text-secondary': 'rgba(232,234,246,0.72)',
      '--text-muted': 'rgba(232,234,246,0.48)',
      '--text-inverse': '#03050E',
      '--accent-soft': 'rgba(99,102,241,0.10)',
      '--shadow': 'rgba(0,0,0,0.55)',
      '--glass-bg': 'rgba(200,210,255,0.03)',
      '--glass-bg-medium': 'rgba(200,210,255,0.06)',
      '--glass-bg-strong': 'rgba(200,210,255,0.1)',
      '--glass-border': 'rgba(99,102,241,0.1)',
      '--glass-subtle': 'rgba(200,210,255,0.02)',
      '--overlay': 'rgba(0,0,0,0.72)',
      '--overlay-soft': 'rgba(0,0,0,0.42)',
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

  const accentRgb = settings.accentCustom
    ? hexToRgb(settings.accentCustom) ?? theme.vars['--accent-rgb']
    : theme.vars['--accent-rgb']
  const glowAlpha = { none: '0', low: '0.07', medium: '0.16', high: '0.3' }
  root.style.setProperty('--glow-color', `rgba(${accentRgb},${glowAlpha[settings.glowIntensity]})`)

  const radiusMap = { sharp: '8px', medium: '12px', soft: '20px' }
  root.style.setProperty('--radius', radiusMap[settings.roundedLevel])

  const speedMap = { reduced: '80ms', normal: '300ms', expressive: '500ms' }
  root.style.setProperty('--speed', speedMap[settings.motionIntensity])

  root.style.setProperty('--font-scale', String(settings.fontScale))

  document.body.style.background = theme.vars['--bg']
  document.body.style.color = theme.vars['--text-primary']
  document.body.classList.toggle('reduce-motion', settings.reduceMotion)
  document.body.classList.toggle('cinematic', settings.cinematicMode)

  root.dataset.colorScheme = theme.colorScheme
}

function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
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
