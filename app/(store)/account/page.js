'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AccountLayout from '@/components/store/AccountLayout'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { getOrdersByCustomer } from '@/services/orders'
import { formatCurrency } from '@/lib/helpers'

function formatDate(ts) {
  if (!ts) return '-'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_LABEL = {
  new: 'Pesanan Baru',
  contacted: 'Dihubungi',
  paid: 'Sudah Bayar',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

const STATUS_COLOR = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-green-50 text-green-700',
  shipped: 'bg-purple-50 text-purple-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-50 text-red-700',
}

export default function AccountPage() {
  const { customerUser, customer, updateCustomerProfile } = useCustomerAuth()
  const [orders, setOrders] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', whatsapp: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (customerUser) {
      getOrdersByCustomer(customerUser.uid).then((data) => setOrders(data.slice(0, 3)))
    }
  }, [customerUser])

  useEffect(() => {
    if (customer) setForm({ name: customer.name || '', whatsapp: customer.whatsapp || '' })
  }, [customer])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await updateCustomerProfile(form)
    setSaving(false)
    setEditing(false)
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Profil</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-sm text-black hover:underline">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium rounded-xl disabled:opacity-50"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="text-sm font-medium text-gray-900">{customer?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{customerUser?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">WhatsApp</p>
                <p className="text-sm text-gray-900">{customer?.whatsapp || '-'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{customer?.totalOrders || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total Pesanan</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer?.totalSpent || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Belanja</p>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pesanan Terakhir</h2>
            <Link href="/account/orders" className="text-sm text-black hover:underline">
              Lihat semua
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Belum ada pesanan</p>
              <Link href="/collections" className="inline-block mt-3 text-sm text-black font-medium hover:underline">
                Mulai belanja →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  )
}
