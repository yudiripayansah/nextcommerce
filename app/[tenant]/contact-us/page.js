'use client'

import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { getPage } from '@/services/pages'

export default function ContactUsPage() {
  const [page, setPage] = useState(null)
  const { tenant } = useTenant() || {}

  useEffect(() => {
    if (!tenant?.id) return
    getPage(tenant.id, 'contact-us').then(setPage).catch(() => {})
  }, [tenant?.id])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{page?.title || 'Hubungi Kami'}</h1>
      {page?.content ? (
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p className="text-gray-500">Konten belum tersedia.</p>
      )}
    </div>
  )
}
