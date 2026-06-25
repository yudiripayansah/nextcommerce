'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import CollectionForm from '@/components/admin/collections/CollectionForm'
import { createCollection } from '@/services/collections'
import toast from 'react-hot-toast'

export default function NewCollectionPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(data) {
    setLoading(true)
    try {
      await createCollection(data)
      toast.success('Koleksi berhasil dibuat')
      router.push('/admin/collections')
    } catch {
      toast.error('Gagal membuat koleksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Koleksi Baru">
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <CollectionForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </AdminLayout>
  )
}
