export const moodChips = [
  'Rainy NYC Nights',
  'Late Night Bachata',
  'Heartbreak Healing',
  'Guitar & Whiskey',
  'Dominican Classics',
  'Deep Lyrics',
  'Romantic Rooftop',
  'Emotional Drive',
  'Studio Session',
  'Soft Nostalgia',
]

export interface MusicScene {
  id: string
  name: string
  description: string
  tags: string[]
  accentColor: string
  gradient: string
  icon: string
}

export const musicScenes: MusicScene[] = [
  {
    id: 'cabaret-bachata',
    name: 'Cabaret Bachata',
    description: 'Warm amber nights, requinto in the dark',
    tags: ['bachata', 'romantic', 'live'],
    accentColor: '#d97706',
    gradient: 'from-amber-900/50 to-zinc-950',
    icon: '🎸',
  },
  {
    id: 'rainy-night',
    name: 'Rainy Night',
    description: 'Soft blue haze, cinematic stillness',
    tags: ['chill', 'atmospheric', 'cinematic'],
    accentColor: '#3b82f6',
    gradient: 'from-blue-900/50 to-zinc-950',
    icon: '🌧',
  },
  {
    id: '2am-studio',
    name: '2AM Studio',
    description: 'Low light, maximum focus, create',
    tags: ['studio', 'focus', 'late night'],
    accentColor: '#6366f1',
    gradient: 'from-indigo-900/50 to-zinc-950',
    icon: '🎛',
  },
]

export interface AIResult {
  type: 'song' | 'playlist' | 'creator' | 'scene'
  id: string
  title: string
  subtitle: string
  tags: string[]
  gradient: string
}

const resultSets: Record<string, AIResult[]> = {
  'Late Night Bachata': [
    { type: 'song', id: 's1', title: 'Entre Sombras', subtitle: 'Bachata · 78 BPM · Sensual', tags: ['requinto', 'romantic', 'deep'], gradient: 'from-amber-900 to-zinc-900' },
    { type: 'playlist', id: 'p1', title: 'Madrugada Bachata', subtitle: '14 songs · 52 min', tags: ['late night', 'emotional'], gradient: 'from-rose-900 to-zinc-900' },
    { type: 'creator', id: 'c1', title: 'Pascasio Emmanuel', subtitle: 'Composer · Bachata Soul', tags: ['verified', 'Dominican'], gradient: 'from-violet-900 to-zinc-900' },
  ],
  'Heartbreak Healing': [
    { type: 'song', id: 's2', title: 'Cicatriz de Amor', subtitle: 'Romantic Ballad · 68 BPM', tags: ['heartbreak', 'acoustic', 'healing'], gradient: 'from-blue-900 to-zinc-900' },
    { type: 'playlist', id: 'p2', title: 'Healing in Silence', subtitle: '18 songs · 1h 8min', tags: ['emotional', 'slow'], gradient: 'from-indigo-900 to-zinc-900' },
  ],
  'Dominican Classics': [
    { type: 'song', id: 's3', title: 'Tierra Mía', subtitle: 'Merengue Típico · 145 BPM', tags: ['merengue', 'classic', 'Dominican'], gradient: 'from-amber-800 to-zinc-900' },
    { type: 'playlist', id: 'p3', title: 'Raíces RD', subtitle: '22 songs · 1h 30min', tags: ['Dominican', 'classic', 'authentic'], gradient: 'from-orange-900 to-zinc-900' },
  ],
  'Rainy NYC Nights': [
    { type: 'scene', id: 'sc1', title: 'Rainy Night Scene', subtitle: 'Soft blue haze · Cinematic', tags: ['atmospheric', 'chill'], gradient: 'from-blue-900 to-zinc-950' },
    { type: 'playlist', id: 'p4', title: 'NYC After Rain', subtitle: '11 songs · 44 min', tags: ['soul', 'atmospheric', 'urban'], gradient: 'from-slate-800 to-zinc-900' },
  ],
  'Studio Session': [
    { type: 'scene', id: 'sc2', title: '2AM Studio', subtitle: 'Maximum focus · Create', tags: ['studio', 'focus'], gradient: 'from-indigo-900 to-zinc-950' },
    { type: 'playlist', id: 'p5', title: 'Session Mode', subtitle: '20 songs · 1h 15min', tags: ['focus', 'create', 'instrumental'], gradient: 'from-violet-900 to-zinc-900' },
  ],
}

export function getAIResults(query: string): AIResult[] {
  const key = Object.keys(resultSets).find(k => k.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(k.toLowerCase()))
  if (key) return resultSets[key]
  return [
    { type: 'playlist', id: 'default1', title: 'Curated for You', subtitle: 'Based on your feeling', tags: ['personal', 'discovery'], gradient: 'from-violet-900 to-zinc-900' },
    { type: 'song', id: 'default2', title: 'Feeling Discovered', subtitle: 'MUSDO AI · Emotional Match', tags: ['ai', 'discovery'], gradient: 'from-blue-900 to-zinc-900' },
  ]
}

export const discoveryPlaceholders = [
  'Describe the feeling…',
  'Find the sound for tonight…',
  'What do you want to feel?',
]
