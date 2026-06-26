import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from '@/lib/firestore'

const COL = collection(db, 'tenants')

export async function getTenants() {
  const q = query(COL, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getTenantById(id) {
  const snap = await getDoc(doc(db, 'tenants', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getTenantBySlug(slug) {
  const q = query(COL, where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function createTenant(data) {
  const r = await addDoc(COL, {
    ...data,
    status: 'active',
    plan: 'free',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return r.id
}

export async function updateTenant(id, data) {
  await updateDoc(doc(db, 'tenants', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
