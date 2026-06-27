'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'

export default function AccountLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { customerUser, customer, loading, logout } = useCustomerAuth()
  const { slug } = useTenant()

  useEffect(() => {
    if (!loading && !customerUser) {
      router.replace(`/${slug}/account/login`)
    }
  }, [loading, customerUser, router, slug])

  if (loading || !customerUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  const navItems = [
    {
      href: `/${slug}/account`,
      label: 'Akun Saya',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      href: `/${slug}/account/orders`,
      label: 'Riwayat Pesanan',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      href: `/${slug}/account/addresses`,
      label: 'Buku Alamat',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const isActive = (href) => {
    if (href === `/${slug}/account`) return pathname === `/${slug}/account`
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await logout()
    router.push(`/${slug}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{customer?.name}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{customerUser.email}</p>
            </div>
            <nav className="p-2">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={
                      active
                        ? { background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }
                        : undefined
                    }
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
