'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { getProducts, deleteProduct } from '@/services/products'
import { formatCurrency, formatDate } from '@/lib/helpers'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await getProducts({ pageLimit: 50 })
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteProduct(deleteId)
      toast.success('Produk dihapus')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Gagal menghapus produk')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Produk',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          {row.featuredImage && (
            <img src={row.featuredImage} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
          )}
          <Link href={`/admin/products/${row.id}`} className="font-medium text-blue-600 hover:underline">
            {val}
          </Link>
        </div>
      ),
    },
    {
      key: 'minPrice',
      label: 'Harga',
      render: (val, row) =>
        row.minPrice === row.maxPrice
          ? formatCurrency(row.minPrice)
          : `${formatCurrency(row.minPrice)} - ${formatCurrency(row.maxPrice)}`,
    },
    { key: 'totalStock', label: 'Stok', render: (val) => val ?? 0 },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
          {val === 'active' ? 'Aktif' : val}
        </span>
      ),
    },
    { key: 'collectionTitle', label: 'Koleksi', render: (val) => val || '-' },
    { key: 'createdAt', label: 'Dibuat', render: (val) => formatDate(val) },
    {
      key: 'id',
      label: 'Aksi',
      render: (val) => (
        <div className="flex gap-2">
          <Link href={`/admin/products/${val}`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(val)}>Hapus</Button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout title="Produk">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Semua Produk</h2>
          <Link href="/admin/products/new">
            <Button>+ Produk Baru</Button>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          searchable
          searchPlaceholder="Cari produk..."
          emptyTitle="Belum ada produk"
          emptyDescription="Buat produk pertama Anda"
        />
      </div>

      <Modal
        open={!!deleteId}
        title="Hapus Produk"
        danger
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      >
        Apakah Anda yakin ingin menghapus produk ini?
      </Modal>
    </AdminLayout>
  )
}
