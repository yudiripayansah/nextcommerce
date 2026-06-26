import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@/lib/firestore'

function ref(tenantId) {
  return doc(db, 'tenants', tenantId, 'settings', 'store')
}

export async function getSettings(tenantId) {
  const snap = await getDoc(ref(tenantId))
  if (!snap.exists()) return null
  return snap.data()
}

export async function saveSettings(tenantId, data) {
  await setDoc(
    ref(tenantId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}
