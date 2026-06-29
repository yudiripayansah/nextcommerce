'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DashboardCard from '@/components/admin/DashboardCard'
import { useAuth } from '@/contexts/AuthContext'
import { getDocs, query, collection, orderBy, limit, db } from '@/lib/firestore'
import { formatCurrency } from '@/lib/helpers'
import { requestFCMToken, getNotificationPermission, fcmSupported } from '@/lib/fcm'

function NotificationCard({ user }) {
  const [permission, setPermission] = useState('default')
  const [supported, setSupported] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fcmSupported().then(setSupported)
    setPermission(getNotificationPermission())
  }, [])

  // Auto-subscribe if already granted (e.g. on revisit)
  useEffect(() => {
    if (permission === 'granted' && supported && user) {
      subscribeSilently()
    }
  }, [permission, supported, user])

  async function subscribeSilently() {
    try {
      const token = await requestFCMToken()
      if (!token) return
      const idToken = await user.getIdToken()
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ fcmToken: token }),
      })
      setSaved(true)
    } catch {}
  }

  async function handleEnable() {
    setSaving(true)
    try {
      const token = await requestFCMToken()
      setPermission(getNotificationPermission())
      if (!token) { setSaving(false); return }
      const idToken = await user.getIdToken()
      const res = await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ fcmToken: token }),
      })
      if (res.ok) setSaved(true)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!supported) return null
  if (permission === 'denied') return null
  if (permission === 'granted' && saved) return null

  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-900">Aktifkan notifikasi pesanan baru</p>
        <p className="text-xs text-amber-700">Terima push notifikasi setiap ada order masuk</p>
      </div>
      <button
        onClick={handleEnable}
        disabled={saving}
        className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-60 shrink-0"
      >
        {saving ? 'Mengaktifkan...' : 'Aktifkan'}
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const { tenantId, user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    if (!tenantId) return
    async function load() {
      try {
        const base = `tenants/${tenantId}`
        const [ordersSnap, productsSnap, customersSnap] = await Promise.all([
          getDocs(collection(db, base, 'orders')),
          getDocs(collection(db, base, 'products')),
          getDocs(collection(db, base, 'customers')),
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

        const recentQ = query(collection(db, base, 'orders'), orderBy('createdAt', 'desc'), limit(5))
        const recentSnap = await getDocs(recentQ)
        setRecentOrders(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Push notification subscribe banner */}
        {user && <NotificationCard user={user} />}

        {loading ? (
          <p className="text-gray-500 text-sm">Memuat data...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </AdminLayout>
  )
}
