import type {
  Playlist,
  PublicIdentity,
  ResonanceSummary,
  EmotionalSignature,
} from '../types/identity'

export const mockEmotionalSignature: EmotionalSignature = {
  dominantMoods: ['Nostalgic', 'Romantic', 'Late Night'],
  tagline: 'Bachata for the rooms only midnight remembers.',
  primeHour: 'late_night',
  texture: 'cinematic',
}

export const mockPublicIdentity: PublicIdentity = {
  userId: 'self',
  alias: 'Emmanuel R.',
  handle: '@emmanuelr',
  bio: 'Writing songs that arrive after midnight. Bachata · Latin Soul.',
  avatarUrl: undefined,
  headerImageUrl: undefined,
  aura: 'velvet_violet',
  accentColor: '#7c3aed',
  emotionalStatus: 'late_night_writing',
  emotionalTags: ['Bachata', 'Romantic', 'Cinematic', 'Dominican'],
  signature: mockEmotionalSignature,
  verifiedHuman: true,
  verifiedArtist: true,
}

export const mockResonance: ResonanceSummary = {
  followers: 1247,
  following: 89,
  tier: 'kindred_creator',
  descriptor: 'Shared atmosphere with night listeners',
}

export const mockPlaylists: Playlist[] = [
  {
    id: 'pl_001',
    ownerId: 'self',
    title: 'Midnight Bachata',
    subtitle: 'For the long drives and longer thoughts',
    atmosphere: 'midnight drive',
    moodSignature: ['Romantic', 'Nostalgic', 'Late Night'],
    visibility: 'public',
    trackCount: 24,
    accentColor: '#7c3aed',
    createdAt: '2025-09-12T03:00:00Z',
  },
  {
    id: 'pl_002',
    ownerId: 'self',
    title: 'Acoustic Mornings',
    subtitle: 'First light, no production',
    atmosphere: 'acoustic morning',
    moodSignature: ['Tender', 'Intimate', 'Reflective'],
    visibility: 'followers_only',
    trackCount: 18,
    accentColor: '#d97706',
    createdAt: '2025-08-04T07:30:00Z',
  },
  {
    id: 'pl_003',
    ownerId: 'self',
    title: 'Studio Sessions — Vol. III',
    subtitle: 'Demos that didn\u2019t make the album',
    atmosphere: 'studio focus',
    moodSignature: ['Raw', 'Cinematic'],
    visibility: 'creator_only',
    trackCount: 7,
    accentColor: '#2563eb',
    createdAt: '2025-10-19T22:14:00Z',
  },
  {
    id: 'pl_004',
    ownerId: 'self',
    title: 'Resonance',
    subtitle: 'Songs other creators sent me',
    atmosphere: 'shared atmosphere',
    moodSignature: ['Hopeful', 'Bittersweet'],
    visibility: 'unlisted',
    trackCount: 31,
    accentColor: '#a855f7',
    createdAt: '2025-07-22T18:45:00Z',
  },
]

export const mockSuggestedCreators: PublicIdentity[] = [
  {
    userId: 'c_002',
    alias: 'Lucía Fernández',
    handle: '@lucia',
    bio: 'Vocal arranger · Santo Domingo nights.',
    aura: 'crimson_dusk',
    emotionalStatus: 'in_the_studio',
    emotionalTags: ['Bolero', 'Vocal'],
    verifiedHuman: true,
    verifiedArtist: false,
  },
  {
    userId: 'c_003',
    alias: 'Carlos B.',
    handle: '@carlosb',
    bio: 'Producer · Bachata Soul, neo-bolero.',
    aura: 'amber_warmth',
    emotionalStatus: 'open_to_collab',
    emotionalTags: ['Producer', 'Bachata'],
    verifiedHuman: true,
    verifiedArtist: true,
  },
  {
    userId: 'c_004',
    alias: 'Ana Díaz',
    handle: '@anadiaz',
    bio: 'Keys & strings. Cinematic textures.',
    aura: 'midnight_blue',
    emotionalStatus: 'feeling_nostalgic',
    emotionalTags: ['Strings', 'Cinematic'],
    verifiedHuman: true,
    verifiedArtist: false,
  },
]
