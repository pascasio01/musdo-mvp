import { supabase } from '../lib/supabase'
import type { Song } from '../types'
import type { DbSong } from '../types/database.types'
import { mockSongs } from '../data/mockData'

export type ServiceResult<T> = { data: T; error: null } | { data: null; error: string }

function dbToSong(row: DbSong): Song {
  return {
    id: row.id,
    title: row.title,
    artist_name: row.artist_name,
    genre: row.genre,
    bpm: row.bpm ?? undefined,
    key: row.key ?? undefined,
    duration: row.duration ?? undefined,
    audio_url: row.audio_url ?? undefined,
    artwork_url: row.artwork_url ?? undefined,
    owner_id: row.owner_id,
    human_verified: row.human_verified ?? false,
    verified_rights_holder: row.verified_rights_holder ?? false,
    created_at: row.created_at,
  }
}

export const songService = {
  async getAll(limit = 50): Promise<ServiceResult<Song[]>> {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) return { data: mockSongs, error: null }
      return { data: (data as DbSong[]).map(dbToSong), error: null }
    } catch {
      return { data: mockSongs, error: null }
    }
  },

  async getById(id: string): Promise<ServiceResult<Song>> {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        const mock = mockSongs.find(s => s.id === id)
        if (mock) return { data: mock, error: null }
        return { data: null, error: error.message }
      }
      return { data: dbToSong(data as DbSong), error: null }
    } catch (e) {
      const mock = mockSongs.find(s => s.id === id)
      if (mock) return { data: mock, error: null }
      return { data: null, error: String(e) }
    }
  },

  async getByOwner(ownerId: string): Promise<ServiceResult<Song[]>> {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })

      if (error) return { data: mockSongs.filter(s => s.owner_id === ownerId), error: null }
      return { data: (data as DbSong[]).map(dbToSong), error: null }
    } catch {
      return { data: mockSongs.filter(s => s.owner_id === ownerId), error: null }
    }
  },

  async getFeatured(limit = 6): Promise<ServiceResult<Song[]>> {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('human_verified', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) return { data: mockSongs.filter(s => s.human_verified).slice(0, limit), error: null }
      return { data: (data as DbSong[]).map(dbToSong), error: null }
    } catch {
      return { data: mockSongs.filter(s => s.human_verified).slice(0, limit), error: null }
    }
  },

  async search(query: string): Promise<ServiceResult<Song[]>> {
    try {
      const q = query.trim().toLowerCase()
      if (!q) return { data: mockSongs, error: null }

      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .or(`title.ilike.%${q}%,artist_name.ilike.%${q}%,genre.ilike.%${q}%`)
        .limit(30)

      if (error) {
        const results = mockSongs.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.artist_name.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q),
        )
        return { data: results, error: null }
      }
      return { data: (data as DbSong[]).map(dbToSong), error: null }
    } catch {
      return { data: [], error: null }
    }
  },
}
