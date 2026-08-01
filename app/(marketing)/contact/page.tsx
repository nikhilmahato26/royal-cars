import ContactForm from '@/components/ui/ContactForm'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export const metadata = { title: 'Contact Us — Royal Cars Bhubaneswar' }

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-10 lg:pt-44">
      <div className="text-center mb-12">
        <p className="text-[#22c55e] text-sm font-semibold uppercase tracking-wider mb-2">Get in Touch</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contact Royal Cars</h1>
        <p className="text-gray-400 max-w-xl mx-auto">Have a question or want a custom quote? Reach out and we&apos;ll get back to you quickly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          {[
            { icon: <Phone size={18} className="text-[#22c55e]" />, title: 'Call', lines: ['+91 9777824577'] },
            { icon: <MessageCircle size={18} className="text-[#22c55e]" />, title: 'WhatsApp', lines: ['+91 9078360902'] },
            { icon: <Mail size={18} className="text-[#22c55e]" />, title: 'Email', lines: ['royalcarbbsr@gmail.com'] },
            { icon: <MapPin size={18} className="text-[#22c55e]" />, title: 'Location', lines: ['Plot No. 1746/61, 62', 'Ganganagar Chhak, Unit-6', 'Bhubaneswar, Odisha'] },
            { icon: <Clock size={18} className="text-[#22c55e]" />, title: 'Working Hours', lines: ['Mon–Sun: 8 AM – 8 PM'] },
          ].map((c) => (
            <div key={c.title} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex gap-4">
              <div className="mt-0.5">{c.icon}</div>
              <div>
                <div className="text-white font-medium text-sm mb-1">{c.title}</div>
                {c.lines.map((l) => <div key={l} className="text-gray-400 text-sm">{l}</div>)}
              </div>
            </div>
          ))}

          <a
            href="https://wa.me/919078360902?text=Hi%20Royal%20Cars%2C%20I%20want%20to%20enquire%20about%20a%20car%20rental"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 text-[#25D366] font-semibold px-5 py-3 rounded-xl transition-all w-full justify-center"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
