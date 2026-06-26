'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import { useSettings } from '@/contexts/SettingsContext'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'

const navLinks = [
  { href: '/collections/kaos-pria', label: 'Pria' },
  { href: '/collections/kaos-wanita', label: 'Wanita' },
  { href: '/collections/celana', label: 'Celana' },
  { href: '/collections/aksesoris', label: 'Aksesoris' },
]

export default function Header() {
  const { totalItems } = useCart()
  const settings = useSettings()
  const { customerUser } = useCustomerAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

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
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      {/* Announcement bar */}
      <div
        className="text-xs text-center py-2 tracking-widest uppercase"
        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
      >
        Pesan via WhatsApp — Gratis Ongkir seluruh Indonesia
      </div>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Left: Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-gray-700 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/collections" className="text-xs tracking-widest uppercase text-gray-700 hover:text-black transition-colors">
              Semua
            </Link>
          </nav>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.storeName} className="h-7 object-contain" />
            ) : (
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-black">
                {settings?.storeName || 'FashionKita'}
              </span>
            )}
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-3">
            <Link href="/about-us" className="hidden md:block text-xs tracking-widest uppercase text-gray-700 hover:text-black transition-colors">
              Tentang
            </Link>

            {/* Search icon */}
            <button
              onClick={openSearch}
              className="p-1 text-gray-800 hover:text-black transition-colors"
              aria-label="Cari"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href={customerUser ? '/account' : '/account/login'} className="p-1" aria-label="Akun">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link href="/cart" className="relative p-1" aria-label="Cart">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="absolute inset-x-0 top-full bg-white border-b border-gray-100 shadow-lg z-50">
              <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="flex-1 text-sm py-1 bg-transparent outline-none placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Tutup"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30" onClick={closeSearch} />
          </>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-xs tracking-widest uppercase text-gray-700"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/collections" onClick={() => setMenuOpen(false)} className="block text-xs tracking-widest uppercase text-gray-700">
              Semua
            </Link>
            <Link href="/about-us" onClick={() => setMenuOpen(false)} className="block text-xs tracking-widest uppercase text-gray-700">
              Tentang Kami
            </Link>
            <button
              onClick={openSearch}
              className="block text-xs tracking-widest uppercase text-gray-700 w-full text-left"
            >
              Cari Produk
            </button>
          </div>
        )}
      </header>
    </>
  )
}
