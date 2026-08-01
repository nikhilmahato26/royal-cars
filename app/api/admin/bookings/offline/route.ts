import { NextRequest, NextResponse } from 'next/server'
import { OfflineBookingSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { checkConflict, calcNights, generateBookingRef } from '@/lib/availability'
import { sendAdminBookingNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = OfflineBookingSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { carId, customerName, customerEmail, customerPhone, startDate: startStr, endDate: endStr, notes } = data.data
    const startDate = new Date(startStr)
    const endDate = new Date(endStr)

    const car = await prisma.car.findUnique({ where: { id: carId } })
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    const conflict = await checkConflict(prisma, carId, startDate, endDate)
    if (conflict) return NextResponse.json({ error: 'Dates conflict with an existing booking' }, { status: 409 })

    const nights = calcNights(startDate, endDate)
    const totalAmount = Number(car.pricePerDay) * nights

    const booking = await prisma.booking.create({
      data: {
        bookingRef: generateBookingRef(),
        carId,
        customerName,
        customerEmail,
        customerPhone,
        startDate,
        endDate,
        pricePerDayAtBooking: car.pricePerDay,
        totalAmount,
        status: 'CONFIRMED',
        source: 'OFFLINE',
        notes,
      },
    })

    await sendAdminBookingNotification({
      bookingRef: booking.bookingRef,
      carName: `${car.brand} ${car.name} — ${car.color}`,
      customerName,
      customerEmail,
      customerPhone,
      startDate: startStr,
      endDate: endStr,
      totalAmount: totalAmount.toString(),
      source: 'OFFLINE',
    })

    return NextResponse.json({ bookingRef: booking.bookingRef }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
