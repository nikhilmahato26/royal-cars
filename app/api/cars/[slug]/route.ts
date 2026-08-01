import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = await prisma.car.findUnique({ where: { slug } })
  if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...car, pricePerDay: car.pricePerDay.toNumber() })
}
