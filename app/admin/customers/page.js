'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import Pagination from '@/components/ui/Pagination'
import { useAuth } from '@/contexts/AuthContext'
import { getCustomers } from '@/services/customers'
import { formatCurrency, formatDate } from '@/lib/helpers'

const PAGE_SIZES = [10, 20, 50, 100]

export default function CustomersPage() {
  const { tenantId } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!tenantId) return
    getCustomers(tenantId).then(setCustomers).finally(() => setLoading(false))
  }, [tenantId])

  const filtered = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.toLowerCase()
    return customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.whatsapp?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  }, [customers, search])

  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  )

  function handleSearch(val) { setSearch(val); setCurrentPage(1) }
  function handlePageSize(val) { setPageSize(val); setCurrentPage(1) }

  const columns = [
    {
      key: 'name',
      label: 'Nama',
      render: (val, row) => (
        <Link href={`/admin/customers/${row.id}`} className="font-medium text-blue-600 hover:underline">
          {val}
        </Link>
      ),
    },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'totalOrders', label: 'Total Pesanan' },
    { key: 'totalSpent', label: 'Total Belanja', render: (val) => formatCurrency(val || 0) },
    { key: 'createdAt', label: 'Bergabung', render: (val) => formatDate(val) },
    {
      key: 'id',
      label: 'Aksi',
      render: (val) => (
        <Link href={`/admin/customers/${val}`} className="text-blue-600 hover:underline text-sm">
          Detail
        </Link>
      ),
    },
  ]

  return (
    <AdminLayout title="Pelanggan">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Semua Pelanggan</h2>

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
              placeholder="Cari pelanggan..."
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
        </div>

        <DataTable
          columns={columns}
          data={paged}
          loading={loading}
          emptyTitle="Belum ada pelanggan"
          emptyDescription="Pelanggan akan muncul setelah ada pesanan"
        />

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-gray-500">
            {!loading && `${filtered.length} pelanggan${search ? ' ditemukan' : ''}`}
          </p>
          <Pagination page={currentPage} total={filtered.length} perPage={pageSize} onChange={setCurrentPage} />
        </div>
      </div>
    </AdminLayout>
  )
}
