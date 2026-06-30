'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import { useSettings } from '@/contexts/SettingsContext'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'

const NAV_STYLE = { color: 'var(--color-text)', opacity: 0.7 }

export default function UrbanFashionHeader() {
  const { totalItems } = useCart()
  const settings = useSettings()
  const { customerUser } = useCustomerAuth()
  const { slug } = useTenant()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const navLinks = [
    { href: `/${slug}/collections`, label: 'Koleksi' },
    { href: `/${slug}/about-us`, label: 'Tentang Kami' },
    { href: `/${slug}/how-to-buy`, label: 'Cara Beli' },
    { href: `/${slug}/contact-us`, label: 'Kontak' },
  ]

  function openSearch() {
    setMenuOpen(false)
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  function closeSearch() {
    setSearchOpen(false)
    setSearchQuery('')
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    closeSearch()
    router.push(`/${slug}/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      {/* Announcement bar */}
      {settings?.content?.announcement !== '' && (
        <div
          className="text-xs text-center py-2 tracking-widest uppercase"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
        >
          {settings?.content?.announcement ?? 'Pesan via WhatsApp — Gratis Ongkir seluruh Indonesia'}
        </div>
      )}

      <header
        className="sticky top-0 z-40"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Left: Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase transition-opacity hover:opacity-100"
                style={NAV_STYLE}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}
            aria-label="Menu"
            style={{ color: 'var(--color-text)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Center: Logo */}
          <Link href={`/${slug}`} className="absolute left-1/2 -translate-x-1/2">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.storeName} className="h-7 object-contain" />
            ) : (
              <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--color-text)' }}>
                {settings?.storeName || 'Store'}
              </span>
            )}
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-3">
            <Link href={`/${slug}/contact-us`} className="hidden md:block text-xs tracking-widest uppercase transition-opacity hover:opacity-100" style={NAV_STYLE}>
              Kontak
            </Link>

            {/* Search icon */}
            <button onClick={openSearch} className="p-1 transition-opacity hover:opacity-60" aria-label="Cari" style={{ color: 'var(--color-text)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href={customerUser ? `/${slug}/account` : `/${slug}/account/login`} className="p-1" aria-label="Akun" style={{ color: 'var(--color-text)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <Link href={`/${slug}/cart`} className="relative p-1" aria-label="Cart" style={{ color: 'var(--color-text)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <>
            <div
              className="absolute inset-x-0 top-full shadow-lg z-50"
              style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
            >
              <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="flex-1 text-sm py-1 bg-transparent outline-none"
                  style={{ color: 'var(--color-text)' }}
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-1 transition-opacity hover:opacity-60"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label="Tutup"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
            <div className="fixed inset-0 z-30" onClick={closeSearch} />
          </>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden px-4 py-4 space-y-4"
            style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-xs tracking-widest uppercase"
                style={{ color: 'var(--color-text)' }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={openSearch}
              className="block text-xs tracking-widest uppercase w-full text-left"
              style={{ color: 'var(--color-text)' }}
            >
              Cari Produk
            </button>
          </div>
        )}
      </header>
    </>
  )
}
