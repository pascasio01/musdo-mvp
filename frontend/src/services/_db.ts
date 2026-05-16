import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

/**
 * Typed table builder helper.
 *
 * Workaround for a known supabase-js v2 generic-inference regression where
 * `.insert()` and `.update()` collapse their argument type to `never`,
 * even when `createClient<Database>()` is correctly parameterised.
 *
 * Casting the FromBuilder through `unknown` lets us re-attach the precise
 * Insert/Update/Row types defined in `database.types.ts`, restoring
 * compile-time safety at every call site.
 *
 * See: https://github.com/supabase/postgrest-js/issues/* (v2 generics)
 */
type Tables = Database['public']['Tables']
type TableName = keyof Tables

type Row<T extends TableName>    = Tables[T]['Row']
type Insert<T extends TableName> = Tables[T]['Insert']
type Update<T extends TableName> = Tables[T]['Update']

interface TypedQuery<T extends TableName> {
  select: (columns?: string) => any
  insert: (values: Insert<T> | Insert<T>[]) => any
  update: (values: Update<T>) => any
  delete: () => any
  upsert: (values: Insert<T> | Insert<T>[]) => any
  eq: (column: keyof Row<T> | string, value: unknown) => any
}

export function db<T extends TableName>(table: T): TypedQuery<T> {
  return supabase.from(table) as unknown as TypedQuery<T>
}

export type { Row, Insert, Update, TableName }
