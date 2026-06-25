import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@/lib/firestore'

export async function getPage(slug) {
  const snap = await getDoc(doc(db, 'pages', slug))
  if (!snap.exists()) return null
  return snap.data()
}

export async function savePage(slug, data) {
  await setDoc(
    doc(db, 'pages', slug),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}
