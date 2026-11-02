import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('posko_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_DB_ADMIN_URL || 'http://localhost:3003'))
}
