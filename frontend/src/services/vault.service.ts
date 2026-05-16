import { supabase } from '../lib/supabase'
import { db } from './_db'
import type { Demo, Lyrics } from '../types'
import type { DbDemo, DbLyrics } from '../types/database.types'
import type { ServiceResult } from './song.service'
import { mockDemos } from '../data/mockData'

function dbToDemo(row: DbDemo): Demo {
  return {
    id: row.id,
    title: row.title,
    composer_id: row.composer_id,
    demo_url: row.demo_url ?? undefined,
    notes: row.notes ?? undefined,
    visibility: row.visibility,
    created_at: row.created_at,
  }
}

function dbToLyrics(row: DbLyrics): Lyrics {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    composer_id: row.composer_id,
    timestamp_proof: row.timestamp_proof ?? undefined,
    created_at: row.created_at,
  }
}

export const vaultService = {
  async getDemos(composerId: string): Promise<ServiceResult<Demo[]>> {
    try {
      const { data, error } = await supabase
        .from('demos')
        .select('*')
        .eq('composer_id', composerId)
        .order('created_at', { ascending: false })

      if (error) return { data: mockDemos, error: null }
      return { data: (data as DbDemo[]).map(dbToDemo), error: null }
    } catch {
      return { data: mockDemos, error: null }
    }
  },

  async getLyrics(composerId: string): Promise<ServiceResult<Lyrics[]>> {
    try {
      const { data, error } = await supabase
        .from('lyrics')
        .select('*')
        .eq('composer_id', composerId)
        .order('created_at', { ascending: false })

      if (error) return { data: [], error: null }
      return { data: (data as DbLyrics[]).map(dbToLyrics), error: null }
    } catch {
      return { data: [], error: null }
    }
  },

  async uploadDemo(demo: { title: string; composer_id: string; demo_url?: string; notes?: string; visibility: Demo['visibility'] }): Promise<ServiceResult<Demo>> {
    try {
      const { data, error } = await db('demos')
        .insert(demo)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToDemo(data as DbDemo), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async saveLyrics(lyrics: { title: string; content: string; composer_id: string }): Promise<ServiceResult<Lyrics>> {
    try {
      const { data, error } = await db('lyrics')
        .insert(lyrics)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToLyrics(data as DbLyrics), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async updateDemoVisibility(id: string, visibility: Demo['visibility']): Promise<ServiceResult<Demo>> {
    try {
      const { data, error } = await db('demos')
        .update({ visibility })
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToDemo(data as DbDemo), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async uploadDemoFile(composerId: string, file: File): Promise<ServiceResult<{ url: string; path: string }>> {
    try {
      const ext = file.name.split('.').pop()
      const path = `demos/${composerId}/${Date.now()}.${ext}`

      const { error } = await supabase.storage.from('demos').upload(path, file)
      if (error) return { data: null, error: error.message }

      const { data } = supabase.storage.from('demos').getPublicUrl(path)
      return { data: { url: data.publicUrl, path }, error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async deleteDemoFile(path: string): Promise<void> {
    try { await supabase.storage.from('demos').remove([path]) } catch { /* best-effort */ }
  },
}
