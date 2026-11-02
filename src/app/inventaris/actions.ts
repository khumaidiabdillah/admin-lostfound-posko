'use server'

import { supabaseAdminDB, supabaseUserDB } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addInventoryItemAction({
  namaBarang,
  kategori,
  fotoUrl,
  lokasiDitemukan,
  diserahkanOleh,
}: {
  namaBarang: string
  kategori: string
  fotoUrl?: string
  lokasiDitemukan: string
  diserahkanOleh: string
}) {
  try {
    // 1. Simpan ke DB_ADMIN.schema_lostfound.posko_inventory
    const { data: invData, error: invError } = await supabaseAdminDB
      .from('posko_inventory')
      .insert({
        nama_barang: namaBarang,
        kategori,
        foto_url: fotoUrl || null,
        lokasi_ditemukan: lokasiDitemukan,
        diserahkan_oleh: diserahkanOleh,
        status_klaim: 'Tersedia di Posko',
      })
      .select()
      .single()

    if (invError) {
      console.error('Error insert to posko_inventory:', invError)
      return { success: false, error: invError.message }
    }

    // 2. Publikasikan juga ke DB_USER.schema_lostfound.public_reports
    // agar masyarakat bisa melihat barang temuan ini di portal publik
    const { error: userError } = await supabaseUserDB
      .from('public_reports')
      .insert({
        jenis_laporan: 'Temuan',
        nama_barang: namaBarang,
        kategori,
        foto_barang_url: fotoUrl || null,
        lokasi: `Posko Keamanan (${lokasiDitemukan})`,
        tanggal_kejadian: new Date().toISOString().split('T')[0],
        deskripsi: `Barang diserahkan oleh ${diserahkanOleh}. Disimpan di inventaris posko keamanan.`,
        status_publik: 'Diproses Posko',
      })

    if (userError) {
      console.error('Warning: Error publishing to public_reports:', userError)
      // Inventory di admin tetap tersimpan
    }

    revalidatePath('/inventaris')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error in addInventoryItemAction:', err)
    return { success: false, error: err.message || 'Gagal menyimpan barang' }
  }
}

export async function updateClaimStatusAction(id: string, statusKlaim: string) {
  try {
    const { error } = await supabaseAdminDB
      .from('posko_inventory')
      .update({ status_klaim: statusKlaim })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/inventaris')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
