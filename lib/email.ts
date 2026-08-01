import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_PORT === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
})

export async function sendOTP(to: string, code: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your Royal Cars Booking OTP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px">
        <h2 style="color:#22c55e;margin-bottom:8px">Royal Cars</h2>
        <p style="color:#aaa;margin-bottom:24px">Self Drive Car Rental · Bhubaneswar</p>
        <h3 style="font-size:32px;letter-spacing:8px;color:#fff;margin:0">${code}</h3>
        <p style="color:#aaa;margin-top:16px">This OTP expires in <strong style="color:#fff">5 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  })
}

export async function sendBookingConfirmation(opts: {
  to: string
  name: string
  bookingRef: string
  carName: string
  startDate: string
  endDate: string
  totalAmount: string
}) {
  const { to, name, bookingRef, carName, startDate, endDate, totalAmount } = opts
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Booking Confirmed — ${bookingRef}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px">
        <h2 style="color:#22c55e">Booking Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Your booking is confirmed. Details below:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#aaa">Booking Ref</td><td style="color:#fff;font-weight:bold">${bookingRef}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Car</td><td style="color:#fff">${carName}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Pickup</td><td style="color:#fff">${startDate}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Return</td><td style="color:#fff">${endDate}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Amount Paid</td><td style="color:#22c55e;font-weight:bold">₹${totalAmount}</td></tr>
        </table>
        <p style="color:#aaa">We'll contact you shortly with pickup instructions. For any questions, WhatsApp us.</p>
        <p style="color:#22c55e;font-weight:bold">Royal Cars · Bhubaneswar</p>
      </div>
    `,
  })
}

export async function sendAdminBookingNotification(opts: {
  bookingRef: string
  carName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  startDate: string
  endDate: string
  totalAmount: string
  source: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New Booking: ${opts.bookingRef}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:12px">
        <h2 style="color:#22c55e">New Booking Received</h2>
        <table style="width:100%;border-collapse:collapse">
          ${Object.entries(opts).map(([k, v]) => `<tr><td style="padding:6px 0;color:#aaa;text-transform:capitalize">${k.replace(/([A-Z])/g, ' $1')}</td><td style="color:#fff">${v}</td></tr>`).join('')}
        </table>
      </div>
    `,
  })
}

export async function sendEnquiryNotification(opts: {
  name: string
  email: string
  phone: string
  carName: string
  message: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New Enquiry from ${opts.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:12px">
        <h2 style="color:#22c55e">New Enquiry</h2>
        <p><strong>Name:</strong> ${opts.name}</p>
        <p><strong>Email:</strong> ${opts.email}</p>
        <p><strong>Phone:</strong> <a href="https://wa.me/91${opts.phone}" style="color:#22c55e">${opts.phone}</a></p>
        <p><strong>Car:</strong> ${opts.carName}</p>
        <p><strong>Message:</strong></p>
        <p style="background:#1a1a1a;padding:12px;border-radius:8px;color:#ddd">${opts.message}</p>
      </div>
    `,
  })
}
