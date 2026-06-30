'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import { useSettings } from '@/contexts/SettingsContext'
import { useTenant } from '@/contexts/TenantContext'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { createOrder } from '@/services/orders'
import { upsertCustomer } from '@/services/customers'
import { formatCurrency, generateOrderNumber } from '@/lib/helpers'

const PROVINCES = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau','Jambi',
  'Sumatera Selatan','Kepulauan Bangka Belitung','Bengkulu','Lampung',
  'DKI Jakarta','Jawa Barat','Banten','Jawa Tengah','DI Yogyakarta','Jawa Timur',
  'Bali','Nusa Tenggara Barat','Nusa Tenggara Timur',
  'Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara',
  'Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara',
  'Maluku','Maluku Utara','Papua','Papua Barat','Papua Selatan','Papua Tengah','Papua Pegunungan',
]

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
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border transition-colors flex-shrink-0"
      style={copied
        ? { borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }
        : { borderColor: '#d1d5db', color: '#6b7280', background: 'white' }}
    >
      {copied ? '✓ Disalin' : 'Salin'}
    </button>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function CheckoutPage() {
  const { tenant: tenantSlug } = useParams()
  const router = useRouter()
  const { cart, totalItems, totalAmount, dispatch } = useCart()
  const settings = useSettings()
  const { tenant } = useTenant() || {}
  const { customerUser, customer } = useCustomerAuth()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', whatsapp: '', notes: '',
    recipientName: '', recipientPhone: '',
    address: '', city: '', province: '', postalCode: '',
    shippingCost: '',
  })

  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || customer.name || '',
        whatsapp: prev.whatsapp || customer.whatsapp || '',
        recipientName: prev.recipientName || customer.name || '',
        recipientPhone: prev.recipientPhone || customer.whatsapp || '',
      }))
    }
  }, [customer])

  useEffect(() => {
    if (cart.items.length === 0) router.replace(`/${tenantSlug}/cart`)
  }, [cart.items.length, tenantSlug, router])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const shippingCost = parseFloat(form.shippingCost) || 0
  const grandTotal = totalAmount + shippingCost
  const bankAccounts = settings?.bankAccounts || []

  async function handleConfirm(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.whatsapp.trim()) {
      setError('Nama dan nomor WhatsApp wajib diisi')
      return
    }
    if (!form.recipientName.trim() || !form.address.trim() || !form.city.trim()) {
      setError('Nama penerima, alamat lengkap, dan kota wajib diisi')
      return
    }
    if (!tenant?.id) { setError('Toko tidak ditemukan'); return }

    setError('')
    setSubmitting(true)

    try {
      const orderNumber = generateOrderNumber()
      const tenantId = tenant.id
      const items = cart.items.map((i) => ({
        productId: i.productId,
        productTitle: i.productTitle,
        variantTitle: i.variantTitle,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.subtotal,
      }))

      const customerId = customerUser
        ? customerUser.uid
        : await upsertCustomer(tenantId, form.name, form.whatsapp, grandTotal)

      await createOrder(tenantId, {
        orderNumber,
        customerId,
        customerName: form.name,
        customerWhatsapp: form.whatsapp,
        notes: form.notes,
        items,
        totalItems,
        subtotal: totalAmount,
        shippingCost,
        totalAmount: grandTotal,
        shippingAddress: {
          recipientName: form.recipientName,
          recipientPhone: form.recipientPhone,
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        status: 'new',
      })

      fetch('/api/push-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, orderNumber, customerName: form.name, totalAmount: grandTotal }),
      }).catch(() => {})

      dispatch({ type: 'CLEAR' })

      // Build WhatsApp message
      const lines = items.map((i) => {
        const v = i.variantTitle ? ` (${i.variantTitle})` : ''
        return `- ${i.productTitle}${v} x${i.quantity} = ${formatCurrency(i.subtotal)}`
      })
      const addrParts = [
        `Nama Penerima: ${form.recipientName}`,
        form.recipientPhone ? `No. HP: ${form.recipientPhone}` : null,
        `Alamat: ${form.address}`,
        `Kota: ${form.city}`,
        form.province ? `Provinsi: ${form.province}` : null,
        form.postalCode ? `Kode Pos: ${form.postalCode}` : null,
      ].filter(Boolean)

      const msgParts = [
        `Halo, saya ingin memesan:\n`,
        lines.join('\n'),
        `\nSubtotal: ${formatCurrency(totalAmount)}`,
        shippingCost > 0 ? `Ongkir: ${formatCurrency(shippingCost)}` : null,
        `*Total: ${formatCurrency(grandTotal)}*`,
        `\nAlamat Pengiriman:\n${addrParts.join('\n')}`,
        `\nNama Pemesan: ${form.name}`,
        `No. WA: ${form.whatsapp}`,
        form.notes ? `Catatan: ${form.notes}` : null,
        `\nTerima kasih.`,
      ].filter(Boolean)

      const waNumber = settings?.whatsappNumber || ''
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msgParts.join('\n'))}`, '_blank')

      router.replace(`/${tenantSlug}`)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan, silakan coba lagi')
      setSubmitting(false)
    }
  }

  if (cart.items.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back link + title */}
      <div className="mb-6">
        <Link href={`/${tenantSlug}/cart`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Keranjang
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Checkout</h1>
      </div>

      <form onSubmit={handleConfirm}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT COLUMN: forms ──────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Customer info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Data Pemesan</h2>
              {!customerUser && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <Link href={`/${tenantSlug}/account/login`} className="font-medium text-gray-900 hover:underline">Masuk</Link> atau{' '}
                  <Link href={`/${tenantSlug}/account/register`} className="font-medium text-gray-900 hover:underline">daftar</Link>{' '}
                  untuk mengisi otomatis.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nama Lengkap" required>
                  <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nama Anda" required className={INPUT} />
                </Field>
                <Field label="Nomor WhatsApp" required>
                  <input type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="628123456789" required className={INPUT} />
                </Field>
              </div>
              <Field label="Catatan (opsional)">
                <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Catatan khusus untuk penjual..." rows={2} className={INPUT} />
              </Field>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Alamat Pengiriman</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nama Penerima" required>
                  <input type="text" value={form.recipientName} onChange={(e) => set('recipientName', e.target.value)} placeholder="Nama penerima paket" required className={INPUT} />
                </Field>
                <Field label="No. HP Penerima">
                  <input type="tel" value={form.recipientPhone} onChange={(e) => set('recipientPhone', e.target.value)} placeholder="08xx" className={INPUT} />
                </Field>
              </div>
              <Field label="Alamat Lengkap" required>
                <textarea
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                  rows={3}
                  required
                  className={INPUT}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Kota" required>
                  <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Kota / Kabupaten" required className={INPUT} />
                </Field>
                <Field label="Provinsi">
                  <select value={form.province} onChange={(e) => set('province', e.target.value)} className={INPUT + ' bg-white'}>
                    <option value="">Pilih provinsi</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Kode Pos">
                  <input type="text" value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="00000" maxLength={5} className={INPUT} />
                </Field>
              </div>
            </div>

            {/* Shipping cost */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <div>
                <h2 className="font-semibold text-gray-900">Biaya Pengiriman</h2>
                <p className="text-xs text-gray-500 mt-0.5">Cek estimasi ongkir melalui website kurir pilihan Anda</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 shrink-0">Rp</span>
                <input
                  type="number"
                  value={form.shippingCost}
                  onChange={(e) => set('shippingCost', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  className={INPUT}
                />
              </div>
              {shippingCost === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  Jika ongkir belum diketahui, biarkan kosong. Konfirmasi ongkir bisa dilakukan via WhatsApp.
                </p>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN: summary + payment + button ─────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Order summary */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Ringkasan Pesanan</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 px-5 py-3">
                    {item.featuredImage && (
                      <img src={item.featuredImage} alt={item.productTitle} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{item.productTitle}</p>
                      {item.variantTitle && <p className="text-xs text-gray-500">{item.variantTitle}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 shrink-0">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 space-y-2 border-t border-gray-100 bg-gray-50 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkir</span>
                  {shippingCost > 0
                    ? <span>{formatCurrency(shippingCost)}</span>
                    : <span className="text-gray-400 italic text-xs self-center">belum diisi</span>}
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-1">
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bank accounts */}
            {bankAccounts.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Info Pembayaran</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Transfer ke salah satu rekening berikut</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {bankAccounts.map((acc) => (
                    <div key={acc.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900">{acc.bankName}</p>
                        <p className="text-sm font-mono text-gray-800 flex items-center flex-wrap gap-1.5">
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

            {error && <p className="text-sm text-red-600 px-1">{error}</p>}

            {/* Confirm button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#16a34a', color: '#ffffff' }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Konfirmasi &amp; Kirim WA
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              Pesanan akan disimpan dan pesan WhatsApp akan terbuka di tab baru
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
