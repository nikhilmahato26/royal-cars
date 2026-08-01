import { Car } from 'lucide-react'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-10 lg:pt-44 animate-pulse">
      <div className="mb-8">
        <div className="h-4 w-24 bg-[#1a1a1a] rounded mb-2" />
        <div className="h-10 w-64 bg-[#1a1a1a] rounded mb-3" />
        <div className="h-5 w-96 bg-[#1a1a1a] rounded" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-[#1a1a1a] rounded-full shrink-0" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <div className="aspect-[16/9] bg-[#1a1a1a] flex items-center justify-center">
              <Car size={48} className="text-[#2a2a2a]" />
            </div>
            <div className="p-4">
              <div className="h-6 w-48 bg-[#1a1a1a] rounded mb-2" />
              <div className="h-4 w-24 bg-[#1a1a1a] rounded mb-4" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-4 w-16 bg-[#1a1a1a] rounded" />
                <div className="h-4 w-16 bg-[#1a1a1a] rounded" />
                <div className="h-4 w-16 bg-[#1a1a1a] rounded" />
              </div>
              
              <div className="flex gap-2 mb-4">
                <div className="h-5 w-16 bg-[#1a1a1a] rounded" />
                <div className="h-5 w-16 bg-[#1a1a1a] rounded" />
                <div className="h-5 w-16 bg-[#1a1a1a] rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-6 w-20 bg-[#1a1a1a] rounded mb-1" />
                  <div className="h-3 w-10 bg-[#1a1a1a] rounded" />
                </div>
                <div className="h-8 w-24 bg-[#1a1a1a] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
