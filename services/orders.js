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

export async function getOrders({ status, pageLimit = 10 } = {}) {
  let constraints = [orderBy('createdAt', 'desc'), limit(pageLimit)]
  if (status) constraints = [where('status', '==', status), ...constraints]
  const q = query(COL, ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
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
  const q = query(
    COL,
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
