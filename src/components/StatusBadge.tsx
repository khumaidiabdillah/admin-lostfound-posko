import type { StatusPublik } from '@/lib/types'

interface StatusBadgeProps {
  status: StatusPublik | string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let classes = ''

  switch (status) {
    case 'Menunggu Verifikasi':
      classes = 'bg-amber-50 text-amber-700 border-amber-200'
      break
    case 'Diproses Posko':
      classes = 'bg-blue-50 text-blue-700 border-blue-200'
      break
    case 'Ditemukan':
      classes = 'bg-emerald-50 text-emerald-700 border-emerald-200'
      break
    case 'Selesai / Kembali ke Pemilik':
      classes = 'bg-green-50 text-green-700 border-green-200'
      break
    case 'Ditolak':
      classes = 'bg-red-50 text-red-700 border-red-200'
      break
    case 'Tersedia di Posko':
      classes = 'bg-blue-50 text-blue-700 border-blue-200'
      break
    case 'Sudah Diklaim':
      classes = 'bg-green-50 text-green-700 border-green-200'
      break
    default:
      classes = 'bg-slate-50 text-slate-600 border-slate-200'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${classes}`}
    >
      {status}
    </span>
  )
}
