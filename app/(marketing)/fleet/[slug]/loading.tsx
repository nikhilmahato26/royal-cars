import { ArrowLeft } from 'lucide-react'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-10 lg:pt-44 animate-pulse">
      <div className="inline-flex items-center gap-2 text-gray-600 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Fleet
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details Skeleton */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] mb-6">
            <div className="w-full aspect-[16/9] bg-[#1a1a1a]" />
            <div className="grid grid-cols-4 gap-2 p-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-[#1a1a1a] rounded-lg" />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-1/2">
                <div className="h-4 w-16 bg-[#1a1a1a] rounded mb-2" />
                <div className="h-8 w-48 bg-[#1a1a1a] rounded mb-2" />
                <div className="h-4 w-24 bg-[#1a1a1a] rounded" />
              </div>
              <div className="text-right">
                <div className="h-8 w-24 bg-[#1a1a1a] rounded mb-1" />
                <div className="h-4 w-12 bg-[#1a1a1a] rounded ml-auto" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#1a1a1a]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center justify-center">
                  <div className="h-6 w-6 bg-[#1a1a1a] rounded-full mb-2" />
                  <div className="h-3 w-12 bg-[#1a1a1a] rounded mb-1" />
                  <div className="h-4 w-16 bg-[#1a1a1a] rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
            <div className="h-6 w-48 bg-[#1a1a1a] rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 w-32 bg-[#1a1a1a] rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Widget Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 sticky top-20">
            <div className="h-6 w-32 bg-[#1a1a1a] rounded mb-5" />
            
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-[#1a1a1a] rounded-lg" />
                <div className="h-10 bg-[#1a1a1a] rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-[#1a1a1a] rounded-lg" />
                <div className="h-10 bg-[#1a1a1a] rounded-lg" />
              </div>
            </div>

            <div className="h-12 bg-[#1a1a1a] rounded-xl mb-4" />
            <div className="h-12 bg-[#1a1a1a] rounded-xl" />
          </div>
          
          <div className="mt-4 bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="h-5 w-32 bg-[#1a1a1a] rounded mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-[#1a1a1a] rounded" />
              <div className="h-4 w-56 bg-[#1a1a1a] rounded" />
              <div className="h-4 w-40 bg-[#1a1a1a] rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
