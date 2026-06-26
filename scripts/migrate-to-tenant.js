// Migrasi data lama (root collections) ke multi-tenant structure
// Jalankan: TENANT_ID=UiLqRXztORQCaX1p6NGR node scripts/migrate-to-tenant.js
//
// Optional: OWNER_UID=kgNOAstVeYSUBCuM9Pt0vaD4UD33
// Jika OWNER_UID diisi, akan membuat/update doc users/{uid} sekalian

const { initializeApp } = require('firebase/app')
const {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  serverTimestamp,
} = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDzO43Bqonz3cAVXKnuW8uD2_mTo-E3LcU',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nextcommerce-f2631.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nextcommerce-f2631',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '913795303372',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:913795303372:web:be67085db95afb95497f69',
}

const TENANT_ID = process.env.TENANT_ID
const OWNER_UID = process.env.OWNER_UID

if (!TENANT_ID) {
  console.error('❌ TENANT_ID wajib diisi. Contoh: TENANT_ID=UiLqRXztORQCaX1p6NGR node scripts/migrate-to-tenant.js')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Collection yang akan dimigrasikan (root → tenants/{tenantId}/)
const COLLECTIONS_TO_MIGRATE = ['collections', 'customers', 'files', 'orders', 'pages', 'products']

async function migrateCollection(colName) {
  const srcRef = collection(db, colName)
  const snap = await getDocs(srcRef)

  if (snap.empty) {
    console.log(`⏭️  ${colName}: kosong, dilewati`)
    return 0
  }

  let count = 0
  for (const srcDoc of snap.docs) {
    const destRef = doc(db, 'tenants', TENANT_ID, colName, srcDoc.id)
    await setDoc(destRef, srcDoc.data(), { merge: true })
    count++
  }

  console.log(`✅ ${colName}: ${count} dokumen dimigrasikan`)
  return count
}

async function migrateSettings() {
  // settings/store → tenants/{tenantId}/settings/store
  const srcRef = doc(db, 'settings', 'store')
  const srcSnap = await getDoc(srcRef)

  if (!srcSnap.exists()) {
    console.log('⏭️  settings/store: tidak ditemukan, dilewati')
    return 0
  }

  const destRef = doc(db, 'tenants', TENANT_ID, 'settings', 'store')
  const destSnap = await getDoc(destRef)

  if (destSnap.exists()) {
    // Merge: jangan timpa settings yang sudah ada di tenant
    const existing = destSnap.data()
    const src = srcSnap.data()
    // Hanya copy field yang belum ada di tenant
    const merged = { ...src, ...existing }
    await setDoc(destRef, merged)
    console.log('✅ settings/store: dimigrasikan (merge dengan data existing)')
  } else {
    await setDoc(destRef, srcSnap.data())
    console.log('✅ settings/store: dimigrasikan')
  }

  return 1
}

async function createUserDoc() {
  if (!OWNER_UID) return

  // Ambil tenant data untuk mendapatkan email dll
  const tenantSnap = await getDoc(doc(db, 'tenants', TENANT_ID))
  if (!tenantSnap.exists()) {
    console.log('⚠️  Tenant doc tidak ditemukan, skip buat users doc')
    return
  }
  const tenant = tenantSnap.data()

  const userRef = doc(db, 'users', OWNER_UID)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    console.log(`⏭️  users/${OWNER_UID}: sudah ada, dilewati`)
    return
  }

  await setDoc(userRef, {
    tenantId: TENANT_ID,
    role: 'admin',
    name: tenant.name || '',
    email: '',
    createdAt: serverTimestamp(),
  })
  console.log(`✅ users/${OWNER_UID}: dokumen dibuat (role: admin, tenantId: ${TENANT_ID})`)
}

async function migrate() {
  console.log(`🚀 Migrasi data ke tenant: ${TENANT_ID}\n`)

  // Migrate per-tenant collections
  let total = 0
  for (const col of COLLECTIONS_TO_MIGRATE) {
    const count = await migrateCollection(col)
    total += count
  }

  // Migrate settings
  total += await migrateSettings()

  // Buat users doc jika OWNER_UID diisi
  await createUserDoc()

  console.log(`\n✅ Selesai! Total ${total} dokumen dimigrasikan ke tenants/${TENANT_ID}/`)
  console.log('\n📌 Langkah selanjutnya:')
  console.log('   1. Cek data di Firebase Console → tenants/' + TENANT_ID)
  console.log('   2. Kalau sudah OK, hapus data lama dengan: node scripts/cleanup-old-data.js')
  if (!OWNER_UID) {
    console.log('   3. Jangan lupa buat doc users/{ownerUID} di Firestore secara manual')
    console.log('      Field: { tenantId: "' + TENANT_ID + '", role: "admin", name: "...", email: "..." }')
  }
  process.exit(0)
}

migrate().catch((e) => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
