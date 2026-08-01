import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET() {
  const enquiries = await prisma.enquiry.findMany({
    include: { car: { select: { name: true, brand: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(enquiries)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const schema = z.object({ id: z.string(), status: z.enum(['NEW', 'CONTACTED', 'CLOSED']) })
  const data = schema.safeParse({ id, status })
  if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

  const enquiry = await prisma.enquiry.update({
    where: { id: data.data.id },
    data: { status: data.data.status },
  })
  return NextResponse.json(enquiry)
}
