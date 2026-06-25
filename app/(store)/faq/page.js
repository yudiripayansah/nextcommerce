'use client'

import { useEffect, useState } from 'react'
import { getPage } from '@/services/pages'

export default function FaqPage() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    getPage('faq').then(setPage).catch(() => {})
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{page?.title || 'FAQ'}</h1>
      {page?.content ? (
        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p className="text-gray-500">Konten belum tersedia.</p>
      )}
    </div>
  )
}
