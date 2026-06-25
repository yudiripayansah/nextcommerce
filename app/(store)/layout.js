import { SettingsProvider } from '@/contexts/SettingsContext'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'

export default function StoreLayout({ children }) {
  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SettingsProvider>
  )
}
