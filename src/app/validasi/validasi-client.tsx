'use client'

import { useState } from 'react'
import { PublicReport, StatusPenanganan, StatusPublik } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import { updateReportStatusAction } from './actions'
import {
  FileCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  MessageCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Image as ImageIcon,
  ImageOff,
  X,
  Maximize2,
} from 'lucide-react'

export default function ValidasiClient({
  initialReports,
}: {
  initialReports: PublicReport[]
}) {
  const [reports, setReports] = useState<PublicReport[]>(initialReports)
  const [activeTab, setActiveTab] = useState<string>('Semua')
  const [search, setSearch] = useState('')
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null)
  const [actionType, setActionType] = useState<
    'Diproses' | 'Ditemukan di Posko' | 'Dikembalikan ke Pemilik' | 'Ditolak/Spam' | null
  >(null)
  const [catatanPetugas, setCatatanPetugas] = useState('')
  const [namaPenerima, setNamaPenerima] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // State untuk Modal Preview Foto Besar
  const [previewImage, setPreviewImage] = useState<{
    url: string
    title: string
    kategori?: string
    deskripsi?: string
    lokasi?: string
  } | null>(null)

  const filteredReports = reports.filter((item) => {
    const matchTab =
      activeTab === 'Semua'
        ? true
        : activeTab === 'Menunggu'
        ? item.status_publik === 'Menunggu Verifikasi'
        : activeTab === 'Diproses'
        ? item.status_publik === 'Diproses Posko'
        : activeTab === 'Ditemukan'
        ? item.status_publik === 'Ditemukan'
        : activeTab === 'Selesai'
        ? item.status_publik === 'Selesai / Kembali ke Pemilik'
        : true

    const matchSearch =
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase()) ||
      (item.no_wa_pelapor && item.no_wa_pelapor.includes(search))

    return matchTab && matchSearch
  })

  const openActionModal = (
    report: PublicReport,
    type: 'Diproses' | 'Ditemukan di Posko' | 'Dikembalikan ke Pemilik' | 'Ditolak/Spam'
  ) => {
    setSelectedReport(report)
    setActionType(type)
    setCatatanPetugas('')
    setNamaPenerima('')
    setMessage(null)
  }

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReport || !actionType) return

    setIsSubmitting(true)
    setMessage(null)

    let newStatusPublik: StatusPublik = 'Diproses Posko'
    if (actionType === 'Diproses') newStatusPublik = 'Diproses Posko'
    else if (actionType === 'Ditemukan di Posko') newStatusPublik = 'Ditemukan'
    else if (actionType === 'Dikembalikan ke Pemilik') newStatusPublik = 'Selesai / Kembali ke Pemilik'
    else if (actionType === 'Ditolak/Spam') newStatusPublik = 'Ditolak'

    const result = await updateReportStatusAction({
      publicReportId: selectedReport.id,
      namaBarang: selectedReport.nama_barang,
      kategori: selectedReport.kategori,
      statusPenanganan: actionType as StatusPenanganan,
      statusPublik: newStatusPublik,
      catatanPetugas,
      namaPenerima: actionType === 'Dikembalikan ke Pemilik' ? namaPenerima : null,
    })

    setIsSubmitting(false)

    if (result.success) {
      // Update local state
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id ? { ...r, status_publik: newStatusPublik } : r
        )
      )
      setMessage({ type: 'success', text: 'Status laporan berhasil disinkronisasi ke DB_ADMIN & DB_USER!' })

      setTimeout(() => {
        setSelectedReport(null)
        setActionType(null)
        setMessage(null)
      }, 1200)
    } else {
      setMessage({ type: 'error', text: result.error || 'Terjadi kesalahan' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
          Validasi & Penanganan Laporan
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Verifikasi laporan dari masyarakat, lakukan Dual-Write ke DB_ADMIN sekaligus perbarui status publik di DB_USER.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-xs overflow-x-auto">
          {['Semua', 'Menunggu', 'Diproses', 'Ditemukan', 'Selesai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-brand-600 text-white'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama barang / lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 text-[#0F172A]"
          />
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-[#475569]">
              <tr>
                <th className="px-5 py-3.5">Jenis</th>
                <th className="px-5 py-3.5">Barang, Foto & Kategori</th>
                <th className="px-5 py-3.5">Lokasi & Tanggal</th>
                <th className="px-5 py-3.5">Kontak Pelapor</th>
                <th className="px-5 py-3.5">Status Publik</th>
                <th className="px-5 py-3.5 text-right">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#94A3B8]">
                    Tidak ada laporan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Kolom Jenis Laporan */}
                    <td className="px-5 py-4 align-top">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          report.jenis_laporan === 'Kehilangan'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {report.jenis_laporan}
                      </span>
                    </td>

                    {/* Kolom Barang & Foto */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-3.5">
                        {/* Thumbnail Foto */}
                        {report.foto_barang_url ? (
                          <div
                            onClick={() =>
                              setPreviewImage({
                                url: report.foto_barang_url!,
                                title: report.nama_barang,
                                kategori: report.kategori,
                                deskripsi: report.deskripsi,
                                lokasi: report.lokasi,
                              })
                            }
                            title="Klik untuk memperbesar gambar"
                            className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 cursor-pointer shadow-xs hover:border-brand-500 hover:ring-2 hover:ring-brand-500/20 transition-all"
                          >
                            <img
                              src={report.foto_barang_url}
                              alt={report.nama_barang}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white drop-shadow" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center shrink-0 text-slate-400">
                            <ImageOff className="w-5 h-5" />
                            <span className="text-[10px] mt-1 text-slate-400 font-medium">No Foto</span>
                          </div>
                        )}

                        {/* Detail Teks Barang */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#0F172A] leading-tight">
                            {report.nama_barang}
                          </div>
                          <div className="text-xs text-[#475569] mt-0.5">
                            Kategori: <span className="font-medium text-slate-700">{report.kategori}</span>
                          </div>
                          {report.deskripsi && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-sm">
                              {report.deskripsi}
                            </p>
                          )}
                          {report.foto_barang_url && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewImage({
                                  url: report.foto_barang_url!,
                                  title: report.nama_barang,
                                  kategori: report.kategori,
                                  deskripsi: report.deskripsi,
                                  lokasi: report.lokasi,
                                })
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 hover:underline mt-1.5"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              Lihat Foto Penuh
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kolom Lokasi & Tanggal */}
                    <td className="px-5 py-4 align-top text-xs text-[#475569]">
                      <div className="font-medium text-[#0F172A]">{report.lokasi}</div>
                      <div className="text-slate-400 mt-0.5 tabular-nums">{report.tanggal_kejadian}</div>
                    </td>

                    {/* Kolom Kontak WhatsApp */}
                    <td className="px-5 py-4 align-top text-xs">
                      {report.no_wa_pelapor ? (
                        <a
                          href={`https://wa.me/${report.no_wa_pelapor.replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 font-medium hover:underline bg-emerald-50/70 border border-emerald-200/60 px-2 py-1 rounded"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {report.no_wa_pelapor}
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Kolom Status Publik */}
                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={report.status_publik} />
                    </td>

                    {/* Kolom Aksi Petugas */}
                    <td className="px-5 py-4 align-top text-right space-x-1.5 whitespace-nowrap">
                      {report.status_publik === 'Menunggu Verifikasi' && (
                        <button
                          onClick={() => openActionModal(report, 'Diproses')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors"
                        >
                          Proses Laporan
                        </button>
                      )}

                      {report.status_publik !== 'Ditemukan' &&
                        report.status_publik !== 'Selesai / Kembali ke Pemilik' &&
                        report.status_publik !== 'Ditolak' && (
                          <button
                            onClick={() => openActionModal(report, 'Ditemukan di Posko')}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            Ditemukan
                          </button>
                        )}

                      {report.status_publik !== 'Selesai / Kembali ke Pemilik' &&
                        report.status_publik !== 'Ditolak' && (
                          <button
                            onClick={() => openActionModal(report, 'Dikembalikan ke Pemilik')}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition-colors shadow-xs"
                          >
                            Serah Terima
                          </button>
                        )}

                      {report.status_publik !== 'Ditolak' && (
                        <button
                          onClick={() => openActionModal(report, 'Ditolak/Spam')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors"
                        >
                          Tolak
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: PREVIEW FOTO UKURAN BESAR (LIGHTBOX) */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-[#0F172A] truncate max-w-sm">
                  {previewImage.title}
                </h3>
                {previewImage.kategori && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                    {previewImage.kategori}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gambar Besar */}
            <div className="p-4 bg-slate-950/5 flex items-center justify-center overflow-auto max-h-[60vh]">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[55vh] w-auto max-w-full rounded-lg object-contain shadow-sm border border-slate-200/60"
              />
            </div>

            {/* Keterangan & Footer */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-[#475569] space-y-0.5">
                {previewImage.lokasi && (
                  <div>
                    <span className="font-semibold text-slate-700">Lokasi:</span> {previewImage.lokasi}
                  </div>
                )}
                {previewImage.deskripsi && (
                  <p className="text-slate-500 italic max-w-md line-clamp-2">
                    &ldquo;{previewImage.deskripsi}&rdquo;
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Tab Baru
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM AKSI PETUGAS POSKO */}
      {selectedReport && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Konfirmasi Aksi Petugas Posko
              </h3>
              <p className="text-xs text-[#475569] mt-1">
                Laporan: <span className="font-semibold">{selectedReport.nama_barang}</span> ({selectedReport.kategori})
              </p>
              <div className="mt-2 text-xs inline-block px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded font-semibold">
                Status Baru: {actionType}
              </div>
            </div>

            {/* Preview Foto Barang di dalam Modal Aksi (Bantu Petugas Memverifikasi) */}
            {selectedReport.foto_barang_url && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-3">
                <img
                  src={selectedReport.foto_barang_url}
                  alt={selectedReport.nama_barang}
                  className="w-16 h-16 rounded object-cover border border-slate-200 shrink-0"
                />
                <div className="text-xs text-slate-600 min-w-0">
                  <div className="font-semibold text-slate-800">Foto Bukti Pelapor</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Lokasi: {selectedReport.lokasi}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewImage({
                        url: selectedReport.foto_barang_url!,
                        title: selectedReport.nama_barang,
                        kategori: selectedReport.kategori,
                        deskripsi: selectedReport.deskripsi,
                        lokasi: selectedReport.lokasi,
                      })
                    }
                    className="text-brand-600 hover:underline text-[11px] font-medium mt-0.5 inline-flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Perbesar Foto
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`p-3 rounded-md text-xs font-medium ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitAction} className="space-y-3.5">
              {actionType === 'Dikembalikan ke Pemilik' && (
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Nama Penerima / Pemilik yang Mengambil *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso (NIK / No Identitas)"
                    value={namaPenerima}
                    onChange={(e) => setNamaPenerima(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Catatan Petugas (Disimpan di DB_ADMIN) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Catatan verifikasi, kondisi fisik barang, posko tempat disimpan, atau alasan penolakan..."
                  value={catatanPetugas}
                  onChange={(e) => setCatatanPetugas(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setSelectedReport(null)
                    setActionType(null)
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors shadow-xs disabled:opacity-60"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan & Sinkronisasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
