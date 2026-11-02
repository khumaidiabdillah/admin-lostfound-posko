import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard Posko - Laporan Barang Hilang',
  description: 'Sistem manajemen posko barang hilang untuk petugas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F8FAFC]">{children}</body>
    </html>
  )
}
