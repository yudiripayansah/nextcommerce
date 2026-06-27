'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/contexts/SettingsContext'
import { useCart } from '@/store/cartStore'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'

export default function HappyHobbyHeader() {
  const settings = useSettings()
  const { state } = useCart()
  const { customer } = useCustomerAuth() || {}
  const { slug } = useTenant()
  const [menuOpen, setMenuOpen] = useState(false)

  const cartCount = state?.items?.reduce((s, i) => s + i.quantity, 0) || 0
  const storeName = settings?.storeName || 'MyShop'

  const navLinks = [
    { href: `/${slug}/collections`, label: 'Semua Produk' },
    { href: `/${slug}/about-us`, label: 'Tentang Kami' },
    { href: `/${slug}/how-to-buy`, label: 'Cara Beli' },
    { href: `/${slug}/contact-us`, label: 'Kontak' },
  ]

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div
        className="text-center py-2 text-xs font-medium tracking-wide"
        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
      >
        🎉 Gratis Ongkir Min. Belanja Rp200.000!
      </div>

      {/* Main nav */}
      <div className="bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href={`/${slug}`} className="font-extrabold text-lg flex-shrink-0" style={{ color: 'var(--color-primary)' }}>
            {settings?.logo ? (
              <img src={settings.logo} alt={storeName} className="h-8 object-contain" />
            ) : (
              storeName
            )}
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-white"
                style={{ color: 'var(--color-text)', borderRadius: 'var(--tm-radius-pill)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-primary)'
                  e.currentTarget.style.color = 'var(--color-primary-fg)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Account */}
            <Link
              href={customer ? `/${slug}/account` : `/${slug}/account/login`}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={customer ? `Halo, ${customer.name}` : 'Login'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link href={`/${slug}/cart`} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={customer ? `/${slug}/account` : `/${slug}/account/login`}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              {customer ? `Akun (${customer.name})` : 'Login / Daftar'}
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
