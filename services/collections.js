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
  serverTimestamp,
} from '@/lib/firestore'

const COL = collection(db, 'collections')

export async function getCollections({ status } = {}) {
  let q = query(COL, orderBy('createdAt', 'desc'))
  if (status) q = query(COL, where('status', '==', status), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getCollectionByHandle(handle) {
  const q = query(COL, where('handle', '==', handle))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function getCollectionById(id) {
  const snap = await getDoc(doc(db, 'collections', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createCollection(data) {
  const ref = await addDoc(COL, {
    ...data,
    productCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCollection(id, data) {
  await updateDoc(doc(db, 'collections', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCollection(id) {
  await deleteDoc(doc(db, 'collections', id))
}
