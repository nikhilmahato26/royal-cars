'use client'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { Menu, X, Phone, Mail, ChevronDown, User, Sun, Compass } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/fleet', label: 'Fleet' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col font-sans">
      {/* Top Promotional Banner */}
      <div className="bg-[#0c1514] text-gray-300 text-xs border-b border-[#1b2b28]/30 py-2 px-4 sm:px-6 hidden lg:flex items-center justify-between">
        {/* Left: Contact info */}
        <div className="flex items-center gap-4">
          <a href="tel:9777824577" className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors">
            <Phone size={12} className="text-[#22c55e]" />
            <span>9777824577</span>
          </a>
          <span className="text-[#1b2b28]/50">|</span>
          <a href="mailto:royalcarbbsr@gmail.com" className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors">
            <Mail size={14} />
            <span>royalcarbbsr@gmail.com</span>
          </a>
        </div>

        {/* Center: Promo Offer */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            More than <strong className="text-white font-semibold">150+</strong> special collection cars in this summer.
          </span>
          <Link href="/fleet" className="bg-[#22c55e] text-black text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-white transition-colors flex items-center gap-0.5 ml-1">
            Access Now <span className="text-[12px] leading-none">→</span>
          </Link>
        </div>

        {/* Right: Contact & WhatsApp */}
        <div className="flex items-center gap-4">
          <a href="https://wa.me/919078360902" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#22c55e]">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
            <span>9078360902</span>
          </a>
          <span className="text-[#1b2b28]/50">|</span>
          <a href="tel:9777824577" className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors">
            <Phone size={12} className="text-[#22c55e]" />
            <span>9777824577</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#1b2b28]/20 h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="Royal Cars" width={100} height={100} className="object-contain transition-transform group-hover:scale-105" />
          {/* <span className="font-bold text-white text-lg hidden sm:block group-hover:text-[#22c55e] transition-colors">
            Royal Cars
          </span> */}
        </Link>

        {/* Middle: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[15px] text-gray-300 hover:text-[#22c55e] font-medium transition-colors flex items-center gap-1 group py-2"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Mobile Menu Toggle only (hidden on desktop) */}
        <div className="flex items-center gap-4">
          {/* Green hamburger menu icon (hidden on desktop) */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden bg-[#22c55e] hover:bg-[#1bb853] text-black p-3 rounded-lg flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(34,197,94,0.2)]"
          >
            {open ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-[#0d0e12] border-t border-[#1b2b28]/20 py-5 px-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-[#22c55e] font-semibold text-lg py-1 border-b border-gray-900 flex items-center justify-between"
            >
              <span>{link.label}</span>
            </Link>
          ))}
          {/* Removed CTA buttons for mobile to keep navbar simple */}
        </div>
      )}
    </header>
  )
}
