'use client'

import { TenantProvider, useTenant } from '@/contexts/TenantContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/store/cartStore'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import FaviconSync from '@/components/store/FaviconSync'
import PWAInstallPrompt from '@/components/store/PWAInstallPrompt'
import ServiceWorkerRegistrar from '@/components/store/ServiceWorkerRegistrar'
import StoreErrorBoundary from '@/components/store/StoreErrorBoundary'

function StoreShellInner({ slug, children }) {
  const { tenant, loading } = useTenant()

  if (!loading && !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Toko tidak ditemukan</p>
          <p className="text-gray-500">Periksa kembali URL toko yang Anda kunjungi.</p>
        </div>
      </div>
    )
  }

  return (
    <CartProvider storageKey={`nc_cart_${slug}`}>
      <SettingsProvider tenantId={tenant?.id}>
        <CustomerAuthProvider tenantId={tenant?.id}>
          <ThemeProvider>
            <ServiceWorkerRegistrar />
            <FaviconSync />
            <div id="store-shell" className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <PWAInstallPrompt />
          </ThemeProvider>
        </CustomerAuthProvider>
      </SettingsProvider>
    </CartProvider>
  )
}

export default function TenantStoreShell({ slug, children }) {
  return (
    <StoreErrorBoundary>
      <TenantProvider slug={slug}>
        <StoreShellInner slug={slug}>
          {children}
        </StoreShellInner>
      </TenantProvider>
    </StoreErrorBoundary>
  )
}
