'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { createOrder } from '@/services/orders'
import { upsertCustomer } from '@/services/customers'
import { formatCurrency, generateOrderNumber } from '@/lib/helpers'

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
      className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border transition-colors"
      style={copied
        ? { borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }
        : { borderColor: '#d1d5db', color: '#6b7280', background: 'white' }}
    >
      {copied ? '✓ Disalin' : 'Salin'}
    </button>
  )
}

export default function WhatsAppOrderButton({ settings }) {
  const { cart, totalItems, totalAmount, dispatch } = useCart()
  const { customerUser, customer } = useCustomerAuth()
  const { tenant } = useTenant()
  const [step, setStep] = useState('form') // 'form' | 'confirm' | 'loading'
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (customer) {
      setName(customer.name || '')
      setWhatsapp(customer.whatsapp || '')
    }
  }, [customer])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !whatsapp.trim()) {
      setError('Nama dan nomor WhatsApp wajib diisi')
      return
    }
    if (!tenant?.id) {
      setError('Toko tidak ditemukan')
      return
    }
    setError('')
    setStep('confirm')
  }

  async function handleOrder() {
    setStep('loading')
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
        : await upsertCustomer(tenantId, name, whatsapp, totalAmount)

      await createOrder(tenantId, {
        orderNumber,
        customerId,
        customerName: name,
        customerWhatsapp: whatsapp,
        notes,
        items,
        totalItems,
        totalAmount,
        status: 'new',
      })

      fetch('/api/push-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, orderNumber, customerName: name, totalAmount }),
      }).catch(() => {})

      dispatch({ type: 'CLEAR' })

      const lines = items.map((i) => {
        const variant = i.variantTitle ? ` (${i.variantTitle})` : ''
        return `- ${i.productTitle}${variant} x${i.quantity} = ${formatCurrency(i.subtotal)}`
      })
      const message = encodeURIComponent(
        `Halo, saya ingin memesan:\n\n${lines.join('\n')}\n\nTotal: ${formatCurrency(totalAmount)}\n\nNama: ${name}\nNo. WA: ${whatsapp}${notes ? `\nCatatan: ${notes}` : ''}\n\nTerima kasih.`
      )
      const waNumber = settings?.whatsappNumber || ''
      window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank')
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan, silakan coba lagi')
      setStep('confirm')
    }
  }

  if (cart.items.length === 0) return null

  // ── FORM STEP ──────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {!customerUser && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <Link href="account/login" className="text-black font-medium hover:underline">Masuk</Link> atau{' '}
            <Link href="account/register" className="text-black font-medium hover:underline">daftar</Link>{' '}
            untuk mengisi otomatis dan menyimpan riwayat pesanan.
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="628123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alamat pengiriman, catatan khusus, dll..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full font-semibold py-3 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
        >
          Lanjutkan ke Konfirmasi →
        </button>
      </form>
    )
  }

  // ── CONFIRM + LOADING STEP ─────────────────────────────────────────
  const bankAccounts = settings?.bankAccounts || []
  const isLoading = step === 'loading'

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-900">Konfirmasi Pesanan</p>

      {/* Order items */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {cart.items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start gap-3 px-4 py-3">
              <span className="text-sm text-gray-700 leading-snug">
                {item.productTitle}
                {item.variantTitle && <span className="text-gray-400"> · {item.variantTitle}</span>}
                <span className="text-gray-400"> ×{item.quantity}</span>
              </span>
              <span className="text-sm font-medium text-gray-900 shrink-0">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
          <span className="text-sm font-bold text-gray-900">Total</span>
          <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Bank accounts */}
      {bankAccounts.length > 0 && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 space-y-2">
          <p className="text-xs font-semibold text-blue-800">Transfer Pembayaran ke:</p>
          {bankAccounts.map((acc) => (
            <div key={acc.id} className="bg-white rounded-lg px-3 py-2.5 border border-blue-100">
              <p className="text-xs font-bold text-gray-900 mb-0.5">{acc.bankName}</p>
              <p className="text-sm font-mono text-gray-800 flex items-center flex-wrap gap-1.5">
                {acc.accountNumber}
                <CopyButton text={acc.accountNumber} />
              </p>
              <p className="text-xs text-gray-500 mt-0.5">a.n. {acc.accountHolder}</p>
            </div>
          ))}
        </div>
      )}

      {/* Customer info summary */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2.5 space-y-0.5">
        <p><span className="font-medium text-gray-700">Nama:</span> {name}</p>
        <p><span className="font-medium text-gray-700">WhatsApp:</span> {whatsapp}</p>
        {notes && <p><span className="font-medium text-gray-700">Catatan:</span> {notes}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* WA button */}
      <button
        type="button"
        onClick={handleOrder}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: '#16a34a', color: '#ffffff' }}
      >
        {isLoading ? (
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
            Buat Pesanan & Kirim WA
          </>
        )}
      </button>

      {!isLoading && (
        <button
          type="button"
          onClick={() => { setStep('form'); setError('') }}
          className="w-full text-sm text-gray-500 hover:text-gray-700 py-1 transition-colors"
        >
          ← Ubah Data Pesanan
        </button>
      )}
    </div>
  )
}
