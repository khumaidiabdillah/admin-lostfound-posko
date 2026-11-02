'use server'

import { supabaseAdminDB, supabaseUserDB } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { StatusPenanganan, StatusPublik } from '@/lib/types'

export async function updateReportStatusAction({
  publicReportId,
  namaBarang,
  kategori,
  statusPenanganan,
  statusPublik,
  catatanPetugas,
  namaPenerima,
}: {
  publicReportId: string
  namaBarang: string
  kategori: string
  statusPenanganan: StatusPenanganan
  statusPublik: StatusPublik
  catatanPetugas: string
  namaPenerima?: string | null
}) {
  try {
    // 1. Dual-Write Step 1: Write verification archive to DB_ADMIN
    const { error: adminError } = await supabaseAdminDB
      .from('verified_reports')
      .insert({
        public_report_id: publicReportId,
        nama_barang: namaBarang,
        kategori: kategori,
        status_penanganan: statusPenanganan,
        catatan_petugas: catatanPetugas || 'Diperiksa oleh petugas posko',
        nama_penerima: namaPenerima || null,
      })

    if (adminError) {
      console.error('Error logging to DB_ADMIN verified_reports:', adminError)
      return { success: false, error: adminError.message }
    }

    // 2. Dual-Write Step 2: Update public status in DB_USER
    const { error: userError } = await supabaseUserDB
      .from('public_reports')
      .update({
        status_publik: statusPublik,
      })
      .eq('id', publicReportId)

    if (userError) {
      console.error('Error updating DB_USER public_reports:', userError)
      return { success: false, error: userError.message }
    }

    revalidatePath('/validasi')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error in updateReportStatusAction:', err)
    return { success: false, error: err.message || 'Gagal memproses laporan' }
  }
}
