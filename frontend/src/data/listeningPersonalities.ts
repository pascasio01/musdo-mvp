import type { ListeningPersonality, ListeningPersonalityId } from '../types/personalization'

/**
 * Listening Personality Profiles™ — emotional listener identities.
 *
 * Each personality is a *bundle of curated defaults* the user can adopt in
 * one tap. Picking a personality applies aura preset + intensity + motion
 * style + atmosphere + adaptive mode + cover-art influence atomically.
 * The user can still tweak any individual setting afterwards (which clears
 * the personality flag and marks the profile as "Custom").
 */
export const listeningPersonalities: Record<ListeningPersonalityId, ListeningPersonality> = {
  warm_listener: {
    id: 'warm_listener',
    label: 'Warm Listener',
    desc: 'Softer highs, warm aura, intimate atmosphere.',
    defaults: {
      auraPreset: 'bachata_amber',
      auraIntensity: 'medium',
      motionStyle: 'smooth',
      playbackAtmosphere: 'intimate',
      adaptiveMode: 'song',
      coverArtInfluence: 0.4,
    },
  },
  studio_listener: {
    id: 'studio_listener',
    label: 'Studio Listener',
    desc: 'Flat surface, clean EQ, reduced motion.',
    defaults: {
      auraPreset: 'studio_gold',
      auraIntensity: 'low',
      motionStyle: 'minimal',
      playbackAtmosphere: 'studio',
      adaptiveMode: 'static',
      coverArtInfluence: 0.1,
    },
  },
  night_listener: {
    id: 'night_listener',
    label: 'Night Listener',
    desc: 'Darker surfaces, slower breathing, low brightness feel.',
    defaults: {
      auraPreset: 'midnight_noir',
      auraIntensity: 'low',
      motionStyle: 'smooth',
      playbackAtmosphere: 'night_drive',
      adaptiveMode: 'time',
      coverArtInfluence: 0.3,
    },
  },
  cinematic_listener: {
    id: 'cinematic_listener',
    label: 'Cinematic Listener',
    desc: 'Immersive transitions, atmospheric depth, smooth aura blending.',
    defaults: {
      auraPreset: 'blue_violet',
      auraIntensity: 'cinematic',
      motionStyle: 'immersive',
      playbackAtmosphere: 'cinematic',
      adaptiveMode: 'cinematic',
      coverArtInfluence: 0.7,
    },
  },
  dominican_nights: {
    id: 'dominican_nights',
    label: 'Dominican Nights',
    desc: 'Tropical cinematic glow. Romantic warmth, nightlife energy.',
    defaults: {
      auraPreset: 'dominican_nights',
      auraIntensity: 'high',
      motionStyle: 'atmospheric',
      playbackAtmosphere: 'cinematic',
      adaptiveMode: 'song',
      coverArtInfluence: 0.5,
    },
  },
}

export const listeningPersonalityOrder: ListeningPersonalityId[] = [
  'warm_listener', 'studio_listener', 'night_listener',
  'cinematic_listener', 'dominican_nights',
]
