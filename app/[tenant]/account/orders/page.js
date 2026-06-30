'use client'

import { useEffect, useState } from 'react'
import AccountLayout from '@/components/store/AccountLayout'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { useSettings } from '@/contexts/SettingsContext'
import { getOrdersByCustomer } from '@/services/orders'
import { formatCurrency } from '@/lib/helpers'

function formatDate(ts) {
  if (!ts) return '-'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
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

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-1.5 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-colors"
      style={copied
        ? { borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }
        : { borderColor: '#d1d5db', color: '#6b7280', background: 'white' }}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Disalin
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Salin
        </>
      )}
    </button>
  )
}

function TrackingBadge({ order }) {
  if (!order.trackingNumber) return null

  const { logisticsProvider: provider, trackingNumber: number } = order

  const TRACKING_URLS = {
    'JNE': `https://www.jne.co.id/tracking?awb=${number}`,
    'J&T Express': `https://jet.co.id/track?awb=${number}`,
    'SiCepat': `https://www.sicepat.com/checkAwb?awb=${number}`,
    'Anteraja': `https://anteraja.id/tracking?awb=${number}`,
    'TIKI': `https://tiki.id/id/tracking?searchValue=${number}`,
    'Pos Indonesia': `https://www.posindonesia.co.id/en/tracking/?awb=${number}`,
    'Wahana': `https://wahana.com/track-trace?no=${number}`,
    'IDExpress': `https://idexpress.com/tracking?awb=${number}`,
    'Ninja Express': `https://www.ninjavan.co/id-id/tracking?id=${number}`,
    'Lion Parcel': `https://lionparcel.com/tracking?awb=${number}`,
  }

  const trackUrl = provider && TRACKING_URLS[provider]

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5">
      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-purple-800">
          {provider ? `${provider} — ` : ''}
          <span className="font-mono tracking-wide">{number}</span>
          <CopyButton text={number} />
        </p>
        <p className="text-xs text-purple-600">Nomor resi pengiriman</p>
      </div>
      {trackUrl && (
        <a
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-purple-700 hover:text-purple-900 underline flex-shrink-0"
        >
          Lacak →
        </a>
      )}
    </div>
  )
}

export default function AccountOrdersPage() {
  const { tenant } = useTenant() || {}
  const { customerUser } = useCustomerAuth()
  const settings = useSettings()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customerUser || !tenant?.id) return
    getOrdersByCustomer(tenant.id, customerUser.uid).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [customerUser, tenant?.id])

  const bankAccounts = settings?.bankAccounts || []

  return (
    <AccountLayout>
      <div className="space-y-5">
        {/* Payment info */}
        {bankAccounts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Info Pembayaran</h2>
              <p className="text-xs text-gray-500 mt-0.5">Transfer ke rekening berikut setelah memesan</p>
            </div>
            <div className="divide-y divide-gray-100">
              {bankAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{acc.bankName}</p>
                    <p className="text-sm font-mono text-gray-800 flex items-center gap-1">
                      {acc.accountNumber}
                      <CopyButton text={acc.accountNumber} />
                    </p>
                    <p className="text-xs text-gray-500">a.n. {acc.accountHolder}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
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

                  <TrackingBadge order={order} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  )
}
