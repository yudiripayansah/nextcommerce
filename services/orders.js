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

const COL = collection(db, 'orders')

export async function getOrders({ status, pageLimit = 50 } = {}) {
  // Fetch with single orderBy, filter status client-side
  const q = query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))
  const snap = await getDocs(q)
  let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  if (status) results = results.filter((o) => o.status === status)
  return results
}

export async function getOrderById(id) {
  const snap = await getDoc(doc(db, 'orders', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createOrder(data) {
  const ref = await addDoc(COL, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateOrderStatus(id, status) {
  await updateDoc(doc(db, 'orders', id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function getOrdersByCustomer(customerId) {
  const q = query(COL, where('customerId', '==', customerId))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}
