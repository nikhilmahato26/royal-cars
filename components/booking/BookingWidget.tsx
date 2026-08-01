'use client'
import { useState, useEffect } from 'react'
import { formatINR } from '@/lib/utils'
import { CalendarDays, User, Mail, Phone, Lock, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react'

type Car = {
  id: string
  name: string
  brand: string
  color: string
  pricePerDay: number
}

type Step = 'dates' | 'details' | 'otp' | 'payment' | 'success'

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
  }
}

function parseDateTime(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  const [time, modifier] = timeStr.split(' ')
  let [hours, minutes] = time.split(':')
  let hrs = parseInt(hours, 10)
  if (modifier === 'PM' && hrs < 12) hrs += 12
  if (modifier === 'AM' && hrs === 12) hrs = 0
  d.setHours(hrs, parseInt(minutes, 10), 0, 0)
  return d
}

function calculatePricing(startDate: string, endDate: string, startTime: string, endTime: string, pricePerDay: number) {
  const start = parseDateTime(startDate, startTime)
  const end = parseDateTime(endDate, endTime)
  
  if (!start || !end) return { total: 0, durationText: '', isValid: false }
  
  const diffMs = end.getTime() - start.getTime()
  if (diffMs <= 0) return { total: 0, durationText: '', isValid: false }

  const totalHours = diffMs / (1000 * 60 * 60)
  
  if (totalHours <= 24) {
    return {
      total: pricePerDay,
      durationText: '1 day',
      isValid: true
    }
  }

  const days = Math.floor(totalHours / 24)
  const remainingHours = Math.ceil(totalHours % 24)

  let total = days * pricePerDay
  let durationText = `${days} day${days > 1 ? 's' : ''}`
  
  if (remainingHours > 0) {
    const hourlyRate = Math.round(pricePerDay / 24)
    total += remainingHours * hourlyRate
    durationText += ` ${remainingHours} hr`
  }

  return { total, durationText, isValid: true }
}

export default function BookingWidget({ car }: { car: Car }) {
  const [step, setStep] = useState<Step>('dates')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('10:00 AM')
  const [endTime, setEndTime] = useState('10:00 AM')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('pickupLocation')) setPickupLocation(params.get('pickupLocation')!)
      if (params.get('dropoffLocation')) setDropoffLocation(params.get('dropoffLocation')!)
      if (params.get('startDate')) setStartDate(params.get('startDate')!)
      if (params.get('endDate')) setEndDate(params.get('endDate')!)
      if (params.get('startTime')) setStartTime(params.get('startTime')!)
      if (params.get('endTime')) setEndTime(params.get('endTime')!)
    }
  }, [])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [bookingToken, setBookingToken] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookedRanges, setBookedRanges] = useState<{ startDate: string; endDate: string }[]>([])

  const timeOptions = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
  ]

  const { total, durationText, isValid } = calculatePricing(startDate, endDate, startTime, endTime, car.pricePerDay)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    fetch(`/api/availability/${car.id}`)
      .then((r) => r.json())
      .then((d) => setBookedRanges(d))
      .catch(() => {})
  }, [car.id])

  function hasOverlap(start: string, end: string) {
    if (!start || !end) return false
    return bookedRanges.some((r) => {
      const rStart = r.startDate.slice(0, 10)
      const rEnd = r.endDate.slice(0, 10)
      return start <= rEnd && end >= rStart
    })
  }

  async function sendOTP() {
    setFieldErrors({})
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Enter full name'
    if (!email) errors.email = 'Enter email address'
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter valid 10-digit mobile number'
    if (!termsAccepted) errors.termsAccepted = 'Accept Terms & Conditions'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    setError('')
    try {
      const notesStr = `Pickup Loc: ${pickupLocation}, Drop Loc: ${dropoffLocation} | Pickup: ${startTime}, Return: ${endTime}`
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car.id, startDate, endDate, name, email, phone, notes: notesStr }),
      })
      const d = await res.json()
      if (!res.ok) return setError(d.error)
      setStep('otp')
    } catch {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function verifyOTP() {
    if (otp.length !== 6) return setError('Enter 6-digit OTP')
    setLoading(true)
    setError('')
    try {
      const notesStr = `Pickup Loc: ${pickupLocation}, Drop Loc: ${dropoffLocation} | Pickup: ${startTime}, Return: ${endTime}`
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car.id, startDate, endDate, name, email, phone, code: otp, notes: notesStr }),
      })
      const d = await res.json()
      if (!res.ok) return setError(d.error)
      setBookingToken(d.bookingToken)
      await initiatePayment(d.bookingToken)
    } catch {
      setError('Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  async function initiatePayment(token: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/booking/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingToken: token }),
      })
      const d = await res.json()
      if (!res.ok) return setError(d.error)

      await loadRazorpay()

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: d.amount,
        currency: d.currency,
        order_id: d.orderId,
        name: 'Royal Cars',
        description: `${car.brand} ${car.name} · ${durationText}`,
        prefill: { name, email, contact: phone },
        theme: { color: '#22c55e' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await confirmPayment(token, response)
        },
      })
      rzp.open()
      setStep('payment')
    } catch {
      setError('Could not initiate payment.')
    } finally {
      setLoading(false)
    }
  }

  async function confirmPayment(token: string, rzpResponse: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    try {
      const res = await fetch('/api/booking/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingToken: token,
          razorpayOrderId: rzpResponse.razorpay_order_id,
          razorpayPaymentId: rzpResponse.razorpay_payment_id,
          razorpaySignature: rzpResponse.razorpay_signature,
        }),
      })
      const d = await res.json()
      if (!res.ok) return setError(d.error)
      setBookingRef(d.bookingRef)
      setStep('success')
    } catch {
      setError('Payment confirmation failed. Please contact us with your payment ID.')
    }
  }

  function loadRazorpay(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve()
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = () => resolve()
      document.body.appendChild(s)
    })
  }

  if (step === 'success') {
    return (
      <div className="bg-[#111] border border-[#22c55e]/30 rounded-2xl p-6 text-center">
        <CheckCircle size={48} className="text-[#22c55e] mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">Booking Confirmed!</h3>
        <p className="text-gray-400 text-sm mb-4">Check your email for booking details.</p>
        <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
          <p className="text-[#22c55e] font-bold text-lg tracking-wider">{bookingRef}</p>
        </div>
        <p className="text-xs text-gray-500">We&apos;ll contact you with pickup instructions shortly.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-lg">Book this Car</h3>
        {isValid && (
          <div className="text-right">
            <div className="text-[#22c55e] font-bold">{formatINR(total)}</div>
            <div className="text-xs text-gray-500">{durationText}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {(step === 'dates' || step === 'details') && (
        <>
          <div className="space-y-3 mb-4">
            {/* Locations Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 flex justify-between">
                  <span>Pickup Location</span>
                  {fieldErrors.pickupLocation && <span className="text-red-400">{fieldErrors.pickupLocation}</span>}
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter city or airport"
                    className={`w-full bg-[#0a0a0a] border ${fieldErrors.pickupLocation ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 flex justify-between">
                  <span>Drop-off Location</span>
                  {fieldErrors.dropoffLocation && <span className="text-red-400">{fieldErrors.dropoffLocation}</span>}
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Enter city or airport"
                    className={`w-full bg-[#0a0a0a] border ${fieldErrors.dropoffLocation ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]`}
                  />
                </div>
              </div>
            </div>

            {/* Pickup Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pickup Date</label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      if (endDate && e.target.value >= endDate) setEndDate('')
                    }}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e] [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pickup Time</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e] h-[38px] cursor-pointer"
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t} className="bg-[#111]">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Return Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Return Date</label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e] [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Return Time</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22c55e] h-[38px] cursor-pointer"
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t} className="bg-[#111]">{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isValid && (
            <div className="bg-[#0a0a0a] rounded-xl p-3 mb-4 text-sm">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>{formatINR(car.pricePerDay)}/day × {durationText}</span>
                <span className="text-white font-medium">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-300">Total</span>
                <span className="text-[#22c55e]">{formatINR(total)}</span>
              </div>
            </div>
          )}

          {step === 'details' && (
            <>
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <label className="text-xs text-gray-400 mb-1 flex justify-between">
                    <span>Full Name *</span>
                    {fieldErrors.name && <span className="text-red-400">{fieldErrors.name}</span>}
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none`} />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs text-gray-400 mb-1 flex justify-between">
                    <span>Email *</span>
                    {fieldErrors.email && <span className="text-red-400">{fieldErrors.email}</span>}
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none`} />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs text-gray-400 mb-1 flex justify-between">
                    <span>Phone *</span>
                    {fieldErrors.phone && <span className="text-red-400">{fieldErrors.phone}</span>}
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="tel" placeholder="Mobile Number (10 digits)" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-[#0a0a0a] border ${fieldErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none`} />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-2.5 mt-4 mb-4">
                <input
                  type="checkbox"
                  id="termsCheck"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 accent-[#22c55e] cursor-pointer"
                />
                <label htmlFor="termsCheck" className="text-[10px] leading-snug text-gray-400 cursor-pointer select-none">
                  I accept the Terms & Conditions, including the extra hours charge of <strong className="text-white">₹{Math.round(car.pricePerDay / 24)}/hr</strong> (calculated as daily price / 24).
                </label>
              </div>
              {fieldErrors.termsAccepted && <div className="text-red-400 text-xs mb-4">{fieldErrors.termsAccepted}</div>}
            </>
          )}

          <button
            onClick={() => {
              if (step === 'dates') {
                setFieldErrors({})
                const errors: Record<string, string> = {}
                if (!pickupLocation.trim()) errors.pickupLocation = 'Required'
                if (!dropoffLocation.trim()) errors.dropoffLocation = 'Required'
                if (!startDate || !endDate || !isValid) errors.dates = 'Select valid pickup and return dates and times'
                if (hasOverlap(startDate, endDate)) errors.dates = 'These dates are already booked'
                if (Object.keys(errors).length > 0) {
                  setFieldErrors(errors)
                  return
                }
                setStep('details')
              } else {
                sendOTP()
              }
            }}
            disabled={loading || (step === 'details' && !termsAccepted)}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {step === 'dates' ? 'Continue' : 'Send OTP & Confirm'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Enter the 6-digit OTP sent to <strong className="text-white">{email}</strong>
          </p>
          <div className="relative mb-4">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e] tracking-widest text-center text-lg"
            />
          </div>
          <button
            onClick={verifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Verify & Pay {formatINR(total)}
          </button>
          <button onClick={() => { setStep('details'); setOtp(''); setError('') }} className="w-full text-gray-500 text-sm mt-2 hover:text-gray-300 transition-colors">
            ← Change details
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="text-center py-6">
          <Loader2 size={32} className="text-[#22c55e] animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Processing payment...</p>
        </div>
      )}
    </div>
  )
}
