import { metaTenantBySlug, metaSettings, metaProduct } from '@/lib/firestore-meta'
import ProductPageShell from './ProductPageShell'

export async function generateMetadata({ params }) {
  const { tenant: slug, handle } = await params
  try {
    const tenant = await metaTenantBySlug(slug)
    if (!tenant) return {}

    const [product, settings] = await Promise.all([
      metaProduct(tenant.id, handle),
      metaSettings(tenant.id),
    ])
    if (!product) return {}

    const storeName = settings?.storeName || slug
    const rawDesc = product.description
      ? product.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
      : `${product.title} — tersedia di ${storeName}`

    return {
      title: product.title,
      description: rawDesc,
      openGraph: {
        title: product.title,
        description: rawDesc,
        type: 'website',
        ...(product.featuredImage && {
          images: [{ url: product.featuredImage, width: 800, height: 600, alt: product.title }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: rawDesc,
        ...(product.featuredImage && { images: [product.featuredImage] }),
      },
    }
  } catch {
    return {}
  }
}

export default function ProductPage() {
  return <ProductPageShell />
}
