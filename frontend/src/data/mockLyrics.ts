import type { LyricsTrack } from '../types'

/**
 * Mock cinematic lyrics for the StudioView.
 * Time values are seconds from track start. Lines are sorted ascending.
 * `intensity` (0..1) drives only very subtle glow modulation in LyricsPanel —
 * never aggressive flashes.
 */
export const mockLyrics: Record<string, LyricsTrack> = {
  '0': {
    song_id: '0',
    language: 'es',
    plain:
      'Compréndeme, no es tan fácil olvidar\nQue tus manos eran mi lugar\nY ahora todo sabe a soledad',
    writer_notes:
      'Escrita en una madrugada de enero. La idea: pedir comprensión sin pedir regreso.',
    emotional_tags: ['longing', 'tender', 'aching'],
    synced: [
      { time: 0,    text: '— Verso —', section: 'verse',  intensity: 0.15 },
      { time: 4,    text: 'Compréndeme,', emotion: 'longing',     intensity: 0.45 },
      { time: 8.2,  text: 'no es tan fácil olvidar',             emotion: 'aching',  intensity: 0.55 },
      { time: 13.0, text: 'que tus manos eran mi lugar',         emotion: 'tender',  intensity: 0.62 },
      { time: 18.5, text: 'y ahora todo sabe a soledad',         emotion: 'bittersweet', intensity: 0.7 },
      { time: 24.0, text: '— Coro —', section: 'chorus', intensity: 0.2 },
      { time: 26.0, text: 'Si te vuelvo a ver,',                 emotion: 'hopeful', intensity: 0.6 },
      { time: 30.0, text: 'no me prometas nada',                 emotion: 'reflective', intensity: 0.5 },
      { time: 34.0, text: 'sólo dime que entendiste',            emotion: 'intimate', intensity: 0.65 },
      { time: 38.0, text: 'lo que dejaste cuando te marchaste',  emotion: 'aching',  intensity: 0.78 },
      { time: 44.0, text: 'compréndeme…',                        emotion: 'longing', intensity: 0.55 },
      { time: 50.0, text: '— Puente —', section: 'bridge', intensity: 0.2 },
      { time: 52.0, text: 'No te pido el regreso,',              emotion: 'reflective', intensity: 0.5 },
      { time: 56.5, text: 'sólo el silencio en paz',             emotion: 'tender',  intensity: 0.62 },
      { time: 62.0, text: 'donde caben los recuerdos',           emotion: 'bittersweet', intensity: 0.68 },
      { time: 67.5, text: 'sin lastimar.',                       emotion: 'release', intensity: 0.55 },
    ],
    translations: [
      {
        language: 'en',
        lines: [
          { time: 4,    text: 'Understand me,' },
          { time: 8.2,  text: "it isn't easy to forget" },
          { time: 13.0, text: 'that your hands were my home' },
          { time: 18.5, text: 'and now everything tastes like solitude' },
          { time: 26.0, text: 'If I see you again,' },
          { time: 30.0, text: "don't promise me a thing" },
          { time: 34.0, text: 'just tell me you understood' },
          { time: 38.0, text: 'what you left behind when you walked away' },
          { time: 44.0, text: 'understand me…' },
          { time: 52.0, text: "I'm not asking you to come back," },
          { time: 56.5, text: 'only for silence in peace' },
          { time: 62.0, text: 'where memories can rest' },
          { time: 67.5, text: 'without hurting.' },
        ],
      },
    ],
  },

  '1': {
    song_id: '1',
    language: 'es',
    plain:
      'Bachata de medianoche\nCuando la ciudad se duerme\nTú aún bailas en mi mente',
    writer_notes: 'Mood: late-night, reverb-heavy guitars, half-whispered vocals.',
    emotional_tags: ['intimate', 'reflective', 'longing'],
    synced: [
      { time: 0,    text: '— Intro —', section: 'intro', intensity: 0.15 },
      { time: 6,    text: 'Bachata de medianoche',         emotion: 'intimate', intensity: 0.5 },
      { time: 11.5, text: 'cuando la ciudad se duerme',    emotion: 'reflective', intensity: 0.55 },
      { time: 17.0, text: 'tú aún bailas en mi mente',     emotion: 'longing', intensity: 0.7 },
      { time: 23.0, text: 'y no te puedo apagar',          emotion: 'aching',  intensity: 0.72 },
      { time: 29.0, text: '— Coro —', section: 'chorus', intensity: 0.2 },
      { time: 31.0, text: 'Quédate un instante más',        emotion: 'tender',  intensity: 0.6 },
      { time: 36.0, text: 'aunque sólo sea un sueño',       emotion: 'bittersweet', intensity: 0.66 },
      { time: 41.5, text: 'antes de que vuelva el sol',     emotion: 'hopeful', intensity: 0.58 },
      { time: 47.0, text: 'a recordarme que no estás.',     emotion: 'release', intensity: 0.5 },
    ],
  },

  '2': {
    song_id: '2',
    language: 'en',
    plain:
      'Broken halo over the bed\nLight bends around what you said\nI keep the silence instead',
    writer_notes: 'English-language demo. Sparse arrangement, room mics on the vocal.',
    emotional_tags: ['bittersweet', 'reflective', 'release'],
    synced: [
      { time: 0,    text: '— Verse —', section: 'verse', intensity: 0.15 },
      { time: 5,    text: 'Broken halo over the bed',          emotion: 'reflective', intensity: 0.5 },
      { time: 10,   text: 'light bends around what you said',  emotion: 'bittersweet', intensity: 0.6 },
      { time: 15.5, text: 'I keep the silence instead',        emotion: 'release', intensity: 0.7 },
      { time: 21.0, text: 'of asking you to come home.',       emotion: 'aching', intensity: 0.75 },
    ],
  },

  '3': {
    song_id: '3',
    language: 'es',
    plain: 'Noches sin ti son más largas\nQue todas las que viví',
    emotional_tags: ['longing', 'aching'],
  },

  '4': {
    song_id: '4',
    language: 'es',
    plain: 'Salgo a la calle a buscar lo que ya no está',
    emotional_tags: ['reflective'],
  },

  '5': {
    song_id: '5',
    language: 'es',
    plain: 'Letra próximamente.',
  },
}

export function getLyricsForSong(songId: string | undefined): LyricsTrack | null {
  if (!songId) return null
  return mockLyrics[songId] ?? null
}
