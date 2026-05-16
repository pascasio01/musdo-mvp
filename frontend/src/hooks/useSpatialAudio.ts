import { useAudioIntelligence } from '../lib/audioIntelligence'
import { spatialModes } from '../data/spatialProfiles'
import { listeningEnvironments } from '../data/listeningEnvironment'
import type { SpatialMode, ListeningEnvironment } from '../types/audio'

/**
 * Adaptive Spatial Listening™ facade.
 *
 * MVP: no actual spatialization. Settings are persisted and exposed for
 * future StereoPannerNode / convolver-based reverb wiring.
 */
export function useSpatialAudio(): {
  settings: ReturnType<typeof useAudioIntelligence>['spatial']
  update: ReturnType<typeof useAudioIntelligence>['setSpatial']
  activeMode: SpatialMode
  activeEnvironment: ListeningEnvironment
} {
  const { spatial, setSpatial } = useAudioIntelligence()
  return {
    settings: spatial,
    update: setSpatial,
    activeMode: spatialModes[spatial.mode],
    activeEnvironment: listeningEnvironments[spatial.environment],
  }
}
