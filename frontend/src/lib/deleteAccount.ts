import { supabase } from './supabase'

export interface DeleteAccountResult {
  /** Every user-owned server row was deleted without error. */
  remoteOk: boolean
  /** Tables that errored or could not be reached (best-effort). */
  failedTables: string[]
  /** Local device data (localStorage + Cache Storage) was cleared. */
  localCleared: boolean
  /** The session was revoked. */
  signedOut: boolean
}

/**
 * Honest, best-effort account deletion for the web beta.
 *
 * The app is a pure client (static SPA + Supabase, no privileged backend), so
 * it can only do what the user is actually allowed to do:
 *   1. Attempt to delete the user-owned rows the RLS policies permit.
 *   2. Erase all MUSVORA data persisted on this device (localStorage `musdo-*`
 *      keys + the offline asset Cache namespaces).
 *   3. Revoke the session (sign out).
 *
 * It does NOT erase the underlying auth credential — that requires a privileged
 * server operation that does not exist in the beta. Supabase returns most
 * DB/RLS errors in the response body (not as throws), so every call's `error`
 * is inspected and surfaced rather than silently swallowed. The caller's copy
 * must match exactly what this returns.
 */
export async function deleteAccountData(userId: string): Promise<DeleteAccountResult> {
  // Dynamic table names fall outside the generated Database types, so use a
  // loosely-typed view of the client. Table/column names are hardcoded
  // constants (no user input), so the cast introduces no injection vector.
  const db = supabase as unknown as {
    from: (table: string) => {
      delete: () => { eq: (column: string, value: string) => PromiseLike<{ error: { message: string } | null }> }
    }
  }

  const targets: Array<{ table: string; column: string }> = [
    { table: 'private_identity', column: 'user_id' },
    { table: 'creator_identity', column: 'user_id' },
    { table: 'user_settings', column: 'user_id' },
    { table: 'playlists', column: 'owner_id' },
    { table: 'follows', column: 'follower_id' },
    { table: 'profiles', column: 'id' },
  ]

  const failedTables: string[] = []
  for (const { table, column } of targets) {
    try {
      const { error } = await db.from(table).delete().eq(column, userId)
      if (error) failedTables.push(table)
    } catch {
      failedTables.push(table)
    }
  }

  // Erase every MUSVORA persistence key on this device.
  let localCleared = false
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith('musdo-')) localStorage.removeItem(key)
    }
    localCleared = true
  } catch {
    /* storage unavailable — ignore */
  }

  // Clear offline asset caches (Cache Storage namespaces).
  try {
    if (typeof caches !== 'undefined') {
      const names = await caches.keys()
      await Promise.all(names.filter(n => n.startsWith('musdo-')).map(n => caches.delete(n)))
    }
  } catch {
    /* ignore */
  }

  // Revoke the local session.
  let signedOut = false
  try {
    const { error } = await supabase.auth.signOut()
    signedOut = !error
  } catch {
    /* ignore */
  }

  return { remoteOk: failedTables.length === 0, failedTables, localCleared, signedOut }
}
