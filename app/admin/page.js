'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DashboardCard from '@/components/admin/DashboardCard'
import { getDocs, query, collection, where, orderBy, limit, db } from '@/lib/firestore'
import { formatCurrency } from '@/lib/helpers'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [ordersSnap, productsSnap, customersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'customers')),
        ])

        const orders = ordersSnap.docs.map((d) => d.data())
        const products = productsSnap.docs.map((d) => d.data())

        const now = new Date()
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const totalRevenue = orders
          .filter((o) => o.status === 'completed')
          .reduce((s, o) => s + (o.totalAmount || 0), 0)

        const monthlyRevenue = orders
          .filter((o) => {
            if (o.status !== 'completed') return false
            const d = o.createdAt?.toDate?.() || new Date(o.createdAt)
            return d >= firstOfMonth
          })
          .reduce((s, o) => s + (o.totalAmount || 0), 0)

        const newOrders = orders.filter((o) => o.status === 'new').length
        const completedOrders = orders.filter((o) => o.status === 'completed').length
        const outOfStock = products.filter((p) => (p.totalStock || 0) === 0).length

        setStats({
          totalRevenue,
          monthlyRevenue,
          totalOrders: orders.length,
          newOrders,
          completedOrders,
          totalProducts: products.length,
          outOfStock,
          totalCustomers: customersSnap.size,
        })

        const recentQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5))
        const recentSnap = await getDocs(recentQ)
        setRecentOrders(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <p className="text-gray-500 text-sm">Memuat data...</p>
      ) : (
        <div className="space-y-6">
          {/* Revenue */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Penjualan</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Total Pendapatan"
                value={formatCurrency(stats.totalRevenue)}
                color="green"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <DashboardCard
                title="Pendapatan Bulan Ini"
                value={formatCurrency(stats.monthlyRevenue)}
                color="blue"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              />
              <DashboardCard
                title="Total Pesanan"
                value={stats.totalOrders}
                color="purple"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              />
              <DashboardCard
                title="Pesanan Baru"
                value={stats.newOrders}
                color="yellow"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>
          </div>

          {/* Products & Customers */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Produk & Pelanggan</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard title="Total Produk" value={stats.totalProducts} color="blue" />
              <DashboardCard title="Stok Habis" value={stats.outOfStock} color="red" />
              <DashboardCard title="Total Pelanggan" value={stats.totalCustomers} color="green" />
            </div>
          </div>

          {/* Recent orders */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pesanan Terbaru</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 p-4">Belum ada pesanan.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Pesanan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                        <td className="px-4 py-3">{order.customerName}</td>
                        <td className="px-4 py-3">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
