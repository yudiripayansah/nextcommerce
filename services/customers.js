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

const COL = collection(db, 'customers')

export async function getCustomers() {
  const q = query(COL, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getCustomerById(id) {
  const snap = await getDoc(doc(db, 'customers', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getCustomerByWhatsapp(whatsapp) {
  const q = query(COL, where('whatsapp', '==', whatsapp))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function upsertCustomer(name, whatsapp, orderAmount) {
  const existing = await getCustomerByWhatsapp(whatsapp)
  if (existing) {
    await updateDoc(doc(db, 'customers', existing.id), {
      totalOrders: (existing.totalOrders || 0) + 1,
      totalSpent: (existing.totalSpent || 0) + orderAmount,
      lastOrderDate: serverTimestamp(),
    })
    return existing.id
  }
  const ref = await addDoc(COL, {
    name,
    whatsapp,
    totalOrders: 1,
    totalSpent: orderAmount,
    lastOrderDate: serverTimestamp(),
    createdAt: serverTimestamp(),
  })
  return ref.id
}
