import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const startStr = searchParams.get('startDate')
  const endStr = searchParams.get('endDate')

  const cars = await prisma.car.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  let unavailable = new Set<string>()
  if (startStr && endStr) {
    const startDate = new Date(startStr)
    const endDate = new Date(endStr)
    const conflicts = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      select: { carId: true },
    })
    unavailable = new Set(conflicts.map((b) => b.carId))
  }

  const result = cars.map((c) => ({
    ...c,
    pricePerDay: c.pricePerDay.toNumber(),
    available: !unavailable.has(c.id),
  }))

  return NextResponse.json(result)
}
