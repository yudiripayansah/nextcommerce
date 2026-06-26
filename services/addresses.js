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

const COL = collection(db, 'addresses')

export async function getAddresses(customerId) {
  const q = query(COL, where('customerId', '==', customerId), orderBy('isDefault', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getDefaultAddress(customerId) {
  const q = query(COL, where('customerId', '==', customerId), where('isDefault', '==', true))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function addAddress(customerId, data) {
  if (data.isDefault) {
    await clearDefault(customerId)
  }
  const ref = await addDoc(COL, {
    ...data,
    customerId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateAddress(id, customerId, data) {
  if (data.isDefault) {
    await clearDefault(customerId)
  }
  await updateDoc(doc(db, 'addresses', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteAddress(id) {
  await deleteDoc(doc(db, 'addresses', id))
}

async function clearDefault(customerId) {
  const existing = await getDefaultAddress(customerId)
  if (existing) {
    await updateDoc(doc(db, 'addresses', existing.id), { isDefault: false })
  }
}
