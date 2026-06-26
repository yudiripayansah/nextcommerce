'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { customerAuth as auth, db } from '@/lib/firebase'

const CustomerAuthContext = createContext(null)

export function CustomerAuthProvider({ tenantId, children }) {
  const [customerUser, setCustomerUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u && tenantId) {
        const snap = await getDoc(doc(db, 'tenants', tenantId, 'customers', u.uid))
        if (snap.exists()) {
          setCustomerUser(u)
          setCustomer({ id: snap.id, ...snap.data() })
        } else {
          setCustomerUser(null)
          setCustomer(null)
        }
      } else {
        setCustomerUser(null)
        setCustomer(null)
      }
      setLoading(false)
    })
    return unsub
  }, [tenantId])

  async function signUp(email, password, name, whatsapp) {
    if (!tenantId) throw new Error('No tenant')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const profile = {
      name,
      email,
      whatsapp: whatsapp || '',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'tenants', tenantId, 'customers', cred.user.uid), profile)
    setCustomerUser(cred.user)
    setCustomer({ id: cred.user.uid, ...profile })
    return cred.user
  }

  async function login(email, password) {
    if (!tenantId) throw new Error('No tenant')
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'tenants', tenantId, 'customers', cred.user.uid))
    if (!snap.exists()) {
      await signOut(auth)
      throw new Error('ADMIN_ACCOUNT')
    }
    setCustomerUser(cred.user)
    setCustomer({ id: snap.id, ...snap.data() })
    return cred.user
  }

  async function updateCustomerProfile(data) {
    if (!customerUser || !tenantId) return
    await updateDoc(doc(db, 'tenants', tenantId, 'customers', customerUser.uid), {
      ...data,
      updatedAt: serverTimestamp(),
    })
    setCustomer((prev) => ({ ...prev, ...data }))
  }

  const logout = () => signOut(auth)

  return (
    <CustomerAuthContext.Provider value={{ customerUser, customer, loading, signUp, login, logout, updateCustomerProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext)
}
