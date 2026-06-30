import CmsPageClient from '@/components/store/CmsPageClient'

export const metadata = {
  title: 'Tentang Kami',
  description: 'Pelajari lebih lanjut tentang toko kami.',
}

export default function AboutUsPage() {
  return <CmsPageClient pageSlug="about-us" defaultTitle="Tentang Kami" />
}
