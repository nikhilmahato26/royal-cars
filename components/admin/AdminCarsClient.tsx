'use client'
import { useState } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, Car, Loader2, X, Upload } from 'lucide-react'
import { formatINR } from '@/lib/utils'

type CarRow = {
  id: string; slug: string; name: string; brand: string; color: string
  category: string; seats: number; fuelType: string; transmission: string
  pricePerDay: number; images: string[]; features: string[]; isActive: boolean
}

const FEATURES_LIST = ['AC', 'Music System', 'GPS', 'Bluetooth', 'USB Charging', 'Airbags', 'Sunroof', 'Reverse Camera', 'Power Windows', 'Central Locking']

const emptyForm = { name: '', brand: '', color: '', category: 'hatchback', seats: 5, fuelType: 'petrol', transmission: 'manual', pricePerDay: 0, images: [] as string[], features: [] as string[], isActive: true }

export default function AdminCarsClient({ initialCars }: { initialCars: CarRow[] }) {
  const [cars, setCars] = useState(initialCars)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImg, setUploadingImg] = useState(false)

  function openCreate() { setForm({ ...emptyForm }); setEditing(null); setShowForm(true); setError('') }
  function openEdit(c: CarRow) {
    setForm({ name: c.name, brand: c.brand, color: c.color, category: c.category, seats: c.seats, fuelType: c.fuelType, transmission: c.transmission, pricePerDay: c.pricePerDay, images: [...c.images], features: [...c.features], isActive: c.isActive })
    setEditing(c.id); setShowForm(true); setError('')
  }

  async function uploadImage(file: File) {
    setUploadingImg(true)
    try {
      const sigRes = await fetch('/api/admin/cloudinary-signature')
      const { signature, timestamp, apiKey, cloudName } = await sigRes.json()
      const fd = new FormData()
      fd.append('file', file)
      fd.append('api_key', apiKey)
      fd.append('timestamp', timestamp)
      fd.append('signature', signature)
      fd.append('folder', 'royal-cars')
      const r = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
      const d = await r.json()
      setForm((f) => ({ ...f, images: [...f.images, d.secure_url] }))
    } catch {
      setError('Image upload failed')
    } finally {
      setUploadingImg(false)
    }
  }

  async function save() {
    if (!form.name || !form.brand || !form.color || form.pricePerDay <= 0) return setError('Fill in all required fields')
    setLoading(true); setError('')
    try {
      const url = editing ? `/api/admin/cars/${editing}` : '/api/admin/cars'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, pricePerDay: Number(form.pricePerDay), seats: Number(form.seats) }) })
      const d = await res.json()
      if (!res.ok) return setError(d.error || 'Save failed')
      if (editing) {
        setCars((cs) => cs.map((c) => c.id === editing ? { ...c, ...d } : c))
      } else {
        setCars((cs) => [d, ...cs])
      }
      setShowForm(false)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/cars/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) })
    if (res.ok) setCars((cs) => cs.map((c) => c.id === id ? { ...c, isActive: !current } : c))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Fleet</h1>
          <p className="text-gray-400 text-sm mt-0.5">{cars.length} total · {cars.filter(c => c.isActive).length} active</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Car
        </button>
      </div>

      {/* Car grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((c) => (
          <div key={c.id} className={`bg-[#111] border rounded-xl overflow-hidden transition-all ${c.isActive ? 'border-[#1a1a1a]' : 'border-[#1a1a1a] opacity-60'}`}>
            <div className="aspect-video bg-[#1a1a1a] relative">
              {c.images[0] ? <img src={c.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Car size={32} className="text-[#2a2a2a]" /></div>}
              <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white">{c.brand} {c.name}</h3>
              <p className="text-gray-500 text-xs mb-2">{c.color} · {c.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#22c55e] font-bold">{formatINR(c.pricePerDay)}<span className="text-gray-500 font-normal text-xs">/day</span></span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => toggleActive(c.id, c.isActive)} className={`p-1.5 rounded-lg transition-colors ${c.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-[#2a2a2a]'}`}>
                    {c.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {cars.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-500">
            <Car size={40} className="mx-auto mb-3 opacity-20" />
            <p>No cars yet. Add your first car!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
              <h2 className="text-white font-bold">{editing ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Brand *</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Maruti" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Model *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Swift Dzire" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Color *</label>
                  <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g. Pearl White" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e] placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price / Day (₹) *</label>
                  <input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]">
                    {['hatchback', 'sedan', 'suv', 'muv'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fuel</label>
                  <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]">
                    {['petrol', 'diesel', 'cng', 'ev'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Gearbox</label>
                  <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]">
                    {['manual', 'automatic'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Seats</label>
                <input type="number" min={2} max={10} value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <img src={img} className="w-full h-full object-cover rounded-lg" />
                      <button onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white"><X size={8} /></button>
                    </div>
                  ))}
                  <label className="w-16 h-16 bg-[#0a0a0a] border border-dashed border-[#2a2a2a] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#22c55e] transition-colors">
                    {uploadingImg ? <Loader2 size={16} className="text-gray-500 animate-spin" /> : <Upload size={16} className="text-gray-500" />}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Features</label>
                <div className="flex flex-wrap gap-2">
                  {FEATURES_LIST.map((f) => (
                    <button key={f} type="button" onClick={() => setForm((ff) => ({ ...ff, features: ff.features.includes(f) ? ff.features.filter((x) => x !== f) : [...ff.features, f] }))}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${form.features.includes(f) ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]' : 'bg-[#0a0a0a] border-[#2a2a2a] text-gray-400'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-[#2a2a2a] text-gray-400 py-2.5 rounded-xl text-sm hover:border-[#3a3a3a] transition-colors">Cancel</button>
                <button onClick={save} disabled={loading} className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {editing ? 'Save Changes' : 'Add Car'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
