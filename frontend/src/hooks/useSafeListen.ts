import { useAudioIntelligence } from '../lib/audioIntelligence'
import type { SafeListenSettings, AwarenessSettings } from '../types/audioSafety'

/**
 * Read & write SafeListen™ + Awareness settings.
 *
 * The actual volume-cap enforcement lives inside <SafeListenEnforcer> mounted
 * by AudioIntelligenceProvider — this hook is purely the settings facade.
 */
export function useSafeListen(): {
  settings: SafeListenSettings
  update: (patch: Partial<SafeListenSettings>) => void
  awareness: AwarenessSettings
  updateAwareness: (patch: Partial<AwarenessSettings>) => void
} {
  const { safe, setSafe, awareness, setAwareness } = useAudioIntelligence()
  return {
    settings: safe,
    update: setSafe,
    awareness,
    updateAwareness: setAwareness,
  }
}
