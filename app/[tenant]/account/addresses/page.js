'use client'

import { useEffect, useState } from 'react'
import AccountLayout from '@/components/store/AccountLayout'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { getAddresses, addAddress, updateAddress, deleteAddress } from '@/services/addresses'

const EMPTY_FORM = { recipientName: '', phone: '', address: '', city: '', province: '', postalCode: '', isDefault: false }

export default function AccountAddressesPage() {
  const { tenant } = useTenant() || {}
  const { customerUser } = useCustomerAuth()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    if (!customerUser || !tenant?.id) return
    load()
  }, [customerUser, tenant?.id])

  async function load() {
    setLoading(true)
    const data = await getAddresses(tenant.id, customerUser.uid)
    setAddresses(data)
    setLoading(false)
  }

  function set(field, value) { setForm((prev) => ({ ...prev, [field]: value })) }

  function openAdd() { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }

  function openEdit(addr) {
    setEditingId(addr.id)
    setForm({ recipientName: addr.recipientName || '', phone: addr.phone || '', address: addr.address || '', city: addr.city || '', province: addr.province || '', postalCode: addr.postalCode || '', isDefault: addr.isDefault || false })
    setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateAddress(tenant.id, editingId, customerUser.uid, form)
      } else {
        await addAddress(tenant.id, customerUser.uid, form)
      }
      await load()
      closeForm()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await deleteAddress(tenant.id, id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    setConfirmDelete(null)
  }

  return (
    <AccountLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Buku Alamat</h2>
          {!showForm && (
            <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl"
              style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Tambah Alamat
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-medium text-gray-900 mb-4">{editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ field: 'recipientName', label: 'Nama Penerima', placeholder: 'Nama penerima' }, { field: 'phone', label: 'Nomor Telepon', type: 'tel', placeholder: '08xxxxxxxxxx' }].map(({ field, label, type = 'text', placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input type={type} value={form[field]} onChange={(e) => set(field, e.target.value)} required placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                <textarea value={form.address} onChange={(e) => set('address', e.target.value)} required rows={2} placeholder="Jl. Merdeka No. 10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[{ field: 'city', label: 'Kota', placeholder: 'Jakarta' }, { field: 'province', label: 'Provinsi', placeholder: 'DKI Jakarta' }, { field: 'postalCode', label: 'Kode Pos', placeholder: '10110', required: false }].map(({ field, label, placeholder, required = true }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input type="text" value={form[field]} onChange={(e) => set(field, e.target.value)} required={required} placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Jadikan alamat utama</span>
              </label>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium rounded-xl disabled:opacity-50"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}>
                  {saving ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
                <button type="button" onClick={closeForm} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p className="text-gray-400 text-sm">Belum ada alamat tersimpan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{addr.recipientName}</p>
                      {addr.isDefault && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}>Utama</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                    <p className="text-sm text-gray-600">{[addr.city, addr.province, addr.postalCode].filter(Boolean).join(', ')}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(addr)} className="text-xs text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
                    <button onClick={() => setConfirmDelete(addr.id)} className="text-xs text-red-500 hover:text-red-700 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">Hapus Alamat?</h3>
            <p className="text-sm text-gray-500 mb-5">Alamat ini akan dihapus secara permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  )
}
