'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/products/ProductForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { getProductById, updateProduct } from '@/services/products'
import toast from 'react-hot-toast'

export default function EditProductPage() {
  const { id } = useParams()
  const { tenantId } = useAuth()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    getProductById(tenantId, id).then(setData).finally(() => setLoading(false))
  }, [tenantId, id])

  async function handleSubmit(form) {
    setSaving(true)
    try {
      await updateProduct(tenantId, id, form)
      toast.success('Produk berhasil disimpan')
      router.push('/admin/products')
    } catch {
      toast.error('Gagal menyimpan produk')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminLayout title="Edit Produk"><LoadingSpinner className="py-16" /></AdminLayout>
  if (!data) return <AdminLayout title="Edit Produk"><p className="text-gray-500">Produk tidak ditemukan.</p></AdminLayout>

  return (
    <AdminLayout title="Edit Produk">
      <ProductForm initialData={data} onSubmit={handleSubmit} loading={saving} />
    </AdminLayout>
  )
}
