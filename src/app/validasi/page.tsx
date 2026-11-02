import { supabaseUserDB } from '@/lib/supabase'
import ValidasiClient from './validasi-client'
import { PublicReport } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getPublicReports(): Promise<PublicReport[]> {
  try {
    const { data, error } = await supabaseUserDB
      .from('public_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching public reports:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Catch fetching public reports:', err)
    return []
  }
}

export default async function ValidasiPage() {
  const reports = await getPublicReports()

  return <ValidasiClient initialReports={reports} />
}
