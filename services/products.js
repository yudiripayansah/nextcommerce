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

const COL = collection(db, 'products')

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

export async function getProducts({ status, collectionId, pageLimit = 10 } = {}) {
  // Fetch with single orderBy to avoid composite index
  const q = query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))
  const snap = await getDocs(q)
  let results = snap.docs.map((d) => normalize({ id: d.id, ...d.data() }))
  if (status) results = results.filter((p) => p.status === status)
  if (collectionId) results = results.filter((p) => p.collectionId === collectionId)
  return results
}

export async function getProductByHandle(handle) {
  const q = query(COL, where('handle', '==', handle))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return normalize({ id: d.id, ...d.data() })
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null
  return normalize({ id: snap.id, ...snap.data() })
}

export async function createProduct(data) {
  const ref = await addDoc(COL, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id))
}

export async function searchProducts(queryStr) {
  const q = query(COL, where('status', '==', 'active'), limit(200))
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

export async function getProductsByCollection(collectionId) {
  const q = query(COL, where('collectionId', '==', collectionId))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => normalize({ id: d.id, ...d.data() }))
    .filter((p) => p.status === 'active')
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}
