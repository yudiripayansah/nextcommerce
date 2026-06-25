import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/store/cartStore'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: {
    default: 'OnlineShop',
    template: '%s | OnlineShop',
  },
  description: 'Toko Online',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
