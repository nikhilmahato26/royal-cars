import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import { formatINR } from '@/lib/utils'
import AdminCarsClient from '@/components/admin/AdminCarsClient'

export const dynamic = 'force-dynamic'

export default async function AdminCarsPage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: 'desc' },
  })
  const serialized = cars.map((c) => ({ ...c, pricePerDay: c.pricePerDay.toNumber() }))

  return (
    <AdminShell>
      <AdminCarsClient initialCars={serialized} />
    </AdminShell>
  )
}
