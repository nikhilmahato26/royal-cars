'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { LayoutDashboard, Car, CalendarCheck, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cars', label: 'Cars', icon: Car },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-[#1a1a1a]">
        <Image src="/logo.png" alt="Royal Cars" width={36} height={36} className="object-contain" />
        <div>
          <div className="text-white font-bold text-sm">Royal Cars</div>
          <div className="text-gray-500 text-xs">Admin Panel</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map((n) => {
          const active = pathname.startsWith(n.href)
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              )}
            >
              <n.icon size={16} />
              {n.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-[#1a1a1a]">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-[#111] border-r border-[#1a1a1a] flex-col shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-[#111] border-r border-[#1a1a1a] flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar (mobile) */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] bg-[#111]">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400">
            <Menu size={20} />
          </button>
          <span className="text-white font-semibold text-sm">Royal Cars Admin</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
