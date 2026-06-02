---
name: Player transport (shuffle/repeat/auto-advance)
description: How queue advance, shuffle and repeat are wired in the PlayerContext
---

# Player transport logic

Auto-advance is centralized: a single `endRef` (ref to `handleEnd`) is invoked by
BOTH the real `<audio>` `'ended'` listener AND the simulation-completion path
(used when `audio.play()` is rejected and playback is faked). Never duplicate
advance logic in those two places again — route everything through `endRef`.

A pure `nextIndex(state, direction)` resolver decides the next queue index:
- linear: repeat `'off'` returns null at the ends (stop), `'all'` wraps.
- shuffle: always a different random index → **continuous play, never stops**
  (this is intentional product behavior, mirrors Spotify-style shuffle).
- repeat `'one'` is handled in `handleEnd` (replay current), not in `nextIndex`.

**Why:** before this, the `'ended'` listener and the simulation path each had their
own ad-hoc "queueIndex + 1" advance, which diverged and ignored shuffle/repeat.

**How to apply:** when changing playback transitions, edit `handleEnd`/`nextIndex`
in `frontend/src/lib/player.tsx`, not the individual event handlers. UI controls
(Player.tsx Shuffle/Repeat) only call `toggleShuffle`/`cycleRepeat`.
