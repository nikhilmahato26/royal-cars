'use client'
import { useState, useEffect } from 'react'
import { formatINR, formatDateTime } from '@/lib/utils'
import { Plus, Loader2, X } from 'lucide-react'

type Booking = {
  id: string; bookingRef: string; customerName: string; customerEmail: string; customerPhone: string
  startDate: string; endDate: string; totalAmount: number; status: string; source: string; notes?: string | null
  car: { name: string; brand: string; color: string }
}
type CarOption = { id: string; name: string; brand: string }

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-500/10 text-green-400',
  COMPLETED: 'bg-blue-500/10 text-blue-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
}

export default function AdminBookingsClient({ bookings: initial, cars }: { bookings: Booking[]; cars: CarOption[] }) {
  const [bookings, setBookings] = useState(initial)
  const [filter, setFilter] = useState('')
  const [showOffline, setShowOffline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [offlineForm, setOfflineForm] = useState({
    carId: '', customerName: '', customerEmail: '', customerPhone: '', startDate: '', endDate: '', pickupLocation: '', dropoffLocation: '', startTime: '10:00 AM', endTime: '10:00 AM', notes: ''
  })
  const [bookedRanges, setBookedRanges] = useState<{ startDate: string; endDate: string }[]>([])

  useEffect(() => {
    if (!offlineForm.carId) {
      setBookedRanges([])
      return
    }
    fetch(`/api/availability/${offlineForm.carId}`)
      .then((r) => r.json())
      .then((d) => setBookedRanges(d))
      .catch(() => {})
  }, [offlineForm.carId])

  function hasOverlap(start: string, end: string) {
    if (!start || !end) return false
    return bookedRanges.some((r) => {
      const rStart = r.startDate.slice(0, 10)
      const rEnd = r.endDate.slice(0, 10)
      return start <= rEnd && end >= rStart
    })
  }

  const timeOptions = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
  ]

  const filtered = bookings.filter((b) =>
    !filter || b.status === filter
  )

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    })
    if (res.ok) setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status } : b))
  }

  async function createOffline() {
    const { carId, customerName, customerEmail, customerPhone, startDate, endDate, pickupLocation, dropoffLocation, startTime, endTime } = offlineForm
    if (!carId || !customerName || !customerEmail || !customerPhone || !startDate || !endDate || !pickupLocation || !dropoffLocation) return setError('Fill all required fields')
    if (hasOverlap(startDate, endDate)) return setError('This car is not available during the selected dates.')
    
    setLoading(true); setError('')
    try {
      const payload = {
        ...offlineForm,
        notes: `Pickup Loc: ${pickupLocation}, Drop Loc: ${dropoffLocation} | Pickup: ${startTime}, Return: ${endTime}${offlineForm.notes ? ' | ' + offlineForm.notes : ''}`
      }
      const res = await fetch('/api/admin/bookings/offline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      const d = await res.json()
      if (!res.ok) return setError(d.error)
      window.location.reload()
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{bookings.length} total</p>
        </div>
        <button onClick={() => setShowOffline(true)} className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Offline Booking
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[['', 'All'], ['CONFIRMED', 'Confirmed'], ['COMPLETED', 'Completed'], ['CANCELLED', 'Cancelled']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${filter === v ? 'bg-[#22c55e] text-black border-[#22c55e]' : 'bg-[#111] text-gray-400 border-[#1a1a1a] hover:border-[#22c55e]/30'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {['Ref', 'Car', 'Customer', 'Phone', 'Dates', 'Amount', 'Source', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-[#0f0f0f] hover:bg-[#1a1a1a]/30">
                  <td className="px-4 py-3 text-[#22c55e] font-mono text-xs font-semibold whitespace-nowrap">{b.bookingRef}</td>
                  <td className="px-4 py-3 text-white whitespace-nowrap text-xs">{b.car.brand} {b.car.name}<br /><span className="text-gray-500">{b.car.color}</span></td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{b.customerName}<br /><span className="text-gray-500 text-xs">{b.customerEmail}</span></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`https://wa.me/91${b.customerPhone}`} target="_blank" rel="noopener noreferrer" className="text-[#22c55e] text-xs hover:underline">{b.customerPhone}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(b.startDate)}<br />→ {formatDateTime(b.endDate)}</td>
                  <td className="px-4 py-3 text-white whitespace-nowrap">{formatINR(b.totalAmount)}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${b.source === 'OFFLINE' ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'}`}>{b.source}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status] ?? ''}`}>{b.status}</span></td>
                  <td className="px-4 py-3">
                    <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="bg-[#0a0a0a] border border-[#2a2a2a] text-gray-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#22c55e]">
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offline booking modal */}
      {showOffline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
              <h2 className="text-white font-bold">Offline Booking</h2>
              <button onClick={() => setShowOffline(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Car *</label>
                <select value={offlineForm.carId} onChange={(e) => setOfflineForm({ ...offlineForm, carId: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]">
                  <option value="">Select car</option>
                  {cars.map((c) => <option key={c.id} value={c.id}>{c.brand} {c.name}</option>)}
                </select>
              </div>
              {[
                { label: 'Customer Name *', key: 'customerName', type: 'text', placeholder: 'Full name' },
                { label: 'Email *', key: 'customerEmail', type: 'email', placeholder: 'email@example.com' },
                { label: 'Phone *', key: 'customerPhone', type: 'tel', placeholder: '10-digit mobile' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(offlineForm as Record<string, string>)[f.key]}
                    onChange={(e) => setOfflineForm({ ...offlineForm, [f.key]: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Pickup Location *</label>
                  <input type="text" placeholder="Bhubaneswar" value={offlineForm.pickupLocation} onChange={(e) => setOfflineForm({ ...offlineForm, pickupLocation: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Drop-off Location *</label>
                  <input type="text" placeholder="Bhubaneswar" value={offlineForm.dropoffLocation} onChange={(e) => setOfflineForm({ ...offlineForm, dropoffLocation: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Pickup Date & Time *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" min={today} value={offlineForm.startDate} onChange={(e) => setOfflineForm({ ...offlineForm, startDate: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] [color-scheme:dark]" />
                    <select value={offlineForm.startTime} onChange={(e) => setOfflineForm({ ...offlineForm, startTime: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]">
                      {timeOptions.map((t) => <option key={t} value={t}>{t.split(' ')[0]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Return Date & Time *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" min={offlineForm.startDate || today} value={offlineForm.endDate} onChange={(e) => setOfflineForm({ ...offlineForm, endDate: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] [color-scheme:dark]" />
                    <select value={offlineForm.endTime} onChange={(e) => setOfflineForm({ ...offlineForm, endTime: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]">
                      {timeOptions.map((t) => <option key={t} value={t}>{t.split(' ')[0]}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
                <textarea value={offlineForm.notes} onChange={(e) => setOfflineForm({ ...offlineForm, notes: e.target.value })} rows={2}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600 resize-none"
                  placeholder="Cash received, advance amount, etc." />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowOffline(false)} className="flex-1 border border-[#2a2a2a] text-gray-400 py-2.5 rounded-xl text-sm hover:border-[#3a3a3a] transition-colors">Cancel</button>
                <button onClick={createOffline} disabled={loading} className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
