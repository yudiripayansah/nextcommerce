import { Suspense } from 'react'
import SearchPageInner from './SearchPageInner'

export const metadata = {
  title: 'Pencarian Produk',
  description: 'Cari produk yang kamu inginkan.',
  robots: { index: false },
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  )
}
