'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import { useAuth } from '@/contexts/AuthContext'
import { getOrders } from '@/services/orders'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { ORDER_STATUSES } from '@/constants'

const PAGE_SIZES = [10, 20, 50, 100]
const statusOptions = [{ value: '', label: 'Semua Status' }, ...ORDER_STATUSES]

export default function OrdersPage() {
  const { tenantId } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)

  async function load(s) {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await getOrders(tenantId, { status: s || undefined, pageLimit: 500 })
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(status) }, [status, tenantId])

  const filtered = useMemo(() => {
    if (!search.trim()) return orders
    const q = search.toLowerCase()
    return orders.filter(o =>
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerWhatsapp?.toLowerCase().includes(q)
    )
  }, [orders, search])

  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  )

  function handleSearch(val) { setSearch(val); setCurrentPage(1) }
  function handlePageSize(val) { setPageSize(val); setCurrentPage(1) }
  function handleStatus(val) { setStatus(val); setCurrentPage(1); setSearch('') }

  const columns = [
    {
      key: 'orderNumber',
      label: 'No. Pesanan',
      render: (val, row) => (
        <Link href={`/admin/orders/${row.id}`} className="font-mono text-xs text-blue-600 hover:underline">
          {val}
        </Link>
      ),
    },
    { key: 'customerName', label: 'Pelanggan' },
    { key: 'customerWhatsapp', label: 'WhatsApp' },
    { key: 'totalItems', label: 'Item', render: (val) => `${val} item` },
    { key: 'totalAmount', label: 'Total', render: (val) => formatCurrency(val) },
    { key: 'status', label: 'Status', render: (val) => <OrderStatusBadge status={val} /> },
    { key: 'createdAt', label: 'Tanggal', render: (val) => formatDate(val) },
    {
      key: 'id',
      label: 'Aksi',
      render: (val) => (
        <Link href={`/admin/orders/${val}`} className="text-blue-600 hover:underline text-sm">
          Detail
        </Link>
      ),
    },
  ]

  return (
    <AdminLayout title="Pesanan">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Semua Pesanan</h2>
          <div className="w-48">
            <Select
              value={status}
              onChange={(e) => handleStatus(e.target.value)}
              options={statusOptions}
              placeholder=""
            />
          </div>
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
              placeholder="Cari pesanan..."
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
          emptyTitle="Belum ada pesanan"
        />

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-gray-500">
            {!loading && `${filtered.length} pesanan${search ? ' ditemukan' : ''}`}
          </p>
          <Pagination page={currentPage} total={filtered.length} perPage={pageSize} onChange={setCurrentPage} />
        </div>
      </div>
    </AdminLayout>
  )
}
