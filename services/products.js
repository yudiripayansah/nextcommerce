import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from '@/lib/firestore'

const COL = collection(db, 'products')

export async function getProducts({ status, collectionId, pageLimit = 10 } = {}) {
  let constraints = [orderBy('createdAt', 'desc'), limit(pageLimit)]
  if (status) constraints = [where('status', '==', status), ...constraints]
  if (collectionId) constraints = [where('collectionId', '==', collectionId), ...constraints]
  const q = query(COL, ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getProductByHandle(handle) {
  const q = query(COL, where('handle', '==', handle))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createProduct(data) {
  const ref = await addDoc(COL, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id))
}

export async function getProductsByCollection(collectionId) {
  const q = query(
    COL,
    where('collectionId', '==', collectionId),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
