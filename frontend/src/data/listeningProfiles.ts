import type { ListeningProfile, ListeningProfileId } from '../types/audio'

export const listeningProfiles: Record<ListeningProfileId, ListeningProfile> = {
  quiet_room:   { id: 'quiet_room',   label: 'Quiet Room',   desc: 'Detail-first. Low compression, full dynamics.',                     volumeLimit: 0.85, bassSafety: 0.7, trebleSoftness: 0.3, awarenessLevel: 0.0, compression: 0.1, fatigueProtection: 0.4 },
  street:       { id: 'street',       label: 'Street',       desc: 'Outdoor presence with a lean low-end so traffic stays audible.',   volumeLimit: 0.75, bassSafety: 0.55, trebleSoftness: 0.4, awarenessLevel: 0.7, compression: 0.4, fatigueProtection: 0.5 },
  subway:       { id: 'subway',       label: 'Subway',       desc: 'Cuts through low rumble without overdriving your ears.',           volumeLimit: 0.8,  bassSafety: 0.5,  trebleSoftness: 0.3, awarenessLevel: 0.4, compression: 0.55, fatigueProtection: 0.6 },
  car:          { id: 'car',          label: 'Car',          desc: 'Cabin-tuned. Wider stereo, controlled lows.',                       volumeLimit: 0.8,  bassSafety: 0.45, trebleSoftness: 0.45, awarenessLevel: 0.3, compression: 0.45, fatigueProtection: 0.5 },
  gym:          { id: 'gym',          label: 'Gym',          desc: 'Body-feel bass and a steady, confident push.',                      volumeLimit: 0.85, bassSafety: 0.35, trebleSoftness: 0.4, awarenessLevel: 0.5, compression: 0.55, fatigueProtection: 0.4 },
  night:        { id: 'night',        label: 'Night',        desc: 'Softened highs, gentle floor. Easy on tired ears.',                  volumeLimit: 0.6,  bassSafety: 0.65, trebleSoftness: 0.7, awarenessLevel: 0.2, compression: 0.3, fatigueProtection: 0.85 },
  studio_check: { id: 'studio_check', label: 'Studio Check', desc: 'Reference flat. For composers reviewing their own work.',            volumeLimit: 0.9,  bassSafety: 0.85, trebleSoftness: 0.1, awarenessLevel: 0.0, compression: 0.0, fatigueProtection: 0.3 },
}

export const listeningProfileOrder: ListeningProfileId[] = [
  'quiet_room', 'street', 'subway', 'car', 'gym', 'night', 'studio_check',
]
