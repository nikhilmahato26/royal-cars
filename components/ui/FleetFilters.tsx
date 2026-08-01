'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'All Cars', value: '' },
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'MUV', value: 'muv' },
]

export default function FleetFilters({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <Link
          key={c.value}
          href={c.value ? `/fleet?category=${c.value}` : '/fleet'}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
            (c.value === (activeCategory ?? ''))
              ? 'bg-[#22c55e] text-black border-[#22c55e]'
              : 'bg-[#111] text-gray-400 border-[#1a1a1a] hover:border-[#22c55e]/30 hover:text-white'
          )}
        >
          {c.label}
        </Link>
      ))}
    </div>
  )
}
