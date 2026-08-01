'use client'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send,
  Compass
} from 'lucide-react'

// Custom inline SVG icons for social platforms to avoid library version mismatches
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-[#0b0c10] border-t border-[#1b2b28]/15 mt-20 pt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Top Bar */}
        <div className="bg-[#0e1116] border border-[#1b2b28]/15 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-16 shadow-lg">
          <div className="max-w-md">
            <h3 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2">
              Subscribe to our newsletter
              {subscribed && <span className="text-xs text-[#22c55e] font-normal px-2 py-1 bg-[#22c55e]/10 rounded-full border border-[#22c55e]/20">Subscribed!</span>}
            </h3>
            <p className="text-gray-400 text-sm">Stay updated with our special offers, latest additions, and rental tips.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md bg-white/5 border border-gray-800 rounded-xl p-1.5 focus-within:border-[#22c55e] transition-colors shrink-0">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-white px-4 py-2.5 outline-none text-sm w-full md:w-64 focus:ring-0"
            />
            <button type="submit" className="bg-[#22c55e] hover:bg-[#1bb853] text-black font-extrabold px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
              <span>Subscribe</span>
              <Send size={14} className="stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-900">
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5 group w-max">
              <Image src="/logo.png" alt="Royal Cars" width={44} height={44} className="object-contain transition-transform group-hover:scale-105" />
              <span className="font-bold text-white text-lg group-hover:text-[#22c55e] transition-colors">
                Royal Cars
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Experience hassle-free premium car rentals. We offer a curated collection of high-performance vehicles for self-drive, backed by round-the-clock roadside assistance.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: <FacebookIcon />, href: '#' },
                { icon: <TwitterIcon />, href: '#' },
                { icon: <InstagramIcon />, href: '#' },
                { icon: <LinkedinIcon />, href: '#' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#22c55e] border border-white/5 hover:border-transparent text-gray-400 hover:text-black flex items-center justify-center transition-all cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3.5 text-sm text-gray-400">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Fleet', href: '/fleet' },
                { label: 'Dealers Location', href: '#' },
                { label: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#22c55e] transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Types Column */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5">Vehicles Type</h4>
            <ul className="space-y-3.5 text-sm text-gray-400">
              {[
                { label: 'Sedans', href: '/fleet?category=sedan' },
                { label: 'SUVs', href: '/fleet?category=suv' },
                { label: 'Hatchbacks', href: '/fleet?category=hatchback' },
                { label: 'MUVs', href: '/fleet?category=muv' },
                { label: 'Coupes', href: '/fleet?category=coupe' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#22c55e] transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#22c55e] mt-0.5 shrink-0" />
                <span>Plot No. 1746/61, 62, Ganganagar Chhak, Unit-6, Bhubaneswar, Odisha</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#22c55e] shrink-0" />
                <a href="tel:9777824577" className="hover:text-[#22c55e] transition-colors">9777824577</a>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#22c55e] shrink-0">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
                <a href="https://wa.me/919078360902" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">9078360902</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#22c55e] shrink-0" />
                <a href="mailto:royalcarbbsr@gmail.com" className="hover:text-[#22c55e] transition-colors">royalcarbbsr@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div>
            © {new Date().getFullYear()} Royal Cars · All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#22c55e] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#22c55e] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
