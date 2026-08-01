'use client'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

type Enquiry = {
  id: string; name: string; email: string; phone: string; message: string
  status: string; createdAt: string; car: { name: string; brand: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-yellow-500/10 text-yellow-400',
  CONTACTED: 'bg-blue-500/10 text-blue-400',
  CLOSED: 'bg-gray-500/10 text-gray-400',
}

export default function AdminEnquiriesClient({ enquiries: initial }: { enquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial)
  const [filter, setFilter] = useState('')

  const filtered = enquiries.filter((e) => !filter || e.status === filter)

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/admin/enquiries', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status })
    })
    if (res.ok) setEnquiries((es) => es.map((e) => e.id === id ? { ...e, status } : e))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Enquiries</h1>
          <p className="text-gray-400 text-sm mt-0.5">{enquiries.filter(e => e.status === 'NEW').length} new · {enquiries.length} total</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {[['', 'All'], ['NEW', 'New'], ['CONTACTED', 'Contacted'], ['CLOSED', 'Closed']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${filter === v ? 'bg-[#22c55e] text-black border-[#22c55e]' : 'bg-[#111] text-gray-400 border-[#1a1a1a] hover:border-[#22c55e]/30'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white">{e.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[e.status] ?? ''}`}>{e.status}</span>
                  {e.car && <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full">{e.car.brand} {e.car.name}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-2">
                  <span>{e.email}</span>
                  <a href={`https://wa.me/91${e.phone}`} target="_blank" rel="noopener noreferrer" className="text-[#22c55e] flex items-center gap-1 hover:underline">
                    <MessageCircle size={11} /> {e.phone}
                  </a>
                  <span>{formatDate(e.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-300 bg-[#0a0a0a] rounded-lg p-3 line-clamp-2">{e.message}</p>
              </div>
              <div className="shrink-0">
                <select value={e.status} onChange={(e2) => updateStatus(e.id, e2.target.value)}
                  className="bg-[#0a0a0a] border border-[#2a2a2a] text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#22c55e]">
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <MessageCircle size={36} className="mx-auto mb-3 opacity-20" />
            <p>No enquiries found</p>
          </div>
        )}
      </div>
    </>
  )
}
