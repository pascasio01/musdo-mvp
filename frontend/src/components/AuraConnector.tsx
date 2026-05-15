import { useEffect } from 'react'
import { usePlayer } from '../lib/player'
import { useMusicAura } from '../lib/aura'

/**
 * Small invisible connector that bridges the PlayerProvider's currently
 * active song into the MusicAuraProvider. Both providers exist independently;
 * this component wires them together so aura reacts to track changes.
 *
 * Mounted once inside the provider tree.
 */
export default function AuraConnector() {
  const { song } = usePlayer()
  const { setActiveSong } = useMusicAura()

  useEffect(() => {
    setActiveSong(song)
  }, [song, setActiveSong])

  return null
}
