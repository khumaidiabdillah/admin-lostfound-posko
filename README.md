# Admin Posko Keamanan - Sistem Laporan Barang Hilang

Dashboard Petugas Posko Keamanan untuk verifikasi laporan masyarakat dan manajemen inventaris fisik barang temuan.

## ✨ Fitur Utama
- **Dashboard Statistik**: Metrik real-time laporan masuk, status penanganan, barang di posko, dan barang selesai dikembalikan.
- **Validasi Laporan (Dual-Write)**: Tindakan petugas memproses laporan masyarakat, mencatat log verifikasi di `DB_ADMIN` dan memperbarui status publik di `DB_USER`.
- **Inventaris Fisik Posko**: Pencatatan barang temuan fisik yang diserahkan langsung ke posko keamanan.

## 🛠️ Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Supabase PostgreSQL

## 🚀 Menjalankan Project
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3003`.
Login petugas: `petugas` / `posko123`.
