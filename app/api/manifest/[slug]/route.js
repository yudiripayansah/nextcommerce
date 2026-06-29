import { adminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  const { slug } = await params
  let storeName = slug
  let themeColor = '#111827'

  try {
    const tenantsSnap = await adminDb.collection('tenants').where('slug', '==', slug).get()
    if (!tenantsSnap.empty) {
      const tenantId = tenantsSnap.docs[0].id
      const settingsSnap = await adminDb
        .collection('tenants').doc(tenantId)
        .collection('settings').doc('store')
        .get()
      if (settingsSnap.exists) {
        const s = settingsSnap.data()
        storeName = s.storeName || slug
        themeColor = s.theme?.primary || '#111827'
      }
    }
  } catch {}

  const manifest = {
    name: storeName,
    short_name: storeName.split(' ')[0],
    description: `Toko ${storeName} — belanja via WhatsApp`,
    start_url: `/${slug}`,
    scope: `/${slug}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: themeColor,
    icons: [
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
  }

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
