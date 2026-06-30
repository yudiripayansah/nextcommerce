'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import OrderDetailCard from '@/components/admin/orders/OrderDetailCard'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { getOrderById, updateOrderStatus, updateOrderTracking } from '@/services/orders'
import { ORDER_STATUSES } from '@/constants'
import toast from 'react-hot-toast'

const LOGISTICS_OPTIONS = [
  { value: '', label: 'Pilih Ekspedisi' },
  { value: 'JNE', label: 'JNE' },
  { value: 'J&T Express', label: 'J&T Express' },
  { value: 'SiCepat', label: 'SiCepat' },
  { value: 'Anteraja', label: 'Anteraja' },
  { value: 'TIKI', label: 'TIKI' },
  { value: 'Pos Indonesia', label: 'Pos Indonesia' },
  { value: 'Wahana', label: 'Wahana' },
  { value: 'IDExpress', label: 'IDExpress' },
  { value: 'Ninja Express', label: 'Ninja Express' },
  { value: 'Lion Parcel', label: 'Lion Parcel' },
  { value: 'Lainnya', label: 'Lainnya' },
]

export default function OrderDetailPage() {
  const { id } = useParams()
  const { tenantId } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  // Tracking state
  const [trackingProvider, setTrackingProvider] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [savingTracking, setSavingTracking] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    getOrderById(tenantId, id).then((data) => {
      setOrder(data)
      setStatus(data?.status || '')
      setTrackingProvider(data?.logisticsProvider || '')
      setTrackingNumber(data?.trackingNumber || '')
      setLoading(false)
    })
  }, [tenantId, id])

  async function handleStatusUpdate() {
    setSaving(true)
    try {
      await updateOrderStatus(tenantId, id, status)
      setOrder((prev) => ({ ...prev, status }))
      toast.success('Status pesanan diperbarui')
    } catch {
      toast.error('Gagal memperbarui status')
    } finally {
      setSaving(false)
    }
  }

  async function handleTrackingUpdate() {
    if (!trackingNumber.trim()) {
      toast.error('Nomor resi tidak boleh kosong')
      return
    }
    setSavingTracking(true)
    try {
      await updateOrderTracking(tenantId, id, trackingNumber.trim(), trackingProvider)
      setOrder((prev) => ({ ...prev, trackingNumber: trackingNumber.trim(), logisticsProvider: trackingProvider }))
      toast.success('Nomor resi disimpan')
    } catch {
      toast.error('Gagal menyimpan nomor resi')
    } finally {
      setSavingTracking(false)
    }
  }

  function clearTracking() {
    setTrackingNumber('')
    setTrackingProvider('')
  }

  if (loading) return <AdminLayout title="Detail Pesanan"><LoadingSpinner className="py-16" /></AdminLayout>
  if (!order) return <AdminLayout title="Detail Pesanan"><p className="text-gray-500">Pesanan tidak ditemukan.</p></AdminLayout>

  const hasTracking = order.trackingNumber

  return (
    <AdminLayout title="Detail Pesanan">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <OrderDetailCard order={order} />
        </div>

        {/* Status update */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={ORDER_STATUSES}
              />
            </div>
            <Button onClick={handleStatusUpdate} loading={saving}>
              Simpan
            </Button>
          </div>
        </div>

        {/* Tracking number */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-900">Nomor Resi Pengiriman</h3>
              {hasTracking && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.logisticsProvider && <span className="font-medium">{order.logisticsProvider}</span>}
                  {order.logisticsProvider && ' · '}
                  <span className="font-mono">{order.trackingNumber}</span>
                </p>
              )}
            </div>
            {hasTracking && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Terisi
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Ekspedisi</label>
              <select
                value={trackingProvider}
                onChange={(e) => setTrackingProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LOGISTICS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Nomor Resi</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Contoh: JNE0012345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleTrackingUpdate} loading={savingTracking}>
                {hasTracking ? 'Update Resi' : 'Simpan Resi'}
              </Button>
              {(trackingNumber !== (order.trackingNumber || '') || trackingProvider !== (order.logisticsProvider || '')) && (
                <button
                  type="button"
                  onClick={clearTracking}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp link */}
        <a
          href={`https://wa.me/${order.customerWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Hubungi via WhatsApp
        </a>
      </div>
    </AdminLayout>
  )
}
