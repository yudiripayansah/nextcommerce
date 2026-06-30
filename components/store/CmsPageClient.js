'use client'

import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { getPage } from '@/services/pages'

export default function CmsPageClient({ pageSlug, defaultTitle }) {
  const [page, setPage] = useState(null)
  const { tenant } = useTenant() || {}

  useEffect(() => {
    if (!tenant?.id) return
    getPage(tenant.id, pageSlug).then(setPage).catch(() => {})
  }, [tenant?.id, pageSlug])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
        {page?.title || defaultTitle}
      </h1>
      {page?.content ? (
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>Konten belum tersedia.</p>
      )}
    </div>
  )
}
