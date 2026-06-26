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
  limit,
  serverTimestamp,
} from '@/lib/firestore'

function col(tenantId) {
  return collection(db, 'tenants', tenantId, 'products')
}

function ref(tenantId, id) {
  return doc(db, 'tenants', tenantId, 'products', id)
}

function normalize(product) {
  const variants = product.variants || []
  const prices = variants.map((v) => v.price || 0).filter(Boolean)
  const stock = variants.reduce((sum, v) => sum + (v.stock || 0), 0)
  return {
    ...product,
    minPrice: prices.length ? Math.min(...prices) : (product.price || 0),
    maxPrice: prices.length ? Math.max(...prices) : (product.price || 0),
    totalStock: stock,
  }
}

export async function getProducts(tenantId, { status, collectionId, pageLimit = 10 } = {}) {
  const q = query(col(tenantId), orderBy('createdAt', 'desc'), limit(pageLimit))
  const snap = await getDocs(q)
  let results = snap.docs.map((d) => normalize({ id: d.id, ...d.data() }))
  if (status) results = results.filter((p) => p.status === status)
  if (collectionId) results = results.filter((p) => p.collectionId === collectionId)
  return results
}

export async function getProductByHandle(tenantId, handle) {
  const q = query(col(tenantId), where('handle', '==', handle))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return normalize({ id: d.id, ...d.data() })
}

export async function getProductById(tenantId, id) {
  const snap = await getDoc(ref(tenantId, id))
  if (!snap.exists()) return null
  return normalize({ id: snap.id, ...snap.data() })
}

export async function createProduct(tenantId, data) {
  const r = await addDoc(col(tenantId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return r.id
}

export async function updateProduct(tenantId, id, data) {
  await updateDoc(ref(tenantId, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(tenantId, id) {
  await deleteDoc(ref(tenantId, id))
}

export async function searchProducts(tenantId, queryStr) {
  const q = query(col(tenantId), where('status', '==', 'active'), limit(200))
  const snap = await getDocs(q)
  const term = queryStr.toLowerCase().trim()
  return snap.docs
    .map((d) => normalize({ id: d.id, ...d.data() }))
    .filter((p) => {
      if (p.title?.toLowerCase().includes(term)) return true
      if (p.description?.toLowerCase().includes(term)) return true
      if (p.tags?.some((t) => t.toLowerCase().includes(term))) return true
      return false
    })
}

export async function getProductsByCollection(tenantId, collectionId) {
  const q = query(col(tenantId), where('collectionId', '==', collectionId))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => normalize({ id: d.id, ...d.data() }))
    .filter((p) => p.status === 'active')
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}
