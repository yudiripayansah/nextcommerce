'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/rateLimit'

export default function AccountLoginPage() {
  const { tenant: tenantSlug } = useParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(null)
  const { login, customerUser } = useCustomerAuth()
  const router = useRouter()

  const RL_KEY = `customer-login-${tenantSlug}`

  useEffect(() => {
    if (customerUser) router.replace(`/${tenantSlug}/account`)
  }, [customerUser, tenantSlug, router])

  useEffect(() => {
    function check() {
      const rl = checkRateLimit(RL_KEY)
      setBlocked(rl.blocked ? rl : null)
    }
    check()
    const t = setInterval(check, 30_000)
    return () => clearInterval(t)
  }, [RL_KEY])

  async function handleSubmit(e) {
    e.preventDefault()
    const rl = checkRateLimit(RL_KEY)
    if (rl.blocked) { setBlocked(rl); return }

    setError('')
    setLoading(true)
    try {
      await login(email, password)
      clearRateLimit(RL_KEY)
    } catch (err) {
      recordFailedAttempt(RL_KEY)
      const next = checkRateLimit(RL_KEY)
      if (next.blocked) {
        setBlocked(next)
        setError('')
      } else if (err?.message === 'ADMIN_ACCOUNT') {
        setError('Akun ini adalah akun admin. Gunakan halaman login admin.')
      } else {
        setError('Email atau password salah.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun pelanggan Anda</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {blocked ? (
            <div className="text-center py-4">
              <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm font-semibold text-gray-800">Akun Sementara Dikunci</p>
              <p className="text-xs text-gray-500 mt-1">
                Terlalu banyak percobaan gagal. Coba lagi dalam{' '}
                <span className="font-medium">{blocked.minutesLeft} menit</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  autoComplete="email"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="••••••••" />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-opacity"
                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Belum punya akun?{' '}
          <Link href={`/${tenantSlug}/account/register`} className="text-black font-medium hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  )
}
