import { useEffect, useMemo, useRef, useState } from 'react'
import type { LyricsTrack, SyncedLyric } from '../types'

interface UseLyricsSyncResult {
  /** index into `track.synced` of the currently active line, or -1 */
  activeIndex: number
  activeLine: SyncedLyric | null
  /** progress 0..1 from current line's start to the next line's start */
  lineProgress: number
  hasSynced: boolean
}

/**
 * Time-coded lyric synchronisation driven by the global player's `elapsed`.
 *
 * Performance:
 *  - The active index is recomputed on every `elapsed` tick (binary search,
 *    O(log n)), but we only call `setActiveIndex` when it actually changes.
 *    That keeps re-renders bound to ~once per lyric line, not per frame.
 *  - `lineProgress` is exposed for very subtle visual interpolation; consumers
 *    should subscribe to it sparingly (it does change every tick).
 */
export function useLyricsSync(
  track: LyricsTrack | null,
  elapsedSec: number,
): UseLyricsSyncResult {
  const lines = track?.synced
  const hasSynced = !!(lines && lines.length > 0)

  const [activeIndex, setActiveIndex] = useState(-1)
  const indexRef = useRef(-1)

  // Reset when the track changes
  useEffect(() => {
    indexRef.current = -1
    setActiveIndex(-1)
  }, [track?.song_id])

  useEffect(() => {
    if (!lines || lines.length === 0) return

    // Binary search for the largest index whose time <= elapsed
    let lo = 0
    let hi = lines.length - 1
    let idx = -1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (lines[mid].time <= elapsedSec) {
        idx = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }

    if (idx !== indexRef.current) {
      indexRef.current = idx
      setActiveIndex(idx)
    }
  }, [elapsedSec, lines])

  const lineProgress = useMemo(() => {
    if (!lines || activeIndex < 0) return 0
    const cur = lines[activeIndex]
    const next = lines[activeIndex + 1]
    if (!next) return 0
    const span = next.time - cur.time
    if (span <= 0) return 0
    return Math.max(0, Math.min(1, (elapsedSec - cur.time) / span))
  }, [lines, activeIndex, elapsedSec])

  const activeLine = activeIndex >= 0 && lines ? lines[activeIndex] : null

  return { activeIndex, activeLine, lineProgress, hasSynced }
}
