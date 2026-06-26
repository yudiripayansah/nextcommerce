'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { storeAuth, db } from '@/lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [tenantId, setTenantId] = useState(null)
  const [tenant, setTenant] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(storeAuth, async (u) => {
      if (u) {
        const userSnap = await getDoc(doc(db, 'users', u.uid))
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          const userData = userSnap.data()
          setUser(u)
          setRole('admin')
          const tid = userData.tenantId || null
          setTenantId(tid)
          if (tid) {
            const tenantSnap = await getDoc(doc(db, 'tenants', tid))
            setTenant(tenantSnap.exists() ? { id: tenantSnap.id, ...tenantSnap.data() } : null)
          } else {
            setTenant(null)
          }
        } else {
          setUser(null)
          setRole(null)
          setTenantId(null)
          setTenant(null)
        }
      } else {
        setUser(null)
        setRole(null)
        setTenantId(null)
        setTenant(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(storeAuth, email, password)
    const userSnap = await getDoc(doc(db, 'users', cred.user.uid))
    if (!userSnap.exists() || userSnap.data().role !== 'admin') {
      await signOut(storeAuth)
      throw new Error('NOT_ADMIN')
    }
    const userData = userSnap.data()
    const tid = userData.tenantId || null
    setUser(cred.user)
    setRole('admin')
    setTenantId(tid)
    if (tid) {
      const tenantSnap = await getDoc(doc(db, 'tenants', tid))
      setTenant(tenantSnap.exists() ? { id: tenantSnap.id, ...tenantSnap.data() } : null)
    }
    return { cred, role: 'admin' }
  }

  const logout = () => signOut(storeAuth)

  return (
    <AuthContext.Provider value={{ user, tenantId, tenant, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
