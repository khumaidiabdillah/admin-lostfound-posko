import { createClient } from '@supabase/supabase-js'

const adminUrl = process.env.NEXT_PUBLIC_DB_ADMIN_URL || 'https://placeholder.supabase.co'
const adminKey = process.env.DB_ADMIN_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
const userUrl = process.env.NEXT_PUBLIC_DB_USER_URL || 'https://placeholder.supabase.co'
const userKey = process.env.DB_USER_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

// Client for DB_ADMIN (schema_lostfound)
export const supabaseAdminDB = createClient(
  adminUrl,
  adminKey,
  { db: { schema: 'schema_lostfound' } }
)

// Client for DB_USER (schema_lostfound - public_reports)
export const supabaseUserDB = createClient(
  userUrl,
  userKey,
  { db: { schema: 'schema_lostfound' } }
)
