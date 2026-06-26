'use client'

import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { getPage } from '@/services/pages'

export default function AboutUsPage() {
  const [page, setPage] = useState(null)
  const { tenant } = useTenant() || {}

  useEffect(() => {
    if (!tenant?.id) return
    getPage(tenant.id, 'about-us').then(setPage).catch(() => {})
  }, [tenant?.id])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{page?.title || 'Tentang Kami'}</h1>
      {page?.content ? (
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p className="text-gray-500">Konten belum tersedia.</p>
      )}
    </div>
  )
}
