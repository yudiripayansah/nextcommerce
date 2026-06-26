import {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from '@/lib/firestore'

function col(tenantId) {
  return collection(db, 'tenants', tenantId, 'files')
}

function ref(tenantId, id) {
  return doc(db, 'tenants', tenantId, 'files', id)
}

export async function getFiles(tenantId, { pageLimit = 200 } = {}) {
  const q = query(col(tenantId), orderBy('createdAt', 'desc'), limit(pageLimit))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addFile(tenantId, data) {
  const r = await addDoc(col(tenantId), { ...data, createdAt: serverTimestamp() })
  return r.id
}

export async function deleteFile(tenantId, id) {
  await deleteDoc(ref(tenantId, id))
}
