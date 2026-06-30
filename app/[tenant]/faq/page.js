import CmsPageClient from '@/components/store/CmsPageClient'

export const metadata = {
  title: 'FAQ',
  description: 'Pertanyaan yang sering ditanyakan.',
}

export default function FaqPage() {
  return <CmsPageClient pageSlug="faq" defaultTitle="FAQ" />
}
