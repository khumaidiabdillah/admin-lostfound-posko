'use client'

import { useState } from 'react'
import { PoskoInventory } from '@/lib/types'
import { addInventoryItemAction, updateClaimStatusAction } from './actions'
import { Archive, Plus, CheckCircle2, MapPin, Calendar, User, Search, Eye, Image as ImageIcon, X, ExternalLink } from 'lucide-react'

export default function InventarisClient({
  initialItems,
}: {
  initialItems: PoskoInventory[]
}) {
  const [items, setItems] = useState<PoskoInventory[]>(initialItems)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)

  // Form states
  const [namaBarang, setNamaBarang] = useState('')
  const [kategori, setKategori] = useState('Dompet')
  const [fotoUrl, setFotoUrl] = useState('')
  const [lokasiDitemukan, setLokasiDitemukan] = useState('')
  const [diserahkanOleh, setDiserahkanOleh] = useState('')

  const filteredItems = items.filter(
    (item) =>
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi_ditemukan.toLowerCase().includes(search.toLowerCase()) ||
      item.diserahkan_oleh.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const res = await addInventoryItemAction({
      namaBarang,
      kategori,
      fotoUrl,
      lokasiDitemukan,
      diserahkanOleh,
    })

    setIsSubmitting(false)

    if (res.success) {
      setMessage({
        type: 'success',
        text: 'Barang temuan berhasil dicatat ke DB_ADMIN & dipublikasikan ke DB_USER!',
      })
      // Reset form
      setNamaBarang('')
      setFotoUrl('')
      setLokasiDitemukan('')
      setDiserahkanOleh('')
      setShowForm(false)
    } else {
      setMessage({ type: 'error', text: res.error || 'Gagal menyimpan barang' })
    }
  }

  const handleUpdateClaim = async (id: string, newStatus: string) => {
    const res = await updateClaimStatusAction(id, newStatus)
    if (res.success) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status_klaim: newStatus } : item))
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Inventaris Fisik Posko
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Pencatatan barang temuan fisik yang diserahkan langsung oleh masyarakat ke posko keamanan.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Tutup Formulir' : 'Input Barang Temuan'}
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form Tambah Barang Temuan */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 mb-5">
            <Archive className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Formulir Penerimaan Barang Temuan di Posko
              </h2>
              <p className="text-xs text-[#475569]">
                Catat barang yang diserahkan oleh penemu secara langsung.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Nama Barang *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dompet Kulit Cokelat Braun Buffon"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Kategori *
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-white"
                >
                  <option value="Dompet">Dompet</option>
                  <option value="HP/Elektronik">HP / Elektronik</option>
                  <option value="Kunci">Kunci</option>
                  <option value="Dokumen">Dokumen (KTP / SIM / STNK)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Lokasi Ditemukan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Area Parkir Barat Gedung A"
                  value={lokasiDitemukan}
                  onChange={(e) => setLokasiDitemukan(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Diserahkan Oleh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Joko (Petugas Kebersihan)"
                  value={diserahkanOleh}
                  onChange={(e) => setDiserahkanOleh(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Foto URL (Opsional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-md shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan ke Posko'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Daftar Barang Tersedia di Posko
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 tabular-nums">
              {filteredItems.length} barang
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari barang posko..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-[#475569]">
              <tr>
                <th className="px-5 py-3">Nama Barang</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Lokasi Penemuan</th>
                <th className="px-5 py-3">Tanggal Masuk</th>
                <th className="px-5 py-3">Diserahkan Oleh</th>
                <th className="px-5 py-3">Status Klaim</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-[#94A3B8]">
                    Belum ada barang inventaris di posko.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#0F172A]">
                      <div className="flex items-center gap-3">
                        {item.foto_url && (
                          <div
                            onClick={() => setPreviewImage({ url: item.foto_url!, title: item.nama_barang })}
                            className="w-10 h-10 rounded-md overflow-hidden border border-slate-200 bg-slate-100 shrink-0 cursor-pointer hover:border-brand-500 transition-colors"
                          >
                            <img
                              src={item.foto_url}
                              alt={item.nama_barang}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span>{item.nama_barang}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#475569]">{item.kategori}</td>
                    <td className="px-5 py-3 text-xs text-[#475569]">{item.lokasi_ditemukan}</td>
                    <td className="px-5 py-3 text-xs text-[#475569] tabular-nums">
                      {item.tanggal_masuk_posko}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#475569]">{item.diserahkan_oleh}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          item.status_klaim === 'Tersedia di Posko'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.status_klaim}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {item.status_klaim === 'Tersedia di Posko' ? (
                        <button
                          onClick={() => handleUpdateClaim(item.id, 'Sudah Diklaim')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors"
                        >
                          Tandai Diklaim
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateClaim(item.id, 'Tersedia di Posko')}
                          className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-700 underline"
                        >
                          Batal Klaim
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

      {/* Lightbox Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <span className="text-sm font-bold text-[#0F172A] truncate">{previewImage.title}</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-950/5 flex items-center justify-center max-h-[60vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[55vh] w-auto max-w-full rounded object-contain"
              />
            </div>
            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka Tab Baru
              </a>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded bg-brand-600 text-white hover:bg-brand-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
