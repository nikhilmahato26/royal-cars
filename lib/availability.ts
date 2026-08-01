import { prisma } from './prisma'

export async function getBookedRanges(carId: string) {
  const bookings = await prisma.booking.findMany({
    where: { carId, status: 'CONFIRMED', endDate: { gte: new Date() } },
    select: { startDate: true, endDate: true },
  })
  return bookings
}

export async function checkConflict(
  tx: typeof prisma,
  carId: string,
  startDate: Date,
  endDate: Date
) {
  return tx.booking.findFirst({
    where: {
      carId,
      status: 'CONFIRMED',
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
  })
}

export function calcNights(startDate: Date, endDate: Date): number {
  const diff = endDate.getTime() - startDate.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function generateBookingRef(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `VTR-${dateStr}-${rand}`
}
