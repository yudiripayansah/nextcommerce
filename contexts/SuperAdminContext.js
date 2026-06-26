'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const SuperAdminContext = createContext(null)

export function SuperAdminProvider({ children }) {
  const [superAdmin, setSuperAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid))
        if (snap.exists() && snap.data().role === 'superadmin') {
          setSuperAdmin(u)
        } else {
          setSuperAdmin(null)
        }
      } else {
        setSuperAdmin(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    if (!snap.exists() || snap.data().role !== 'superadmin') {
      await signOut(auth)
      throw new Error('NOT_SUPERADMIN')
    }
    setSuperAdmin(cred.user)
    return cred
  }

  const logout = () => signOut(auth)

  return (
    <SuperAdminContext.Provider value={{ superAdmin, loading, login, logout }}>
      {children}
    </SuperAdminContext.Provider>
  )
}

export function useSuperAdmin() {
  return useContext(SuperAdminContext)
}
