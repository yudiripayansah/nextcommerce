'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSuperAdmin } from '@/contexts/SuperAdminContext'
import { getTenants } from '@/services/tenants'
import { formatDate } from '@/lib/helpers'
import Link from 'next/link'
const PLAN_COLOR = { free: 'bg-gray-100 text-gray-700', pro: 'bg-blue-100 text-blue-700', enterprise: 'bg-purple-100 text-purple-700' }
const STATUS_COLOR = { active: 'bg-green-100 text-green-700', inactive: 'bg-red-100 text-red-700', suspended: 'bg-yellow-100 text-yellow-700' }

const EMPTY_FORM = { storeName: '', ownerName: '', email: '', password: '', whatsapp: '' }

function CreateTenantModal({ onClose, onCreated }) {
  const { superAdmin: user } = useSuperAdmin()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat toko')
      onCreated(data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Buat Toko Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.storeName}
              onChange={set('storeName')}
              required
              placeholder="Contoh: Toko Baju Maju"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.ownerName}
              onChange={set('ownerName')}
              required
              placeholder="Nama lengkap pemilik"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Login <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              placeholder="email@toko.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              placeholder="Min. 6 karakter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={set('whatsapp')}
              placeholder="628xxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-400 mt-1">Format: 628xxxxxxxxxx (tanpa + atau spasi)</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Membuat...' : 'Buat Toko'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SuperadminPage() {
  const { superAdmin: user, loading: authLoading } = useSuperAdmin()
  const router = useRouter()
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace('/login')
      return
    }
    getTenants().then(setTenants).finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, router])

  function handleCreated({ tenantId, slug }) {
    getTenants().then(setTenants)
  }

  const filtered = tenants.filter((t) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return t.name?.toLowerCase().includes(q) || t.slug?.toLowerCase().includes(q)
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {showModal && (
        <CreateTenantModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900">Superadmin Panel</h1>
            <p className="text-xs text-gray-500 mt-0.5">360&5 NextCommerce · {tenants.length} toko terdaftar</p>
          </div>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">Keluar</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Toko</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-2xl font-bold text-gray-900">{tenants.filter(t => t.status === 'active').length}</p>
            <p className="text-sm text-gray-500 mt-1">Toko Aktif</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-2xl font-bold text-gray-900">{tenants.filter(t => t.plan === 'pro').length}</p>
            <p className="text-sm text-gray-500 mt-1">Plan Pro</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="font-semibold text-gray-900 shrink-0">Semua Toko</h2>
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="relative w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari toko..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 whitespace-nowrap"
              >
                + Buat Toko Baru
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">Belum ada toko terdaftar.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toko</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">/{t.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${PLAN_COLOR[t.plan] || 'bg-gray-100 text-gray-700'}`}>{t.plan || 'free'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-700'}`}>{t.status || 'active'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(t.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Link href={`/${t.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                        Buka Toko ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
