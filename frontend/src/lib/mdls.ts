/**
 * MUSVORA Design Language System (MDLS) — single source of truth for product
 * vocabulary.
 *
 * MDLS replaces generic streaming terminology with MUSVORA-native language so
 * the product reads as Human · Premium · Intelligent · Emotional · Music-first.
 * Import these constants instead of hardcoding labels so the terminology stays
 * consistent and is changed in exactly one place.
 *
 * INTENTIONALLY KEPT (industry-standard music terms + core UX verbs) — these are
 * NOT redefined by MDLS:
 *   Albums · Artists · Composers · Producers · Lyrics · Passports · Licenses · Demos
 *   Login · Register · Save · Delete · Share · Search
 *
 * Two playlist-like concepts are deliberately distinct:
 *   - Collections   → lists the user creates / curates / saves.
 *   - Sound Journeys → mood/feeling listening sessions built by MUSVORA AI.
 */
export const MDLS = {
  /** Bottom-navigation labels — kept short for width; full brand names live in titles. */
  nav: {
    home: 'Pulse',
    search: 'Search',
    ai: 'AI',
    library: 'Universe',
    vault: 'Vault',
  },

  /** Full brand names — used in page titles and headers. */
  brand: {
    ai: 'MUSVORA AI',
    library: 'My Universe',
    vault: 'Creator Vault',
    studio: 'Creator Studio',
  },

  /** Cross-cutting concepts (used across several areas). */
  collection: 'Collection',
  collections: 'Collections',
  soundJourney: 'Sound Journey',
  soundJourneys: 'Sound Journeys',
  curatedForYou: 'Curated For You',
  risingNow: 'Rising Now',
  explore: 'Explore',
  byFeeling: 'By Feeling',
  byTempo: 'By Tempo',
  perfectMatch: 'Perfect Match',
  similarVibes: 'Similar Vibes',
  personalCollection: 'Personal Collection',
  loved: 'Loved',
  echoes: 'Echoes',
  /** Plays/streams, as a count noun. Capitalize at call sites when needed. */
  listens: 'listens',

  /** Discovery surfaces. */
  discovery: {
    musvoraPicks: 'MUSVORA Picks',
    byFeeling: 'By Feeling',
    forYourMoment: 'For Your Moment',
    continueListening: 'Pick Up Where You Left Off',
    explore: 'Explore',
  },

  /** MUSVORA AI surfaces. */
  ai: {
    findMySound: 'Find My Sound',
    takeMeSomewhere: 'Take Me Somewhere',
    risingNow: 'Rising Now',
    explore: 'Explorar',
    byTempo: 'By Tempo',
    byFeeling: 'By Feeling',
    createSoundJourney: 'Crear un Sound Journey',
    createSoundJourneyShort: 'Crear Sound Journey',
  },

  /** My Universe (library) surfaces. */
  library: {
    title: 'My Universe',
    eyebrow: 'MUSVORA · My Universe',
    loved: 'Loved',
    echoes: 'Echoes',
    yourCollections: 'Your Collections',
    sharedCollections: 'Shared Collections',
    onYourDevice: 'On Your Device',
  },

  /** Creator Studio (analytics) surfaces. */
  studio: {
    title: 'Creator Studio',
    insights: 'Catalogue Insights',
    totalListens: 'Total Listens',
    earnings: 'Earnings',
    liveSongs: 'Live Songs',
    yourStrongestSongs: 'Your Strongest Songs',
    listeningInsights: 'Listening Insights',
    whatsHappening: "What's Happening",
  },

  /** Music Director (DJ AI) surfaces. */
  dj: {
    curatedForYou: 'Curated For You',
    risingNow: 'Rising Now',
    genreLeaders: 'Genre Leaders',
    byFeeling: 'By Feeling',
    byTempo: 'By Tempo',
    mostHeardArtists: 'Most Heard Artists',
    moreRisingSoon: 'More Rising Soon',
    experiences: 'Experiences',
  },

  /** Notifications → Music Signals. */
  signals: {
    title: 'Music Signals',
    push: 'Push Signals',
    email: 'Email Signals',
  },
} as const

export type Mdls = typeof MDLS
