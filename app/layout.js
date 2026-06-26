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

const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('store_theme');
  if(t){
    t=JSON.parse(t);
    var r=document.documentElement;
    if(t.primary)r.style.setProperty('--color-primary',t.primary);
    if(t.primaryFg)r.style.setProperty('--color-primary-fg',t.primaryFg);
    if(t.accent)r.style.setProperty('--color-accent',t.accent);
    if(t.bg)r.style.setProperty('--color-bg',t.bg);
    if(t.surface)r.style.setProperty('--color-surface',t.surface);
    if(t.text)r.style.setProperty('--color-text',t.text);
  }
}catch(e){}})();
`

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
