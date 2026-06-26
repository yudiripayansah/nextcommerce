'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUser } from '@/services/users'
import { createTenant } from '@/services/tenants'
import { saveSettings } from '@/services/settings'
import { slugify } from '@/lib/helpers'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', storeName: '', whatsapp: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Password tidak sama.'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return }
    if (!form.storeName.trim()) { setError('Nama toko wajib diisi.'); return }

    setLoading(true)
    try {
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid = credential.user.uid

      const slug = slugify(form.storeName)
      const tenantId = await createTenant({ slug, name: form.storeName, ownerUid: uid })

      await Promise.all([
        createUser(uid, { tenantId, role: 'admin', email: form.email, name: form.name }),
        saveSettings(tenantId, { storeName: form.storeName, whatsappNumber: form.whatsapp }),
      ])

      router.replace('/admin')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan login.')
      } else {
        setError(`Gagal mendaftar: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-xl text-gray-900">NextCommerce</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Buat Toko Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Isi data berikut untuk mulai</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama pemilik toko" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
              <input type="text" value={form.storeName} onChange={(e) => set('storeName', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Toko Baju Keren" />
              {form.storeName && (
                <p className="text-xs text-gray-400 mt-1">URL toko: <span className="text-blue-600">/{slugify(form.storeName)}</span></p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
              <input type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="628123456789" />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@contoh.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min. 6 karakter" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ulangi password" />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {loading ? 'Membuat toko...' : 'Buat Toko Sekarang'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Sudah punya akun?{' '}
          <Link href="/admin/login" className="text-black font-medium hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
