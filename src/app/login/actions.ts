'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdminDB } from '@/lib/supabase'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username dan password harus diisi.' }
  }

  try {
    const { data, error } = await supabaseAdminDB
      .from('posko_admins')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      return { error: 'Username atau password salah.' }
    }

    // Simple password check (in production, use bcrypt)
    if (data.password_hash !== password) {
      return { error: 'Username atau password salah.' }
    }

    const cookieStore = await cookies()
    cookieStore.set('posko_session', JSON.stringify({
      id: data.id,
      username: data.username,
      nama_petugas: data.nama_petugas,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
  } catch {
    return { error: 'Terjadi kesalahan server. Coba lagi.' }
  }

  redirect('/dashboard')
}
