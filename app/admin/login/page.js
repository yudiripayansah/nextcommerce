'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/rateLimit'
import Link from 'next/link'

const RL_KEY = 'admin-login'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(null) // { minutesLeft }
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace('/admin')
  }, [user, router])

  // Check rate-limit status on mount and update every 30s
  useEffect(() => {
    function check() {
      const rl = checkRateLimit(RL_KEY)
      setBlocked(rl.blocked ? rl : null)
    }
    check()
    const t = setInterval(check, 30_000)
    return () => clearInterval(t)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const rl = checkRateLimit(RL_KEY)
    if (rl.blocked) {
      setBlocked(rl)
      return
    }

    setError('')
    setLoading(true)
    try {
      await login(email, password)
      clearRateLimit(RL_KEY)
      // redirect handled by useEffect watching user
    } catch (err) {
      recordFailedAttempt(RL_KEY)
      const next = checkRateLimit(RL_KEY)
      if (next.blocked) {
        setBlocked(next)
        setError('')
      } else if (err?.message === 'NOT_ADMIN') {
        setError('Akun ini bukan akun admin toko.')
      } else {
        setError('Email atau password salah.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Toko</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke panel admin toko</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {blocked ? (
            <div className="text-center py-4">
              <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-semibold text-gray-800">Akun Sementara Dikunci</p>
              <p className="text-xs text-gray-500 mt-1">
                Terlalu banyak percobaan gagal. Coba lagi dalam{' '}
                <span className="font-medium text-gray-700">{blocked.minutesLeft} menit</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="admin@toko.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50 transition-colors"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Superadmin?{' '}
          <Link href="/superadmin/login" className="text-gray-600 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  )
}
