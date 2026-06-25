'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge'
import Select from '@/components/ui/Select'
import { getOrders } from '@/services/orders'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { ORDER_STATUSES } from '@/constants'

const statusOptions = [{ value: '', label: 'Semua Status' }, ...ORDER_STATUSES]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  async function load(s) {
    setLoading(true)
    try {
      const data = await getOrders({ status: s || undefined, pageLimit: 50 })
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(status) }, [status])

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Semua Pesanan</h2>
          <div className="w-48">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              placeholder=""
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          searchable
          searchPlaceholder="Cari pesanan..."
          emptyTitle="Belum ada pesanan"
        />
      </div>
    </AdminLayout>
  )
}
