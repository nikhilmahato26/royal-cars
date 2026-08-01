import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminEnquiriesClient from '@/components/admin/AdminEnquiriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { car: { select: { name: true, brand: true } } },
  })
  const serialized = enquiries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }))

  return (
    <AdminShell>
      <AdminEnquiriesClient enquiries={serialized} />
    </AdminShell>
  )
}
