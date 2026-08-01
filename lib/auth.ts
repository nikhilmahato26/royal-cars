import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_ADMIN_SECRET!)
const BOOKING_SECRET = new TextEncoder().encode(process.env.JWT_BOOKING_SECRET!)

export async function signAdminToken(payload: { adminId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(ADMIN_SECRET)
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, ADMIN_SECRET)
  return payload as { adminId: string; email: string }
}

export async function getAdminFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null
  try {
    return await verifyAdminToken(token)
  } catch {
    return null
  }
}

export interface BookingTokenPayload {
  carId: string
  startDate: string
  endDate: string
  name: string
  email: string
  phone: string
  notes?: string
}

export async function signBookingToken(payload: BookingTokenPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(BOOKING_SECRET)
}

export async function verifyBookingToken(token: string): Promise<BookingTokenPayload> {
  const { payload } = await jwtVerify(token, BOOKING_SECRET)
  return payload as unknown as BookingTokenPayload
}
