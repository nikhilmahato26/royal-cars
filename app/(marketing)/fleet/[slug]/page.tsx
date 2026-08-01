import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Car, Users, Fuel, Settings, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import BookingWidget from '@/components/booking/BookingWidget'

export const revalidate = 300

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = await prisma.car.findUnique({ where: { slug }, include: { _count: { select: { bookings: true } } } })
  if (!car || !car.isActive) notFound()

  const carData = { ...car, pricePerDay: car.pricePerDay.toNumber() }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-10 lg:pt-44">
      <Link href="/fleet" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Fleet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] mb-6">
            {car.images[0] ? (
              <img src={car.images[0]} alt={`${car.brand} ${car.name}`} className="w-full aspect-[16/9] object-cover" />
            ) : (
              <div className="w-full aspect-[16/9] flex items-center justify-center">
                <Car size={64} className="text-[#2a2a2a]" />
              </div>
            )}
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-2">
                {car.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt="" className="aspect-square object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[#22c55e] text-xs font-semibold uppercase tracking-wider capitalize">{car.category}</span>
                <h1 className="text-2xl font-bold text-white mt-1">{car.brand} {car.name}</h1>
                <p className="text-gray-400">{car.color}</p>
              </div>
              <div className="text-right">
                <div className="text-[#22c55e] font-bold text-2xl">{formatINR(carData.pricePerDay)}</div>
                <div className="text-gray-500 text-sm">per day</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#1a1a1a]">
              {[
                { icon: <Users size={16} />, label: 'Seats', value: `${car.seats} persons` },
                { icon: <Fuel size={16} />, label: 'Fuel', value: car.fuelType },
                { icon: <Settings size={16} />, label: 'Gearbox', value: car.transmission },
                { icon: <Car size={16} />, label: 'Type', value: car.category },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center justify-center text-[#22c55e] mb-1">{s.icon}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                  <div className="text-sm text-white font-medium capitalize">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-[#22c55e] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Widget */}
        <div className="lg:col-span-1">
          <BookingWidget car={carData} />
          <div className="mt-4 bg-[#111] border border-[#1a1a1a] rounded-xl p-4 text-sm text-gray-400">
            <p className="text-white font-medium mb-2">📋 Booking Policy</p>
            <ul className="space-y-1.5">
              <li>• Minimum booking: 1 day</li>
              <li>• Fuel: Customer's responsibility</li>
              <li>• Valid DL required at pickup</li>
              <li>• 100% payment to confirm booking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
