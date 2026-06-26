'use client'

import { useEffect, useState } from 'react'
import AccountLayout from '@/components/store/AccountLayout'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { getOrdersByCustomer } from '@/services/orders'
import { formatCurrency } from '@/lib/helpers'

function formatDate(ts) {
  if (!ts) return '-'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_LABEL = { new: 'Pesanan Baru', contacted: 'Dihubungi', paid: 'Sudah Bayar', shipped: 'Dikirim', completed: 'Selesai', cancelled: 'Dibatalkan' }
const STATUS_COLOR = { new: 'bg-blue-50 text-blue-700', contacted: 'bg-yellow-50 text-yellow-700', paid: 'bg-green-50 text-green-700', shipped: 'bg-purple-50 text-purple-700', completed: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-50 text-red-700' }

export default function AccountOrdersPage() {
  const { tenant } = useTenant() || {}
  const { customerUser } = useCustomerAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customerUser || !tenant?.id) return
    getOrdersByCustomer(tenant.id, customerUser.uid).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [customerUser, tenant?.id])

  return (
    <AccountLayout>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Riwayat Pesanan</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 px-6">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 text-sm">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.productTitle}
                        {item.variantTitle && <span className="text-gray-400"> · {item.variantTitle}</span>}
                        <span className="text-gray-400"> ×{item.quantity}</span>
                      </span>
                      <span className="text-gray-900 font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{order.totalItems} item</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>

                {order.notes && (
                  <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Catatan: {order.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
