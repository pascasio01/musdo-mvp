import { supabase } from '../lib/supabase'
import type { License } from '../types'
import type { DbLicense } from '../types/database.types'
import type { ServiceResult } from './song.service'
import { mockLicenses } from '../data/mockData'

function dbToLicense(row: DbLicense): License {
  return {
    id: row.id,
    song_id: row.song_id,
    owner_id: row.owner_id,
    license_type: row.license_type,
    price: row.price,
    status: row.status,
    created_at: row.created_at,
  }
}

export const licenseService = {
  async getAvailable(limit = 50): Promise<ServiceResult<License[]>> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*, song:songs(*)')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) return { data: mockLicenses, error: null }
      return { data: data as License[], error: null }
    } catch {
      return { data: mockLicenses, error: null }
    }
  },

  async getByOwner(ownerId: string): Promise<ServiceResult<License[]>> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*, song:songs(*)')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })

      if (error) return { data: mockLicenses.filter(l => l.owner_id === ownerId), error: null }
      return { data: data as License[], error: null }
    } catch {
      return { data: mockLicenses.filter(l => l.owner_id === ownerId), error: null }
    }
  },

  async create(license: Omit<License, 'id' | 'created_at'>): Promise<ServiceResult<License>> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert(license)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToLicense(data as DbLicense), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async updateStatus(id: string, status: License['status']): Promise<ServiceResult<License>> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToLicense(data as DbLicense), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },
}
