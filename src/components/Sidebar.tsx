'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileCheck, Archive, LogOut, Shield } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/validasi', label: 'Validasi Laporan', icon: FileCheck },
  { href: '/inventaris', label: 'Inventaris Posko', icon: Archive },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0F172A] leading-tight">
              Posko Barang Hilang
            </h1>
            <p className="text-xs text-[#475569]">Panel Petugas</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-brand-700' : 'text-[#94A3B8]'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-200">
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#475569] hover:bg-slate-50 hover:text-[#0F172A] transition-colors w-full"
          >
            <LogOut className="w-[18px] h-[18px] text-[#94A3B8]" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
