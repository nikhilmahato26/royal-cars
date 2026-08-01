import { NextRequest, NextResponse } from 'next/server'
import { CreateOrderSchema } from '@/lib/validation'
import { verifyBookingToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { razorpay } from '@/lib/razorpay'
import { checkConflict, calcNights } from '@/lib/availability'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = CreateOrderSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    let tokenPayload
    try {
      tokenPayload = await verifyBookingToken(data.data.bookingToken)
    } catch {
      return NextResponse.json({ error: 'Booking session expired. Please restart.' }, { status: 401 })
    }

    const { carId, startDate: startStr, endDate: endStr } = tokenPayload
    const startDate = new Date(startStr)
    const endDate = new Date(endStr)

    const car = await prisma.car.findUnique({ where: { id: carId } })
    if (!car || !car.isActive) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    const conflict = await checkConflict(prisma, carId, startDate, endDate)
    if (conflict) return NextResponse.json({ error: 'These dates are no longer available' }, { status: 409 })

    const lockKey = `lock:${carId}:${startStr}:${endStr}`
    const sessionId = `${Date.now()}-${Math.random()}`
    const acquired = await redis.set(lockKey, sessionId, { nx: true, ex: 900 })
    if (!acquired) {
      return NextResponse.json({ error: 'Someone else is booking this car right now — try again shortly' }, { status: 409 })
    }

    const nights = calcNights(startDate, endDate)
    const totalAmount = Number(car.pricePerDay) * nights
    const amountPaise = Math.round(totalAmount * 100)

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      carName: `${car.brand} ${car.name} — ${car.color}`,
      nights,
      totalAmount,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
