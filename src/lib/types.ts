export type Kategori = 'Dompet' | 'HP/Elektronik' | 'Kunci' | 'Dokumen' | 'Lainnya'

export type StatusPenanganan =
  | 'Diproses'
  | 'Ditemukan di Posko'
  | 'Dikembalikan ke Pemilik'
  | 'Ditolak/Spam'

export type StatusPublik =
  | 'Menunggu Verifikasi'
  | 'Diproses Posko'
  | 'Ditemukan'
  | 'Selesai / Kembali ke Pemilik'
  | 'Ditolak'

export interface PoskoAdmin {
  id: string
  username: string
  password_hash: string
  nama_petugas: string
  created_at: string
}

export interface VerifiedReport {
  id: string
  public_report_id: string
  nama_barang: string
  kategori: Kategori
  status_penanganan: StatusPenanganan
  catatan_petugas: string
  nama_penerima: string | null
  verified_at: string
}

export interface PoskoInventory {
  id: string
  nama_barang: string
  kategori: Kategori
  foto_url: string | null
  lokasi_ditemukan: string
  tanggal_masuk_posko: string
  diserahkan_oleh: string
  status_klaim: string
  created_at: string
}

export interface PublicReport {
  id: string
  jenis_laporan: string
  nama_barang: string
  kategori: Kategori
  foto_barang_url: string | null
  lokasi: string
  tanggal_kejadian: string
  no_wa_pelapor: string
  deskripsi: string
  status_publik: StatusPublik
  created_at: string
}

export const KATEGORI_OPTIONS: Kategori[] = [
  'Dompet',
  'HP/Elektronik',
  'Kunci',
  'Dokumen',
  'Lainnya',
]

export const STATUS_PENANGANAN_OPTIONS: StatusPenanganan[] = [
  'Diproses',
  'Ditemukan di Posko',
  'Dikembalikan ke Pemilik',
  'Ditolak/Spam',
]

export const STATUS_PUBLIK_OPTIONS: StatusPublik[] = [
  'Menunggu Verifikasi',
  'Diproses Posko',
  'Ditemukan',
  'Selesai / Kembali ke Pemilik',
  'Ditolak',
]
