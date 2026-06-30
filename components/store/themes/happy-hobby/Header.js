'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/contexts/SettingsContext'
import { useCart } from '@/store/cartStore'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'

export default function HappyHobbyHeader() {
  const settings = useSettings()
  const { state } = useCart()
  const { customer } = useCustomerAuth() || {}
  const { slug } = useTenant()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const searchInputRef = useRef(null)

  const cartCount = state?.items?.reduce((s, i) => s + i.quantity, 0) || 0
  const storeName = settings?.storeName || 'MyShop'

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = searchVal.trim()
    if (!q) return
    setSearchOpen(false)
    setSearchVal('')
    router.push(`/${slug}/search?q=${encodeURIComponent(q)}`)
  }

  function openSearch() {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  const navLinks = [
    { href: `/${slug}/collections`, label: 'Semua Produk' },
    { href: `/${slug}/about-us`, label: 'Tentang Kami' },
    { href: `/${slug}/how-to-buy`, label: 'Cara Beli' },
    { href: `/${slug}/contact-us`, label: 'Kontak' },
  ]

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      {settings?.content?.announcement !== '' && (
        <div
          className="text-center py-2 text-xs font-medium tracking-wide"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
        >
          {settings?.content?.announcement ?? '🎉 Gratis Ongkir Min. Belanja Rp200.000!'}
        </div>
      )}

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
            {/* Search */}
            <button
              onClick={openSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Cari produk"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

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

        {/* Search overlay */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white py-3 px-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl mx-auto">
              <div
                className="flex-1 flex items-center gap-2 bg-white px-4 py-2"
                style={{ borderRadius: 'var(--tm-radius-pill)', border: '2px solid var(--color-primary)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Cari produk favoritmu..."
                  className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 font-medium"
                  style={{ color: 'var(--color-text)' }}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-extrabold flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
              >
                Cari
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        )}

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
