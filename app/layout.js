import './globals.css'
import { SuperAdminProvider } from '@/contexts/SuperAdminContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: {
    default: 'NextCommerce',
    template: '%s | NextCommerce',
  },
  description: 'Platform toko online untuk UMKM Indonesia',
}

// Apply per-tenant theme instantly before React hydrates to prevent flash.
// Only reads the slug-specific key — no fallback to the no-suffix key which may hold stale data.
const themeInitScript = `
(function(){try{
  var slug=window.location.pathname.split('/')[1];
  if(!slug)return;
  var skip=['admin','superadmin','login','register','api',''];
  if(skip.indexOf(slug)!==-1)return;
  var t=localStorage.getItem('store_theme_'+slug);
  if(!t)return;
  t=JSON.parse(t);
  var r=document.documentElement;
  if(t.template)r.setAttribute('data-template',t.template);
  if(t.primary)r.style.setProperty('--color-primary',t.primary);
  if(t.primaryFg)r.style.setProperty('--color-primary-fg',t.primaryFg);
  if(t.accent)r.style.setProperty('--color-accent',t.accent);
  if(t.bg)r.style.setProperty('--color-bg',t.bg);
  if(t.surface)r.style.setProperty('--color-surface',t.surface);
  if(t.text)r.style.setProperty('--color-text',t.text);
}catch(e){}})();
`

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SuperAdminProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </SuperAdminProvider>
      </body>
    </html>
  )
}
