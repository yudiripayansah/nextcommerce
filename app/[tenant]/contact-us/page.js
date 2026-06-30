import CmsPageClient from '@/components/store/CmsPageClient'

export const metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi kami untuk pertanyaan dan bantuan pembelian.',
}

export default function ContactUsPage() {
  return <CmsPageClient pageSlug="contact-us" defaultTitle="Hubungi Kami" />
}
