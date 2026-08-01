import { NextRequest, NextResponse } from 'next/server'
import { AdminLoginSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { signAdminToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = AdminLoginSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { email, password } = data.data
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = await signAdminToken({ adminId: admin.id, email: admin.email })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
