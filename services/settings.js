import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@/lib/firestore'

const SETTINGS_DOC = doc(db, 'settings', 'store')

export async function getSettings() {
  const snap = await getDoc(SETTINGS_DOC)
  if (!snap.exists()) return null
  return snap.data()
}

export async function saveSettings(data) {
  await setDoc(
    SETTINGS_DOC,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}
