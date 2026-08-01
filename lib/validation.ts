import { z } from 'zod'

export const OtpSendSchema = z.object({
  email: z.string().email(),
  carId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  notes: z.string().optional(),
})

export const OtpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  carId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  notes: z.string().optional(),
})

export const CreateOrderSchema = z.object({
  bookingToken: z.string().min(1),
})

export const VerifyPaymentSchema = z.object({
  bookingToken: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
})

export const EnquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  carId: z.string().optional(),
  message: z.string().min(10).max(1000),
})

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const CarSchema = z.object({
  name: z.string().min(1).max(100),
  brand: z.string().min(1).max(100),
  color: z.string().min(1).max(50),
  category: z.enum(['hatchback', 'sedan', 'suv', 'muv']),
  seats: z.number().int().min(2).max(10),
  fuelType: z.enum(['petrol', 'diesel', 'cng', 'ev']),
  transmission: z.enum(['manual', 'automatic']),
  pricePerDay: z.number().positive(),
  images: z.array(z.string().url()).min(1),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

export const OfflineBookingSchema = z.object({
  carId: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
})
