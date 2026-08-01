import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'
import { checkConflict, calcNights, generateBookingRef } from '@/lib/availability'
import { sendBookingConfirmation, sendAdminBookingNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const orderId = payment.order_id
    const paymentId = payment.id

    const existing = await prisma.booking.findFirst({ where: { razorpayOrderId: orderId } })
    if (existing) return NextResponse.json({ ok: true })

    const order = await prisma.booking.findFirst({ where: { razorpayOrderId: orderId } })
    if (!order) {
      console.log(`Webhook: no booking for order ${orderId} — may be handled by verify-payment`)
    }
  }

  return NextResponse.json({ ok: true })
}
