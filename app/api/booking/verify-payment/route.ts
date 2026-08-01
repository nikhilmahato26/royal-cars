import { NextRequest, NextResponse } from 'next/server'
import { VerifyPaymentSchema } from '@/lib/validation'
import { verifyBookingToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature, razorpay } from '@/lib/razorpay'
import { checkConflict, calcNights, generateBookingRef } from '@/lib/availability'
import { sendBookingConfirmation, sendAdminBookingNotification } from '@/lib/email'

class BookingConflictError extends Error {}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = VerifyPaymentSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { bookingToken, razorpayOrderId, razorpayPaymentId, razorpaySignature } = data.data

    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    let tokenPayload
    try {
      tokenPayload = await verifyBookingToken(bookingToken)
    } catch {
      return NextResponse.json({ error: 'Booking session expired' }, { status: 401 })
    }

    const { carId, startDate: startStr, endDate: endStr, name, email, phone, notes } = tokenPayload
    const startDate = new Date(startStr)
    const endDate = new Date(endStr)

    const car = await prisma.car.findUnique({ where: { id: carId } })
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    const nights = calcNights(startDate, endDate)
    const totalAmount = Number(car.pricePerDay) * nights

    let booking
    try {
      booking = await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT id FROM "Car" WHERE id = ${carId} FOR UPDATE`
        const conflict = await checkConflict(tx as typeof prisma, carId, startDate, endDate)
        if (conflict) throw new BookingConflictError()

        return tx.booking.create({
          data: {
            bookingRef: generateBookingRef(),
            carId,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            startDate,
            endDate,
            pricePerDayAtBooking: car.pricePerDay,
            totalAmount,
            status: 'CONFIRMED',
            source: 'ONLINE',
            razorpayOrderId,
            razorpayPaymentId,
            notes: notes || null,
          },
        })
      })
    } catch (err) {
      if (err instanceof BookingConflictError) {
        await razorpay.payments.refund(razorpayPaymentId, { speed: 'optimum' })
        return NextResponse.json(
          { error: 'These dates were just booked by someone else. A full refund has been initiated.' },
          { status: 409 }
        )
      }
      throw err
    }

    const carName = `${car.brand} ${car.name} — ${car.color}`
    await Promise.all([
      sendBookingConfirmation({
        to: email,
        name,
        bookingRef: booking.bookingRef,
        carName,
        startDate: startStr,
        endDate: endStr,
        totalAmount: totalAmount.toString(),
      }),
      sendAdminBookingNotification({
        bookingRef: booking.bookingRef,
        carName,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        startDate: startStr,
        endDate: endStr,
        totalAmount: totalAmount.toString(),
        source: 'ONLINE',
      }),
    ])

    return NextResponse.json({ bookingRef: booking.bookingRef })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Payment confirmation failed' }, { status: 500 })
  }
}
