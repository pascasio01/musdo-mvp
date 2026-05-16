import { supabase } from '../lib/supabase'
import { db } from './_db'
import type { VerificationRequest, BadgeType, VerificationStatus } from '../types'
import type { DbVerificationRequest } from '../types/database.types'
import type { ServiceResult } from './song.service'
import { mockVerificationQueue } from '../data/mockData'

function dbToRequest(row: DbVerificationRequest): VerificationRequest {
  return {
    id: row.id,
    user_id: row.user_id,
    username: '',
    badge_type: row.badge_type,
    status: row.status,
    submitted_at: row.submitted_at,
    reviewed_at: row.reviewed_at ?? undefined,
    notes: row.notes ?? undefined,
  }
}

export const verificationService = {
  async getPending(): Promise<ServiceResult<VerificationRequest[]>> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*, profile:profiles(username)')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true })

      if (error) return { data: mockVerificationQueue.filter(v => v.status === 'pending'), error: null }
      return { data: data as VerificationRequest[], error: null }
    } catch {
      return { data: mockVerificationQueue.filter(v => v.status === 'pending'), error: null }
    }
  },

  async getAll(): Promise<ServiceResult<VerificationRequest[]>> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*, profile:profiles(username)')
        .order('submitted_at', { ascending: false })

      if (error) return { data: mockVerificationQueue, error: null }
      return { data: data as VerificationRequest[], error: null }
    } catch {
      return { data: mockVerificationQueue, error: null }
    }
  },

  async submit(userId: string, badgeType: BadgeType, notes?: string): Promise<ServiceResult<VerificationRequest>> {
    try {
      const { data, error } = await db('verification_requests')
        .insert({ user_id: userId, badge_type: badgeType, status: 'pending', notes: notes ?? null })
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToRequest(data as DbVerificationRequest), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async review(
    requestId: string,
    reviewerId: string,
    decision: 'approved' | 'rejected',
    rejectionReason?: string,
  ): Promise<ServiceResult<VerificationRequest>> {
    try {
      const { data, error } = await db('verification_requests')
        .update({
          status: decision,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerId,
          rejection_reason: rejectionReason ?? null,
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: dbToRequest(data as DbVerificationRequest), error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },

  async applyBadge(userId: string, badgeType: BadgeType): Promise<ServiceResult<void>> {
    try {
      const update: Record<string, boolean> = { [badgeType]: true }

      const { error } = await db('profiles')
        .update({ ...update, verification_status: 'approved' as VerificationStatus })
        .eq('id', userId)

      if (error) return { data: null, error: error.message }
      return { data: undefined, error: null }
    } catch (e) {
      return { data: null, error: String(e) }
    }
  },
}
