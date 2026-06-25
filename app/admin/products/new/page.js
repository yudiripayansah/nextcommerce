'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/products/ProductForm'
import { createProduct } from '@/services/products'
import toast from 'react-hot-toast'

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(data) {
    setLoading(true)
    try {
      await createProduct(data)
      toast.success('Produk berhasil dibuat')
      router.push('/admin/products')
    } catch {
      toast.error('Gagal membuat produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Produk Baru">
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  )
}
