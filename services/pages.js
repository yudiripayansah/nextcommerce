import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@/lib/firestore'

export async function getPage(tenantId, slug) {
  const snap = await getDoc(doc(db, 'tenants', tenantId, 'pages', slug))
  if (!snap.exists()) return null
  return snap.data()
}

export async function savePage(tenantId, slug, data) {
  await setDoc(
    doc(db, 'tenants', tenantId, 'pages', slug),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}
