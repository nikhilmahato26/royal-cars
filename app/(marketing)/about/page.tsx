import { CheckCircle, Shield, Zap, Star, Car, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Royal Cars Bhubaneswar',
}

const values = [
  { icon: <Shield className="text-[#22c55e]" size={22} />, title: 'Safety First', desc: 'Every car in our fleet is regularly inspected, insured, and maintained to the highest standard.' },
  { icon: <CheckCircle className="text-[#22c55e]" size={22} />, title: 'Transparent Pricing', desc: 'No hidden charges, no surprises. The price you see is the price you pay.' },
  { icon: <Zap className="text-[#22c55e]" size={22} />, title: 'Quick Booking', desc: 'Book your car in under 3 minutes from any device, any time.' },
  { icon: <Heart className="text-[#22c55e]" size={22} />, title: 'Customer First', desc: 'We go above and beyond to make your rental experience seamless and memorable.' },
]

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-10 lg:pt-44">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-[#22c55e] text-sm font-semibold uppercase tracking-wider mb-2">Our Story</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">About Royal Cars</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Born in Bhubaneswar, built for Bhubaneswar. Royal Cars started in 2024 with a simple mission: give people the freedom to drive on their own terms, with a fleet they can trust.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="Royal Cars" width={52} height={52} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Why We Exist</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We noticed that renting a car in Bhubaneswar was either too expensive, too complicated, or came with too many hidden costs. We built Royal Cars to change that — offering a premium self-drive experience at honest prices.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Every car in our fleet is personally selected, regularly serviced, and fully insured. We handle the logistics, you handle the adventure.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '50+', label: 'Happy Customers' },
            { value: '10+', label: 'Cars in Fleet' },
            { value: '2024', label: 'Founded' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-[#22c55e] mb-1">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <p className="text-[#22c55e] text-sm font-semibold uppercase tracking-wider mb-2">What We Stand For</p>
          <h2 className="text-2xl font-bold text-white">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="mb-3">{v.icon}</div>
              <h3 className="text-white font-semibold mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#22c55e]/10 to-[#16a34a]/10 border border-[#22c55e]/20 rounded-2xl p-8 text-center">
        <Car size={40} className="text-[#22c55e] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Ready to Drive?</h3>
        <p className="text-gray-400 mb-5">Join hundreds of satisfied customers. Book your Royal Cars experience today.</p>
        <Link href="/fleet" className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold px-8 py-3 rounded-xl transition-all">
          Browse Fleet
        </Link>
      </div>
    </div>
  )
}
