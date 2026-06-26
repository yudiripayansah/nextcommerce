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
  return collection(db, 'tenants', tenantId, 'addresses')
}

function ref(tenantId, id) {
  return doc(db, 'tenants', tenantId, 'addresses', id)
}

export async function getAddresses(tenantId, customerId) {
  const q = query(col(tenantId), where('customerId', '==', customerId), orderBy('isDefault', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getDefaultAddress(tenantId, customerId) {
  const q = query(col(tenantId), where('customerId', '==', customerId), where('isDefault', '==', true))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function addAddress(tenantId, customerId, data) {
  if (data.isDefault) await clearDefault(tenantId, customerId)
  const r = await addDoc(col(tenantId), {
    ...data,
    customerId,
    createdAt: serverTimestamp(),
  })
  return r.id
}

export async function updateAddress(tenantId, id, customerId, data) {
  if (data.isDefault) await clearDefault(tenantId, customerId)
  await updateDoc(ref(tenantId, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteAddress(tenantId, id) {
  await deleteDoc(ref(tenantId, id))
}

async function clearDefault(tenantId, customerId) {
  const existing = await getDefaultAddress(tenantId, customerId)
  if (existing) {
    await updateDoc(ref(tenantId, existing.id), { isDefault: false })
  }
}
