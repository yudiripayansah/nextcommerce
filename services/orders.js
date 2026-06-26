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
  limit,
  serverTimestamp,
} from '@/lib/firestore'

function col(tenantId) {
  return collection(db, 'tenants', tenantId, 'orders')
}

function ref(tenantId, id) {
  return doc(db, 'tenants', tenantId, 'orders', id)
}

export async function getOrders(tenantId, { status, pageLimit = 50 } = {}) {
  const q = query(col(tenantId), orderBy('createdAt', 'desc'), limit(pageLimit))
  const snap = await getDocs(q)
  let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  if (status) results = results.filter((o) => o.status === status)
  return results
}

export async function getOrderById(tenantId, id) {
  const snap = await getDoc(ref(tenantId, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createOrder(tenantId, data) {
  const r = await addDoc(col(tenantId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return r.id
}

export async function updateOrderStatus(tenantId, id, status) {
  await updateDoc(ref(tenantId, id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function getOrdersByCustomer(tenantId, customerId) {
  const q = query(col(tenantId), where('customerId', '==', customerId))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}
