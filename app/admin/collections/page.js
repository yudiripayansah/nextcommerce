'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { getCollections, deleteCollection } from '@/services/collections'
import { formatDate } from '@/lib/helpers'
import toast from 'react-hot-toast'

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await getCollections()
      setCollections(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCollection(deleteId)
      toast.success('Koleksi dihapus')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Gagal menghapus koleksi')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Judul',
      render: (val, row) => (
        <Link href={`/admin/collections/${row.id}`} className="font-medium text-blue-600 hover:underline">
          {val}
        </Link>
      ),
    },
    { key: 'handle', label: 'Handle' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
          {val === 'active' ? 'Aktif' : 'Draft'}
        </span>
      ),
    },
    { key: 'productCount', label: 'Produk', render: (val) => val || 0 },
    { key: 'createdAt', label: 'Dibuat', render: (val) => formatDate(val) },
    {
      key: 'id',
      label: 'Aksi',
      render: (val) => (
        <div className="flex gap-2">
          <Link href={`/admin/collections/${val}`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(val)}>Hapus</Button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout title="Koleksi">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Semua Koleksi</h2>
          <Link href="/admin/collections/new">
            <Button>+ Koleksi Baru</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={collections}
          loading={loading}
          searchable
          searchPlaceholder="Cari koleksi..."
          emptyTitle="Belum ada koleksi"
          emptyDescription="Buat koleksi pertama Anda"
        />
      </div>

      <Modal
        open={!!deleteId}
        title="Hapus Koleksi"
        danger
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      >
        Apakah Anda yakin ingin menghapus koleksi ini? Tindakan ini tidak dapat dibatalkan.
      </Modal>
    </AdminLayout>
  )
}
