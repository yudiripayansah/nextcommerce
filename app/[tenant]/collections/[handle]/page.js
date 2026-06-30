import { metaTenantBySlug, metaSettings, metaCollection } from '@/lib/firestore-meta'
import CollectionPageShell from './CollectionPageShell'

export async function generateMetadata({ params }) {
  const { tenant: slug, handle } = await params
  try {
    const tenant = await metaTenantBySlug(slug)
    if (!tenant) return {}

    const [collection, settings] = await Promise.all([
      metaCollection(tenant.id, handle),
      metaSettings(tenant.id),
    ])
    if (!collection) return {}

    const storeName = settings?.storeName || slug
    const desc = collection.description
      ? collection.description.slice(0, 160).trim()
      : `Koleksi ${collection.title} — belanja di ${storeName}`

    return {
      title: collection.title,
      description: desc,
      openGraph: {
        title: collection.title,
        description: desc,
        type: 'website',
        ...(collection.image && {
          images: [{ url: collection.image, width: 800, height: 600, alt: collection.title }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: collection.title,
        description: desc,
        ...(collection.image && { images: [collection.image] }),
      },
    }
  } catch {
    return {}
  }
}

export default function CollectionDetailPage() {
  return <CollectionPageShell />
}
