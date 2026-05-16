import type { PlaybackAtmosphere, PlaybackAtmosphereId } from '../types/personalization'

/**
 * MUSDO Playback Atmospheres — premium spatial vibes.
 *
 * MVP: width/depth are mock values surfaced only for the UI and persisted
 * for future DSP wiring (StereoPannerNode + convolver). They do not alter
 * playback today. The aim is to let users *describe how they want music to
 * feel*, not give them an EQ knob.
 */
export const playbackAtmospheres: Record<PlaybackAtmosphereId, PlaybackAtmosphere> = {
  intimate:    { id: 'intimate',    label: 'Intimate',    desc: 'Vocals close. Headphones-on-pillow.',                    width: 0.25, depth: 0.35 },
  studio:      { id: 'studio',      label: 'Studio',      desc: 'Reference. The mix as the engineer hears it.',           width: 0.5,  depth: 0.5  },
  wide:        { id: 'wide',        label: 'Wide',        desc: 'Open stereo image without losing the centre.',           width: 0.7,  depth: 0.5  },
  cinematic:   { id: 'cinematic',   label: 'Cinematic',   desc: 'Theatrical depth. Reverbs breathe further out.',         width: 0.75, depth: 0.85 },
  night_drive: { id: 'night_drive', label: 'Night Drive', desc: 'Soft top-end, deep floor. Late-night cabin tuning.',     width: 0.6,  depth: 0.7  },
}

export const playbackAtmosphereOrder: PlaybackAtmosphereId[] = [
  'intimate', 'studio', 'wide', 'cinematic', 'night_drive',
]
