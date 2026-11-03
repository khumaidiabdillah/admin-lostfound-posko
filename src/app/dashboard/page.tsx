import { supabaseAdminDB, supabaseUserDB } from '@/lib/supabase'
import StatCard from '@/components/StatCard'
import StatusBadge from '@/components/StatusBadge'
import { FileText, Clock, Archive, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PublicReport, PoskoInventory } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  try {
    // 1. Fetch public reports from DB_USER
    const { data: reports, error: reportsErr } = await supabaseUserDB
      .from('public_reports')
      .select('*')
      .order('created_at', { ascending: false })

    // 2. Fetch inventory from DB_ADMIN
    const { data: inventory, error: invErr } = await supabaseAdminDB
      .from('posko_inventory')
      .select('*')

    const safeReports: PublicReport[] = reports || []
    const safeInventory: PoskoInventory[] = inventory || []

    const totalLaporan = safeReports.length
    const belumDiproses = safeReports.filter((r) => r.status_publik === 'Menunggu Verifikasi').length
    const barangDiPosko = safeInventory.filter((i) => i.status_klaim === 'Tersedia di Posko').length
    const sudahKembali = safeReports.filter((r) => r.status_publik === 'Selesai / Kembali ke Pemilik').length

    // Grouping category counts
    const categoryCounts: Record<string, number> = {
      Dompet: 0,
      'HP/Elektronik': 0,
      Kunci: 0,
      Dokumen: 0,
      Lainnya: 0,
    }
    safeReports.forEach((r) => {
      if (categoryCounts[r.kategori] !== undefined) {
        categoryCounts[r.kategori]++
      } else {
        categoryCounts['Lainnya']++
      }
    })

    return {
      totalLaporan,
      belumDiproses,
      barangDiPosko,
      sudahKembali,
      categoryCounts,
      recentReports: safeReports.slice(0, 8),
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      totalLaporan: 0,
      belumDiproses: 0,
      barangDiPosko: 0,
      sudahKembali: 0,
      categoryCounts: { Dompet: 0, 'HP/Elektronik': 0, Kunci: 0, Dokumen: 0, Lainnya: 0 },
      recentReports: [],
    }
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
          Ringkasan Posko Keamanan
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Pantau arus laporan publik, status verifikasi, dan inventaris barang temuan posko.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Laporan Masuk"
          value={data.totalLaporan}
          icon={FileText}
          accentColor="blue"
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={data.belumDiproses}
          icon={Clock}
          accentColor="amber"
        />
        <StatCard
          label="Tersedia di Posko"
          value={data.barangDiPosko}
          icon={Archive}
          accentColor="emerald"
        />
        <StatCard
          label="Selesai Dikembalikan"
          value={data.sudahKembali}
          icon={CheckCircle2}
          accentColor="slate"
        />
      </div>

      {/* Section Grid: Category Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs lg:col-span-1">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">
            Distribusi per Kategori Barang
          </h2>
          <div className="space-y-3">
            {Object.entries(data.categoryCounts).map(([kategori, count]) => {
              const percentage = data.totalLaporan > 0 ? Math.round((count / data.totalLaporan) * 100) : 0
              return (
                <div key={kategori} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#475569]">{kategori}</span>
                    <span className="font-semibold text-[#0F172A] tabular-nums">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs lg:col-span-2 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Laporan Publik Terbaru
            </h2>
            <Link
              href="/validasi"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              Kelola di Validasi
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-[#475569]">
                <tr>
                  <th className="px-5 py-3">Jenis</th>
                  <th className="px-5 py-3">Nama Barang</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Status Publik</th>
                  <th className="px-5 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs text-[#94A3B8]">
                      Belum ada laporan dari publik.
                    </td>
                  </tr>
                ) : (
                  data.recentReports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-xs font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            item.jenis_laporan === 'Kehilangan'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {item.jenis_laporan}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-[#0F172A]">
                        <div className="flex items-center gap-2.5">
                          {item.foto_barang_url && (
                            <img
                              src={item.foto_barang_url}
                              alt={item.nama_barang}
                              className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <span className="truncate max-w-[140px] sm:max-w-xs">{item.nama_barang}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#475569]">{item.kategori}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={item.status_publik} />
                      </td>
                      <td className="px-5 py-3 text-xs text-[#475569] tabular-nums">
                        {item.tanggal_kejadian}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
