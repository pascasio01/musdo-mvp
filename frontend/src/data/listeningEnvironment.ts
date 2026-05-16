import type { ListeningEnvironment, ListeningEnvironmentId } from '../types/audio'

export const listeningEnvironments: Record<ListeningEnvironmentId, ListeningEnvironment> = {
  quiet_room:      { id: 'quiet_room',      label: 'Quiet Room',      desc: 'Detail-first. Music as a private experience.',           eqSoftness: 0.2, spatialWidth: 0.45, vocalClarity: 0.55, awarenessLevel: 0.0, bassIntensity: 0.5,  compression: 0.1 },
  nyc_street:      { id: 'nyc_street',      label: 'NYC Street',      desc: 'Cut through city noise without sacrificing safety.',     eqSoftness: 0.3, spatialWidth: 0.55, vocalClarity: 0.7,  awarenessLevel: 0.75, bassIntensity: 0.45, compression: 0.45 },
  subway:          { id: 'subway',          label: 'Subway',          desc: 'Low rumble compensated; trebles softened.',              eqSoftness: 0.55, spatialWidth: 0.4,  vocalClarity: 0.65, awarenessLevel: 0.4,  bassIntensity: 0.4,  compression: 0.6 },
  car_ride:        { id: 'car_ride',        label: 'Car Ride',        desc: 'Cabin-tuned warmth. Stereo opens with the road.',       eqSoftness: 0.4, spatialWidth: 0.6,  vocalClarity: 0.55, awarenessLevel: 0.3,  bassIntensity: 0.55, compression: 0.5 },
  airplane:        { id: 'airplane',        label: 'Airplane',        desc: 'Compensates for engine drone. Easy on the ears.',        eqSoftness: 0.6, spatialWidth: 0.5,  vocalClarity: 0.7,  awarenessLevel: 0.1,  bassIntensity: 0.35, compression: 0.55 },
  gym:             { id: 'gym',             label: 'Gym',             desc: 'Body-feel bass with a steady, confident push.',          eqSoftness: 0.25, spatialWidth: 0.5,  vocalClarity: 0.5,  awarenessLevel: 0.5,  bassIntensity: 0.75, compression: 0.55 },
  studio_session:  { id: 'studio_session',  label: 'Studio Session',  desc: 'Flat reference. Truthful to the master.',                 eqSoftness: 0.05, spatialWidth: 0.5,  vocalClarity: 0.4,  awarenessLevel: 0.0,  bassIntensity: 0.5,  compression: 0.05 },
  night_listening: { id: 'night_listening', label: 'Night Listening', desc: 'Lowered ceiling, softened highs, deeper floor.',         eqSoftness: 0.65, spatialWidth: 0.45, vocalClarity: 0.55, awarenessLevel: 0.15, bassIntensity: 0.6,  compression: 0.3 },
  rainy_night:     { id: 'rainy_night',     label: 'Rainy Night',     desc: 'Cinematic, slow-motion mood. Wide reverbs, soft top-end.', eqSoftness: 0.55, spatialWidth: 0.7,  vocalClarity: 0.5,  awarenessLevel: 0.1,  bassIntensity: 0.55, compression: 0.25 },
}

export const listeningEnvironmentOrder: ListeningEnvironmentId[] = [
  'quiet_room', 'nyc_street', 'subway', 'car_ride', 'airplane',
  'gym', 'studio_session', 'night_listening', 'rainy_night',
]
