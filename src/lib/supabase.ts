import { createClient } from '@supabase/supabase-js'

// Client for DB_ADMIN (schema_lostfound)
export const supabaseAdminDB = createClient(
  process.env.NEXT_PUBLIC_DB_ADMIN_URL!,
  process.env.DB_ADMIN_SERVICE_ROLE_KEY!,
  { db: { schema: 'schema_lostfound' } }
)

// Client for DB_USER (schema_lostfound - public_reports)
export const supabaseUserDB = createClient(
  process.env.NEXT_PUBLIC_DB_USER_URL!,
  process.env.DB_USER_SERVICE_ROLE_KEY!,
  { db: { schema: 'schema_lostfound' } }
)
