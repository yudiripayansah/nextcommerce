import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@/lib/firestore'

export async function getUserById(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createUser(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
  })
}
