'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import { useTenant } from '@/contexts/TenantContext'
import { useTheme } from '@/contexts/ThemeContext'
import { searchProducts } from '@/services/products'
import UrbanFashionSearchPage from '@/components/store/themes/urban-fashion/SearchPage'
import HappyHobbySearchPage from '@/components/store/themes/happy-hobby/SearchPage'

function SearchPageInner() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const { tenant: tenantSlug } = useParams()
  const { tenant } = useTenant() || {}
  const { template } = useTheme() || {}
  const router = useRouter()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!tenant?.id) return
    if (!q.trim()) { setProducts([]); setLoading(false); return }
    setLoading(true)
    searchProducts(tenant.id, q)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [tenant?.id, q])

  function handleSearch(newQuery) {
    const trimmed = newQuery.trim()
    if (!trimmed) return
    router.push(`/${tenantSlug}/search?q=${encodeURIComponent(trimmed)}`)
  }

  const props = { products, loading, query: q, onSearch: handleSearch }

  if (template === 'happy-hobby') return <HappyHobbySearchPage {...props} />
  return <UrbanFashionSearchPage {...props} />
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  )
}
