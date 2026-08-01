import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED']),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = UpdateSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: data.data.status },
    })
    return NextResponse.json({ ...booking, totalAmount: booking.totalAmount.toNumber() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
