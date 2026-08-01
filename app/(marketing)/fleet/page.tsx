import { prisma } from '@/lib/prisma'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'
import { Car, Users, Fuel, Settings } from 'lucide-react'
import FleetFilters from '@/components/ui/FleetFilters'

export const revalidate = 300

async function getCars(category?: string) {
  const cars = await prisma.car.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
  return cars.map((c) => ({ ...c, pricePerDay: c.pricePerDay.toNumber() }))
}

export default async function FleetPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const cars = await getCars(category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-10 lg:pt-44">
      <div className="mb-8">
        <p className="text-[#22c55e] text-sm font-semibold uppercase tracking-wider mb-1">Our Fleet</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Available Cars</h1>
        <p className="text-gray-400 mt-2">Choose from our carefully maintained fleet. All prices per day.</p>
      </div>

      <FleetFilters activeCategory={category} />

      {cars.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Car size={52} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">No cars available in this category right now.</p>
          <Link href="/fleet" className="text-[#22c55e] text-sm mt-2 inline-block hover:underline">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/fleet/${car.slug}`}
              className="group bg-[#111] border border-[#1a1a1a] hover:border-[#22c55e]/30 rounded-2xl overflow-hidden transition-all hover:shadow-[0_4px_30px_#22c55e15]"
            >
              <div className="aspect-[16/9] bg-[#1a1a1a] relative overflow-hidden">
                {car.images[0] ? (
                  <img src={car.images[0]} alt={`${car.brand} ${car.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car size={48} className="text-[#2a2a2a]" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 text-[#22c55e] text-xs font-semibold px-2 py-1 rounded-full capitalize">
                  {car.category}
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-bold text-white text-lg">{car.brand} {car.name}</h2>
                <p className="text-gray-500 text-sm mb-3">{car.color}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 flex-wrap">
                  <span className="flex items-center gap-1"><Users size={12} />{car.seats} seats</span>
                  <span className="flex items-center gap-1"><Fuel size={12} />{car.fuelType}</span>
                  <span className="flex items-center gap-1"><Settings size={12} />{car.transmission}</span>
                </div>
                {car.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {car.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-xs bg-[#1a1a1a] text-gray-400 px-2 py-0.5 rounded">{f}</span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="text-xs text-gray-600">+{car.features.length - 3} more</span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#22c55e] font-bold text-lg">{formatINR(car.pricePerDay)}</span>
                    <span className="text-gray-500 text-xs">/day</span>
                  </div>
                  <span className="bg-[#22c55e]/10 text-[#22c55e] text-xs font-semibold px-3 py-1.5 rounded-lg group-hover:bg-[#22c55e] group-hover:text-black transition-all">
                    Book Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
