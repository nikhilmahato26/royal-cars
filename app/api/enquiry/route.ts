import { NextRequest, NextResponse } from 'next/server'
import { EnquirySchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { sendEnquiryNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = EnquirySchema.safeParse(body)
    if (!data.success) return NextResponse.json({ error: data.error.issues[0].path[0] ? `${String(data.error.issues[0].path[0])}: ${data.error.issues[0].message}` : data.error.issues[0].message }, { status: 400 })

    const { name, email, phone, carId, message } = data.data

    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone, carId: carId || null, message },
      include: { car: { select: { name: true, brand: true } } },
    })

    await sendEnquiryNotification({
      name,
      email,
      phone,
      carName: enquiry.car ? `${enquiry.car.brand} ${enquiry.car.name}` : 'General',
      message,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}
