'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import { Shield, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#0F172A]">Posko Barang Hilang</h1>
          <p className="text-sm text-[#475569] mt-1">Login petugas posko</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-medium text-sm py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Hanya untuk petugas posko yang berwenang
        </p>
      </div>
    </div>
  )
}
