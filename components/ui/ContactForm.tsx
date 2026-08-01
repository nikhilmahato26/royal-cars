'use client'
import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    setError('')

    const errors: Record<string, string> = {}
    if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
    if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number'
    if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) {
        const match = d.error?.match(/^(\w+):\s*(.+)$/)
        if (match) {
          setFieldErrors({ [match[1]]: match[2] })
          return
        }
        return setError(d.error || 'Submission failed')
      }
      setSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#111] border border-[#22c55e]/30 rounded-2xl p-10 text-center">
        <CheckCircle size={48} className="text-[#22c55e] mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
        <p className="text-gray-400">We&apos;ll get back to you within a few hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 space-y-4">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Full Name *</span>
            {fieldErrors.name && <span className="text-red-400">{fieldErrors.name}</span>}
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full bg-[#0a0a0a] border ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none placeholder-gray-600`} placeholder="Your name" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>Phone *</span>
            {fieldErrors.phone && <span className="text-red-400">{fieldErrors.phone}</span>}
          </label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full bg-[#0a0a0a] border ${fieldErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none placeholder-gray-600`} placeholder="10-digit mobile" />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>Email *</span>
          {fieldErrors.email && <span className="text-red-400">{fieldErrors.email}</span>}
        </label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full bg-[#0a0a0a] border ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none placeholder-gray-600`} placeholder="your@email.com" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>Message *</span>
          {fieldErrors.message && <span className="text-red-400">{fieldErrors.message}</span>}
        </label>
        <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`w-full bg-[#0a0a0a] border ${fieldErrors.message ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#22c55e]'} rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none placeholder-gray-600 resize-none`} placeholder="Tell us about your rental needs..." />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {loading && <Loader2 size={16} className="animate-spin" />}
        Send Message
      </button>
    </form>
  )
}
