import TenantStoreShell from './TenantStoreShell'
import { getTenantBySlug } from '@/services/tenants'
import { getSettings } from '@/services/settings'

export async function generateMetadata({ params }) {
  const { tenant: slug } = await params
  try {
    const tenant = await getTenantBySlug(slug)
    if (!tenant) return { manifest: `/api/manifest/${slug}` }

    const settings = await getSettings(tenant.id)
    const storeName = settings?.storeName || slug
    const ogImage = settings?.logo || null

    return {
      manifest: `/api/manifest/${slug}`,
      title: {
        default: storeName,
        template: `%s | ${storeName}`,
      },
      description: `Toko online ${storeName} — temukan produk terbaik dan pesan via WhatsApp`,
      openGraph: {
        siteName: storeName,
        locale: 'id_ID',
        type: 'website',
        ...(ogImage && {
          images: [{ url: ogImage, width: 800, height: 600, alt: storeName }],
        }),
      },
      twitter: {
        card: ogImage ? 'summary_large_image' : 'summary',
        ...(ogImage && { images: [ogImage] }),
      },
    }
  } catch {
    return { manifest: `/api/manifest/${slug}` }
  }
}

export default async function TenantLayout({ children, params }) {
  const { tenant } = await params
  return <TenantStoreShell slug={tenant}>{children}</TenantStoreShell>
}
