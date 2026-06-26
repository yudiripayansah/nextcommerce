'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Pagination from '@/components/ui/Pagination'
import { getProducts, deleteProduct } from '@/services/products'
import { formatCurrency, formatDate } from '@/lib/helpers'
import toast from 'react-hot-toast'

const PAGE_SIZES = [10, 20, 50, 100]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [deleteId, setDeleteId] = useState(null)
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await getProducts({ pageLimit: 500 })
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.collectionTitle?.toLowerCase().includes(q)
    )
  }, [products, search])

  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  )

  function handleSearch(val) { setSearch(val); setCurrentPage(1); setSelectedIds(new Set()) }
  function handlePageSize(val) { setPageSize(val); setCurrentPage(1); setSelectedIds(new Set()) }

  const allPageSelected = paged.length > 0 && paged.every(p => selectedIds.has(p.id))
  const somePageSelected = paged.some(p => selectedIds.has(p.id))

  function toggleAll() {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allPageSelected) paged.forEach(p => next.delete(p.id))
      else paged.forEach(p => next.add(p.id))
      return next
    })
  }

  function toggleOne(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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

  async function handleBulkDelete() {
    setDeleting(true)
    try {
      await Promise.all([...selectedIds].map(id => deleteProduct(id)))
      toast.success(`${selectedIds.size} produk dihapus`)
      setSelectedIds(new Set())
      setShowBulkConfirm(false)
      load()
    } catch {
      toast.error('Gagal menghapus beberapa produk')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: '__check',
      width: '44px',
      label: (
        <input
          type="checkbox"
          checked={allPageSelected}
          ref={el => { if (el) el.indeterminate = somePageSelected && !allPageSelected }}
          onChange={toggleAll}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleOne(row.id)}
          onClick={e => e.stopPropagation()}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
        />
      ),
    },
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
          : `${formatCurrency(row.minPrice)} – ${formatCurrency(row.maxPrice)}`,
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Semua Produk</h2>
          <Link href="/admin/products/new">
            <Button>+ Produk Baru</Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={pageSize}
            onChange={e => handlePageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n} per halaman</option>)}
          </select>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <span className="text-blue-700 font-medium">{selectedIds.size} dipilih</span>
              <button
                onClick={() => setShowBulkConfirm(true)}
                className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-xs text-blue-500 hover:text-blue-700">
                Batal
              </button>
            </div>
          )}
        </div>

        <DataTable
          columns={columns}
          data={paged}
          loading={loading}
          emptyTitle="Belum ada produk"
          emptyDescription="Buat produk pertama Anda"
        />

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-gray-500">
            {!loading && `${filtered.length} produk${search ? ' ditemukan' : ''}`}
          </p>
          <Pagination page={currentPage} total={filtered.length} perPage={pageSize} onChange={setCurrentPage} />
        </div>
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

      <Modal
        open={showBulkConfirm}
        title={`Hapus ${selectedIds.size} Produk`}
        danger
        confirmLabel={`Hapus ${selectedIds.size} Produk`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkConfirm(false)}
        loading={deleting}
      >
        {selectedIds.size} produk yang dipilih akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
      </Modal>
    </AdminLayout>
  )
}
