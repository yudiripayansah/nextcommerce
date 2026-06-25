'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import CustomerCard from '@/components/admin/customers/CustomerCard'
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getCustomerById } from '@/services/customers'
import { getOrdersByCustomer } from '@/services/orders'
import { formatCurrency, formatDate } from '@/lib/helpers'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [c, o] = await Promise.all([getCustomerById(id), getOrdersByCustomer(id)])
      setCustomer(c)
      setOrders(o)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <AdminLayout title="Detail Pelanggan"><LoadingSpinner className="py-16" /></AdminLayout>
  if (!customer) return <AdminLayout title="Detail Pelanggan"><p className="text-gray-500">Pelanggan tidak ditemukan.</p></AdminLayout>

  return (
    <AdminLayout title="Detail Pelanggan">
      <div className="max-w-2xl space-y-6">
        <CustomerCard customer={customer} />

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-4">Riwayat Pesanan</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-mono text-xs text-gray-500">{o.orderNumber}</p>
                    <p className="text-sm font-medium">{formatCurrency(o.totalAmount)}</p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={o.status} />
                    <p className="text-xs text-gray-400 mt-1">{formatDate(o.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
