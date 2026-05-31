import type { CuratedAuraPreset, CuratedAuraPresetId } from '../types/personalization'

/**
 * MUSVORA curated aura presets — hand-picked emotional atmospheres the user
 * can lock in. Distinct from the auto-detected genre auras in `lib/aura.tsx`:
 * those react to whatever's playing, these are *the user's chosen mood*.
 *
 * Every preset stays inside MUSVORA's cinematic design language — low
 * saturation, warm shadows, no neon. If a colour ever feels gamer-RGB or
 * Spotify-green, it does not belong in this list.
 */
export const curatedAuraPresets: Record<CuratedAuraPresetId, CuratedAuraPreset> = {
  bachata_amber: {
    id: 'bachata_amber',
    label: 'Bachata Amber',
    desc: 'Warm amber glow. Soft gold haze, like late summer.',
    primary:   'rgba(217,119,6,0.18)',
    secondary: 'rgba(255,180,80,0.10)',
    glow:      'rgba(217,119,6,0.24)',
    pulseSpeed:'4s',
    preview:   ['#1a0e02', '#d97706', '#ffb45a'],
  },
  midnight_noir: {
    id: 'midnight_noir',
    label: 'Midnight Noir',
    desc: 'Matte black with a violet whisper. Cinematic darkness.',
    primary:   'rgba(80,40,180,0.12)',
    secondary: 'rgba(40,20,80,0.08)',
    glow:      'rgba(110,60,200,0.16)',
    pulseSpeed:'5.5s',
    preview:   ['#050008', '#3a1f7a', '#7c4dd6'],
  },
  rainy_nyc: {
    id: 'rainy_nyc',
    label: 'Rainy NYC',
    desc: 'Cold blue haze. Reflections on wet asphalt.',
    primary:   'rgba(60,90,160,0.16)',
    secondary: 'rgba(80,120,180,0.10)',
    glow:      'rgba(80,140,220,0.18)',
    pulseSpeed:'6.5s',
    preview:   ['#04060e', '#3c5aa0', '#5d8fdc'],
  },
  studio_gold: {
    id: 'studio_gold',
    label: 'Studio Gold',
    desc: 'Warm studio lighting. Analogue tape, soft contrast.',
    primary:   'rgba(190,140,60,0.14)',
    secondary: 'rgba(220,180,100,0.09)',
    glow:      'rgba(200,150,70,0.18)',
    pulseSpeed:'4.5s',
    preview:   ['#0e0a02', '#be8c3c', '#dcb464'],
  },
  deep_crimson: {
    id: 'deep_crimson',
    label: 'Deep Crimson',
    desc: 'Dark wine tones. Emotional intensity, low saturation.',
    primary:   'rgba(140,30,50,0.16)',
    secondary: 'rgba(80,20,40,0.10)',
    glow:      'rgba(160,40,60,0.20)',
    pulseSpeed:'5s',
    preview:   ['#0e0205', '#8c1e32', '#c0344a'],
  },
  blue_violet: {
    id: 'blue_violet',
    label: 'Blue Violet',
    desc: 'Nostalgic mood. Cinematic softness, nighttime ambience.',
    primary:   'rgba(90,70,180,0.16)',
    secondary: 'rgba(120,80,200,0.10)',
    glow:      'rgba(110,90,220,0.20)',
    pulseSpeed:'5.5s',
    preview:   ['#06061a', '#5a46b4', '#8c7adc'],
  },
  dominican_nights: {
    id: 'dominican_nights',
    label: 'Dominican Nights',
    desc: 'Tropical warmth. Romantic amber, subtle nightlife pulse.',
    primary:   'rgba(220,100,40,0.18)',
    secondary: 'rgba(250,160,80,0.12)',
    glow:      'rgba(230,120,50,0.22)',
    pulseSpeed:'3.8s',
    preview:   ['#100604', '#dc6428', '#ffa050'],
  },
}

export const curatedAuraPresetOrder: CuratedAuraPresetId[] = [
  'bachata_amber', 'midnight_noir', 'rainy_nyc', 'studio_gold',
  'deep_crimson', 'blue_violet', 'dominican_nights',
]

/* ── Mood + Time-of-day mappings (used by Adaptive modes) ────── */

export function moodToCuratedPreset(mood: string | null | undefined): CuratedAuraPresetId {
  const m = (mood ?? '').toLowerCase()
  if (m.includes('romantic'))             return 'dominican_nights'
  if (m.includes('sad') || m.includes('amargue') || m.includes('nostalgic')) return 'blue_violet'
  if (m.includes('cinematic'))            return 'midnight_noir'
  if (m.includes('warm') || m.includes('intimate')) return 'bachata_amber'
  if (m.includes('night'))                return 'midnight_noir'
  if (m.includes('rain') || m.includes('cold')) return 'rainy_nyc'
  return 'studio_gold'
}

export function timeOfDayToCuratedPreset(date: Date = new Date()): CuratedAuraPresetId {
  const h = date.getHours()
  if (h < 5)  return 'midnight_noir'   // 00:00–04:59 — late night
  if (h < 9)  return 'rainy_nyc'        // 05:00–08:59 — early morning
  if (h < 12) return 'studio_gold'      // 09:00–11:59 — bright studio
  if (h < 17) return 'bachata_amber'    // 12:00–16:59 — afternoon warmth
  if (h < 20) return 'deep_crimson'     // 17:00–19:59 — golden hour
  if (h < 23) return 'dominican_nights' // 20:00–22:59 — nightlife
  return 'midnight_noir'                // 23:00–23:59 — late
}
