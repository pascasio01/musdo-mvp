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
    description: 'Pure black, infinite depth',
    preview: ['#000000', '#7c3aed', '#111111'],
    colorScheme: 'dark',
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
      '--text-primary': '#ffffff',
      '--text-secondary': '#a1a1aa',
      '--text-muted': '#71717a',
      '--text-inverse': '#000000',
      '--card-elevated': '#1c1c1c',
      '--border-soft': 'rgba(255,255,255,0.04)',
      '--accent-soft': 'rgba(124,58,237,0.12)',
      '--shadow': 'rgba(0,0,0,0.5)',
      '--glass-bg': 'rgba(255,255,255,0.04)',
      '--glass-bg-medium': 'rgba(255,255,255,0.08)',
      '--glass-bg-strong': 'rgba(255,255,255,0.13)',
      '--glass-border': 'rgba(255,255,255,0.08)',
      '--glass-subtle': 'rgba(255,255,255,0.025)',
      '--overlay': 'rgba(0,0,0,0.72)',
      '--overlay-soft': 'rgba(0,0,0,0.45)',
    },
  },
  {
    id: 'studio',
    name: 'Studio Mode',
    description: 'Focus atmosphere, deep charcoal',
    preview: ['#0d0d10', '#2563eb', '#1a1a24'],
    colorScheme: 'dark',
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
      '--text-primary': '#f0f0f5',
      '--text-secondary': '#9da0b0',
      '--text-muted': '#6b7080',
      '--text-inverse': '#050508',
      '--card-elevated': '#222230',
      '--border-soft': 'rgba(255,255,255,0.04)',
      '--accent-soft': 'rgba(37,99,235,0.12)',
      '--shadow': 'rgba(0,0,0,0.45)',
      '--glass-bg': 'rgba(255,255,255,0.04)',
      '--glass-bg-medium': 'rgba(255,255,255,0.07)',
      '--glass-bg-strong': 'rgba(255,255,255,0.12)',
      '--glass-border': 'rgba(255,255,255,0.07)',
      '--glass-subtle': 'rgba(255,255,255,0.02)',
      '--overlay': 'rgba(0,0,0,0.72)',
      '--overlay-soft': 'rgba(0,0,0,0.4)',
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
    description: 'Electric darkness, sharp contrast',
    preview: ['#080008', '#a855f7', '#170017'],
    colorScheme: 'dark',
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
      '--text-primary': '#f5f0ff',
      '--text-secondary': '#b0a0d0',
      '--text-muted': '#7c6b9e',
      '--text-inverse': '#040004',
      '--card-elevated': '#200020',
      '--border-soft': 'rgba(168,85,247,0.07)',
      '--accent-soft': 'rgba(168,85,247,0.14)',
      '--shadow': 'rgba(0,0,0,0.6)',
      '--glass-bg': 'rgba(240,224,255,0.03)',
      '--glass-bg-medium': 'rgba(240,224,255,0.07)',
      '--glass-bg-strong': 'rgba(240,224,255,0.12)',
      '--glass-border': 'rgba(168,85,247,0.14)',
      '--glass-subtle': 'rgba(240,224,255,0.02)',
      '--overlay': 'rgba(0,0,0,0.78)',
      '--overlay-soft': 'rgba(0,0,0,0.5)',
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
    description: 'Deep navy, serene depth',
    preview: ['#02040e', '#6366f1', '#080d22'],
    colorScheme: 'dark',
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
      '--text-primary': '#e8eaf6',
      '--text-secondary': '#9498c8',
      '--text-muted': '#5c6391',
      '--text-inverse': '#010308',
      '--card-elevated': '#0e1430',
      '--border-soft': 'rgba(99,102,241,0.05)',
      '--accent-soft': 'rgba(99,102,241,0.12)',
      '--shadow': 'rgba(0,0,0,0.5)',
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
