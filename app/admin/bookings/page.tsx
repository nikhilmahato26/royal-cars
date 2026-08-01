import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminBookingsClient from '@/components/admin/AdminBookingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const [bookings, cars] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { car: { select: { name: true, brand: true, color: true } } },
    }),
    prisma.car.findMany({ where: { isActive: true }, select: { id: true, name: true, brand: true } }),
  ])

  const serialized = bookings.map((b) => ({
    ...b,
    pricePerDayAtBooking: b.pricePerDayAtBooking.toNumber(),
    totalAmount: b.totalAmount.toNumber(),
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }))

  return (
    <AdminShell>
      <AdminBookingsClient bookings={serialized} cars={cars} />
    </AdminShell>
  )
}
