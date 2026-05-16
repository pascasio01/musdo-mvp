import type { SpatialMode, SpatialModeId } from '../types/audio'

export const spatialModes: Record<SpatialModeId, SpatialMode> = {
  intimate:  { id: 'intimate',  label: 'Intimate',  desc: 'Vocals close, room narrow. Headphones-on-pillow feeling.',         width: 0.25, depth: 0.35 },
  wide:      { id: 'wide',      label: 'Wide',      desc: 'Open stereo image without losing the centre.',                      width: 0.65, depth: 0.45 },
  cinematic: { id: 'cinematic', label: 'Cinematic', desc: 'Theatrical depth. Reverbs breathe further out.',                    width: 0.75, depth: 0.85 },
  studio:    { id: 'studio',    label: 'Studio',    desc: 'Reference. Mix as the engineer hears it in the control room.',     width: 0.5,  depth: 0.5 },
  live_room: { id: 'live_room', label: 'Live Room', desc: 'A small venue with the band a few rows in front of you.',           width: 0.6,  depth: 0.7 },
}

export const spatialModeOrder: SpatialModeId[] = [
  'intimate', 'wide', 'cinematic', 'studio', 'live_room',
]
