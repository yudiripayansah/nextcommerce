'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import CollectionForm from '@/components/admin/collections/CollectionForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { getCollectionById, updateCollection } from '@/services/collections'
import toast from 'react-hot-toast'

export default function EditCollectionPage() {
  const { id } = useParams()
  const { tenantId } = useAuth()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    getCollectionById(tenantId, id).then(setData).finally(() => setLoading(false))
  }, [tenantId, id])

  async function handleSubmit(form) {
    setSaving(true)
    try {
      await updateCollection(tenantId, id, form)
      toast.success('Koleksi berhasil disimpan')
      router.push('/admin/collections')
    } catch {
      toast.error('Gagal menyimpan koleksi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminLayout title="Edit Koleksi"><LoadingSpinner className="py-16" /></AdminLayout>
  if (!data) return <AdminLayout title="Edit Koleksi"><p className="text-gray-500">Koleksi tidak ditemukan.</p></AdminLayout>

  return (
    <AdminLayout title="Edit Koleksi">
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <CollectionForm initialData={data} onSubmit={handleSubmit} loading={saving} />
      </div>
    </AdminLayout>
  )
}
