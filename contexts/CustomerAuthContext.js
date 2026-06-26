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
import { auth, db } from '@/lib/firebase'

const CustomerAuthContext = createContext(null)

export function CustomerAuthProvider({ children }) {
  const [customerUser, setCustomerUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, 'customers', u.uid))
        if (snap.exists()) {
          setCustomerUser(u)
          setCustomer({ id: snap.id, ...snap.data() })
        } else {
          // No customer profile — this is an admin account, not a customer
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
  }, [])

  async function signUp(email, password, name, whatsapp) {
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
    await setDoc(doc(db, 'customers', cred.user.uid), profile)
    // Explicitly set state — onAuthStateChanged may have fired before the doc was created
    setCustomerUser(cred.user)
    setCustomer({ id: cred.user.uid, ...profile })
    return cred.user
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'customers', cred.user.uid))
    if (!snap.exists()) {
      // Admin account trying to log in as customer
      await signOut(auth)
      throw new Error('ADMIN_ACCOUNT')
    }
    // Explicitly set state — onAuthStateChanged may not re-fire if session was already active
    setCustomerUser(cred.user)
    setCustomer({ id: snap.id, ...snap.data() })
    return cred.user
  }

  async function updateCustomerProfile(data) {
    if (!customerUser) return
    await updateDoc(doc(db, 'customers', customerUser.uid), {
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
