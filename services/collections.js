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

function col(tenantId) {
  return collection(db, 'tenants', tenantId, 'collections')
}

function ref(tenantId, id) {
  return doc(db, 'tenants', tenantId, 'collections', id)
}

export async function getCollections(tenantId, { status } = {}) {
  const q = query(col(tenantId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  if (status) results = results.filter((c) => c.status === status)
  return results
}

export async function getCollectionByHandle(tenantId, handle) {
  const q = query(col(tenantId), where('handle', '==', handle))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function getCollectionById(tenantId, id) {
  const snap = await getDoc(ref(tenantId, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createCollection(tenantId, data) {
  const r = await addDoc(col(tenantId), {
    ...data,
    productCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return r.id
}

export async function updateCollection(tenantId, id, data) {
  await updateDoc(ref(tenantId, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCollection(tenantId, id) {
  await deleteDoc(ref(tenantId, id))
}
