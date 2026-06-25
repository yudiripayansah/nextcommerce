'use client'

import { useEffect, useState } from 'react'
import { getPage } from '@/services/pages'

export default function HowToBuyPage() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    getPage('how-to-buy').then(setPage).catch(() => {})
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{page?.title || 'Cara Pembelian'}</h1>
      {page?.content ? (
        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Pilih produk yang Anda inginkan</li>
          <li>Tambahkan ke keranjang belanja</li>
          <li>Buka halaman keranjang</li>
          <li>Isi nama dan nomor WhatsApp Anda</li>
          <li>Klik tombol &quot;Pesan via WhatsApp&quot;</li>
          <li>Lanjutkan percakapan dengan penjual di WhatsApp</li>
        </ol>
      )}
    </div>
  )
}
