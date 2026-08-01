import { NextRequest, NextResponse } from 'next/server'
import { CarSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = CarSchema.partial().safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const car = await prisma.car.update({ where: { id }, data: data.data })
    revalidatePath('/fleet')
    revalidatePath(`/fleet/${car.slug}`)
    return NextResponse.json({ ...car, pricePerDay: car.pricePerDay.toNumber() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const car = await prisma.car.update({ where: { id }, data: { isActive: false } })
    revalidatePath('/fleet')
    return NextResponse.json({ ok: true, slug: car.slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
