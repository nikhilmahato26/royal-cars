import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import { formatINR, formatDate } from '@/lib/utils'
import { Car, CalendarCheck, MessageSquare, IndianRupee } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalBookings, monthBookings, openEnquiries, activeCars, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.findMany({
      where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth } },
      select: { totalAmount: true },
    }),
    prisma.enquiry.count({ where: { status: 'NEW' } }),
    prisma.car.count({ where: { isActive: true } }),
    prisma.booking.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { car: { select: { name: true, brand: true } } },
    }),
  ])

  const monthRevenue = monthBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0)

  const stats = [
    { label: 'Active Cars', value: activeCars, icon: <Car size={20} className="text-[#22c55e]" />, href: '/admin/cars' },
    { label: 'Confirmed Bookings', value: totalBookings, icon: <CalendarCheck size={20} className="text-[#22c55e]" />, href: '/admin/bookings' },
    { label: 'Month Revenue', value: formatINR(monthRevenue), icon: <IndianRupee size={20} className="text-[#22c55e]" />, href: '/admin/bookings' },
    { label: 'Open Enquiries', value: openEnquiries, icon: <MessageSquare size={20} className="text-[#22c55e]" />, href: '/admin/enquiries' },
  ]

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening at Royal Cars.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-[#111] border border-[#1a1a1a] hover:border-[#22c55e]/20 rounded-xl p-4 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#22c55e]/10 rounded-lg">{s.icon}</div>
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-white font-semibold">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-[#22c55e] text-xs hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {['Ref', 'Car', 'Customer', 'Dates', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-[#0f0f0f] hover:bg-[#1a1a1a]/30">
                  <td className="px-5 py-3 text-[#22c55e] font-mono text-xs font-semibold whitespace-nowrap">{b.bookingRef}</td>
                  <td className="px-5 py-3 text-white whitespace-nowrap">{b.car.brand} {b.car.name}</td>
                  <td className="px-5 py-3 text-gray-300 whitespace-nowrap">{b.customerName}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(b.startDate)} → {formatDate(b.endDate)}</td>
                  <td className="px-5 py-3 text-white whitespace-nowrap">{formatINR(Number(b.totalAmount))}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      b.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400' :
                      b.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
