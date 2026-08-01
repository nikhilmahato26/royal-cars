import { NextRequest, NextResponse } from 'next/server'
import { CarSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'

function generateSlug(brand: string, name: string, color: string): string {
  return `${brand}-${name}-${color}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  const cars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(cars.map((c) => ({ ...c, pricePerDay: c.pricePerDay.toNumber() })))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = CarSchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { name, brand, color, ...rest } = data.data
    let slug = generateSlug(brand, name, color)

    const existing = await prisma.car.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const car = await prisma.car.create({
      data: { name, brand, color, slug, ...rest },
    })

    return NextResponse.json({ ...car, pricePerDay: car.pricePerDay.toNumber() }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
