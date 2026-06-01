import { supabase } from '../lib/supabase'
import { db } from './_db'
import type { Profile } from '../types'
import type { DbProfile } from '../types/database.types'
import type { ServiceResult } from './song.service'

function dbToProfile(row: DbProfile): Profile {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    sub_role: row.sub_role ?? undefined,
    avatar_url: row.avatar_url ?? undefined,
    bio: row.bio ?? undefined,
    verified_artist: row.verified_artist ?? false,
    verified_composer: row.verified_composer ?? false,
    verified_rights_holder: row.verified_rights_holder ?? false,
    human_verified: row.human_verified ?? false,
    label_verified: row.label_verified ?? false,
    verification_status: row.verification_status ?? 'none',
    verification_level: row.verification_level ?? 0,
    created_at: row.created_at,
  }
}

export const profileService = {
  async getById(id: string): Promise<ServiceResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToProfile(data as DbProfile), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async update(id: string, updates: Partial<Profile>): Promise<ServiceResult<Profile>> {
    try {
      const { data, error } = await db('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToProfile(data as DbProfile), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async getComposers(limit = 20): Promise<ServiceResult<Profile[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['composer', 'producer'])
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) return { data: [], error: null }
      return { data: (data as DbProfile[]).map(dbToProfile), error: null }
    } catch {
      return { data: [], error: null }
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<ServiceResult<string>> {
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${userId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) return { data: null, error: uploadError.message }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      return { data: data.publicUrl, error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async uploadCover(userId: string, file: File): Promise<ServiceResult<string>> {
    try {
      const ext = file.name.split('.').pop()
      // Reuse the existing public `avatars` bucket under a `covers/` prefix to
      // avoid introducing new storage infrastructure.
      const path = `covers/${userId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) return { data: null, error: uploadError.message }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      return { data: data.publicUrl, error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },
}
