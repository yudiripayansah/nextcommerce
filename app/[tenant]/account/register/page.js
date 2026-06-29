'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { sanitizeText, sanitizePhone, isValidWhatsApp } from '@/lib/sanitize'

export default function AccountRegisterPage() {
  const { tenant: tenantSlug } = useParams()
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, customerUser } = useCustomerAuth()
  const router = useRouter()

  useEffect(() => {
    if (customerUser) router.replace(`/${tenantSlug}/account`)
  }, [customerUser, tenantSlug, router])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const name = sanitizeText(form.name, 100)
    const email = form.email.trim().toLowerCase()
    const whatsapp = sanitizePhone(form.whatsapp)
    const { password, confirm } = form

    if (!name) { setError('Nama tidak boleh kosong.'); return }
    if (name.length < 2) { setError('Nama minimal 2 karakter.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Format email tidak valid.'); return }
    if (whatsapp && !isValidWhatsApp(whatsapp)) {
      setError('Nomor WhatsApp tidak valid. Gunakan format 08xx atau 628xx.')
      return
    }
    if (password.length < 8) { setError('Password minimal 8 karakter.'); return }
    if (password !== confirm) { setError('Password dan konfirmasi tidak sama.'); return }
    // Reject passwords that are all the same character
    if (/^(.)\1+$/.test(password)) { setError('Password terlalu sederhana.'); return }

    setLoading(true)
    try {
      await signUp(email, password, name, whatsapp)
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan masuk.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah. Gunakan kombinasi huruf dan angka.')
      } else {
        setError('Gagal mendaftar. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
          <p className="text-sm text-gray-500 mt-1">Buat akun pelanggan baru</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda', autoComplete: 'name' },
              { field: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', autoComplete: 'email' },
              { field: 'whatsapp', label: 'Nomor WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx', optional: true, autoComplete: 'tel' },
              { field: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 karakter', autoComplete: 'new-password' },
              { field: 'confirm', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password', autoComplete: 'new-password' },
            ].map(({ field, label, type, placeholder, optional, autoComplete }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {optional && <span className="text-gray-400 font-normal">(opsional)</span>}
                </label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={(e) => set(field, e.target.value)}
                  required={!optional}
                  autoComplete={autoComplete}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-opacity"
              style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}>
              {loading ? 'Mendaftarkan...' : 'Buat Akun'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Sudah punya akun?{' '}
          <Link href={`/${tenantSlug}/account/login`} className="text-black font-medium hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
