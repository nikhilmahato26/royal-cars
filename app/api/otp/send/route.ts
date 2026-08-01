import { NextRequest, NextResponse } from 'next/server'
import { OtpSendSchema } from '@/lib/validation'
import { redis, otpRatelimit } from '@/lib/redis'
import { sendOTP } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = OtpSendSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { email } = data.data

    const { success } = await otpRatelimit.limit(email)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Try again in 10 minutes.' }, { status: 429 })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    await redis.set(`otp:${email}`, code, { ex: 300 })
    await sendOTP(email, code)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
