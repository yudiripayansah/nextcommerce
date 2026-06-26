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

function col(tenantId) {
  return collection(db, 'tenants', tenantId, 'customers')
}

function ref(tenantId, id) {
  return doc(db, 'tenants', tenantId, 'customers', id)
}

export async function getCustomers(tenantId) {
  const q = query(col(tenantId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getCustomerById(tenantId, id) {
  const snap = await getDoc(ref(tenantId, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getCustomerByWhatsapp(tenantId, whatsapp) {
  const q = query(col(tenantId), where('whatsapp', '==', whatsapp))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function upsertCustomer(tenantId, name, whatsapp, orderAmount) {
  const existing = await getCustomerByWhatsapp(tenantId, whatsapp)
  if (existing) {
    await updateDoc(ref(tenantId, existing.id), {
      totalOrders: (existing.totalOrders || 0) + 1,
      totalSpent: (existing.totalSpent || 0) + orderAmount,
      lastOrderDate: serverTimestamp(),
    })
    return existing.id
  }
  const r = await addDoc(col(tenantId), {
    name,
    whatsapp,
    totalOrders: 1,
    totalSpent: orderAmount,
    lastOrderDate: serverTimestamp(),
    createdAt: serverTimestamp(),
  })
  return r.id
}

export async function updateCustomer(tenantId, id, data) {
  await updateDoc(ref(tenantId, id), { ...data, updatedAt: serverTimestamp() })
}
