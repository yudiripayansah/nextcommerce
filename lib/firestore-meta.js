// Server-safe Firestore reads for generateMetadata.
// Imports ONLY firebase/app + firebase/firestore — NOT firebase/auth.
// firebase/auth cannot run in Next.js server components (no browser storage).

import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getMetaDb() {
  const app =
    getApps().find((a) => a.name === 'meta') ||
    initializeApp(firebaseConfig, 'meta')
  return getFirestore(app)
}

export async function metaTenantBySlug(slug) {
  const db = getMetaDb()
  const q = query(collection(db, 'tenants'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export async function metaSettings(tenantId) {
  const db = getMetaDb()
  const snap = await getDoc(doc(db, 'tenants', tenantId, 'settings', 'store'))
  if (!snap.exists()) return null
  return snap.data()
}

export async function metaProduct(tenantId, handle) {
  const db = getMetaDb()
  const q = query(
    collection(db, 'tenants', tenantId, 'products'),
    where('handle', '==', handle)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export async function metaCollection(tenantId, handle) {
  const db = getMetaDb()
  const q = query(
    collection(db, 'tenants', tenantId, 'collections'),
    where('handle', '==', handle)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}
