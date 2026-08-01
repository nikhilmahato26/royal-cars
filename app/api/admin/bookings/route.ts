import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const carId = searchParams.get('carId')

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status: status as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' } : {}),
      ...(carId ? { carId } : {}),
    },
    include: { car: { select: { name: true, brand: true, color: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    bookings.map((b) => ({
      ...b,
      pricePerDayAtBooking: b.pricePerDayAtBooking.toNumber(),
      totalAmount: b.totalAmount.toNumber(),
    }))
  )
}
