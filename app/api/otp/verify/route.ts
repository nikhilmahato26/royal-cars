import { NextRequest, NextResponse } from 'next/server'
import { OtpVerifySchema } from '@/lib/validation'
import { redis, otpRatelimit } from '@/lib/redis'
import { signBookingToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = OtpVerifySchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { email, code, carId, startDate, endDate, name, phone, notes } = data.data

    const { success } = await otpRatelimit.limit(`verify:${email}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
    }

    const stored = await redis.get<string | number>(`otp:${email}`)
    if (!stored || String(stored) !== code) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    await redis.del(`otp:${email}`)

    const bookingToken = await signBookingToken({ carId, startDate, endDate, name, email, phone, notes })
    return NextResponse.json({ bookingToken })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
