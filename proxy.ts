import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_ADMIN_SECRET!)

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (path === '/admin/login' || path === '/api/admin/login') {
    return NextResponse.next()
  }

  const token = req.cookies.get('admin_session')?.value
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
  try {
    await jwtVerify(token, ADMIN_SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
