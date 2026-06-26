import { SettingsProvider } from '@/contexts/SettingsContext'
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import FaviconSync from '@/components/store/FaviconSync'

export default function StoreLayout({ children }) {
  return (
    <SettingsProvider>
      <CustomerAuthProvider>
        <ThemeProvider>
          <FaviconSync />
          <div id="store-shell" className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </CustomerAuthProvider>
    </SettingsProvider>
  )
}
