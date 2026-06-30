import CmsPageClient from '@/components/store/CmsPageClient'

export const metadata = {
  title: 'Cara Berbelanja',
  description: 'Panduan cara berbelanja dan memesan produk via WhatsApp.',
}

export default function HowToBuyPage() {
  return <CmsPageClient pageSlug="how-to-buy" defaultTitle="Cara Berbelanja" />
}
