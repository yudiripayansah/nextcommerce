'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import { getCustomers } from '@/services/customers'
import { formatCurrency, formatDate } from '@/lib/helpers'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCustomers().then(setCustomers).finally(() => setLoading(false))
  }, [])

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
        <h2 className="font-semibold text-gray-900 mb-6">Semua Pelanggan</h2>
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          searchable
          searchPlaceholder="Cari pelanggan..."
          emptyTitle="Belum ada pelanggan"
          emptyDescription="Pelanggan akan muncul setelah ada pesanan"
        />
      </div>
    </AdminLayout>
  )
}
