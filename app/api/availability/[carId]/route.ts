import { NextRequest, NextResponse } from 'next/server'
import { getBookedRanges } from '@/lib/availability'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ carId: string }> }) {
  const { carId } = await params
  const ranges = await getBookedRanges(carId)
  return NextResponse.json(ranges)
}
