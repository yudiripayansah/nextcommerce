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

const COL = collection(db, 'files')

export async function getFiles({ pageLimit = 200 } = {}) {
  const q = query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addFile(data) {
  const ref = await addDoc(COL, { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function deleteFile(id) {
  await deleteDoc(doc(db, 'files', id))
}
